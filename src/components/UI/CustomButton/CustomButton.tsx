import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

import styles from './CustomButton.module.css'

type DefaultButtonPropsType = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

type CustomButtonType = DefaultButtonPropsType & {
  title?: string
  iconSrc?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  callbackHandler?: () => void
}

const CustomButton: React.FC<CustomButtonType> = ({
  title,
  iconSrc,
  callbackHandler,
  type = 'button',
  disabled,
  className,
  ...restProps
}) => {
  const finalClassName = `${styles.btn} ${className}`

  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className={finalClassName}
        onClick={callbackHandler}
        {...restProps}
      >
        {iconSrc && <img className={styles.icon} src={iconSrc} alt='icon' />}
        {title}
      </button>
    </>
  )
}

export default CustomButton
