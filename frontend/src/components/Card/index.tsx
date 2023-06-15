import { getHours, isAfter } from 'date-fns';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import style from './card.module.css';

interface ISchedule {
  name: string;
  date: Date;
  id: string;
}

export function Card({ name, date, id }: ISchedule) {
  const isAfterDate = isAfter(new Date(date), new Date());
  return (
    <div className={style.background}>
      <div>
        <span className={`${!isAfterDate && style.disable}`}>{getHours(new Date(date))}h</span>
        <p>{name}</p>
      </div>
      <div className={style.icons}>
        <AiOutlineEdit size={17} color="#5f68b1" />
        <RiDeleteBinLine size={17} color="#EB2e2e" />
      </div>
    </div>
  )
}