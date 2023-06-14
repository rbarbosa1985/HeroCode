import { isAxiosError } from "axios";
import { ReactNode, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../server";

interface IAuthProvider {
  children: ReactNode;
}

interface IAuthContextData {
  signIn: ({ email, password }: ISigIn) => void;
  signOut: () => void;
  user: IUserData;
}

interface IUserData {
  name: string;
  avatar_url: string;
  email: string;
}

interface ISigIn {
  email: string;
  password: string;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user')
    if (user) {
      return JSON.parse(user);
    }
    return {}
  })
  const navigate = useNavigate();
  async function signIn({ email, password }: ISigIn) {
    try {
      const { data } = await api.post('/users/auth', {
        email,
        password
      });
      const { token, refresh_token } = data;
      const userData = {
        name: data.user.name,
        email: data.user.email,
        avatar_url: data.user.avatar_url
      }
      localStorage.setItem('token', token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(userData))
      navigate('/dashboard')
      toast.success(`Seja bem vindo(a), ${userData.name}`)
      setUser(userData)
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Não foi possível realizar o login. Tente novamente.")
      }

    }
  }

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  )
}