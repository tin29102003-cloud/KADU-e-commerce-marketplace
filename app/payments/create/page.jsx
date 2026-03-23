"use client"

import CreatePTTTForm from '@/components/CreatePTTTForm'
import React from 'react'

const page = () => {
  // Thêm return ở đây
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
      </main>
      <CreatePTTTForm/>
    </div>
  )
}

export default page