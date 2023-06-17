import { getHours, isAfter } from 'date-fns';
import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toast } from "react-toastify";
import { api } from '../../server';
import { ModalEdit } from '../ModalEdit';
import style from './card.module.css';

interface ISchedule {
  name: string;
  date: Date;
  id: string;
  phone: string;
  schedulesUpdate: (date: Date) => void;

}

export function Card({ name, date, id, phone, schedulesUpdate }: ISchedule) {
  const isAfterDate = isAfter(new Date(date), new Date());
  const [openModal, setOpenModal] = useState<boolean>(false);

  const dateFormatted = new Date(date);
  const hour = getHours(dateFormatted)
  let phoneFormatted = phone.replace(/\D/g, '');
  phoneFormatted = phoneFormatted.replace(
    /(\d{2})(\d{5})(\d{4})/,
    '($1) $2-$3',
  )

  const handleChangeModal = () => {
    setOpenModal(!openModal);
  }

  const handleDelete = async () => {
    await api.delete(`/schedules/${id}`).
      then(() => {
        toast.success('Agendamento deletado com sucesso!');
        schedulesUpdate(date);
      }).
      catch(() => toast.error('Erro ao deletar o agendamento!'));
  }

  return (
    <>
      <div className={style.background}>
        <div>
          <span className={`${!isAfterDate && style.disable}`}>{hour}h</span>
          <p>{name} - {phoneFormatted}</p>
        </div>
        <div className={style.icons}>
          <AiOutlineEdit size={25} color="#5f68b1" onClick={() => { isAfterDate && handleChangeModal() }} />
          <RiDeleteBinLine size={25} color="#EB2e2e" onClick={() => { isAfterDate && handleDelete() }} />
        </div>
      </div>
      <ModalEdit isOpen={openModal} data={date} schedulesUpdate={schedulesUpdate} handleChangeModal={handleChangeModal} hour={hour} name={name} id={id} />
    </>
  )
}