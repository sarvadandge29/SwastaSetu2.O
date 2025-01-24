
import AdminHeader from '@/components/AdminHeader'
import {AdminSidebar} from '@/components/Sidebar'
import React, { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <main className='flex min-h-screen w-full flex-row'>
        <SidebarProvider>
        <AdminSidebar />
        <div className='flex w-[calc(100%-264px)] flex-1 flex-col bg-light-300 p-5 xs:p-10;'>
            <AdminHeader />
            <div className='mt-10 pb-10'>
                {children}
            </div>
        </div>
        </SidebarProvider>
    </main>
  )
}

export default Layout