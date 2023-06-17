import { yupResolver } from "@hookform/resolvers/yup";
import { formatISO, getHours, parseISO, setHours } from "date-fns";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { Header } from "../../components/Header";
import { InputSchedule } from "../../components/InputSchedule";
import { useAuth } from "../../hooks/auth";
import { api } from "../../server";
import style from "./schedules.module.css";

interface IFormValues {
  date: string;
  name: string;
  phone: string;
  hour: string;
}

export function Schedules() {
  const schema = yup.object().shape({
    phone: yup.string().required('O telefone é obrigatório.'),
    name: yup.string().required('O nome é obrigatório.'),
    date: yup.string().required('A data é obrigatório.'),
    hour: yup.string().required('A Hora é obrigatório.'),
  });
  const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({ resolver: yupResolver(schema) });

  const { availableSchedules, schedules, handleSetDate } = useAuth();
  const currentValue = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  const filteredDate = availableSchedules.filter((hour) => {
    const isScheduleAvailable = !schedules.find((scheduleItem) => {
      const scheduleDate = new Date(scheduleItem.date);
      const scheduleHour = getHours(scheduleDate);
      return scheduleHour === Number(hour);
    });
    return isScheduleAvailable;
  })

  const submit = handleSubmit(async ({ name, phone, date, hour }) => {

    const formattedDate = formatISO(setHours(parseISO(date), parseInt(hour)))
    await api.post('/schedules', {
      name,
      date: formattedDate,
      phone

    }).then(() => {
      toast.success('Horário alterado com sucesso!');
      navigate("/dashboard");

    }).catch((error) => {
      toast.error(error.response.data.message)
    })
  })

  return (
    <div className={`container ${style.container}`}>
      <Header />
      <h2>Agendamento de Horário</h2>
      <div className={style.formDiv}>
        <form onSubmit={submit}>
          <InputSchedule error={errors.name && errors.name.message} placeholder="Nome do cliente:" type="text" {...register('name', { required: true })} />
          <InputSchedule error={errors.phone && errors.phone.message} placeholder="Celular:" type="text" {...register('phone', { required: true })} />
          <div className={style.date}>
            <InputSchedule error={errors.date && errors.date.message} placeholder="Dia:" type="date" {...register('date', { required: true, value: currentValue, onChange: (e) => { handleSetDate(e.target.value) } })} />
            <div className={style.select}>
              <label htmlFor="">Hora</label>
              <select {...register('hour', { required: true })}>
                {filteredDate.map((hour, index) => {
                  return (
                    <option value={hour} key={index}>{hour}:00</option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className={style.footer}>
            <button onClick={() => { navigate('/dashboard') }}>Cancelar</button>
            <button>Agendar</button>
          </div>
        </form>
      </div>
    </div>
  )
}