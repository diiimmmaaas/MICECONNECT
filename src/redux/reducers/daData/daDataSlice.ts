import { createSlice } from '@reduxjs/toolkit'
import { getDaDataCity, getDaDataCompany } from '../../actions/daDataAction'
import { authSlice } from '../auth/authSlice'

export interface IDaData {
  daDataCompany: any
  daDataCity: any
  loading: boolean
  error: unknown | string
}

const initialState: IDaData = {
  daDataCompany: {
    suggestions: [{}],
  },
  daDataCity: [],
  loading: false,
  error: '',
}

export const daDataSlice = createSlice({
  name: 'daData',
  initialState,
  reducers: {
    clearDadata(state) {
      state.daDataCompany.suggestions = [{}]
      state.daDataCity = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDaDataCompany.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDaDataCompany.fulfilled, (state, action) => {
      state.loading = false
      state.error = ''
      state.daDataCompany = action.payload
    })
    builder.addCase(getDaDataCompany.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    builder.addCase(getDaDataCity.fulfilled, (state, action) => {
      state.error = ''
      state.daDataCity = action.payload
    })
    builder.addCase(getDaDataCity.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export const clearDadata = daDataSlice.actions.clearDadata
export const daDataReducer = daDataSlice.reducer
