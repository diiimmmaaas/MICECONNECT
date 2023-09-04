import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import { getMeResponseData } from './types'

export const getMe = createAsyncThunk(
  'me/getMe',
  async ({ token }: { token: string }, thunkAPI) => {
    try {
      const response = await instance.get<getMeResponseData>('employees/me', {
        headers: { authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)
