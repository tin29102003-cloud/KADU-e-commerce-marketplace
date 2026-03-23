"use client"

import CreateVoucherForm from '@/components/CreateVoucherForm'
import VouchersTable from '@/components/VouchersTable'
import React from 'react'

const page = () => {
  // Thêm return ở đây
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
      </main>
      <CreateVoucherForm/>
    </div>
  )
}

export default page