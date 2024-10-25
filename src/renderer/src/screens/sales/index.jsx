import React, { useState } from 'react'
import CardDataStats from '../../components/CardDataStats'
import { DatePicker } from '../../components/FormElements'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { currencyFormatter } from '../../lib/currencyLogic'
import { dashboardSchema } from '../../Validations'
import Spinner from '../../components/Spinner'

const Sales = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const methods = useForm({
    resolver: dashboardSchema
  })

  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const salesData = await window.api.getSales(formData)
      setData(salesData)
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="space-y-6">
      <div className="rounded-sm border shadow-default border-stroke bg-white dark:border-strokedark dark:bg-boxdark p-3 ">
        <FormProvider {...methods}>
          <form className="flex gap-4 items-center" onSubmit={methods.handleSubmit(onSubmit)}>
            <DatePicker mode="range" name="dateRange" py="3" />
            <Button label="Filter" raised size="small" className="w-26" type="submit" />
          </form>
        </FormProvider>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6  gap-6">
        <CardDataStats
          title="Total Sales"
          total={currencyFormatter.format(data || 0)}
        ></CardDataStats>
      </div>
    </div>
  )
}
export default Sales
