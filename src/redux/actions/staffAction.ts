import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import { CommentsType, CreateStaffResponseType, StaffType } from './types'

export const getStaff = createAsyncThunk(
  'staff/getStaff',
  async (
    {
      companyId,
      token,
      page,
      itemsPerPage,
      search,
      role,
    }: {
      companyId: string | undefined
      token: string
      page: number
      itemsPerPage: number
      search?: string
      role?: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<CreateStaffResponseType>(
        `employees?companyId=${companyId}`,
        {
          params: {
            ...(page ? { page: page } : {}),
            ...(itemsPerPage ? { itemsPerPage: itemsPerPage } : {}),
            ...(search ? { search: search } : {}),
            ...(role ? { role: role } : {}),
          },
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

export const getCurrentStaff = createAsyncThunk(
  'staff/getCurrentStaff',
  async ({ staffId, token }: { staffId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.get<StaffType>(`employees/${staffId}`, {
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

export const createStaff = createAsyncThunk(
  'staff/createStaff',
  async (
    {
      token,
      companyId,
      email,
      password,
      role,
      phone,
      fullName,
    }: {
      token: string
      companyId: string | undefined
      role: string | undefined
      fullName: string
      phone: string
      email: string
      password: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post<CreateStaffResponseType>(
        'employees',
        {
          companyId,
          email,
          password,
          role,
          phone,
          fullName,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const changeCurrentStaffMainInformation = createAsyncThunk(
  'staff/changeCurrentStaffMainInformation',
  async (
    {
      token,
      staffId,
      phone,
      fullName,
    }: {
      token: string
      staffId: string | undefined
      fullName: string
      phone: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<StaffType>(
        `employees/${staffId}`,
        {
          fullName,
          phone,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const changeCurrentStaffDetails = createAsyncThunk(
  'staff/changeCurrentStaffDetails',
  async (
    {
      token,
      staffId,
      role,
      password,
      email,
    }: {
      token: string
      staffId: string | undefined
      role: string | undefined
      email: string
      password: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<StaffType>(
        `employees/${staffId}`,
        {
          role,
          email,
          password,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async ({ staffId, token }: { staffId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.delete<CreateStaffResponseType>(`employees/${staffId}`, {
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

export const getStaffComments = createAsyncThunk(
  'staff/getStaffComments',
  async ({ staffId }: { staffId: string | undefined }, thunkAPI) => {
    try {
      const response = await instance.get<CommentsType[]>(`employee-comments/all/${staffId}`)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const createStaffComment = createAsyncThunk(
  'staff/createStaffComment',
  async ({ employeeId, formData }: { employeeId: string; formData: any }, thunkAPI) => {
    try {
      const response = await instance.post<CommentsType>(
        `employee-comments/${employeeId}`,
        formData,
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

export const blockStaff = createAsyncThunk(
  'staff/blockStaff',
  async ({ staffId, isBlocked }: { staffId: string | undefined; isBlocked: boolean }, thunkAPI) => {
    try {
      const response = await instance.patch<any>(`employees/${staffId}`, {
        isBlocked,
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
