import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import { CommentsType, GetPlatformsResponseType, PlaceType } from './types'

export const getPlaces = createAsyncThunk(
  'places/getPlaces',
  async (
    {
      token,
      page,
      itemsPerPage,
      city,
      endDate,
      peopleCount,
      startDate,
    }: {
      token: string
      page: number
      itemsPerPage: number
      city?: string
      peopleCount?: string
      startDate?: string | null
      endDate?: string | null
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<GetPlatformsResponseType>('places', {
        params: {
          ...(page ? { page: page } : {}),
          ...(itemsPerPage ? { itemsPerPage: itemsPerPage } : {}),
          ...(city ? { city: city } : {}),
          ...(peopleCount ? { peopleCount: peopleCount } : {}),
          ...(endDate ? { endDate: endDate } : {}),
          ...(startDate ? { startDate: startDate } : {}),
        },
        headers: { authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const getPlacesFromCompany = createAsyncThunk(
  'places/getPlacesFromCompany',
  async (
    {
      companyId,
      token,
      page,
      itemsPerPage,
      search,
    }: {
      companyId: string | undefined
      token: string
      page: number
      itemsPerPage: number
      search?: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<GetPlatformsResponseType>(
        `places?companyId=${companyId}`,
        {
          params: {
            ...(page ? { page: page } : {}),
            ...(itemsPerPage ? { itemsPerPage: itemsPerPage } : {}),
            ...(search ? { search: search } : {}),
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

export const getCurrentPlaces = createAsyncThunk(
  'places/getCurrentPlaces',
  async ({ placeId, token }: { placeId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.get<PlaceType>(`places/${placeId}`, {
        headers: { authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const createPlace = createAsyncThunk(
  'places/createPlace',
  async ({ formData, token }: { formData: any; token: string }, thunkAPI) => {
    try {
      const response = await instance.post<any>('places', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const changePlaceMainInformation = createAsyncThunk(
  'places/changePlaceMainInformation',
  async (
    {
      token,
      placeId,
      address,
      name,
      size,
      city,
    }: {
      placeId: string | undefined
      name: string
      city: string
      size: string
      address: string
      token: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<PlaceType>(
        `places/${placeId}`,
        {
          address,
          name,
          size,
          city,
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

export const changePlaceDescription = createAsyncThunk(
  'places/changePlaceDescription',
  async (
    {
      placeId,
      description,
      token,
    }: { placeId: string | undefined; description: string; token: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<PlaceType>(
        `places/${placeId}`,
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

export const deleteCurrentPlaces = createAsyncThunk(
  'places/deleteCurrentPlaces',
  async ({ placeId, token }: { placeId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.delete<PlaceType>(`places/${placeId}`, {
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

export const deleteCurrentFileFromPlatform = createAsyncThunk(
  'places/deleteCurrentFileFromPlatform',
  async (
    {
      placeId,
      filesToDelete,
      token,
    }: { placeId: string | undefined; filesToDelete: string[]; token: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.delete<PlaceType>(`places/${placeId}/files`, {
        data: { filesToDelete },
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

export const pushNewFilesToPlatform = createAsyncThunk(
  'places/pushNewImagesToPlatform',
  async (
    { placeId, formData, token }: { placeId: string | undefined; formData: any; token: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.put<PlaceType>(`places/${placeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8',
          authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)

export const createPlatformComments = createAsyncThunk(
  'places/createPlatformComments',
  async (
    {
      formData,
    }: {
      formData: any
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post<CommentsType>('place-comments', formData)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const getPlatformComments = createAsyncThunk(
  'places/getPlatformComments',
  async (
    {
      placeId,
    }: {
      placeId: string | undefined
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<CommentsType[]>(`place-comments?placeId=${placeId}`)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const blockPlatform = createAsyncThunk(
  'places/blockPlatform',
  async (
    {
      placeId,
      isBlocked,
    }: {
      placeId: string | undefined
      isBlocked: boolean
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<any>(`places/${placeId}`, {
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
