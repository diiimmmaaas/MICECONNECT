import React, { FC, useMemo, useState } from 'react'
import styles from './ReviewsForCards.module.css'
import CustomTextArea from '../UI/CustomTextArea/CustomTextArea'
import CustomButton from '../UI/CustomButton/CustomButton'
import ReviewBlock from '../ReviewsBlock/ReviewsBlock'
import CustomPagination from '../UI/CustomPagination/CustomPagination'
import s from '../../styles/common/Form.module.css'
import { CommentsType, EmployeeType } from '../../redux/actions/types'
import logo from '../UI/Logo/Logo'
import { useAppSelector } from '../../redux/types/types'

export type ReviewType = {
  id: number
  fullname: string
  text: string
  date: string
  file: string
}

export type ReviewsForCardsPropsType = {
  employees: EmployeeType[] | undefined
  comments: CommentsType[]
  postNewCommentHandler: (commentText: string) => void
  postCommentError?: boolean
  setCommentFile: (files: any) => void
}

const ReviewsForCards: FC<ReviewsForCardsPropsType> = ({
  employees,
  comments,
  postNewCommentHandler,
  postCommentError,
  setCommentFile,
}) => {
  const [description, setDescription] = useState<string>('')

  const { userRole, user } = useAppSelector((state) => state.auth)

  const sortedArray = [...comments].sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
  )

  const dummyData = (array: CommentsType[]) => {
    const items: ReviewType[] = array.map((comment) => {
      return {
        id: comment.id,
        fullname: comment?.user?.fullName,
        text: comment.text,
        date: comment.createdAt.slice(0, 10).split('-').reverse().join('.'),
        file: comment.file,
      }
    })
    return items
  }

  const reviews = dummyData(sortedArray)

  const foundObject = employees && employees.find((item) => item.id === user.employee?.id)

  const onPostNewComment = () => {
    postNewCommentHandler(description)
    setDescription('')
  }

  return (
    <div className={styles.cardReviews}>
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>{`Комментарии (${comments.length})`}</h2>
      </div>
      {(userRole === 'superAdmin' ||
        userRole === 'admin' ||
        userRole === 'directorPlace' ||
        userRole === 'employeePlace' ||
        userRole === 'directorAgent') && (
        <div className={styles.container}>
          <div className={styles.addComment}>Добавить комментарий</div>
          <CustomTextArea
            placeholder='Задайте интересующие вас вопросы '
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            setCommentFile={setCommentFile}
          />
          <>
            {postCommentError && (
              <p className={`${s.errorValidation} ${s.networkError}`}>
                Произошла ошибка при создании комментария. Попробуйте еще раз...
              </p>
            )}
          </>
          <div className={styles.sendBtnContainer}>
            <CustomButton title='Отправить' className={styles.sendBtn} onClick={onPostNewComment} />
          </div>
        </div>
      )}
      <ReviewBlock reviews={reviews} />
    </div>
  )
}

export default ReviewsForCards
