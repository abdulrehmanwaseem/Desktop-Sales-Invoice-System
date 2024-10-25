import React, { useRef } from 'react'
import moment from 'moment'
import { Eye, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { openModal } from '../../redux/slice/modal'
import { currencyFormatter } from '../../lib/currencyLogic'
import DataTable from '../../components/Datatable'
import useFetchData from '../../hooks/useFetchData'
import Spinner from '../../components/Spinner'
import { Tag } from 'primereact/tag'

const Invoice = () => {
  const { getInvoices, createInvoice, cancelInvoice } = window.api
  const { data: items, loading, refetch } = useFetchData(getInvoices)

  const dispatch = useDispatch()

  if (loading) {
    return <Spinner />
  }

  const columns = [
    { field: 'id', header: 'Id' },
    {
      field: 'date',
      header: 'Date',
      body: ({ date }) => {
        return moment(date).format('DD/MMM/YYYY')
      }
    },

    {
      field: 'amount',
      header: 'Amount',
      body: ({ amount }) => {
        return <span>{currencyFormatter.format(amount)}</span>
      }
    },
    {
      field: 'status',
      header: 'Status',
      body: ({ isCancelled }) => {
        return isCancelled ? <Tag severity="danger" value={'Cancelled'} /> : null
      }
    }
  ]

  const customActions = (data) => {
    const { status } = data
    return (
      <span className="flex justify-center items-center gap-3 actions">
        <Eye
          className="cursor-pointer hover:text-slate-400"
          strokeWidth={2.5}
          onClick={() =>
            dispatch(
              openModal({
                modalType: 'previewInvoice',
                title: 'Preview Invoice',
                data: data
              })
            )
          }
        />

        {status !== 'Cancelled' && (
          <X
            className="cursor-pointer hover:text-slate-400"
            strokeWidth={2.5}
            onClick={() =>
              dispatch(
                openModal({
                  modalType: 'cancelInvoice',
                  title: 'Cancel Invoice',
                  callback: cancelInvoice,
                  data: data,
                  refetch: refetch
                })
              )
            }
          />
        )}
      </span>
    )
  }

  const modalType = 'invoice'
  return (
    <DataTable
      data={items}
      columns={columns}
      createRecord={createInvoice}
      refetch={refetch}
      modalType={modalType}
      customActions={customActions}
    />
  )
}

export default Invoice
