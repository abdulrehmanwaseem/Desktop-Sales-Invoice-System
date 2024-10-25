import { lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

// Screens Import:
import AppLayout from './layout/AppLayout'
import ErrorPage from './screens/error'
import CreateInvoice from './screens/invoice/CreateInvoice'

const Item = lazy(() => import('./screens/item'))
const Sales = lazy(() => import('./screens/sales'))
const Invoice = lazy(() => import('./screens/invoice'))

const App = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Sales />} />
            <Route path="/invoices" element={<Invoice />} />
            <Route path="/createInvoice" element={<CreateInvoice />} />
            <Route path="/items" element={<Item />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
