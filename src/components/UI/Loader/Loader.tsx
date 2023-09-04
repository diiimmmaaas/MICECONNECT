import React from 'react'
import { Audio } from 'react-loader-spinner'
import styles from './Loader.module.css'

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <Audio
        height='100'
        width='100'
        color='#FD5C20'
        ariaLabel='audio-loading'
        wrapperClass='wrapper-class'
        visible={true}
      />
    </div>
  )
}

export default Loader
