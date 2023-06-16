import { Header } from "../../components/Header";
import { InputSchedule } from "../../components/InputSchedule";
import style from "./schedules.module.css";
export function Schedules() {

  const submit = () => {
    console.log("oi")
  }

  return (
    <div className="container">
      <Header />
      <h2>Agendamento de Horário</h2>
      <div className={style.formDiv}>
        <form onSubmit={submit}>
          <InputSchedule placeholder="Nome do cliente:" type="text" />
          <InputSchedule placeholder="Celular:" type="text" />
          <div className={style.date}>
            <InputSchedule placeholder="Dia:" type="date" />
            <div className={style.select}>
              <label htmlFor="">Hora</label>
              <select name="" id="">
                <option value="">1</option>
                <option value="">1</option>
                <option value="">1</option>
                <option value="">1</option>
                <option value="">1</option>
              </select>
            </div>
          </div>
          <div className={style.footer}>
            <button /*onClick={handleChangeModal}*/>Cancelar</button>
            <button /*onClick={updateData}*/>Agendar</button>
          </div>
        </form>
      </div>
    </div>
  )
}