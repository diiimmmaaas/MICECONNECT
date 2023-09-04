import { rootReducer, store } from '../store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ActionCreatorsMapObject, bindActionCreators } from '@reduxjs/toolkit'
import { useMemo } from 'react'

export type FieldErrorType = { field: string; error: string }
export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>
export type AppDispatchType = typeof store.dispatch
export type ThunkError = {
  rejectValue: { errors: Array<string>; fieldsErrors?: Array<FieldErrorType> }
}

export const useAppDispatch = (): any => useDispatch<AppDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T): any {
  const dispatch = useAppDispatch()

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [actions, dispatch])

  return boundActions
}
