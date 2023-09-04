import { createSlice } from '@reduxjs/toolkit'
import {
  CommentsType,
  CompaniesType,
  CreateStaffResponseType,
  EmployeeType,
  getMeResponseData,
  StaffType,
  UserType,
} from '../../actions/types'
import {
  changeCurrentStaffMainInformation,
  createStaffComment,
  deleteStaff,
  getCurrentStaff,
  getStaff,
  getStaffComments,
} from '../../actions/staffAction'
import { authSlice } from '../auth/authSlice'
import { getMe } from '../../actions/meAction'

export interface IStaff {
  meData: getMeResponseData
  isLoading: boolean
  error: any
}

const initialState: IStaff = {
  meData: {
    id: 0,
    createdAt: '',
    user: {
      id: 0,
      role: '',
      fullName: '',
      phone: '',
      email: '',
      login: '',
      password: '',
      employee: {
        id: 0,
        createdAt: '',
      },
      isBlocked: false,
    },
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
  isLoading: false,
  error: '',
}

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false
      state.meData = action.payload
      state.error = ''
    })
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
})

export const meReducer = meSlice.reducer
