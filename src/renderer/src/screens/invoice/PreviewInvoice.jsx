import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { currencyFormatter } from '../../lib/currencyLogic'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import { Download } from 'lucide-react'

const PreviewInvoiceModal = () => {
  const contentRef = useRef()

  const { data } = useSelector((state) => state.modal)
  const { id, date, amount, items } = data

  const handlePreview = (target) => {
    return new Promise((resolve, reject) => {
      try {
        const data = target.contentWindow.document.documentElement.outerHTML
        const blob = new Blob([data], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const fileName = `Invoice#${id}`

        window.api.previewComponent(url, fileName)
        resolve()
      } catch (error) {
        toast.error('Failed to download invoice. Please try again.')
        reject(error)
      }
    })
  }

  const handleInvoicePreview = useReactToPrint({
    contentRef: contentRef,
    print: handlePreview
  })

  return (
    <>
      <div className="border-2 p-6 ">
        <div ref={contentRef} className="text-xs text-black dark:text-white">
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
      <Download
        className="cursor-pointer absolute right-16 top-[1.8rem] text-slate-500 hover:text-slate-700"
        size={20}
        onClick={handleInvoicePreview}
      />
    </>
  )
}

export default PreviewInvoiceModal
