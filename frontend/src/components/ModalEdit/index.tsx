import { formatISO, getHours, parseISO, setHours } from 'date-fns';
import { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { toast } from "react-toastify";
import { useAuth } from '../../hooks/auth';
import { api } from '../../server';
import style from './modaledit.module.css';


interface IModal {
  isOpen: boolean;
  handleChangeModal: () => void;
  name: string;
  hour: number;
  id: string;
  data: Date;
  schedulesUpdate: (date: Date) => void;
}

export function ModalEdit({ isOpen, handleChangeModal, hour, name, id, data, schedulesUpdate }: IModal) {
  const { availableSchedules, schedules, date, handleSetDate } = useAuth();
  const [hourSchedule, setHourSchedule] = useState('');
  const currentValue = new Date().toISOString().split('T')[0];

  const filteredDate = availableSchedules.filter((hour) => {
    const isScheduleAvailable = !schedules.find((scheduleItem) => {
      const scheduleDate = new Date(scheduleItem.date);
      const scheduleHour = getHours(scheduleDate);
      return scheduleHour === Number(hour);
    });
    return isScheduleAvailable;
  })

  const handleChangeHour = (hour: string) => {
    setHourSchedule(hour);
  }

  const updateData = async () => {
    try {
      const formattedDate = formatISO(setHours(parseISO(date), parseInt(hourSchedule)))
      await api.put(`/schedules/${id}`, {
        date: formattedDate
      }).then(() => {
        toast.success('Horário atualizado com sucesso!')
        schedulesUpdate(data);
      }).catch((error) => {
        toast.error(error.response.data.message)
      }).finally(() => { handleChangeModal(); })
    } catch {
      toast.error('Não é possível cadastrar em data anterior ou final de semana.')
    }

  }

  if (isOpen) {
    return (
      <div className={style.background}>
        <div className={style.modal}>
          <div className={style.header}>
            <h2>Editar Horário</h2>
            <AiOutlineCloseCircle size={25} onClick={handleChangeModal} />
          </div>
          <div className={style.body}>
            <p>{hour}h {name}</p>
            <div className={style.input}>
              <label>Indique uma nova data:</label>
              <input type='date' defaultValue={currentValue} min={currentValue} onChange={(e) => handleSetDate(e.target.value)} />
            </div>
            <div className={style.input}>
              <label>Escolha um novo horário:</label>
              <select onChange={(e) => handleChangeHour(e.target.value)} >
                {
                  filteredDate.map((hour, index) => {
                    return (
                      <option value={hour} key={index}>{hour}:00</option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          <div className={style.footer}>
            <button onClick={handleChangeModal}>Cancelar</button>
            <button onClick={updateData}>Editar</button>
          </div>
        </div>
      </div >
    )
  } else {
    return (
      <></>
    )
  }


}