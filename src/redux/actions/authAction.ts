import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import { setCookie } from 'nookies'
import { LoginResponseType } from './types'
import axios from 'axios'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      console.log('im here')
      const response = await instance.post<LoginResponseType>('auth/login', {
        email,
        password,
      })

      response.data.access &&
        setCookie(null, 'authToken', response.data.access, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      response.data.access &&
        setCookie(null, 'refreshToken', response.data.refresh, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      response.data.access &&
        setCookie(null, 'userRole', response.data.user.role, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      response.data.access &&
        setCookie(null, 'userId', String(response.data.user.id), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      response.data.access &&
        setCookie(null, 'userEmail', String(response.data.user.email), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      response.data.access &&
        response.data.user.employee &&
        setCookie(null, 'userEmloyeeId', String(response.data.user.employee.id), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      response.data.access &&
        response.data?.user?.employee?.company &&
        setCookie(null, 'userCompanyId', String(response.data.user.employee.company.id), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const registrationRequest = createAsyncThunk(
  'auth/registrationRequest',
  async (
    {
      companyName,
      inn,
      city,
      address,
      contactFullName,
      contactPhone,
      role,
      email,
      password,
    }: {
      companyName: string
      inn: string
      city: string
      address: string
      contactFullName: string
      contactPhone: string
      email: string
      role: string | undefined
      password: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post('registration-requests', {
        companyName,
        inn,
        city,
        address,
        contactFullName,
        contactPhone,
        role,
        email,
        password,
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const passwordRecovery = createAsyncThunk(
  'auth/passwordRecovery',
  async (
    {
      email,
    }: {
      email: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post('auth/reset/send-code', {
        email,
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const passwordRecoveryCode = createAsyncThunk(
  'auth/passwordRecoveryCode',
  async (
    {
      email,
      code,
    }: {
      email: string
      code: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post('auth/reset/check-code', {
        email,
        code,
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const passwordRecoveryResetPassword = createAsyncThunk(
  'auth/passwordRecoveryResetPassword',
  async (
    {
      email,
      code,
      password,
    }: {
      email: string
      code: string
      password: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch('auth/reset/password', {
        email,
        code,
        password,
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (
    {
      refreshToken,
    }: {
      refreshToken: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await axios.post(
        'auth/refresh-tokens',
        {
          refreshToken,
        },
        { withCredentials: true },
      )

      response.data.access &&
        setCookie(null, 'authToken', response.data.access, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      response.data.access &&
        setCookie(null, 'refreshToken', response.data.refresh, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })

      console.log('refresh-tokens res', response.data)

      return response.data
    } catch (error: any) {
      console.log('refresh-tokens error', error)
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)
