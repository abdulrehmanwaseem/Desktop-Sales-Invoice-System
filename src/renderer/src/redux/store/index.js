import { configureStore } from '@reduxjs/toolkit'

import { authSlice } from '../slice/auth'
import { modal } from '../slice/modal'

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [modal.name]: modal.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
