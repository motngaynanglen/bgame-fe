'use client'
import SingleProductDescription from "@/src/components/Products/ProductDescription";
import ProductDetails from "@/src/components/Products/ProductDetails";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

export default function BoardGameDetailPage() {
    const { id } = useParams();
    console.log(id)
  return (
    <div className="container p-3 bg-sky-50">
      <ProductDetails productId={id} />
      <SingleProductDescription />
    </div>
  );
}
