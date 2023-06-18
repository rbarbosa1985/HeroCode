import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import { BsKey } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../assets/logo.webp';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import style from './login.module.css';

interface IFormValues {

  email: string;
  password: string;
}

export function Login() {
  const { signIn } = useAuth();
  const schema = yup.object().shape({

    email: yup.string().email('Digite um e-mail válido').required('Campo de email obrigatório'),
    password: yup.string().required('Campo de senha obrigatório')

  })
  const { register, handleSubmit, formState: { errors } } = useForm<IFormValues>({ resolver: yupResolver(schema) })

  const submit = handleSubmit(async ({ email, password }) => {
    try {
      signIn({ email, password });
    } catch (error) {
      console.log(error)
    }



  })
  return (
    <div className={style.background}>
      <div className={`container ${style.container}`}>
        <div className={style.wrapper}>
          <div>
            <img src={logo} alt="" />
          </div>
          <div className={style.card}>
            <h2>Olá, seja bem vindo</h2>
            <form onSubmit={submit}>
              <Input type='text' placeholder="Email" icon={<AiOutlineMail size={20} />} {...register('email', { required: true })} error={errors.email && errors.email.message} />
              <Input type='password' placeholder="Senha" icon={<BsKey size={20} />} {...register('password', { required: true })} error={errors.password && errors.password.message} />
              <Button text='Entrar' />
            </form>
            <div className={style.register}>
              <span>Ainda não tem conta? <Link to={'/register'}>Cadastre-se</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}