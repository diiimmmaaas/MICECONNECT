import { createSlice } from '@reduxjs/toolkit'
import {
  getCurrentRegistrationRequests,
  getRegistrationRequests,
} from '../../actions/registartionRequestAction'
import { GetRegistrationRequestType, RegistrationRequestType } from '../../actions/types'

export interface IRegistrationRequest {
  registrationRequests: GetRegistrationRequestType
  currentRegistrationRequests: RegistrationRequestType
  isLoading: boolean
  error: unknown | string
}

const initialState: IRegistrationRequest = {
  registrationRequests: {
    requests: [],
    totalCount: 8,
  },
  currentRegistrationRequests: {
    id: 0,
    companyName: '',
    inn: '',
    city: '',
    address: '',
    contactFullName: '',
    contactPhone: '',
    email: '',
    login: '',
    password: '',
    role: '',
    status: '',
    createdAt: '',
  },
  isLoading: false,
  error: '',
}

export const registrationRequestSlice = createSlice({
  name: 'registrationRequest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRegistrationRequests.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getRegistrationRequests.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.registrationRequests = action.payload
    })
    builder.addCase(getRegistrationRequests.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCurrentRegistrationRequests.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCurrentRegistrationRequests.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.currentRegistrationRequests = action.payload
    })
    builder.addCase(getCurrentRegistrationRequests.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
})

export const registrationRequestReducer = registrationRequestSlice.reducer
