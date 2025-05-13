import { IUseCase, TokenPayload } from '@/share/interface';
import { User, UserLoginDTO } from '../model';
import { UserConditionDTO, UserRegisterDTO, UserUpdateDTO } from '../model/index';

export interface IUserUseCase extends IUseCase<UserRegisterDTO, UserUpdateDTO, UserConditionDTO, User> {
  login(dto: UserLoginDTO): Promise<string>;
  register(dto: UserRegisterDTO): Promise<string>;
  profile(userId: string): Promise<User>;
  verifyToken(token: string): Promise<TokenPayload>;
}
