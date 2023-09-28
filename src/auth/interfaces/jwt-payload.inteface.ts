import { UUID } from 'crypto';

export interface jwtPayload {
  sub: UUID;
  role: string;
  email: string;
  iat: number;
  exp: number;
}
