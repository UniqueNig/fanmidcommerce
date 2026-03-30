import ProductForm from "@/src/components/admindashboard/ProductForm";
import React from "react";

const EditProduct = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ProductForm mode="edit" />

    </div>
  );
};

export default EditProduct;
