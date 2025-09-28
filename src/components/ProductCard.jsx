import React from 'react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  const { name, price, image_path, discount, discountedPrice, discountPercentage } = product;
  const hasDiscount = Number(discount) > 0;

  return (
    <div className="relative bg-white border rounded-lg shadow-sm overflow-hidden text-center group transition-all hover:shadow-lg">
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">Hot Sell</div>
      )}

      <div className="p-4 bg-gray-100 aspect-square flex items-center justify-center">
        <img src={image_path} alt={name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 h-10">{name}</h3>

        {hasDiscount ? (
          <div className="mb-4">
            <div className="text-gray-500 text-xs">From</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-sm text-gray-500 line-through">৳{price}</span>
              <span className="font-bold text-black text-lg">৳{discountedPrice ?? price}</span>
              {discountPercentage != null && (
                <span className="ml-2 text-sm text-green-600 font-semibold">-{discountPercentage}%</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-sm mb-4">From: <span className="font-bold text-black">৳{price}</span></p>
        )}

        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline">Add to Cart</Button>
          <Button size="sm" className="bg-red-500 hover:bg-red-600">Buy Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

