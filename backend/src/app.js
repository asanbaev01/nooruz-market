import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.js';
import swaggerSpec from './config/swagger.js';

// ====== ES modules'то __dirname алуу ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Express app ======
const app = express();

// ====== Trust proxy (production'до) ======
app.set('trust proxy', 1);

// ====== Middleware ======

// 1. Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// 2. CORS — фронттон чакыруу үчүн
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.CLIENT_URL_PROD,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`⚠️ CORS блок: ${origin}`);
    return callback(new Error('CORS блок'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Body parser — JSON жана form-data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Compression — жоопту кичирейтет
app.use(compression());

// 5. Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 6. Static files — uploads папка
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ====== Swagger UI — КҮҢҮРТ ЖАШЫЛ ДИЗАЙН ======
const customSwaggerCSS = `
  /* ========== FONTS ========== */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
  code, pre, .microlight { font-family: 'JetBrains Mono', monospace !important; }

  /* ========== BODY (күңүрт жашыл фон) ========== */
  body {
    background:
      radial-gradient(120% 80% at 50% 0%, rgba(16,185,129,.25) 0%, transparent 60%),
      linear-gradient(135deg, #047857 0%, #065f46 50%, #022c22 100%) !important;
    background-attachment: fixed !important;
    min-height: 100vh;
  }
  .swagger-ui { background: transparent !important; }
  .swagger-ui .wrapper { background: transparent !important; }

  /* ========== TOPBAR (жашыруу) ========== */
  .swagger-ui .topbar { display: none !important; }

  /* ========== INFO BLOCK (күңүрт жашыл glass) ========== */
  .swagger-ui .info {
    background: rgba(255,255,255,.12) !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(34,232,176,.3) !important;
    border-radius: 24px !important;
    padding: 40px !important;
    margin: 24px 0 40px !important;
    box-shadow: 0 20px 50px -20px rgba(0,0,0,.5), 0 0 0 1px rgba(34,232,176,.15) !important;
    position: relative; overflow: hidden;
    animation: fadeInUp .6s cubic-bezier(.34,1.56,.64,1);
  }
  .swagger-ui .info::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #22E8B0, #10B981, #22E8B0, #10B981);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }
  .swagger-ui .info::after {
    content: ''; position: absolute; top: -50%; right: -10%; width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(34,232,176,.25), transparent 70%);
    border-radius: 50%; pointer-events: none;
    animation: float 8s ease-in-out infinite;
  }
  @keyframes shimmer { to { background-position: 200% center; } }
  @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
  @keyframes float { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,20px) scale(1.1); } }

  /* ========== TITLE ========== */
  .swagger-ui .info .title {
    font-size: 42px !important;
    font-weight: 800 !important;
    background: linear-gradient(135deg, #22E8B0 0%, #ffffff 50%, #22E8B0 100%) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    letter-spacing: -1px !important;
    position: relative; z-index: 1;
    animation: gradientShift 5s ease infinite;
    background-size: 200% auto !important;
    filter: drop-shadow(0 2px 10px rgba(34,232,176,.4));
  }
  @keyframes gradientShift { 0%,100% { background-position: 0% center; } 50% { background-position: 100% center; } }

  .swagger-ui .info .title small {
    background: linear-gradient(135deg, #22E8B0, #10B981) !important;
    color: #022c22 !important;
    padding: 6px 14px !important;
    border-radius: 999px !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    margin-left: 12px !important;
    box-shadow: 0 6px 16px -4px rgba(34,232,176,.6) !important;
    animation: badgePulse 2.5s ease-in-out infinite;
    -webkit-text-fill-color: #022c22 !important;
  }
  @keyframes badgePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  .swagger-ui .info .title small pre {
    background: transparent !important;
    color: #022c22 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
  }
  .swagger-ui .info .title small.version-stamp {
    background: linear-gradient(135deg, #10B981, #047857) !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
  }
  .swagger-ui .info .title small.version-stamp pre {
    color: #ffffff !important;
  }

  /* ========== DESCRIPTION (ак текст) ========== */
  .swagger-ui .info .description,
  .swagger-ui .info .markdown {
    color: #d1fae5 !important;
    font-size: 15px !important;
    line-height: 1.8 !important;
    font-weight: 500 !important;
  }
  .swagger-ui .info .description a,
  .swagger-ui .info .markdown a {
    color: #22E8B0 !important;
    font-weight: 700 !important;
    text-decoration: none !important;
    border-bottom: 2px solid rgba(34,232,176,.4) !important;
    transition: all .2s ease !important;
  }
  .swagger-ui .info .description a:hover {
    border-bottom-color: #22E8B0 !important;
    color: #ffffff !important;
  }
  .swagger-ui .info h1, .swagger-ui .info h2,
  .swagger-ui .info h3, .swagger-ui .info h4 {
    color: #22E8B0 !important;
    font-weight: 800 !important;
    margin-top: 24px !important;
    text-shadow: 0 2px 8px rgba(34,232,176,.3);
  }
  .swagger-ui .info code {
    background: rgba(34,232,176,.2) !important;
    color: #22E8B0 !important;
    padding: 3px 8px !important;
    border-radius: 6px !important;
    font-weight: 700 !important;
    font-size: 13px !important;
    border: 1px solid rgba(34,232,176,.3) !important;
  }

  /* ========== SCHEME CONTAINER ========== */
  .swagger-ui .scheme-container {
    background: rgba(255,255,255,.08) !important;
    backdrop-filter: blur(16px) !important;
    border: 1px solid rgba(34,232,176,.25) !important;
    border-radius: 16px !important;
    padding: 16px 24px !important;
    margin: 24px 0 !important;
    box-shadow: 0 8px 24px -10px rgba(0,0,0,.4) !important;
  }
  .swagger-ui .servers > label {
    color: #22E8B0 !important;
    font-weight: 700 !important;
    font-size: 13px !important;
    text-transform: uppercase !important;
    letter-spacing: .5px !important;
  }
  .swagger-ui .servers select {
    background: rgba(255,255,255,.95) !important;
    border: 2px solid rgba(34,232,176,.4) !important;
    border-radius: 10px !important;
    padding: 10px 16px !important;
    font-weight: 700 !important;
    color: #022c22 !important;
    cursor: pointer !important;
    transition: all .25s cubic-bezier(.34,1.56,.64,1) !important;
  }
  .swagger-ui .servers select:hover {
    border-color: #22E8B0 !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -8px rgba(34,232,176,.5) !important;
  }

  /* ========== AUTHORIZE BUTTON ========== */
  .swagger-ui .auth-wrapper .authorize {
    background: linear-gradient(135deg, #22E8B0, #10B981) !important;
    border: none !important;
    color: #022c22 !important;
    font-weight: 800 !important;
    padding: 12px 28px !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 20px -8px rgba(34,232,176,.6) !important;
    transition: all .3s cubic-bezier(.34,1.56,.64,1) !important;
    position: relative; overflow: hidden;
  }
  .swagger-ui .auth-wrapper .authorize:hover {
    transform: translateY(-3px) scale(1.02) !important;
    box-shadow: 0 15px 30px -10px rgba(34,232,176,.7) !important;
  }
  .swagger-ui .auth-wrapper .authorize svg {
    fill: #022c22 !important;
    margin-right: 6px !important;
  }

  /* ========== TAGS (glass cards) ========== */
  .swagger-ui .opblock-tag {
    background: rgba(255,255,255,.1) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(34,232,176,.25) !important;
    border-radius: 16px !important;
    padding: 20px 24px !important;
    margin: 16px 0 !important;
    transition: all .3s cubic-bezier(.34,1.56,.64,1) !important;
    box-shadow: 0 8px 20px -10px rgba(0,0,0,.3) !important;
    position: relative; overflow: hidden;
  }
  .swagger-ui .opblock-tag::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
    background: linear-gradient(180deg, #22E8B0, #10B981);
    transform: scaleY(0);
    transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    transform-origin: top;
  }
  .swagger-ui .opblock-tag:hover {
    border-color: #22E8B0 !important;
    background: rgba(255,255,255,.15) !important;
    transform: translateX(6px);
    box-shadow: 0 15px 35px -12px rgba(34,232,176,.4) !important;
  }
  .swagger-ui .opblock-tag:hover::before {
    transform: scaleY(1);
  }
  .swagger-ui .opblock-tag a {
    color: #ffffff !important;
    font-weight: 800 !important;
    font-size: 20px !important;
    transition: color .2s ease;
    text-shadow: 0 2px 8px rgba(0,0,0,.3);
  }
  .swagger-ui .opblock-tag:hover a {
    color: #22E8B0 !important;
  }
  .swagger-ui .opblock-tag small {
    color: #a7f3d0 !important;
    font-weight: 500 !important;
    font-size: 13px !important;
    margin-left: 12px !important;
  }
  .swagger-ui .opblock-tag svg {
    fill: #22E8B0 !important;
    transition: transform .3s cubic-bezier(.34,1.56,.64,1) !important;
  }
  .swagger-ui .opblock-tag:hover svg {
    transform: scale(1.15) rotate(-5deg);
  }

  /* ========== OPERATIONS ========== */
  .swagger-ui .opblock {
    border-radius: 14px !important;
    margin: 10px 0 !important;
    border: none !important;
    box-shadow: 0 6px 16px -6px rgba(0,0,0,.35) !important;
    transition: all .3s cubic-bezier(.34,1.56,.64,1) !important;
    overflow: hidden;
    animation: fadeInUp .4s cubic-bezier(.34,1.56,.64,1) both;
  }
  .swagger-ui .opblock:hover {
    transform: translateX(6px) scale(1.008);
    box-shadow: 0 15px 35px -10px rgba(0,0,0,.5) !important;
  }
  .swagger-ui .opblock .opblock-summary {
    padding: 14px 20px !important;
    border-radius: 14px !important;
    transition: background .2s ease;
  }
  .swagger-ui .opblock-summary-method {
    border-radius: 8px !important;
    padding: 8px 16px !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    letter-spacing: .5px !important;
    min-width: 80px !important;
    text-align: center !important;
    color: #ffffff !important;
    transition: transform .3s cubic-bezier(.34,1.56,.64,1) !important;
  }
  .swagger-ui .opblock:hover .opblock-summary-method {
    transform: scale(1.08) rotate(-2deg);
  }
  .swagger-ui .opblock-summary-path {
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    font-family: 'JetBrains Mono', monospace !important;
    text-shadow: 0 1px 4px rgba(0,0,0,.3);
  }
  .swagger-ui .opblock-summary-path__deprecated {
    color: #fca5a5 !important;
  }
  .swagger-ui .opblock-summary-description {
    color: #a7f3d0 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
  }
  .swagger-ui .opblock-summary-control svg {
    fill: #22E8B0 !important;
  }

  /* GET — Blue */
  .swagger-ui .opblock.opblock-get {
    background: linear-gradient(135deg, rgba(30,64,175,.4) 0%, rgba(37,99,235,.3) 100%) !important;
    border-left: 4px solid #3B82F6 !important;
  }
  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: linear-gradient(135deg, #3B82F6, #2563EB) !important;
    box-shadow: 0 6px 16px -4px rgba(59,130,246,.6) !important;
  }
  .swagger-ui .opblock.opblock-get .opblock-summary:hover {
    background: rgba(59,130,246,.15) !important;
  }

  /* POST — Green */
  .swagger-ui .opblock.opblock-post {
    background: linear-gradient(135deg, rgba(6,95,70,.4) 0%, rgba(16,185,129,.3) 100%) !important;
    border-left: 4px solid #10B981 !important;
  }
  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: linear-gradient(135deg, #10B981, #059669) !important;
    box-shadow: 0 6px 16px -4px rgba(16,185,129,.6) !important;
  }
  .swagger-ui .opblock.opblock-post .opblock-summary:hover {
    background: rgba(16,185,129,.15) !important;
  }

  /* PUT/PATCH — Amber */
  .swagger-ui .opblock.opblock-put,
  .swagger-ui .opblock.opblock-patch {
    background: linear-gradient(135deg, rgba(146,64,14,.4) 0%, rgba(245,158,11,.3) 100%) !important;
    border-left: 4px solid #F59E0B !important;
  }
  .swagger-ui .opblock.opblock-put .opblock-summary-method,
  .swagger-ui .opblock.opblock-patch .opblock-summary-method {
    background: linear-gradient(135deg, #F59E0B, #D97706) !important;
    box-shadow: 0 6px 16px -4px rgba(245,158,11,.6) !important;
  }
  .swagger-ui .opblock.opblock-put .opblock-summary:hover,
  .swagger-ui .opblock.opblock-patch .opblock-summary:hover {
    background: rgba(245,158,11,.15) !important;
  }

  /* DELETE — Red */
  .swagger-ui .opblock.opblock-delete {
    background: linear-gradient(135deg, rgba(153,27,27,.4) 0%, rgba(239,68,68,.3) 100%) !important;
    border-left: 4px solid #EF4444 !important;
  }
  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: linear-gradient(135deg, #EF4444, #DC2626) !important;
    box-shadow: 0 6px 16px -4px rgba(239,68,68,.6) !important;
  }
  .swagger-ui .opblock.opblock-delete .opblock-summary:hover {
    background: rgba(239,68,68,.15) !important;
  }

  /* ========== OPERATION BODY (ички мазмун) ========== */
  .swagger-ui .opblock-body {
    background: rgba(0,0,0,.15) !important;
    color: #d1fae5 !important;
  }
  .swagger-ui .opblock-body pre,
  .swagger-ui .opblock-body .markdown {
    color: #d1fae5 !important;
  }
  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .opblock-external-docs-wrapper p,
  .swagger-ui .opblock-title_normal p {
    color: #a7f3d0 !important;
  }
  .swagger-ui .opblock .opblock-section-header {
    background: rgba(34,232,176,.1) !important;
    border-bottom: 1px solid rgba(34,232,176,.2) !important;
  }
  .swagger-ui .opblock .opblock-section-header h4 {
    color: #22E8B0 !important;
  }
  .swagger-ui .opblock .opblock-section-header label {
    color: #d1fae5 !important;
  }

  /* ========== BUTTONS ========== */
  .swagger-ui .btn {
    border-radius: 10px !important;
    font-weight: 800 !important;
    padding: 10px 22px !important;
    transition: all .3s cubic-bezier(.34,1.56,.64,1) !important;
    border: none !important;
  }
  .swagger-ui .btn.execute {
    background: linear-gradient(135deg, #22E8B0, #10B981) !important;
    color: #022c22 !important;
    box-shadow: 0 6px 16px -4px rgba(34,232,176,.6) !important;
    position: relative; overflow: hidden;
  }
  .swagger-ui .btn.execute:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 12px 24px -8px rgba(34,232,176,.7) !important;
  }
  .swagger-ui .btn.execute::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
    transform: translateX(-100%); transition: transform .6s ease;
  }
  .swagger-ui .btn.execute:hover::before {
    transform: translateX(100%);
  }
  .swagger-ui .btn.cancel {
    background: rgba(255,255,255,.15) !important;
    color: #d1fae5 !important;
    border: 1px solid rgba(255,255,255,.2) !important;
  }
  .swagger-ui .btn.cancel:hover {
    background: rgba(255,255,255,.25) !important;
    transform: scale(1.03);
  }
  .swagger-ui .btn.authorize {
    background: linear-gradient(135deg, #22E8B0, #10B981) !important;
    color: #022c22 !important;
  }
  .swagger-ui .btn.authorize svg {
    fill: #022c22 !important;
  }

  /* ========== MODELS ========== */
  .swagger-ui section.models {
    background: rgba(255,255,255,.08) !important;
    backdrop-filter: blur(16px) !important;
    border: 1px solid rgba(34,232,176,.25) !important;
    border-radius: 20px !important;
    padding: 24px !important;
    margin: 24px 0 !important;
    box-shadow: 0 12px 30px -10px rgba(0,0,0,.4) !important;
  }
  .swagger-ui section.models h4 {
    color: #22E8B0 !important;
    font-weight: 800 !important;
    font-size: 22px !important;
    border-bottom: 2px solid rgba(34,232,176,.25) !important;
    padding-bottom: 16px !important;
  }
  .swagger-ui section.models h4 svg {
    fill: #22E8B0 !important;
  }
  .swagger-ui section.models .model-container {
    background: rgba(34,232,176,.08) !important;
    border: 1px solid rgba(34,232,176,.15) !important;
    border-radius: 12px !important;
    margin: 8px 0 !important;
    transition: all .3s cubic-bezier(.34,1.56,.64,1) !important;
  }
  .swagger-ui section.models .model-container:hover {
    background: rgba(34,232,176,.15) !important;
    transform: translateX(4px);
    box-shadow: 0 8px 20px -8px rgba(34,232,176,.3) !important;
  }
  .swagger-ui .model-box {
    background: transparent !important;
  }
  .swagger-ui .model-title {
    color: #22E8B0 !important;
    font-weight: 700 !important;
  }
  .swagger-ui .model {
    color: #d1fae5 !important;
  }
  .swagger-ui .property-row {
    border-bottom: 1px dashed rgba(34,232,176,.2) !important;
  }
  .swagger-ui .prop-type {
    color: #22E8B0 !important;
    font-weight: 700 !important;
  }
  .swagger-ui .prop-format {
    color: #a7f3d0 !important;
    font-size: 12px !important;
  }

  /* ========== RESPONSES ========== */
  .swagger-ui .responses-inner {
    background: rgba(0,0,0,.2) !important;
    border-radius: 12px !important;
    padding: 16px !important;
  }
  .swagger-ui .response-col_status {
    font-weight: 800 !important;
    font-size: 15px !important;
    color: #22E8B0 !important;
  }
  .swagger-ui .response-col_status .response-undocumented {
    color: #64748b !important;
  }
  .swagger-ui .response-col_description {
    color: #d1fae5 !important;
  }
  .swagger-ui .responses-table .response {
    transition: background .2s ease !important;
  }
  .swagger-ui .responses-table .response:hover {
    background: rgba(34,232,176,.08) !important;
  }

  /* ========== CODE BLOCKS (dark) ========== */
  .swagger-ui .highlight-code,
  .swagger-ui .microlight {
    background: linear-gradient(135deg, #0a0e17 0%, #022c22 100%) !important;
    border-radius: 12px !important;
    padding: 16px !important;
    border: 1px solid rgba(34,232,176,.25) !important;
    color: #a7f3d0 !important;
    font-size: 13px !important;
    line-height: 1.6 !important;
  }
  .swagger-ui .highlight-code .token.string { color: #a7f3d0 !important; }
  .swagger-ui .highlight-code .token.number { color: #fbbf24 !important; }
  .swagger-ui .highlight-code .token.boolean { color: #f472b6 !important; }
  .swagger-ui .highlight-code .token.property { color: #93c5fd !important; }
  .swagger-ui .highlight-code .token.punctuation { color: #94a3b8 !important; }

  /* ========== INPUTS ========== */
  .swagger-ui input[type=text],
  .swagger-ui input[type=email],
  .swagger-ui input[type=password],
  .swagger-ui input[type=search],
  .swagger-ui input[type=number],
  .swagger-ui textarea,
  .swagger-ui select {
    background: rgba(255,255,255,.95) !important;
    border: 2px solid rgba(34,232,176,.3) !important;
    border-radius: 10px !important;
    padding: 10px 14px !important;
    font-size: 14px !important;
    color: #022c22 !important;
    transition: all .25s cubic-bezier(.34,1.56,.64,1) !important;
    font-weight: 600 !important;
  }
  .swagger-ui input:focus,
  .swagger-ui textarea:focus,
  .swagger-ui select:focus {
    outline: none !important;
    border-color: #22E8B0 !important;
    background: #ffffff !important;
    box-shadow: 0 0 0 4px rgba(34,232,176,.25) !important;
    transform: translateY(-1px);
  }
  .swagger-ui input::placeholder,
  .swagger-ui textarea::placeholder {
    color: #64748b !important;
  }

  /* ========== TABLES ========== */
  .swagger-ui table thead tr th {
    color: #22E8B0 !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    text-transform: uppercase !important;
    letter-spacing: .5px !important;
    border-bottom: 2px solid rgba(34,232,176,.25) !important;
    padding: 12px 8px !important;
  }
  .swagger-ui table tbody tr {
    transition: background .2s ease;
  }
  .swagger-ui table tbody tr:hover {
    background: rgba(34,232,176,.08) !important;
  }
  .swagger-ui table tbody tr td {
    padding: 12px 8px !important;
    border-bottom: 1px solid rgba(34,232,176,.12) !important;
    color: #d1fae5 !important;
    font-size: 13.5px !important;
  }

  /* ========== DIALOG (Authorize modal) ========== */
  .swagger-ui .dialog-ux .modal-ux {
    background: rgba(2,44,34,.95) !important;
    backdrop-filter: blur(24px) !important;
    border-radius: 20px !important;
    box-shadow: 0 30px 60px -20px rgba(0,0,0,.7) !important;
    border: 1px solid rgba(34,232,176,.3) !important;
    animation: modalIn .4s cubic-bezier(.34,1.56,.64,1) !important;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .swagger-ui .dialog-ux .modal-ux-header {
    background: linear-gradient(135deg, rgba(34,232,176,.15), rgba(16,185,129,.1)) !important;
    border-bottom: 1px solid rgba(34,232,176,.25) !important;
    border-radius: 20px 20px 0 0 !important;
    padding: 20px 24px !important;
  }
  .swagger-ui .dialog-ux .modal-ux-header h3 {
    color: #22E8B0 !important;
    font-weight: 800 !important;
  }
  .swagger-ui .dialog-ux .modal-ux-header button {
    fill: #22E8B0 !important;
  }
  .swagger-ui .dialog-ux .modal-ux-content {
    padding: 24px !important;
  }
  .swagger-ui .dialog-ux .modal-ux-content label {
    color: #d1fae5 !important;
    font-weight: 600 !important;
  }
  .swagger-ui .dialog-ux .modal-ux-content h4 {
    color: #22E8B0 !important;
  }
  .swagger-ui .dialog-ux .modal-ux-content p {
    color: #a7f3d0 !important;
  }
  .swagger-ui .dialog-ux .modal-ux-content code {
    background: rgba(34,232,176,.15) !important;
    color: #22E8B0 !important;
    padding: 2px 6px !important;
    border-radius: 4px !important;
  }
  .swagger-ui .dialog-ux .modal-ux-content .auth-btn-wrapper {
    padding-top: 20px;
  }

  /* ========== LOADING ========== */
  .swagger-ui .loading-container .loading::after {
    border-color: #22E8B0 transparent #22E8B0 transparent !important;
  }

  /* ========== SCROLLBAR ========== */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(2,44,34,.3);
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #22E8B0, #10B981);
    border-radius: 5px;
    border: 2px solid rgba(2,44,34,.3);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #10B981, #047857);
  }

  /* ========== RESPONSIVE ========== */
  @media (max-width: 768px) {
    .swagger-ui .info { padding: 24px !important; }
    .swagger-ui .info .title { font-size: 26px !important; }
    .swagger-ui .opblock-tag { padding: 14px !important; }
    .swagger-ui .opblock-tag a { font-size: 15px !important; }
    .swagger-ui .opblock-summary-path { font-size: 12px !important; }
  }
`;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: customSwaggerCSS,
  customSiteTitle: 'Nooruz Market API',
  customfavIcon: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    displayRequestDuration: true,
    tryItOutEnabled: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai',
    },
  },
}));

// JSON форматында да жеткиликтүү
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ====== Health check ======
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 Nooruz Market API иштеп жатат',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
  });
});

// ====== API welcome ======
app.get('/', (req, res) => {
  res.json({
    name: 'Nooruz Market API',
    version: '1.0.0',
    description: 'Онлайн-маркет Nooruz Market үчүн REST API',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      docsJson: '/api-docs.json',
      api: '/api',
    },
    author: 'Nooruz Market',
  });
});

// ====== API Routes ======
app.use('/api', routes);

// ====== 404 handler ======
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `❌ Маршрут табылган жок: ${req.method} ${req.originalUrl}`,
  });
});

// ====== Global error handler ======
app.use((err, req, res, next) => {
  console.error('');
  console.error('╔════════════════════════════════════════════╗');
  console.error('║  ⚠️  Ката кармалды                         ║');
  console.error('╠════════════════════════════════════════════╣');
  console.error(`║  ${err.message.slice(0, 42).padEnd(42)}║`);
  console.error('╚════════════════════════════════════════════╝');
  console.error('');

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Ички сервер катасы',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;