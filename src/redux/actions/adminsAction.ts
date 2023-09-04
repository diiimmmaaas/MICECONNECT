import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import { GetAdminsResponseType, GetCurrentAdminResponseType } from './types'

export const getAdmins = createAsyncThunk(
  'admins/getAdmins',
  async (
    {
      token,
      page,
      itemsPerPage,
      search,
      role,
    }: { token: string; page: number; itemsPerPage: number; search?: string; role?: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<GetAdminsResponseType>('users', {
        params: {
          ...(page ? { page: page } : {}),
          ...(itemsPerPage ? { itemsPerPage: itemsPerPage } : {}),
          ...(search ? { search: search } : {}),
          ...(role ? { role: role } : {}),
        },
        headers: { authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const postAdmin = createAsyncThunk(
  'admins/postAdmin',
  async (
    {
      token,
      password,
      email,
      role,
      phone,
      fullName,
    }: {
      token: string
      role: string | undefined
      fullName: string
      phone: string
      email: string
      password: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post<GetAdminsResponseType>(
        'users',
        {
          role,
          fullName,
          phone,
          email,
          password,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const getCurrentAdmin = createAsyncThunk(
  'admins/getCurrentAdmin',
  async ({ adminId, token }: { adminId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.get<GetCurrentAdminResponseType>(`users/${adminId}`, {
        headers: { authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const changeAdminMainInformation = createAsyncThunk(
  'admins/changeAdminMainInformation',
  async (
    {
      token,
      adminId,
      phone,
      fullName,
    }: {
      token: string
      adminId: string | undefined
      fullName: string
      phone: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<GetCurrentAdminResponseType>(
        `users/${adminId}`,
        {
          phone,
          fullName,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const changeAdminLoginDetails = createAsyncThunk(
  'admins/changeAdminLoginDetails',
  async (
    {
      token,
      adminId,
      role,
      email,
      password,
    }: {
      token: string
      adminId: string | undefined
      role: string | undefined
      email?: string
      password: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<GetCurrentAdminResponseType>(
        `users/${adminId}`,
        email
          ? {
              role,
              email,
              password,
            }
          : {
              role,
              password,
            },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const deleteAdmin = createAsyncThunk(
  'admins/deleteAdmin',
  async (
    {
      adminId,
      token,
    }: {
      adminId: string | undefined
      token: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.delete<GetCurrentAdminResponseType>(`users/${adminId}`, {
        headers: { authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const blockAdmin = createAsyncThunk(
  'admins/blockAdmin',
  async (
    {
      token,
      adminId,
      isBlocked,
    }: {
      token: string
      adminId: string | undefined
      isBlocked: boolean
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<GetCurrentAdminResponseType>(
        `users/${adminId}`,
        {
          isBlocked,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)
