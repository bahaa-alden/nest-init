import { registerAs } from '@nestjs/config';

const postgresConfig = registerAs('postgres', () => ({
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_NAME,
  password: process.env.POSTGRES_PASS,
  port: Number(process.env.POSTGRES_PORT),
  host: process.env.POSTGRES_HOST,
}));
export default postgresConfig;
