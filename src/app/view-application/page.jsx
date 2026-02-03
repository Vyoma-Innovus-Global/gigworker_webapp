import ViewApplicationPage from '@/components/ApplicationPreview'
import React, { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-2">Loading...</div>}>
      <ViewApplicationPage />
    </Suspense>
  )
}
