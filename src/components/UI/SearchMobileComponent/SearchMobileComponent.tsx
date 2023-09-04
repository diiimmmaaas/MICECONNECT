import React, { FC } from 'react'
import styles from './SearchMobileComponent.module.css'
import orangeSearchIcon from '../../../assets/icons/orangeSearch.svg'

export type SearchMobileComponentPropsType = {
  callback: () => void
  searchValue: string
  setSearchValues: (searchValue: string) => void
}

const SearchMobileComponent: FC<SearchMobileComponentPropsType> = ({
  searchValue,
  setSearchValues,
  callback,
}) => {
  return (
    <div className={styles.searchInputContainer}>
      <div className={styles.searchInput}>
        <input
          className={styles.input}
          type='text'
          placeholder='Поиск...'
          value={searchValue}
          onChange={(e) => setSearchValues(e.target.value)}
        />
      </div>
      <img
        className={styles.searchIcon}
        src={orangeSearchIcon}
        alt='orangeSearchIcon'
        onClick={callback}
      />
    </div>
  )
}

export default SearchMobileComponent
