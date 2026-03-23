"use client"

import PTTTTable from '@/components/PTTTTable'
import VouchersTable from '@/components/VouchersTable'
import React from 'react'

const page = () => {
  // Thêm return ở đây
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* Bạn nên đưa Table vào trong main để căn chỉnh đúng max-width */}
        <PTTTTable/>
      </main>
    </div>
  )
}

export default page