import { ITokenProvider, TokenPayload } from '../interface';
import jwt from 'jsonwebtoken';
import { config } from './config';

export class JWTTokenService implements ITokenProvider {
  private readonly secretKey: string;
  private readonly expiresIn: string | number;

  constructor(secretKey: string, expiresIn: string | number) {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}

export const jwtService = new JWTTokenService(config.accessToken.secretKey, config.accessToken.expiresIn);
