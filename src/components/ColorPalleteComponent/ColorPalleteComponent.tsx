import React, { FC } from 'react'
import styles from './ColorPalleteComponent.module.css'

export type ColorPalletePropsType = {
  colors: string[]
  color: string
  handleChange: any
  className?: string
}

const ColorPalleteComponent: FC<ColorPalletePropsType> = ({
  colors,
  color,
  handleChange,
  className,
}) => {
  return (
    <>
      {colors.map((o, index) => (
        <label className={styles.label} key={index}>
          <input
            style={{ background: o }}
            type='radio'
            name='color'
            value={o}
            checked={o === color}
            onChange={handleChange}
            className={className}
          />
        </label>
      ))}
    </>
  )
}

export default ColorPalleteComponent
