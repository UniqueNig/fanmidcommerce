"use client";

import ProductForm from "@/src/components/admindashboard/ProductForm";
import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { use } from "react"; // ✅ MUST import

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      image
      stock
      category
      isNew
    }
  }
`;

interface GetProductData {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    isNew: boolean | null;
  };
}

interface GetProductVars {
  id: string;
}

const EditProduct = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params); // ✅ required in Next.js 16

  const { data, loading, error } = useQuery<GetProductData, GetProductVars>(
    GET_PRODUCT,
    {
      variables: { id },
      skip: !id, // ✅ VERY IMPORTANT
      fetchPolicy: "network-only",
    },
  );
  if (!id) return null; // optional safety

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3">
        <Loader2
          size={20}
          className="animate-spin"
          style={{ color: "var(--accent)" }}
        />
        <span
          className="text-sm font-['DM_Sans']"
          style={{ color: "var(--text-muted)" }}
        >
          Loading product...
        </span>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (error || !data?.product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle size={32} style={{ color: "#ef4444" }} />
        <p className="text-sm font-['DM_Sans']" style={{ color: "#ef4444" }}>
          {error ? error.message : "Product not found."}
        </p>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-xs tracking-widest uppercase font-['DM_Sans'] border px-5 py-2.5 hover:opacity-70"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <ArrowLeft size={12} /> Back to Products
        </Link>
      </div>
    );
  }

  const product = data.product;

  return (
    <div>
      <ProductForm
        {...({
          mode: "edit",
          productId: product.id,
          initialData: {
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
            image: product.image,
            isNew: product.isNew ?? false,
          },
        } as any)}
      />
    </div>
  );
};

export default EditProduct;
