import { createSlice } from '@reduxjs/toolkit'
import { CommentsType, GetPlatformsResponseType, PlaceType } from '../../actions/types'
import {
  createPlace,
  createPlatformComments,
  getCurrentPlaces,
  getPlaces,
  getPlacesFromCompany,
  getPlatformComments,
  pushNewFilesToPlatform,
} from '../../actions/placesAction'

export interface IPlaces {
  places: GetPlatformsResponseType
  placesFromCurrentCompany: GetPlatformsResponseType
  currentPlace: PlaceType
  placesComments: CommentsType[]
  isLoading: boolean
  error: any
  errorImage: any
}

const initialState: IPlaces = {
  places: {
    places: [],
    totalCount: 0,
  },
  placesFromCurrentCompany: {
    places: [],
    totalCount: 0,
  },
  placesComments: [],
  currentPlace: {
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
  isLoading: false,
  error: '',
  errorImage: '',
}

export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPlaces.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getPlaces.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.places = action.payload
    })
    builder.addCase(getPlaces.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getPlacesFromCompany.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getPlacesFromCompany.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.placesFromCurrentCompany = action.payload
      state.places = action.payload
    })
    builder.addCase(getPlacesFromCompany.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(getCurrentPlaces.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getCurrentPlaces.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
      state.currentPlace = action.payload
    })
    builder.addCase(getCurrentPlaces.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(pushNewFilesToPlatform.pending, (state) => {
      state.isLoading = true
      state.errorImage = ''
    })
    builder.addCase(pushNewFilesToPlatform.fulfilled, (state, action) => {
      state.isLoading = false
      state.errorImage = ''
    })
    builder.addCase(pushNewFilesToPlatform.rejected, (state, action) => {
      state.isLoading = false
      state.errorImage = action.payload
    })
    builder.addCase(getPlatformComments.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getPlatformComments.fulfilled, (state, action) => {
      state.placesComments = action.payload
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(getPlatformComments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(createPlatformComments.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(createPlatformComments.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = ''
    })
    builder.addCase(createPlatformComments.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    builder.addCase(createPlace.pending, (state) => {
      state.error = ''
    })
    builder.addCase(createPlace.fulfilled, (state, action) => {
      state.error = ''
    })
    builder.addCase(createPlace.rejected, (state, action) => {
      state.error = action.payload
    })
  },
})

export const placesReducer = placesSlice.reducer
