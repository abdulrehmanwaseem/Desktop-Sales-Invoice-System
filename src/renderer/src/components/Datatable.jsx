import React from 'react'
import { DataTable as Table } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { Button } from 'primereact/button'
import { useDispatch } from 'react-redux'
import Card from './Card'
import { openModal } from '../redux/slice/modal'

const DataTable = ({
  data = [],
  columns = [],
  createRecord = null,
  updateRecord = null,
  deleteRecord = null,
  refetch = null,
  modalType,
  addBtn = true,
  rowActions = true,
  customActions = null
}) => {
  const dispatch = useDispatch()

  const rowActionsCol = (data, row) => {
    return (
      <span className="flex justify-center items-center gap-3 actions">
        <Edit
          className="cursor-pointer hover:text-slate-400"
          onClick={() =>
            dispatch(
              openModal({
                modalType: modalType,
                title: 'Update Record',
                sendId: true,
                data: data,
                refetch,
                callback: updateRecord
              })
            )
          }
        />
        <Trash2
          className="cursor-pointer hover:text-slate-400"
          onClick={() =>
            dispatch(
              openModal({
                modalType: 'confirmation',
                title: 'Delete Record',
                data: data,
                refetch,
                callback: deleteRecord
              })
            )
          }
        />
      </span>
    )
  }

  const noRecordFoundMsg = () => {
    return <p className="dark:bg-boxdark dark:text-bodydark1 p-2 -m-2">No records are found.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        {addBtn && (
          <Button
            label="Add Record"
            size="small"
            icon={<Plus />}
            onClick={() =>
              dispatch(
                openModal({
                  modalType: modalType,
                  title: 'Create Record',
                  refetch,
                  callback: createRecord
                })
              )
            }
          />
        )}
      </Card>

      <Table
        value={data}
        dataKey="id"
        emptyMessage={noRecordFoundMsg()}
        showGridlines
        resizableColumns
        size="small"
        rows={15}
        tableStyle={{ minWidth: '50rem' }}
        rowClassName="dark:bg-boxdark dark:text-slate-300"
      >
        {columns?.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.body}
            headerClassName="dark:bg-strokedark dark:text-bodydark1"
          />
        ))}
        {rowActions && (
          <Column
            body={customActions || rowActionsCol}
            header="Actions"
            headerClassName="dark:bg-strokedark dark:text-bodydark1"
            style={{ textAlign: 'center', width: '5em' }}
          />
        )}
      </Table>
    </div>
  )
}

export default DataTable
