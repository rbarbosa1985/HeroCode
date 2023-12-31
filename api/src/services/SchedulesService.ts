import { getHours, isBefore, startOfHour } from "date-fns";
import { ICreateSchedules } from "../interfaces/SchedulesInterface";
import { SchedulesRepository } from "../repositories/SchedulesRepository";

class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async delete(id: string) {
    const result = await this.schedulesRepository.delete(id);
    return result

  }

  async create({ name, phone, date, user_id }: ICreateSchedules) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    const hour = getHours(hourStart)
    if (hour < 9 || hour > 19) {
      throw new Error('Horários disponíveis somente de 9 as 19.')
    }

    if (isBefore(hourStart, new Date())) {
      throw new Error('Não é possível agendar em dias anteriores ou finais de semana!');
    }

    const checkIsAvailable = await this.schedulesRepository.findSchedule(hourStart);

    if (checkIsAvailable) {
      throw new Error('Esse horário já está ocupado.');
    }

    const create = await this.schedulesRepository.create({ name, phone, date: hourStart, user_id });

    return create;
  }

  async index(date: Date) {
    const schedules = await this.schedulesRepository.findSchedules(date);
    return schedules;
  }

  async update(id: string, date: Date) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);

    if (isBefore(hourStart, new Date())) {
      throw new Error('Não é possível agendar em dias anteriores ou finais de semana!');
    }

    const checkIsAvailable = await this.schedulesRepository.findSchedule(hourStart);

    if (checkIsAvailable) {
      throw new Error('Esse horário já está ocupado.');
    }

    const result = await this.schedulesRepository.update(id, date);
    return result
  }

}

export { SchedulesService };

