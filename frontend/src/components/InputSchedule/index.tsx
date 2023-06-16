import { ForwardRefRenderFunction, forwardRef } from 'react';

import style from './inputschedule.module.css';

interface IInput {
  placeholder: string;
  type: 'password' | 'text' | 'date';
  error?: string;

}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInput> = ({ placeholder, type, error, ...rest }, ref) => {
  return (
    <div className={style.container}>
      <label>{placeholder}</label>
      <input type={type} {...rest} /* placeholder={placeholder}*/ ref={ref} />
      {error && <span>{error}</span>}
    </div>
  )
}

export const InputSchedule = forwardRef(InputBase);