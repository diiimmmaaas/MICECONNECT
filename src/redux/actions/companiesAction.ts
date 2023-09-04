import { createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../api/api'
import {
  CommentsType,
  CompaniesType,
  GetCompaniesResponseType,
  GetCompanyCommentsResponseType,
  PlaceType,
} from './types'

export const getCompanies = createAsyncThunk(
  'companies/getCompanies',
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
      const response = await instance.get<GetCompaniesResponseType>('companies', {
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

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (
    {
      token,
      description,
      name,
      role,
      city,
      address,
      contactFullName,
      contactPhone,
      email,
      inn,
    }: {
      token: string
      description: string
      name: string
      role: string | undefined
      city: string
      address: string
      contactFullName: string
      contactPhone: string
      email: string
      inn: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post<any>(
        'companies',
        {
          description,
          name,
          role,
          city,
          address,
          contactFullName,
          contactPhone,
          email,
          inn,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        },
      )

      console.log('post company', response.data)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const getCurrentCompany = createAsyncThunk(
  'companies/getCurrentCompany',
  async ({ companyId, token }: { companyId: string | undefined; token: string }, thunkAPI) => {
    try {
      const response = await instance.get<CompaniesType>(`companies/${companyId}`, {
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

// пока не используем
export const changeCompanyMainInformation = createAsyncThunk(
  'companies/changeCompanyMainInformation',
  async (
    {
      token,
      companyId,
      name,
      role,
      city,
      address,
      contactFullName,
      contactPhone,
      email,
    }: {
      token: string
      companyId: string
      name: string
      role: string | undefined
      city: string
      address: string
      contactFullName: string
      contactPhone?: string
      email: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<any>(
        `companies/${companyId}`,
        {
          name,
          role,
          city,
          address,
          contactFullName,
          contactPhone,
          email,
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

export const changeCompanyShortInformation = createAsyncThunk(
  'companies/changeCompanyShortInformation',
  async (
    {
      token,
      companyId,
      city,
      address,
      contactPhone,
      email,
    }: {
      token: string
      companyId: string
      city: string
      address: string
      contactPhone?: string
      email: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<any>(
        `companies/${companyId}`,
        {
          city,
          address,
          contactPhone,
          email,
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

export const changeCompanyLegalInformation = createAsyncThunk(
  'companies/changeCompanyLegalInformation',
  async (
    {
      token,
      companyId,
      name,
      contactFullName,
      contactPhone,
      email,
    }: {
      token: string
      companyId: string
      name: string
      contactFullName: string
      contactPhone?: string
      email: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<any>(
        `companies/${companyId}`,
        {
          name,
          contactFullName,
          contactPhone,
          email,
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

export const changeCompanyDetails = createAsyncThunk(
  'companies/changeCompanyDetails',
  async (
    {
      token,
      companyId,
      description,
    }: {
      token: string
      companyId: string
      description: string
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<any>(
        `companies/${companyId}`,
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

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (
    {
      token,
      companyId,
    }: {
      token: string
      companyId: string | undefined
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.delete<any>(`companies/${companyId}`, {
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

export const getCompanyComments = createAsyncThunk(
  'companies/getCompanyComments',
  async (
    {
      token,
      companyId,
    }: {
      token: string
      companyId: string | undefined
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.get<GetCompanyCommentsResponseType>(
        `company-comments/all/${companyId}`,
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

export const createCompanyComments = createAsyncThunk(
  'companies/createCompanyComments',
  async (
    {
      formData,
    }: {
      formData: any
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.post<CommentsType>('company-comments', formData)

      console.log('createCompanyComments', response.data)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const deleteCompanyComments = createAsyncThunk(
  'companies/deleteCompanyComments',
  async (
    {
      token,
      companyId,
    }: {
      token: string
      companyId: string | undefined
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.delete<any>(`company-comments/${companyId}`, {
        headers: { authorization: `Bearer ${token}` },
      })

      console.log('deleteCompanyComments', response.data)

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)

export const blockCompany = createAsyncThunk(
  'companies/blockCompany',
  async (
    {
      token,
      companyId,
      isBlocked,
    }: {
      token: string
      companyId: string | undefined
      isBlocked: boolean
    },
    thunkAPI,
  ) => {
    try {
      const response = await instance.patch<any>(`/companies/${companyId}/block`, {
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

export const pushNewFilesToCompany = createAsyncThunk(
  'companies/pushNewFilesToCompany',
  async (
    { companyId, formData, token }: { companyId: string | undefined; formData: any; token: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.put<any>(`companies/${companyId}`, formData, {
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

export const deleteCurrentFileFromCompany = createAsyncThunk(
  'companies/pushNewFilesToCompany',
  async (
    {
      companyId,
      filesToDelete,
      token,
    }: { companyId: string | undefined; filesToDelete: string[]; token: string },
    thunkAPI,
  ) => {
    try {
      const response = await instance.delete<any>(`companies/${companyId}/files`, {
        data: { filesToDelete },
        headers: { authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message)
    }
  },
)
