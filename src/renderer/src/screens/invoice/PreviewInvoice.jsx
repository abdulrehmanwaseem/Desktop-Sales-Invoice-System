import React, { forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { currencyFormatter } from '../../lib/currencyLogic'
import moment from 'moment'

const PreviewInvoiceModal = forwardRef((props, ref) => {
  const { data } = useSelector((state) => state.modal)
  const { id, date, amount, items } = data || props.data

  return (
    <>
      <div className="border-2 p-6">
        <div ref={ref} className="text-xs text-black dark:text-white">
          <div className="flex items-start justify-between mb-3 text-right">
            <div className="flex flex-col  items-start ">
              <div className="text-gray-700 font-semibold text-lg mb-2">
                {import.meta.env.VITE_PRODUCT_OWNER_NAME}
              </div>
            </div>

            <div className="text-gray-700 space-y-1">
              <div className="font-bold text-xl mb-2">INVOICE #{id}</div>
              <div className="text-md">
                Date:
                <span className="font-semibold">{moment(date).format('DD/MMM/YYYY')}</span>
              </div>
            </div>
          </div>

          <table className="w-full text-left my-2">
            <thead>
              <tr className="border-b">
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((val) => (
                <tr className="border-b" key={val.name}>
                  <td>{val.name}</td>
                  <td>{val.quantity}</td>
                  <td>{val.rate}</td>
                  <td align="right">{currencyFormatter.format(val.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col items-end mb-1 gap-1">
            <div className="flex justify-between w-full font-bold">
              <p className="w-[90%] text-right">Total:</p>{' '}
              <p className="w-[10%] text-right">{currencyFormatter.format(amount)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default PreviewInvoiceModal
