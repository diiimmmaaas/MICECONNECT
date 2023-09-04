import { createSlice } from '@reduxjs/toolkit'
import {
  createCompanyComments,
  getCompanies,
  getCompanyComments,
  getCurrentCompany,
  pushNewFilesToCompany,
} from '../../actions/companiesAction'
import { CommentsType, CompaniesType, GetCompaniesResponseType } from '../../actions/types'

export interface ICompanies {
  isLoading: boolean
  companies: GetCompaniesResponseType
  currentCompany: CompaniesType
  companiesComments: CommentsType[]
  error: unknown | string
}

const initialState: ICompanies = {
  currentCompany: {
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
  companiesComments: [],
  isLoading: false,
  companies: {
    companies: [],
    totalCount: 0,
  },
  error: '',
}

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCompanies.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.companies = action.payload
    })
    builder.addCase(getCompanies.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCurrentCompany.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCurrentCompany.fulfilled, (state, action) => {
      state.currentCompany = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getCurrentCompany.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCompanyComments.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCompanyComments.fulfilled, (state, action) => {
      state.companiesComments = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getCompanyComments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(createCompanyComments.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(createCompanyComments.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(createCompanyComments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(pushNewFilesToCompany.pending, (state) => {
      state.isLoading = true
      state.error = ''
    })
    builder.addCase(pushNewFilesToCompany.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(pushNewFilesToCompany.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
})

export const companiesReducer = companiesSlice.reducer
