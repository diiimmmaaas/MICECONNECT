import React, { FC, useState } from 'react'
import styles from './CompanyCardCategories.module.css'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import { CategoryType } from '../../redux/actions/types'

type CompanyCardCategoriesPropsType = {
  categories: CategoryType[]
  activeLink: number
  cardId?: string
}

const CompanyCardCategories: FC<CompanyCardCategoriesPropsType> = ({
  categories,
  activeLink,
  cardId,
}) => {
  const [activeCategory, setActiveCategory] = useState(activeLink)

  const navigate = useNavigate()

  const navigateToCurrentPage = (id: number) => {
    switch (id) {
      case 1:
        navigate(`${PATH.companyCardPage}${cardId}`)
        return
      case 2:
        navigate(`${PATH.companyManagementStaffPageAdmin}${cardId}`)
        return
      case 3:
        navigate(`${PATH.companyManagementPlatformsPage}${cardId}`)
        return
    }
  }

  const onClickHandler = (id: number) => {
    setActiveCategory(id)
    navigateToCurrentPage(id)
  }

  return (
    <div className={styles.categoriesBlock}>
      <div className={styles.container}>
        {categories.map((category) => {
          return (
            <div
              onClick={() => onClickHandler(category.id)}
              key={category.id}
              className={
                activeCategory === category.id
                  ? `${styles.active} ${styles.category}`
                  : styles.category
              }
            >
              {category.title}
            </div>
          )
        })}
      </div>
      <div className={styles.line}></div>
    </div>
  )
}

export default CompanyCardCategories
