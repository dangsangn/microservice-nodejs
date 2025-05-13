import { IRepository, TokenPayload, UserRole } from '@/share/interface';
import { PagingDTO } from '@/share/model/paging';
import { IUserUseCase } from '../interface';
import {
  Gender,
  Status,
  User,
  userCondDTOSchema,
  UserConditionDTO,
  UserLoginDTO,
  UserLoginDTOSchema,
  UserRegisterDTO,
  userRegisterDTOSchema,
  UserUpdateDTO,
  userUpdateDTOSchema,
} from '../model';
import { ErrDataNotFound } from '@/share/model/base-error';
import { ErrEmailAlreadyExists, ErrInvalidPassword, ErrInvalidToken, ErrUserInvalid } from '../model/error';
import * as bcrypt from 'bcrypt';
import { v7 } from 'uuid';
import { jwtService } from '@/share/component/jwt';

export class UserUseCase implements IUserUseCase {
  constructor(private readonly userRepository: IRepository<User, UserConditionDTO, UserUpdateDTO>) {}
  async login(dto: UserLoginDTO): Promise<string> {
    const data = UserLoginDTOSchema.parse(dto);

    const user = await this.userRepository.findByCondition({ email: data.email });
    if (!user) {
      throw ErrDataNotFound;
    }

    const isMatch = bcrypt.compareSync(`${data.password}.${user.salt}`, user.password);
    if (!isMatch) {
      throw ErrInvalidPassword;
    }

    const token = jwtService.generateToken({ sub: user.id, role: user.role });
    return token;
  }

  async register(dto: UserRegisterDTO): Promise<string> {
    const data = userRegisterDTOSchema.parse(dto);

    // check email exist
    const userExist = await this.userRepository.findByCondition({ email: data.email });
    if (userExist) {
      throw ErrEmailAlreadyExists;
    }

    // generate salt and hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(`${data.password}.${salt}`, 10);
    const userId = v7();

    const user = {
      ...data,
      id: userId,
      password: hash,
      salt,
      gender: Gender.UNKNOWN,
      role: UserRole.USER,
      status: Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // insert user
    await this.userRepository.insert(user);
    return userId;
  }

  async profile(userId: string): Promise<User> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      throw ErrDataNotFound;
    }
    return user;
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    const result = await jwtService.verifyToken(token);
    if (!result) {
      throw ErrInvalidToken;
    }
    const user = await this.userRepository.get(result.sub);
    if (!user) {
      throw ErrDataNotFound;
    }
    if (user.status === Status.INACTIVE || user.status === Status.DELETED || user.status === Status.BANNED) {
      throw ErrUserInvalid;
    }
    return result;
  }

  async create(data: UserRegisterDTO): Promise<string> {
    return await this.register(data);
  }

  async get(id: string): Promise<User> {
    const data = await this.userRepository.get(id);

    if (!data || data.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    return data;
  }

  async update(id: string, data: UserUpdateDTO): Promise<boolean> {
    const dto = userUpdateDTOSchema.parse(data);

    const product = await this.userRepository.get(id);
    if (!product || product.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    await this.userRepository.update(id, dto);

    return true;
  }

  async list(cond: UserConditionDTO, paging: PagingDTO): Promise<User[]> {
    const parsedCond = userCondDTOSchema.parse(cond);

    return await this.userRepository.list(parsedCond, paging);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.userRepository.get(id);

    if (!product || product.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    await this.userRepository.delete(id, false);

    return true;
  }
}
