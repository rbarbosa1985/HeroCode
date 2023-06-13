import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/UsersInterface";

class UsersRepository {

  async create({ name, email, password }: ICreate) {
    const result = await prisma.users.create({
      data: {
        name,
        email,
        password
      }
    });
    return result;
  }

  async findUserByEmail(email: string) {
    const result = await prisma.users.findUnique({
      where: {
        email
      }
    });

    return result;
  }

  async findUserById(id: string) {
    const result = await prisma.users.findUnique({
      where: {
        id
      }
    });

    return result;
  }

  async updatePassword(name: string, password: string, id: string) {
    const result = await prisma.users.update({
      where: {
        id
      },
      data: {
        name,
        password
      }
    })
    return result;
  }

  async updateAvatar(name: string, avatar_url: string, id: string) {
    const result = await prisma.users.update({
      where: {
        id
      },
      data: {
        name,
        avatar_url
      }
    })
    return result;
  }


  async updateUser(name: string, id: string) {
    const result = await prisma.users.update({
      where: {
        id
      },
      data: {
        name,
      }
    })
    return result;
  }

}

export { UsersRepository };
