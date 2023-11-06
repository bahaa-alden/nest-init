import { registerAs } from '@nestjs/config';

const AppConfig = registerAs('application', () => ({
  port: process.env.PORT || 3000,
  env: process.env.ENV,
}));

const CloudinaryConfig = registerAs('cloudinary', () => ({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}));
const JwtConfig = registerAs('jwt', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
}));
export { AppConfig, CloudinaryConfig, JwtConfig };
