import React, { SelectHTMLAttributes, DetailedHTMLProps, ChangeEvent } from 'react'
import styles from './CustomSelect.module.css'

type DefaultSelectPropsType = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

type SuperSelectPropsType = DefaultSelectPropsType & {
  options?: any[]
  onChangeOption?: (option: any) => void
}

const CustomSelect: React.FC<SuperSelectPropsType> = ({
  options,
  onChange,
  onChangeOption,
  ...restProps
}) => {
  const mappedOptions: any[] = options
    ? options.map((o, i) => {
        return (
          <option className={styles.option} key={o + ' ' + i} value={o}>
            {o}
          </option>
        )
      })
    : []

  const onChangeCallback = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(e)
    onChangeOption && onChangeOption(e.currentTarget.value)
  }

  return (
    <select className={styles.select} onChange={onChangeCallback} {...restProps}>
      {mappedOptions}
    </select>
  )
}

export default CustomSelect
