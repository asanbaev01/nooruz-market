import mongoose from 'mongoose';

/**
 * MongoDB'ке туташуу
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // MongoDB 8.x үчүн керек эмес, бирок эскертүүсүз иштөө үчүн
    });

    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ MongoDB туташты                        ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║  🌐 Host: ${conn.connection.host.padEnd(32)}║`);
    console.log(`║  💾 DB:   ${conn.connection.name.padEnd(32)}║`);
    console.log(`║  🔢 Port: ${String(conn.connection.port || 'default').padEnd(32)}║`);
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('╔════════════════════════════════════════════╗');
    console.error('║  ❌ MongoDB туташуу катасы                 ║');
    console.error('╠════════════════════════════════════════════╣');
    console.error(`║  ${error.message.slice(0, 42).padEnd(42)}║`);
    console.error('╚════════════════════════════════════════════╝');
    console.error('');
    process.exit(1);
  }
};

/**
 * MongoDB'ден ажыроо (graceful shutdown)
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('🔌 MongoDB ажыратылды');
  } catch (error) {
    console.error('❌ Ажыроо катасы:', error.message);
  }
};

// MongoDB иш-чаралары (events)
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose: туташты');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose ката:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose: ажыратылды');
});

// Node.js токтогондо (Ctrl+C) туура жабуу
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

export default connectDB;