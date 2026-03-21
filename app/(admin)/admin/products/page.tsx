import Link from 'next/link'
import React from 'react'

const ProductsPage = () => {
  return (
   <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-black text-white px-4 py-2">
          Add Product
        </Link>
      </div>

      <p>Product list will show here</p>
    </div>
  )
}

export default ProductsPage