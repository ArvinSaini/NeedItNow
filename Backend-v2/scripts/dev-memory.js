// Runs the API against a throwaway in-memory MongoDB. No real database or .env needed.
// Data disappears when the process exits. Good for demos, browser testing and interviews.
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create();

// Values set here win over .env because Node's loadEnvFile never overrides existing variables.
process.env.MONGODB_URI = mongod.getUri('needitnow');
process.env.NODE_ENV ??= 'development';
process.env.PORT ??= '5000';
process.env.JWT_SECRET ??= 'dev-only-secret-never-use-in-production';
process.env.ADMIN_EMAILS ??= 'admin@test.com';

console.log(`in-memory mongodb at ${process.env.MONGODB_URI}`);
process.on('exit', () => mongod.stop());

await import('../src/server.js');
