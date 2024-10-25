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

export default handlePreview
