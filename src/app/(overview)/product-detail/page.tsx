import SingleProductDescription from "@/src/components/Products/ProductDescription";
import ProductDetails from "@/src/components/Products/ProductDetails";
import React from "react";

export default function ProductsDetailPage() {
  return (
    <div className="container p-3 bg-sky-100">
      <ProductDetails />
      <SingleProductDescription />
    </div>
  );
}
