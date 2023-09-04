import { createSlice } from '@reduxjs/toolkit'
import { GetAdminsResponseType, GetCurrentAdminResponseType } from '../../actions/types'
import { blockAdmin, deleteAdmin, getAdmins, getCurrentAdmin } from '../../actions/adminsAction'

export interface IAdmins {
  admins: GetAdminsResponseType
  currentAdmin: GetCurrentAdminResponseType
  isLoading: boolean
  error: unknown | string
}

const initialState: IAdmins = {
  admins: {
    users: [],
    totalCount: 0,
  },
  currentAdmin: {
    id: 0,
    role: '',
    fullName: '',
    phone: '',
    email: '',
    login: '',
    password: '',
    isBlocked: false,
  },
  isLoading: false,
  error: '',
}

export const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAdmins.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAdmins.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.admins = action.payload
    })
    builder.addCase(getAdmins.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCurrentAdmin.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCurrentAdmin.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.currentAdmin = action.payload
    })
    builder.addCase(getCurrentAdmin.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(deleteAdmin.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(deleteAdmin.fulfilled, (state) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(deleteAdmin.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(blockAdmin.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(blockAdmin.fulfilled, (state) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(blockAdmin.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
})

export const adminsReducer = adminsSlice.reducer
