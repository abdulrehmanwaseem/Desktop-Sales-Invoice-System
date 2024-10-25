import { configureStore } from '@reduxjs/toolkit'

import { modal } from '../slice/modal'

export const store = configureStore({
  reducer: {
    [modal.name]: modal.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
