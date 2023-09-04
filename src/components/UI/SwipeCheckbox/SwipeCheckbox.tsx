import React, { FC, useEffect, useState } from 'react'
import styles from './SwipeCheckbox.module.css'

export type SwipeCheckbox = {
  isBlocked?: boolean
  id: string
  name: string
  onChangeHandler: (checked: boolean) => void
  classNameInput?: string
  classNameLabel?: string
}

const SwipeCheckbox: FC<SwipeCheckbox> = ({
  isBlocked,
  id,
  name,
  onChangeHandler,
  classNameInput,
  classNameLabel,
}) => {
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    setChecked(!checked)
    onChangeHandler(checked)
  }

  useEffect(() => {
    if (isBlocked) {
      setChecked(isBlocked)
    }
  }, [isBlocked])

  return (
    <>
      <input
        type='checkbox'
        className={`${styles.highload} ${classNameInput}`}
        id={id}
        name={name}
        checked={checked}
        onChange={handleCheck}
      />
      <label
        htmlFor={id}
        data-onlabel='on'
        data-offlabel='off'
        className={`${styles.lb} ${classNameLabel}`}
      ></label>
    </>
  )
}

export default SwipeCheckbox
