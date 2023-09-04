import React, { FC } from 'react'
import styles from './Table.module.css'
import s from '../../styles/common/Form.module.css'
import TableFilters from '../TableFilters/TableFilters'
import CustomPagination from '../UI/CustomPagination/CustomPagination'
import { FiltersTitlesForTable, TableItem } from '../../types'
import { useMediaQuery } from 'react-responsive'
import inProgressIcon from '../../assets/icons/registrationRequests/Clock.svg'
import acceptedIcon from '../../assets/icons/registrationRequests/okay.svg'
import rejectedIcon from '../../assets/icons/registrationRequests/Close_Circle.svg'
import Loader from '../UI/Loader/Loader'

export const createStatusIconForRegistrationRequest = (status: string | undefined) => {
  switch (status) {
    case 'В ожидании':
      return inProgressIcon
    case 'Принят':
      return acceptedIcon
    case 'Отклонен':
      return rejectedIcon
  }
}

export type TablePropsType = {
  isCompany?: boolean
  debouncedStatus?: string
  isLoading?: boolean
  data: TableItem[]
  pageSize: number
  totalCountPages?: number
  currentPage: number
  setCurrentPage: (page: number) => void
  columns: string[]
  filtersTitles: FiltersTitlesForTable
  onActiveCurrentCard: (currentCardId: number) => void
  handleFirstFilterButtonClick: (title: string) => void
  handleSecondFilterButtonClick: (title: string) => void
  handleThirdFilterButtonClick: (title: string) => void
  handleFourthFilterButtonClick: (title: string) => void
  search: string
  setSearch: (searchItem: string) => void
}

const Table: FC<TablePropsType> = ({
  isCompany,
  debouncedStatus,
  isLoading,
  data,
  pageSize,
  totalCountPages,
  currentPage,
  setCurrentPage,
  columns,
  filtersTitles,
  onActiveCurrentCard,
  handleFirstFilterButtonClick,
  handleSecondFilterButtonClick,
  handleThirdFilterButtonClick,
  handleFourthFilterButtonClick,
  search,
  setSearch,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  return (
    <div className={styles.table}>
      {!isMobile && (
        <TableFilters
          isCompany={isCompany}
          firstBtnTitle={filtersTitles.firstBtnTitle}
          secondBtnTitle={filtersTitles.secondBtnTitle}
          thirdBtnTitle={filtersTitles.thirdBtnTitle}
          fourthBtnTitle={filtersTitles.fourthBtnTitle}
          handleFirstButtonClick={handleFirstFilterButtonClick}
          handleSecondButtonClick={handleSecondFilterButtonClick}
          handleThirdButtonClick={handleThirdFilterButtonClick}
          handleFourthButtonClick={handleFourthFilterButtonClick}
          search={search}
          setSearch={setSearch}
          debouncedStatus={debouncedStatus}
        />
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {data.length !== 0 ? (
            <table className={styles.tableContainer}>
              <thead className={styles.tableHeader}>
                <tr className={styles.tableHeaderRow}>
                  {columns.map((column, index) => {
                    return (
                      <th key={index} className={styles.headerItem}>
                        {column}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {data.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className={styles.tableBodyRow}
                      onClick={() => onActiveCurrentCard(item.id)}
                    >
                      <td className={styles.bodyItem}>{item.firstColumn}</td>
                      <td className={styles.bodyItem}>{item.secondColumn}</td>
                      <td className={styles.bodyItem}>{item.thirdColumn}</td>
                      <td
                        className={
                          item.fourthColumn === 'Суперадминистратор'
                            ? `${styles.superBodyItem} ${styles.bodyItem}`
                            : styles.bodyItem
                        }
                      >
                        {item.fourthColumn}
                      </td>
                      {item.fifthColumn && (
                        <td className={styles.bodyItem}>
                          {item.fifthColumn === 'В ожидании' ||
                          item.fifthColumn === 'Принят' ||
                          item.fifthColumn === 'Отклонен' ? (
                            <div className={styles.fifthColumnContainer}>
                              <img
                                className={styles.statusIcon}
                                src={createStatusIconForRegistrationRequest(item.fifthColumn)}
                                alt={item.fifthColumn}
                              />
                              <div>{item.fifthColumn}</div>
                            </div>
                          ) : (
                            <div>{item.fifthColumn}</div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className={s.emptyTable}>
              <div className={s.emptyTableText}>Список пуст.</div>
              <div className={s.emptyTableText}>Для создания нажмите кнопку Добавить.</div>
            </div>
          )}
          <div className={s.paginationContainer}>
            <CustomPagination
              currentPage={currentPage}
              totalCount={totalCountPages}
              pageSize={pageSize}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Table
