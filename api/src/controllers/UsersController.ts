import { NextFunction, Request, Response } from "express";
import { UsersService } from "../services/UsersService";

class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }
  async me(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;
    try {
      const result = await this.usersService.index(email);

      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  async store(request: Request, response: Response, next: NextFunction) {
    const { name, email, password } = request.body;
    try {
      const result = await this.usersService.create({ name, email, password });

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, oldPassword, newPassword } = request.body;
    const { user_id } = request;

    try {
      const result = await this.usersService.update({ name, oldPassword, newPassword, avatar_url: request.file?.path, user_id });
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;

    try {
      const result = await this.usersService.auth(email, password)
      return response.json(result);

    } catch (error) {
      next(error);
    }
  }

  async refresh(request: Request, response: Response, next: NextFunction) {
    const { refresh_token } = request.body;

    try {
      const result = await this.usersService.refresh(refresh_token)
      return response.json(result);

    } catch (error) {
      next(error);
    }
  }
}

export { UsersController };

