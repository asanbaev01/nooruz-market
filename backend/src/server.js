import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Серверди иштетүү
 */
const startServer = async () => {
  try {
    // ====== 1. MongoDB'ке туташуу ======
    await connectDB();

    // ====== 2. Express серверин иштетүү ======
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║                                                       ║');
      console.log('║   🛒  NOORUZ MARKET API                               ║');
      console.log('║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     ║');
      console.log('║                                                       ║');
      console.log(`║   🚀  Сервер:      http://localhost:${String(PORT).padEnd(24)}║`);
      console.log(`║   🌍  Орчо:        ${NODE_ENV.padEnd(34)}║`);
      console.log(`║   💚  Health:      http://localhost:${PORT}/health${' '.repeat(Math.max(0, 6 - String(PORT).length))}║`);
      console.log(`║   📚  API Docs:    http://localhost:${PORT}/api-docs${' '.repeat(Math.max(0, 3 - String(PORT).length))}║`);
      console.log('║                                                       ║');
      console.log('║   Басуу Ctrl+C токтотуу үчүн                         ║');
      console.log('║                                                       ║');
      console.log('╚═══════════════════════════════════════════════════════╝');
      console.log('');
    });

    // ====== 3. Graceful shutdown ======
    const shutdown = (signal) => {
      console.log('');
      console.log(`📴 ${signal} кабыл алынды. Сервер жабылып жатат...`);
      server.close(() => {
        console.log('✅ Сервер жабылды');
        process.exit(0);
      });

      // 10 секунддан кийин күч менен жабуу
      setTimeout(() => {
        console.error('⚠️ Сервер 10 секундда жабылбады. Күч менен жабуу.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // ====== 4. Кармалбаган каталарды кармоо ======
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection:', reason);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error.message);
      console.error(error.stack);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error('');
    console.error('❌ Серверди иштетүү катасы:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();