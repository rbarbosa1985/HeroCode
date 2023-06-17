import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from 'yup';
import imageDefault from "../../assets/do-utilizador_318-159711.avif";
import { Header } from "../../components/Header";
import { InputSchedule } from "../../components/InputSchedule";
import { api } from "../../server";
import style from "./editProfile.module.css";

interface IFormValues {
  picture: File[];
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface IData {
  oldPassword?: string;
  newPassword?: string;
  name: string;
  avatar_url?: File;
  email: string;
}

interface IData2 {
  oldPassword?: string;
  newPassword?: string;
  name: string;
  avatar_url?: string;
  email: string;
}

export function EditProfile() {
  const [userProfile, setUserProfile] = useState<IData2>();
  const [fileUpload, setFileUpload] = useState(imageDefault);
  const schema = yup.object().shape({
    name: yup.string().required('O nome é obrigatório.'),
    email: yup.string().required('O email é obrigatório.'),
    oldPassword: yup.string(),
    newPassword: yup.string(),
    newPasswordConfirm: yup.string().oneOf([yup.ref('newPassword')], 'senha devem ser iguais'),

  });
  const { register, handleSubmit, setValue } = useForm<IFormValues>({
    resolver: yupResolver(schema)
  });


  const navigate = useNavigate();

  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    const user = userStorage && JSON.parse(userStorage);
    async function Profile() {
      const result = await api.get(`/users/${user.email}`);
      setUserProfile(result);
      if (userProfile) {
        if (userProfile?.avatar_url) {
          setFileUpload("../../../public/uploads/" + userProfile.avatar_url.split('\\')[4]);
        }

        setValue('name', userProfile.name);
        setValue('email', userProfile.email);
      }
    }

    Profile();

  }, [])

  const handleImage = (files: File[]) => {
    const image = files[0];
    const imageUrl = URL.createObjectURL(image);
    setFileUpload(imageUrl);
  }

  const submit = handleSubmit(async ({ name, email, oldPassword, newPassword, newPasswordConfirm, picture }) => {
    const data: IData = {
      name,
      email
    };
    if (oldPassword && newPassword) {
      data.oldPassword = oldPassword;
      data.newPassword = newPassword;
    }
    if (picture) {
      data.avatar_url = picture[0];
    }

    await api.put('/users', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(() => {
      toast.success('Usuário alterado com sucesso!');

      navigate("/dashboard");
    }).catch((error) => {
      toast.error(error.response.data.message)
    })
  })


  return (
    <div className="container">
      <Header />
      <h2 className={style.title}>Perfil</h2>
      <form onSubmit={submit}>

        <div className={style.formDiv}>
          {fileUpload && (
            <div className={style.fileUpload}>
              <img src={fileUpload} alt="" />
              <label className={style.imageUpload}>
                <input type="file" {...register('picture', { required: true, onChange: (e) => { handleImage(e.target.files) } })} />
                <FiEdit2 />
              </label>
            </div>
          )}
          <InputSchedule placeholder="Nome" type="text" {...register('name', { required: true })} />
          <InputSchedule placeholder="Email" type="text" {...register('email', { required: true })} />
          <InputSchedule placeholder="Senha Atual" type="password" {...register('oldPassword')} />
          <InputSchedule placeholder="Nova Senha" type="password"{...register('newPassword')} />
          <InputSchedule placeholder="Confirmar Nova Senha" type="password"{...register('newPasswordConfirm')} />
          <div className={style.footer}>
            <button onClick={() => { navigate('/dashboard') }}>Cancelar</button>
            <button>Editar</button>
          </div>
        </div>
      </form>

    </div>
  )
}
