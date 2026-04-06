import { type InputHTMLAttributes } from "react";
import styles from './colorInput.module.css';

interface IColorInputProps {
  options?: InputHTMLAttributes<HTMLInputElement>
}

const ColorInput = (props: IColorInputProps) => {
  const { options } = props;

  return (
    <input 
      className={styles.colorInput}
      type="color"
      {...options}
    />
  );
};

export default ColorInput;
