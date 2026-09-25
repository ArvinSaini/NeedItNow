// Loaded before anything else in every test file (first import in setup.js).
// Values here never touch a real database or secret.
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/unused-in-tests';
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-1234';
process.env.JWT_EXPIRES_IN = '7d';
process.env.ADMIN_EMAILS = 'admin@test.com';
process.env.CORS_ORIGINS = '';
