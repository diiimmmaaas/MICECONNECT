import React, { FC, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'
import profileBtnIcon from '../../assets/icons/profileBtnIcon.svg'
import arrowDown from '../../assets/icons/arrowDown.svg'
import DropDown from '../DropDown/DropDown'
import Logo from '../UI/Logo/Logo'
import exitIcon from '../../assets/icons/log-out.svg'
import DropDownItem from '../DropDownItem/DropDownItem'
import {
  adminOptions,
  agentOptions,
  directorAgentOptions,
  directorPlatformOptions,
  platformOptions,
  superAdminOptions,
} from '../../constants/constants'
import { useAppDispatch, useAppSelector } from '../../redux/types/types'
import { useMediaQuery } from 'react-responsive'
import Hamburger from 'hamburger-react'
import { authLogout } from '../../redux/reducers/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import PATH from '../../navigation/path'
import SearchMobileComponent from '../UI/SearchMobileComponent/SearchMobileComponent'

export type NavbarPropsType = {
  isPlatforms?: boolean
  children?: ReactNode
}

const Navbar: FC<NavbarPropsType> = ({ isPlatforms, children }) => {
  const [open, setOpen] = useState(false)
  const [activeOption, setActiveOption] = useState<number | null>(null)
  const [activeSearchMobile, setActiveSearchMobile] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isTablet = useMediaQuery({ query: '(max-width: 1439px)' })

  const userRole = useAppSelector((state) => state.auth.userRole)
  const { user } = useAppSelector((state) => state.auth)

  const createOptionsForNavbar = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return superAdminOptions
      case 'admin':
        return adminOptions
      case 'directorAgent':
        return directorAgentOptions
      case 'directorPlace':
        return directorPlatformOptions
      case 'employeeAgent':
        return agentOptions
      case 'employeePlace':
        return platformOptions
    }
  }

  const openNavDropDown = (e: any) => {
    e.stopPropagation()
    setOpen(!open)
  }

  const options = createOptionsForNavbar(userRole)

  const handleSearchClick = () => {
    setActiveSearchMobile(!activeSearchMobile)
  }

  const logoutHandler = () => {
    dispatch(authLogout())
    navigate(PATH.authPage)
  }

  const onOpenDropDown = (e: any) => {
    e.stopPropagation()
    setOpen(!open)
  }

  const dropdownNavbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownNavbarRef.current && !dropdownNavbarRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    // @ts-ignore
    window.addEventListener('click', handleClickOutside)

    return () => {
      // @ts-ignore
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <Logo />
        {children}
        {isMobile ? (
          <div className={styles.burger}>
            <Hamburger size={28} toggled={open} toggle={(e) => setOpen(!open)} />
            <DropDown open={open}>
              <ul className={styles.dropDownList}>
                {options?.map((option) => {
                  return (
                    <DropDownItem
                      key={option.id}
                      title={option.title}
                      active={activeOption === option.id}
                      setActive={setActiveOption}
                      id={option.id}
                    />
                  )
                })}
              </ul>
              <div className={styles.exitBlock} onClick={logoutHandler}>
                <img className={styles.exitIcon} src={exitIcon} alt='exit' />
                <div className={styles.exitText}>Выход</div>
              </div>
            </DropDown>
          </div>
        ) : (
          <div className={styles.profileBtn} onClick={(e) => onOpenDropDown(e)}>
            <img className={styles.profileBtnIcon} src={profileBtnIcon} alt='profileBtnIcon' />
            {!isTablet && <div className={styles.profileBtnText}>{user.email}</div>}
            <img className={styles.arrowDown} src={arrowDown} alt='arrowDown' />
            <DropDown ref={dropdownNavbarRef} open={open}>
              <ul className={styles.dropDownList}>
                {options?.map((option) => {
                  return (
                    <DropDownItem
                      key={option.id}
                      title={option.title}
                      active={activeOption === option.id}
                      setActive={setActiveOption}
                      id={option.id}
                    />
                  )
                })}
              </ul>
              <div className={styles.exitBlock} onClick={logoutHandler}>
                <img className={styles.exitIcon} src={exitIcon} alt='exit' />
                <div className={styles.exitText}>Выход</div>
              </div>
            </DropDown>
          </div>
        )}
      </div>
      {isMobile && isPlatforms && (
        <div className={styles.searchMobileComponent}>
          <SearchMobileComponent
            searchValue={''}
            setSearchValues={() => console.log('')}
            callback={handleSearchClick}
          />
        </div>
      )}
    </div>
  )
}

export default Navbar
