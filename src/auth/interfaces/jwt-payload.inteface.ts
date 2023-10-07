import { UUID } from 'crypto';

export interface jwtPayload {
  sub: UUID;
  role: string;
  iat: number;
  exp: number;
}
