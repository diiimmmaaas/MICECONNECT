import React, { useState } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  text: string
  children: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovered && <div className={styles.tooltip}>{text}</div>}
    </div>
  )
}

export default Tooltip
