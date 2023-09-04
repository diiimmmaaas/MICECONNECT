import React, { ChangeEvent, FC } from 'react'
import styles from './ClaimFilters.module.css'
import PopupHeader from '../PopupHeader/PopupHeader'
import CustomCheckbox from '../UI/CustomCheckbox/CustomCheckbox'
import CustomButton from '../UI/CustomButton/CustomButton'
import { PlaceType } from '../../redux/actions/types'
import s from '../../styles/common/Form.module.css'

export type ClaimFiltersPropsType = {
  error: string
  checkedState: string[]
  setCheckedState: (checkedState: string[]) => void
  platforms: any
  onClickHandler: () => void
  callback: (checkedFilters: string[]) => void
}

const ClaimFilters: FC<ClaimFiltersPropsType> = ({
  error,
  checkedState,
  setCheckedState,
  platforms,
  onClickHandler,
  callback,
}) => {
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.id
    const checked = e.target.checked
    if (checked) {
      setCheckedState([...checkedState, value])
    } else {
      setCheckedState(checkedState.filter((c) => c !== value))
    }
  }

  const sendFiltersHandler = () => {
    callback(checkedState)
  }

  const onClearAllCheckbox = () => {
    setCheckedState([])
  }

  const dummyData = (array: PlaceType[]) => {
    const items: any[] = array.map((place) => {
      return {
        id: place.id,
        title: place.name,
      }
    })
    return items
  }

  const filtersArray = dummyData(platforms)

  return (
    <div className={styles.claimFilters}>
      <div className={styles.headerForm}>
        <PopupHeader title='Фильтры' onClickHandler={onClickHandler} />
      </div>
      {filtersArray.length !== 0 ? (
        <div className={styles.filtersBlock}>
          {filtersArray.map((filter) => {
            return (
              <div key={filter.id} className={styles.filterBlock}>
                <CustomCheckbox
                  id={filter.id}
                  checked={checkedState.includes(String(filter.id))}
                  value={filter.title}
                  onChange={(e) => handleCheckboxChange(e)}
                  className={styles.checkboxStyle}
                  spanClassName={styles.spanStyle}
                >
                  {filter.title}
                </CustomCheckbox>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ width: '100%', textAlign: 'center', marginBottom: 50 }}>
          Список площадок пуст...
        </div>
      )}
      <>{error && <p className={`${s.errorValidation} ${s.networkError}`}>{error}</p>}</>
      {filtersArray.length !== 0 && (
        <div className={styles.filersControl}>
          <div className={styles.clearBtn} onClick={onClearAllCheckbox}>
            Очистить все
          </div>
          <CustomButton
            title='Показать варианты'
            className={styles.submitBtn}
            onClick={sendFiltersHandler}
          />
        </div>
      )}
    </div>
  )
}

export default ClaimFilters
