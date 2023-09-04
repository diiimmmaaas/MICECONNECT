import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { authReducer } from './reducers/auth/authSlice'
import { adminsReducer } from './reducers/admins/adminsSlice'
import { companiesReducer } from './reducers/companies/companiesSlice'
import { daDataReducer } from './reducers/daData/daDataSlice'
import { staffReducer } from './reducers/staff/staffSlice'
import { placesReducer } from './reducers/places/placesSlice'
import { claimsReducer } from './reducers/claims/claimsSlice'
import { registrationRequestReducer } from './reducers/registrationRequest/registrationRequestSlice'
import { meReducer } from './reducers/me/meSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  admins: adminsReducer,
  companies: companiesReducer,
  daData: daDataReducer,
  staff: staffReducer,
  places: placesReducer,
  claims: claimsReducer,
  registrationRequest: registrationRequestReducer,
  me: meReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// @ts-ignore
window.store = store
