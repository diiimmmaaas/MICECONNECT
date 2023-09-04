import React, { FC } from 'react'
import styles from './ReviewsBlock.module.css'
import Review from '../Review/Review'
import { ReviewType } from '../ReviewsForCards/ReviewsForCards'

export type ReviewsBlockPropsType = {
  reviews: ReviewType[]
}

const ReviewsBlock: FC<ReviewsBlockPropsType> = ({ reviews }) => {
  return (
    <div className={styles.reviewsBlock}>
      {reviews.map((review) => {
        return (
          <Review
            key={review.id}
            fullname={review.fullname}
            text={review.text}
            date={review.date}
            file={review.file}
          />
        )
      })}
    </div>
  )
}

export default ReviewsBlock
