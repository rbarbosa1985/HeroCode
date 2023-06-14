import { getHours, isBefore, startOfHour } from "date-fns";
import { ICreateSchedules } from "../interfaces/SchedulesInterface";
import { SchedulesRepository } from "../repositories/SchedulesRepository";

class SchedulesService {
  private schedulesRepository: SchedulesRepository;
  constructor() {
    this.schedulesRepository = new SchedulesRepository();
  }

  async delete() {

  }

  async create({ name, phone, date, user_id }: ICreateSchedules) {
    const dateFormatted = new Date(date);
    const hourStart = startOfHour(dateFormatted);
    const hour = getHours(hourStart)
    if (hour < 9 || hour > 19) {
      throw new Error('Create Schedule between 9 at 19.')
    }

    if (isBefore(hourStart, new Date())) {
      throw new Error('It is not allowed schedule old date!');
    }

    const checkIsAvailable = await this.schedulesRepository.findSchedule(hourStart);

    if (checkIsAvailable) {
      throw new Error('Schedule date is not available');
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
      throw new Error('It is not allowed schedule old date!');
    }

    const checkIsAvailable = await this.schedulesRepository.findSchedule(hourStart);

    if (checkIsAvailable) {
      throw new Error('Schedule date is not available');
    }

    const result = await this.schedulesRepository.update(id, date);
    return result
  }

}

export { SchedulesService };
