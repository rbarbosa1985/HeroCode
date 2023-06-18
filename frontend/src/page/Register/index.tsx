import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { BsKey, BsPerson } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../assets/logo.webp';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../server';
import style from './register.module.css';

interface IFormValues {
  name: string;
  email: string;
  password: string;
}
export function Register() {

  const schema = yup.object().shape({
    name: yup.string().required('Campo de nome obrigatório'),
    email: yup.string().email('Digite um e-mail válido').required('Campo de email obrigatório'),
    password: yup.string().required('Campo de senha obrigatório')

  })
  const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({ resolver: yupResolver(schema) })

  const submit = handleSubmit(async (data) => {
    const result = await api.post('users/', {
      name: data.name,
      email: data.email,
      password: data.password
    });
  })

  return (
    <div className={style.background}>
      <div className="container">
        <p className={style.navigate}><Link to={'/'}>Home</Link> {'>'} Área de Cadastro</p>
        <div className={style.wrapper}>
          <div className={style.imageContainer}>
            <img src={logo} alt="" />
          </div>
          <div className={style.card}>
            <h2>Olá, seja bem vindo</h2>
            <form onSubmit={submit}>
              <Input type='text' placeholder="Nome" icon={<BsPerson size={20} />} {...register('name', { required: true })} error={errors.name && errors.name.message} />
              <Input type='text' placeholder="Email" icon={<AiOutlineMail size={20} />}{...register('email', { required: true })} error={errors.email && errors.email.message} />
              <Input type='password' placeholder="Senha" icon={<BsKey size={20} />} {...register('password', { required: true })} error={errors.password && errors.password.message} />
              <Button text='Cadastrar' />
            </form>
            <div className={style.register}>
              <span>Já tem cadastro? <Link to={'/'}>Voltar à Pagina Inicial</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}