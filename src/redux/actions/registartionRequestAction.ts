import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import { GetRegistrationRequestType, RegistrationRequestType } from './types'

export const getRegistrationRequests = createAsyncThunk(
  'registrationRequest/getRegistrationRequests',
  async (
    {
      page,
      itemsPerPage,
      requestStatus,
      search,
    }: { page: number; itemsPerPage: number; requestStatus?: string; search?: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<GetRegistrationRequestType>('registration-requests', {
        params: {
          ...(page ? { page: page } : {}),
          ...(itemsPerPage ? { itemsPerPage: itemsPerPage } : {}),
          ...(requestStatus ? { status: requestStatus } : {}),
          ...(search ? { search: search } : {}),
        },
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

export const getCurrentRegistrationRequests = createAsyncThunk(
  'registrationRequest/getCurrentRegistrationRequests',
  async ({ requestId }: { requestId: string | undefined }, thunkAPI) => {
    try {
      const response = await instance.get<RegistrationRequestType>(
        `registration-requests/${requestId}`,
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

export const acceptRegistrationRequests = createAsyncThunk(
  'registrationRequest/acceptRegistrationRequests',
  async ({ requestId }: { requestId: string | undefined }, thunkAPI) => {
    try {
      const response = await instance.post<RegistrationRequestType>(
        `registration-requests/accept/${requestId}`,
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

export const rejectRegistrationRequests = createAsyncThunk(
  'registrationRequest/rejectRegistrationRequests',
  async ({ requestId }: { requestId: string | undefined }, thunkAPI) => {
    try {
      const response = await instance.post<RegistrationRequestType>(
        `registration-requests/reject/${requestId}`,
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
