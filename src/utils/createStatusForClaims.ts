import styles from '../components/ClaimCardMainInformation/ClaimCardMainInformation.module.css'
import { ClaimStatus } from '../components/ClaimCardMainInformation/ClaimCardMainInformation'

export const createRuStatusValueForClaim = (value: string): ClaimStatus => {
  switch (value) {
    case 'inProgress':
      return 'В работе'
    case 'accepted':
      return 'Завершена'
    case 'rejected':
      return 'Отклонена'
    default:
      return 'В работе'
  }
}

export const createEnStatusValueForClaim = (value: string) => {
  switch (value) {
    case 'В работе':
      return 'inProgress'
    case 'Завершена':
      return 'accepted'
    case 'Отклонена':
      return 'rejected'
    default:
      return 'inProgress'
  }
}

export const createStyleForStatusClaim = (value: string) => {
  switch (value) {
    case 'inProgress':
      return styles.statusInProgress
    case 'accepted':
      return styles.statusPositive
    case 'rejected':
      return styles.statusNegative
    default:
      return styles.statusInProgress
  }
}
