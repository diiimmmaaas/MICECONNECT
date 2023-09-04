import React, { forwardRef, ReactNode } from 'react'
import styles from './DropDown.module.css'

type DropDownPropsType = {
  open: boolean
  ref?: any
  className?: string
  children?: ReactNode
}

// eslint-disable-next-line react/display-name
const DropDown = forwardRef<HTMLDivElement, DropDownPropsType>((props, ref) => {
  const { open, className, children } = props
  return (
    <div
      ref={ref}
      className={`${styles.dropDownMenu} ${open ? styles.active : styles.inactive} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
})

export default DropDown
