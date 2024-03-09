export type TokenPayload = {
  sub: string;
  isSecondFactorAuthenticated: boolean;
  iat: number;
  exp: number;
};
