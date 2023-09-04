import React, { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from 'react'
import styles from './CustomCheckbox.module.css'

type DefaultInputPropsType = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type CustomCheckboxPropsType = DefaultInputPropsType & {
  onChangeChecked?: (checked: boolean) => void
  spanClassName?: string
}

const CustomCheckbox: React.FC<CustomCheckboxPropsType> = ({
  type,
  onChange,
  onChangeChecked,
  className,
  spanClassName,
  children,

  ...restProps
}) => {
  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)

    onChangeChecked && onChangeChecked(e.currentTarget.checked)
  }

  const finalInputClassName = `${styles.checkbox} ${className ? className : ''}`

  return (
    <label className={styles.label}>
      <input
        type={'checkbox'}
        onChange={onChangeCallback}
        className={finalInputClassName}
        {...restProps}
      />
      {children && <span className={styles.spanClassName}>{children}</span>}
    </label>
  )
}

export default CustomCheckbox
