import React from 'react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  const { name, price, image } = product;
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden text-center group transition-all hover:shadow-lg">
      <div className="p-4 bg-gray-100 aspect-square flex items-center justify-center">
        <img src={image} alt={name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 h-10">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">From: <span className="font-bold text-black">৳{price}</span></p>
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline">Add to Cart</Button>
          <Button size="sm" className="bg-red-500 hover:bg-red-600">Buy Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

