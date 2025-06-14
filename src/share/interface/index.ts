import { PagingDTO } from '@/share/model/paging';

export interface IRepository<Entity, Condition, UpdateDTO>
  extends IQueryRepository<Entity, Condition>,
    ICommandRepository<Entity, UpdateDTO> {}

export interface IQueryRepository<Entity, Condition> {
  get(id: string): Promise<Entity | null>;
  findByCondition(condition: Condition): Promise<Entity | null>;
  list(condition: Condition, paging: PagingDTO): Promise<Entity[]>;
  listByIds(ids: string[]): Promise<Entity[]>;
}

export interface ICommandRepository<Entity, UpdateDTO> {
  insert(entity: Entity): Promise<boolean>;
  update(id: string, updateDTO: UpdateDTO): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface ICommandHandler<Command, Result> {
  execute(command: Command): Promise<Result>;
}

export interface IQueryHandler<Query, Result> {
  query(query: Query): Promise<Result>;
}

export interface IUseCase<CreateDTO, UpdateDTO, Condition, Entity> {
  create(dto: CreateDTO): Promise<string>;
  update(id: string, dto: UpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  get(id: string): Promise<Entity>;
  list(condition: Condition, paging: PagingDTO): Promise<Entity[]>;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export interface Requester extends TokenPayload {}

export interface ITokenProvider {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}

// Authorization
export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  isOk: boolean;
  error?: Error;
};

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}
