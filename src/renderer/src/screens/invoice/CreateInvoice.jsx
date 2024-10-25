import { HotTable } from '@handsontable/react'
import { Button } from 'primereact/button'
import React, { useCallback, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { calculateTotalAmount, currencyFormatter } from '../../lib/currencyLogic'
import { validateTable } from '../../Validations'
import useFetchData from '../../hooks/useFetchData'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../redux/slice/modal'

const CreateInvoice = () => {
  const [tableData] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const hotRef = useRef(null)
  const methods = useForm()
  const dispatch = useDispatch()

  const { callback, refetch } = useSelector((state) => state.modal)

  const colHeaders = ['Item', 'Rate', 'Quantity', 'Amount']

  const { getItems } = window.api

  const { data: itemsData } = useFetchData(getItems)

  const columns = [
    {
      data: 'name',
      type: 'autocomplete',
      source: itemsData.map((item) => item.name),
      strict: true,
      allowInvalid: false
    }, // name
    {
      data: 'rate',
      type: 'numeric',
      numericFormat: { pattern: '0,0.00' },
      strict: true,
      allowInvalid: false
    }, // rate
    {
      data: 'quantity',
      type: 'numeric',
      strict: true,
      allowInvalid: false
    }, // quantity
    {
      data: 'amount',
      type: 'numeric',
      numericFormat: { pattern: '0,0.00' },
      readOnly: true,
      allowInvalid: false,
      strict: true
    } // amount
  ]

  const onTableSubmit = async () => {
    try {
      const hot = hotRef?.current?.hotInstance

      const { isGridEmpty, isError } = validateTable(hot)
      if (isGridEmpty) {
        toast.error('Please Add Items in table to submit')
        return
      }
      if (isError) {
        toast.error('Please Review Table Data')
        return
      }

      const items = hot?.getSourceData().filter((item) => item.name)
      const payload = {
        items,
        date: new Date(),
        isCancelled: false,
        amount: totalAmount
      }

      await callback(payload)
      dispatch(closeModal())
      refetch()
    } catch (error) {
      toast.error('An error occurred, try again later')
      console.log(error)
    }
  }

  const afterChange = useCallback((changes, source) => {
    const hot = hotRef.current?.hotInstance

    if (source === 'edit' || source === 'CopyPaste.paste') {
      changes?.forEach(([row, prop, oldValue, newValue]) => {
        if (prop === 'name') {
          if (oldValue !== newValue) {
            const selectedItems = hot
              .getDataAtCol(1)
              .filter((name, rowIndex) => name && rowIndex !== row)

            const isDuplicate = selectedItems.includes(newValue)
            if (isDuplicate) {
              hot.setDataAtRowProp(row, prop, oldValue)
              toast.error('Item already added, please choose a different item.')
            } else {
              const item = itemsData?.find((item) => item.name === newValue)
              const idColumn = 0
              const rateColumn = 1
              hot.setDataAtCell(row, idColumn, item?.id)
              hot.setDataAtCell(row, rateColumn, item?.price)
            }
          }
        }
        if (prop === 'rate' || prop === 'quantity') {
          if (oldValue !== newValue) {
            const [name, price, quantity, amount] = hot.getDataAtRow(row)
            const amountColumn = 3
            hot.setDataAtCell(row, amountColumn, (price || 0) * (quantity || 0))
          }
        }
      })
      const items = hot?.getSourceData().filter((item) => Object.keys(item).length > 0)
      setTotalAmount(calculateTotalAmount(items))
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onTableSubmit)}>
        <div className="space-y-4 ">
          <HotTable
            data={tableData}
            ref={hotRef}
            afterChange={afterChange}
            colHeaders={colHeaders}
            columns={columns}
            stretchH="all"
            beforeRefreshDimensions={() => false}
            height={`${Math.min(tableData.length, 10) * 24 + 24}px`}
            contextMenu={true}
            manualColumnResize={true}
            manualRowResize={true}
            rowHeaders={true}
            minRows={10}
            minSpareRows={1}
            licenseKey="non-commercial-and-evaluation"
          />
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Payment Details</h1>
            <div className="flex gap-3 items-center">
              <span className="text-lg font-semibold">
                Total Amount: {currencyFormatter.format(totalAmount)}
              </span>
            </div>
          </div>
          <hr />
          <Button label="Submit" raised className="w-full" size="small" type="submit" />
        </div>
      </form>
    </FormProvider>
  )
}
export default CreateInvoice
