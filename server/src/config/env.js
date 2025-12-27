const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  validateEnv,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
