import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import style from './card.module.css';

export function Card() {
  return (
    <div className={style.background}>
      <div>
        <span>10h</span>
        <p>Roberto Barbosa</p>
      </div>
      <div className={style.icons}>
        <AiOutlineEdit size={17} color="#5f68b1" />
        <RiDeleteBinLine size={17} color="#EB2e2e" />
      </div>
    </div>
  )
}