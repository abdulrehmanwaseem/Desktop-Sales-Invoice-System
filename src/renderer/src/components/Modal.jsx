import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../redux/slice/modal'
import { Dialog } from 'primereact/dialog'
import Item from '../screens/item/ItemModal'
import ConfirmationModal from './ConfirmationModal'
import CreateInvoice from '../screens/invoice/CreateInvoice'
import PreviewInvoiceModal from '../screens/invoice/PreviewInvoice'
import CancelInvoiceModal from '../screens/invoice/CancelInvoice'

const Modal = () => {
  const dispatch = useDispatch()
  const { open, modalType, title } = useSelector((state) => state.modal)

  const dialogWidth = modalType === 'invoice' ? '60vw' : '35vw'

  return (
    <Dialog
      contentClassName="dark:bg-boxdark"
      className="z-40"
      headerClassName="dark:bg-boxdark dark:text-bodydark1"
      header={title}
      visible={open}
      onHide={() => {
        if (!open) return
        dispatch(closeModal())
      }}
      style={{ minWidth: dialogWidth }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
    >
      <div className="m-0 dark:text-bodydark1">{checkModal(modalType)}</div>
    </Dialog>
  )
}

export default Modal

const checkModal = (name) => {
  let component = null
  switch (name) {
    case 'confirmation':
      component = <ConfirmationModal />
      break
    case 'itemModal':
      component = <Item />
      break
    case 'invoice':
      component = <CreateInvoice />
      break
    case 'cancelInvoice':
      component = <CancelInvoiceModal />
      break
    case 'previewInvoice':
      component = <PreviewInvoiceModal />
      break
    case '':
      component = <span>No Modal Find With This Type</span>
  }
  return component
}
