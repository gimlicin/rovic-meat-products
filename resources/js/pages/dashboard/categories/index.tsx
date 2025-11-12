import AppLayout from '@/layouts/app-layout'
import React from 'react'
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/dashboard/categories',
    },
];

export default function Categories() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Category" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-x1 p-4">
            <h2>This is the Dashboard Category</h2>     
        </div>
    </AppLayout>
  )
}