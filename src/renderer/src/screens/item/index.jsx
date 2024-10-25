import React from 'react'
import DataTable from '../../components/Datatable'

import { currencyFormatter } from '../../lib/currencyLogic'
import useFetchData from '../../hooks/useFetchData'
import Spinner from '../../components/Spinner'

const Item = () => {
  const { getItems, createItem, updateItem, delItem } = window.api
  const { data: items, loading, refetch } = useFetchData(getItems)

  if (loading) {
    return <Spinner />
  }

  const columns = [
    { field: 'name', header: 'Name' },
    {
      field: 'price',
      header: 'Price',
      body: ({ price }) => {
        return <span>{currencyFormatter.format(price)}</span>
      }
    }
  ]

  const modalType = 'itemModal'

  return (
    <DataTable
      data={items}
      columns={columns}
      createRecord={createItem}
      updateRecord={updateItem}
      deleteRecord={delItem}
      refetch={refetch}
      modalType={modalType}
    />
  )
}

export default Item
