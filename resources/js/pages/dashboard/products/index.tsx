import AppLayout from '@/layouts/app-layout'
import React from 'react'
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ProductsDataTable from '@/components/dashboard/ProductDataTable';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/dashboard/products',
    },
];

export default function Products() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Products" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-x1 p-4">
            <ProductsDataTable />    
        </div>
    </AppLayout>
  )
}