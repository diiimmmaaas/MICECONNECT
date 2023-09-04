import { createSlice } from '@reduxjs/toolkit'
import { ClaimResponseType, ClaimsFromPlacesType, CommentsType } from '../../actions/types'
import {
  createClaim,
  createClaimComments,
  deleteCurrentClaim,
  getAllClaims,
  getAllClaimsFromPlatforms,
  getClaimComments,
  getCurrentClaim,
  getCurrentClaimFromCurrentPlatform,
} from '../../actions/claimsAction'
import { authSlice } from '../auth/authSlice'

export interface IClaims {
  allClaims: ClaimResponseType[]
  allClaimsFromPlaces: ClaimsFromPlacesType[]
  currentClaim: ClaimResponseType
  currentClaimFromCurrentPlace: ClaimResponseType[]
  claimComments: CommentsType[]
  claimsDataForCheck: ClaimResponseType
  isLoading: boolean
  error: unknown | string
}

const initialState: IClaims = {
  allClaims: [],
  allClaimsFromPlaces: [],
  currentClaim: {
    peopleCount: '',
    description: '',
    startDate: '',
    endDate: '',
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
    place: {
      id: 0,
      name: '',
      city: '',
      address: '',
      size: 0,
      description: '',
      color: '',
      images: [],
      files: [],
      createdAt: '',
      isBlocked: false,
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
    id: 0,
    status: '',
    createdAt: '',
    comments: [],
  },
  claimComments: [],
  currentClaimFromCurrentPlace: [],
  claimsDataForCheck: {
    description: '',
    peopleCount: '',
    startDate: '',
    endDate: '',
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
    place: {
      id: 0,
      name: '',
      city: '',
      address: '',
      size: 0,
      description: '',
      color: '',
      images: [],
      files: [],
      createdAt: '',
      isBlocked: false,
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
        isBlocked: false,
        employees: [],
        comments: [],
        images: [],
      },
    },
    id: 0,
    status: '',
    createdAt: '',
    comments: [],
  },
  isLoading: false,
  error: '',
}

export const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    clearError(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllClaims.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAllClaims.fulfilled, (state, action) => {
      state.allClaims = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getAllClaims.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getAllClaimsFromPlatforms.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAllClaimsFromPlatforms.fulfilled, (state, action) => {
      state.allClaimsFromPlaces = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getAllClaimsFromPlatforms.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCurrentClaim.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCurrentClaim.fulfilled, (state, action) => {
      state.currentClaim = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getCurrentClaim.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCurrentClaimFromCurrentPlatform.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCurrentClaimFromCurrentPlatform.fulfilled, (state, action) => {
      state.currentClaimFromCurrentPlace = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getCurrentClaimFromCurrentPlatform.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(createClaim.pending, (state) => {
      state.isLoading = true
      state.error = ''
    })
    builder.addCase(createClaim.fulfilled, (state, action) => {
      state.claimsDataForCheck = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(createClaim.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(deleteCurrentClaim.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(deleteCurrentClaim.fulfilled, (state) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(deleteCurrentClaim.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getClaimComments.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getClaimComments.fulfilled, (state, action) => {
      state.claimComments = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getClaimComments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(createClaimComments.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(createClaimComments.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(createClaimComments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
})

export const clearError = claimsSlice.actions.clearError

export const claimsReducer = claimsSlice.reducer
