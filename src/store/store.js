import { configureStore } from '@reduxjs/toolkit'
import applicationsReducer from './slices/applicationsSlice'

export const store = configureStore({
  reducer: {
    applications: applicationsReducer,
  },
})

