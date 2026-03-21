import React from "react";

const EditProduct = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Product: {params.id}</h1>
    </div>
  );
};

export default EditProduct;
