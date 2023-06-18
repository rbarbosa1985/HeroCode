import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { Card } from "../../components/Card";
import { Header } from "../../components/Header";
import { useAuth } from "../../hooks/auth";
import { api } from "../../server";
import style from './dashboard.module.css';

interface ISchedule {
  date: Date;
  id: string;
  name: string;
  phone: string;
  user_id: string;
}

export function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
  const { user } = useAuth();
  const currentValue = new Date().toISOString().split('T')[0];

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  const isWeekDay = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6
  }

  const handleDataChange = (date: Date) => {
    setDate(date);
  }

  function schedulesUpdate(date: Date) {
    api.get('/schedules', {
      params: {
        date,
      }
    }).then((response) => {
      setSchedules(response.data);
    })
  }

  useEffect(() => {
    schedulesUpdate(date);
  }, [date])

  return (
    <div className="container">
      <Header />
      <div className={style.dataTitle}>
        <h2>Bem vindo(a), {user.name}</h2>
        <p>Esta é a sua lista de horários {isToday(date) ? <span>de hoje,</span> : <span>do</span>} dia {format(date, 'dd/MM/yyy')}</p>
      </div>

      <div className={style.schedule}>
        <div className={style.cardWrapper}>
          {schedules.length > 0 && <h2 className={style.nextSchedules}>Próximos horários</h2>}
          {schedules.length <= 0 && <h2 className={style.nextSchedules}>Nenhum cliente agendado para esta data.</h2>}
          {schedules.map((schedule, index) => {
            return <Card key={index} schedulesUpdate={schedulesUpdate} date={schedule.date} name={schedule.name} id={schedule.id} phone={schedule.phone} />
          })}
        </div>
        <div className={style.picker}>
          <DayPicker className={style.calender}
            selected={date} mode="single"
            classNames={{ day: style.day }}
            disabled={isWeekend}
            modifiers={{ available: isWeekDay }}
            modifiersClassNames={{
              selected: style.selected,
            }}
            onDayClick={handleDataChange}
            locale={ptBR}
            fromMonth={new Date()}
          // fromDate={new Date()}
          />
        </div>
      </div>
    </div>
  )
}