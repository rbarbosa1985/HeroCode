import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  private usersRepository: UsersRepository;
  constructor() {
    this.usersRepository = new UsersRepository();
  }
  async create({ name, email, password }: ICreate) {
    const findUser = await this.usersRepository.findUserByEmail(email);

    if (findUser) {
      throw new Error('User exists.')
    }

    const hashPassword = await hash(password, 10);
    const create = await this.usersRepository.create({ name, email, password: hashPassword });

    return create;
  }

  async update({ name, oldPassword, newPassword, avatar_url, user_id }: IUpdate) {
    let hashPassword
    if (oldPassword && newPassword) {
      const findUser = await this.usersRepository.findUserById(user_id);

      if (!findUser) {
        throw new Error('User not found.')
      }
      const passwordMatch = compare(oldPassword, findUser.password);

      if (!passwordMatch) {
        throw new Error('User or password invalid.')
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

  async auth(email: string, password: string) {

    console.log("Email:" + email);

    const findUser = await this.usersRepository.findUserByEmail(email);
    if (!findUser) {
      throw new Error('User or password invalid.')
    }
    const passwordMatch = compare(password, findUser.password);

    if (!passwordMatch) {
      throw new Error('User or password invalid.')
    }

    let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN

    if (!secretKey) {
      throw new Error('There is no token key')
    }

    const token = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 15,
    })

    return {
      token,
      user: {
        name: findUser.name,
        email: findUser.email
      }
    }

  }
}

export { UsersService };
