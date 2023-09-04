import { createSlice } from '@reduxjs/toolkit'
import {
  loginUser,
  passwordRecovery,
  passwordRecoveryCode,
  passwordRecoveryResetPassword,
  refreshToken,
  registrationRequest,
} from '../../actions/authAction'
import nookies, { destroyCookie } from 'nookies'
import { UserType } from '../../actions/types'

const cookies = nookies.get(null)

export interface IAuth {
  token: string
  refreshToken: string
  user: UserType
  userRole: string
  isLoading: boolean
  isAuth: boolean
  error: any
}

const initialState: IAuth = {
  token: cookies.authToken ?? '',
  refreshToken: cookies.refreshToken ?? '',
  user: {
    id: cookies.userId ?? '',
    email: cookies.userEmail ?? '',
    fullName: '',
    role: '',
    phone: '',
    login: cookies.userEmail ?? '',
    password: '',
    employee: {
      id: Number(cookies.userEmloyeeId) ?? 0,
      createdAt: '',
      company: {
        id: Number(cookies.userCompanyId) ?? 0,
        name: '',
        role: '',
        city: '',
        address: '',
        contactFullName: '',
        contactPhone: '',
        email: '',
        inn: '',
        description: '',
        isBlocked: false,
        createdAt: '',
        comments: [],
        employees: [],
        images: [],
      },
    },
    isBlocked: false,
  },
  userRole: cookies.userRole ?? 'superAdmin',
  isLoading: false,
  isAuth: Boolean(cookies.authToken) ?? false,
  error: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isLoading = false
      state.isAuth = false
      state.error = ''
      state.token = ''
      state.refreshToken = ''
      state.userRole = 'superAdmin'
      state.user = {
        id: 0,
        email: '',
        fullName: '',
        role: '',
        phone: '',
        login: '',
        password: '',
        employee: {
          id: 0,
          createdAt: '',
          company: {
            id: 0,
            name: '',
            role: '',
            city: '',
            address: '',
            contactFullName: '',
            contactPhone: '',
            email: '',
            inn: '',
            description: '',
            isBlocked: false,
            createdAt: '',
            comments: [],
            employees: [],
            images: [],
          },
        },
        isBlocked: false,
      }
      destroyCookie(null, 'authToken', {
        path: '/',
      })
      destroyCookie(null, 'refreshToken', {
        path: '/',
      })
      destroyCookie(null, 'userRole', {
        path: '/',
      })
      destroyCookie(null, 'userId', {
        path: '/',
      })
      destroyCookie(null, 'userEmail', {
        path: '/',
      })
      destroyCookie(null, 'userEmloyeeId', {
        path: '/',
      })
      destroyCookie(null, 'userCompanyId', {
        path: '/',
      })
    },
    clearError(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true
      state.error = ''
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuth = true
      state.error = ''
      state.token = action.payload.access
      state.refreshToken = action.payload.refresh
      state.user = action.payload.user
      state.userRole = action.payload.user.role
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(refreshToken.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuth = true
      state.error = ''
      state.token = action.payload.access
      state.refreshToken = action.payload.refresh
    })
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(registrationRequest.pending, (state) => {
      state.isLoading = true
      // state.error = ''
    })
    builder.addCase(registrationRequest.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(registrationRequest.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(passwordRecovery.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(passwordRecovery.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(passwordRecovery.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(passwordRecoveryCode.pending, (state) => {
      state.isLoading = true
      state.error = ''
    })
    builder.addCase(passwordRecoveryCode.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(passwordRecoveryCode.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(passwordRecoveryResetPassword.pending, (state) => {
      state.isLoading = true
      state.error = ''
    })
    builder.addCase(passwordRecoveryResetPassword.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(passwordRecoveryResetPassword.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
})

export const authLogout = authSlice.actions.logout
export const clearError = authSlice.actions.clearError

export const authReducer = authSlice.reducer
