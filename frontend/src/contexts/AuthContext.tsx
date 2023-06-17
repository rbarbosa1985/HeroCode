import { isAxiosError } from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
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
  availableSchedules: Array<string>;
  schedules: Array<ISchedule>;
  date: string;
  handleSetDate: (date: string) => void;
  isAuthenticated: boolean;
}


interface ISchedule {
  name: string;
  date: Date;
  id: string;
  phone: string;
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
  const [schedules, setSchedules] = useState<Array<ISchedule>>([]);
  const [date, setDate] = useState('');
  const availableSchedules = [
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
  ]
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user')
    if (user) {
      return JSON.parse(user);
    }
    return {}
  });

  const isAuthenticated = !!user && Object.keys(user).length !== 0
  const navigate = useNavigate();
  const handleSetDate = (date: string) => {
    setDate(date)
  }

  useEffect(() => {
    api.get('/schedules', {
      params: {
        date
      }
    }).then((response) => {
      setSchedules(response.data);
    }).catch((error) => {
      console.log(error)
    });
  }, [date]);


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
    <AuthContext.Provider value={{ signIn, signOut, user, availableSchedules, schedules, date, handleSetDate, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}