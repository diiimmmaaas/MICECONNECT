import { createSlice } from '@reduxjs/toolkit'
import { CommentsType, CreateStaffResponseType, StaffType } from '../../actions/types'
import {
  changeCurrentStaffMainInformation,
  createStaff,
  createStaffComment,
  deleteStaff,
  getCurrentStaff,
  getStaff,
  getStaffComments,
} from '../../actions/staffAction'

export interface IStaff {
  staff: CreateStaffResponseType
  currentStaff: StaffType
  staffComments: CommentsType[]
  isLoading: boolean
  error: any
}

const initialState: IStaff = {
  staff: {
    employees: [],
    totalCount: 0,
  },
  currentStaff: {
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
      createdAt: '',
      comments: [],
      employees: [],
      isBlocked: false,
      images: [],
    },
  },
  staffComments: [],
  isLoading: false,
  error: '',
}

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearError(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStaff.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getStaff.fulfilled, (state, action) => {
      state.isLoading = false
      state.staff = action.payload
      state.error = ''
    })
    builder.addCase(getStaff.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCurrentStaff.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCurrentStaff.fulfilled, (state, action) => {
      state.isLoading = false
      state.currentStaff = action.payload
      state.error = ''
    })
    builder.addCase(getCurrentStaff.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(deleteStaff.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(deleteStaff.fulfilled, (state) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(deleteStaff.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(createStaffComment.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(createStaffComment.fulfilled, (state) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(createStaffComment.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getStaffComments.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getStaffComments.fulfilled, (state, action) => {
      state.staffComments = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getStaffComments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(changeCurrentStaffMainInformation.pending, (state) => {
      state.isLoading = true
      state.error = ''
    })
    builder.addCase(changeCurrentStaffMainInformation.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(changeCurrentStaffMainInformation.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(createStaff.pending, (state) => {
      state.isLoading = true
      state.error = ''
    })
    builder.addCase(createStaff.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(createStaff.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
})

export const clearError = staffSlice.actions.clearError

export const staffReducer = staffSlice.reducer
