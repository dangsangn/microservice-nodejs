import axios from 'axios';
import { ITokenIntrospect, TokenIntrospectResult } from '../interface';

export class TokenIntrospectRPCClient implements ITokenIntrospect {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async introspect(token: string): Promise<TokenIntrospectResult> {
    try {
      const { data } = await axios.post(`${this.baseUrl}`, {
        token,
      });
      const { sub, role } = data.data;

      return {
        payload: {
          sub,
          role,
        },
        isOk: true,
      };
    } catch (error) {
      return {
        payload: null,
        isOk: false,
        error: error as Error,
      };
    }
  }
}
