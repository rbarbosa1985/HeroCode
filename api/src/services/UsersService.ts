import { compare, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  private usersRepository: UsersRepository;
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async index(email: string) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    return findUser;
  }

  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if (findUser) {
      throw new Error('Usuário já existe.')
    }

    const hashPassword = await hash(password, 10);
    const create = await this.usersRepository.create({ name, email, password: hashPassword });

    return create;
  }

  async update({ name, oldPassword, newPassword, avatar_url, user_id }: IUpdate) {
    if (oldPassword && newPassword) {
      const findUser = await this.usersRepository.findUserById(user_id);

      if (!findUser) {
        throw new Error('Usuário não encontrado.')
      }
      const passwordMatch = compare(oldPassword, findUser.password);

      if (!passwordMatch) {
        throw new Error('Usuário ou senha invalida.')
      }

      const hashPassword = await hash(newPassword, 10);
      const result = await this.usersRepository.updatePassword(name, hashPassword, user_id);

      return result;
    }

    if (avatar_url) {
      const result = await this.usersRepository.updateAvatar(name, avatar_url, user_id);

      return result;
    }

    const result = await this.usersRepository.updateUser(name, user_id);

    return result;

  }

  async refresh(refresh_token: string) {

    if (!refresh_token) {
      throw new Error('Refresh token  missing.')
    }

    let secretKeyRefresh: string | undefined = process.env.ACCESS_KEY_TOKEN_REFRESH

    if (!secretKeyRefresh) {
      throw new Error('There is no token key')
    }

    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN

    if (!secretKey) {
      throw new Error('There is no token key')
    }

    const verifyRefreshToken = await verify(refresh_token, secretKeyRefresh)

    const { sub } = verifyRefreshToken;

    const newToken = sign({ sub }, secretKey, {
      expiresIn: '1h',
    })

    const refreshToken = sign({ sub }, secretKey, {
      expiresIn: '7d',
    })

    return { token: newToken, refresh_token: refreshToken };

  }

  async auth(email: string, password: string) {

    const findUser = await this.usersRepository.findUserByEmail(email);
    if (!findUser) {
      throw new Error('Usuário ou senha invalida.')
    }
    const passwordMatch = await compare(password, findUser.password);

    if (!passwordMatch) {
      throw new Error('Usuário ou senha invalida.')
    }

    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN

    if (!secretKey) {
      throw new Error('There is no token key')
    }

    let secretKeyRefreshToken: string | undefined = process.env.ACCESS_KEY_TOKEN_REFRESH

    if (!secretKeyRefreshToken) {
      throw new Error('There is no token key')
    }

    const token = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 15,
    })

    const refreshToken = sign({ email }, secretKeyRefreshToken, {
      subject: findUser.id,
      expiresIn: '7d',
    })

    return {
      token,
      refresh_token: refreshToken,
      user: {
        name: findUser.name,
        email: findUser.email,
        avatar_url: findUser.avatar_url
      }
    }

  }
}

export { UsersService };

