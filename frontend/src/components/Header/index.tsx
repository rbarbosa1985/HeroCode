import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo_branca.png';
import { useAuth } from '../../hooks/auth';
import style from './header.module.css';

export function Header() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  return (
    <header className={style.background}>
      <div className={style.image} onClick={() => navigate('/dashboard')}>
        <img src={logo} alt='' />
        <span>Hero HairDresses</span>
      </div>
      <div className={style.profile}>
        <div className={style.dropdown} onClick={() => setOpen(!open)}>
          <CgProfile size={18} />
          <span>Perfil</span>
          <ul className={`${style.dropdownMenu} ${open && style.open}`}>
            <li className={style.dropdownMenuItem} onClick={() => { navigate("/schedules") }}>Agendamentos</li>
            <li className={style.dropdownMenuItem} onClick={() => { navigate("/profile") }} >Editar Perfil</li>
            <li className={style.dropdownMenuItem} onClick={signOut}>Sair</li>
          </ul>
        </div>
      </div>
    </header>
  )
}