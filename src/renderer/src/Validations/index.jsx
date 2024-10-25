import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export const ItemsSchema = yupResolver(
  yup.object({
    name: yup.string().required('Item name is required'),
    price: yup.number().typeError('Price is required')
  })
)

export const dashboardSchema = yupResolver(
  yup.object({
    dateRange: yup.string().required('Date Range is required')
  })
)

export const validateTable = (hotRef) => {
  const data = hotRef.getData()

  let isGridEmpty = true
  let isError = false
  data.forEach((nestedArray, _) => {
    if (nestedArray.every((value) => !value)) return

    nestedArray.forEach((value) => {
      if (!value) {
        isError = true
      } else {
        isGridEmpty = false
      }
    })
  })

  return { isGridEmpty, isError }
}
