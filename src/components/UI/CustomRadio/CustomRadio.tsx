import React, { ChangeEvent, InputHTMLAttributes, DetailedHTMLProps } from 'react'
import styles from './CustomRadio.module.css'

type DefaultRadioPropsType = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type CustomRadioPropsType = DefaultRadioPropsType & {
  options?: any[]
  onChangeOption?: (option: any) => void
}

const CustomRadio: React.FC<CustomRadioPropsType> = ({
  name,
  options,
  value,
  onChange,
  onChangeOption,
  ...restProps
}) => {
  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)
    onChangeOption && onChangeOption(e.currentTarget.value)
  }

  const mappedOptions: any[] = options
    ? options.map((o, i) => (
        <label className={styles.label} key={`${name}-${i}`}>
          <input
            type='radio'
            name={name}
            checked={o === value}
            value={o}
            onChange={onChangeCallback}
            className={styles.radioButton}
            {...restProps}
          />
          {o}
        </label>
      ))
    : []

  return <div className={styles.radioButtonBlock}>{mappedOptions}</div>
}

export default CustomRadio
