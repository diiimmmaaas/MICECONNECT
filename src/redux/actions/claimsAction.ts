import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import { ClaimResponseType, ClaimsFromPlacesResponseType, CommentsType } from './types'

export const getAllClaims = createAsyncThunk(
  'claims/getAllClaims',
  async (
    {
      yearsAndMonth,
      token,
      search,
      status,
      places,
    }: { yearsAndMonth: string; token: string; search?: string; status?: string; places?: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<ClaimResponseType[]>(
        `place-requests?yearAndMonth=${yearsAndMonth}`,
        {
          params: {
            ...(search ? { search: search } : {}),
            ...(status ? { status: status } : {}),
            ...(places ? { places: places } : {}),
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

export const getAllClaimsFromPlatforms = createAsyncThunk(
  'claims/getAllClaimsFromPlatforms',
  async (
    {
      companyId,
      yearsAndMonth,
      token,
      search,
      status,
      places,
    }: {
      companyId?: string
      yearsAndMonth: string
      token: string
      search?: string
      status?: string
      places?: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<ClaimsFromPlacesResponseType>(
        `place-requests/from-places?yearAndMonth=${yearsAndMonth}`,
        {
          params: {
            ...(companyId ? { companyId: companyId } : {}),
            ...(search ? { search: search } : {}),
            ...(status ? { status: status } : {}),
            ...(places ? { places: places } : {}),
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

//

export const getCurrentClaim = createAsyncThunk(
  'claims/getCurrentClaim',
  async ({ claimId, token }: { claimId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.get<ClaimResponseType>(`place-requests/${claimId}`, {
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

export const getCurrentClaimFromCurrentPlatform = createAsyncThunk(
  'claims/getCurrentClaimFromCurrentPlatform',
  async (
    {
      placeId,
      yearsAndMonth,
      token,
      search,
      status,
    }: {
      placeId: string | undefined
      yearsAndMonth: string
      token: string
      search?: string
      status?: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<ClaimResponseType[]>(
        `place-requests/from-places?yearAndMonth=${yearsAndMonth}&places=${placeId}`,
        {
          params: {
            ...(search ? { search: search } : {}),
            ...(status ? { status: status } : {}),
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

export const createClaim = createAsyncThunk(
  'claims/createClaim',
  async (
    {
      token,
      endDate,
      startDate,
      userId,
      peopleCount,
      placeId,
    }: {
      userId: string
      placeId: string
      peopleCount: string
      startDate: string
      endDate: string
      token: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post<ClaimResponseType>(
        'place-requests',
        {
          endDate,
          startDate,
          userId,
          peopleCount,
          placeId,
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

export const changeClaimMainInformation = createAsyncThunk(
  'claims/changeClaimMainInformation',
  async (
    {
      token,
      claimId,
      payload,
    }: {
      token: string
      claimId: string | undefined
      payload: any
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<ClaimResponseType>(
        `place-requests/${claimId}`,
        payload,
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

export const changeClaimDescription = createAsyncThunk(
  'claims/changeClaimDescription',
  async (
    {
      token,
      claimId,
      description,
    }: {
      token: string
      claimId: string | undefined
      description: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<ClaimResponseType>(
        `place-requests/${claimId}`,
        {
          description,
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

export const deleteCurrentClaim = createAsyncThunk(
  'claims/deleteCurrentClaim',
  async ({ claimId, token }: { claimId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.delete<ClaimResponseType>(`place-requests/${claimId}`, {
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

export const createClaimComments = createAsyncThunk(
  'claims/createClaimComments',
  async (
    {
      formData,
    }: {
      formData: any
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post<CommentsType>('request-comments', formData)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const getClaimComments = createAsyncThunk(
  'claims/getClaimComments',
  async (
    {
      requestId,
    }: {
      requestId: string | undefined
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<CommentsType[]>(`request-comments?requestId=${requestId}`)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)
