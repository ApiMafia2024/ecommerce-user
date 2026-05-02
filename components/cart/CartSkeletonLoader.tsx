import React from 'react'
import { Skeleton } from '../ui/skeleton'

const CartSkeletonLoader = () => {
  return (
    <>
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Breadcrumbs Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Page Heading Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-10 w-32 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Cart Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List Skeleton */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-background-dark/40 border border-gray-100 dark:border-gray-800 rounded-xl"
              >
                {/* Product Image Skeleton */}
                <Skeleton className="w-full md:w-32 aspect-square rounded-lg shrink-0" />

                {/* Product Details Skeleton */}
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-5 w-20 mt-2" />
                    </div>
                    <Skeleton className="w-10 h-10 rounded-lg" />
                  </div>

                  {/* Quantity Controls and Total Skeleton */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3 bg-[#f5f2f0] dark:bg-[#3d2d1d] rounded-lg p-1">
                      <Skeleton className="size-8 rounded-md" />
                      <Skeleton className="w-8 h-6" />
                      <Skeleton className="size-8 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Sidebar Skeleton */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white dark:bg-background-dark/40 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                {/* Order Summary Title */}
                <Skeleton className="h-7 w-40 mb-6" />

                {/* Summary Details Skeleton */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                {/* Discount Code Skeleton */}
                <div className="mb-8">
                  <Skeleton className="h-4 w-28 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="flex-1 h-10 rounded-lg" />
                    <Skeleton className="w-20 h-10 rounded-lg" />
                  </div>
                </div>

                {/* Total Skeleton */}
                <div className="flex items-end justify-between mb-8">
                  <Skeleton className="h-6 w-32" />
                  <div className="text-right">
                    <Skeleton className="h-9 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>

                {/* Checkout Button Skeleton */}
                <Skeleton className="w-full h-12 rounded-xl mb-6" />

                {/* Security Badge Skeleton */}
                <div className="flex items-center justify-center gap-4">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Next Day Delivery Banner Skeleton */}
              <div className="mt-4 p-4 flex items-center gap-4 bg-primary/5 rounded-xl border border-primary/10">
                <Skeleton className="w-5 h-5 rounded shrink-0" />
                <Skeleton className="h-4 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CartSkeletonLoader