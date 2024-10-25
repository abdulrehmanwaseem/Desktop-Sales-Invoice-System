import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Input } from '../../components/FormElements'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../../redux/slice/modal'
import { Button } from 'primereact/button'
import { v4 as uuid } from 'uuid'
import { ItemsSchema } from '../../Validations'

const Item = () => {
  const { data, sendId, callback, refetch } = useSelector((state) => state.modal)

  const dispatch = useDispatch()

  const methods = useForm({
    values: data,
    resolver: ItemsSchema
  })

  const onSubmit = async (formData) => {
    try {
      const trimmedFormData = {
        ...formData,
        name: formData?.name?.trim()
      }
      if (sendId) {
        await callback({ id: data.id, ...trimmedFormData })
        dispatch(closeModal())
      } else {
        await callback({ ...trimmedFormData, id: uuid() })
        dispatch(closeModal())
      }
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input label={'Name'} name="name" placeholder="Enter name here" />

          <Input label={'Price'} name="price" type="number" placeholder="Enter price here" />

          <Button label="Submit" raised className="w-full py-3" size="small" />
        </form>
      </FormProvider>
    </div>
  )
}

export default Item
