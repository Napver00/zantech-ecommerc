import React from 'react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  const { name, price, image, discount, discountedPrice, discountPercentage } = product;
  const hasDiscount = Number(discount) > 0;

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden group transition-all hover:shadow-lg">
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">Hot Sell</div>
      )}

      {/* Full-bleed image */}
      <div className="w-full h-48 bg-white overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </div>

      <div className="p-4 text-left">
        <h3 className="font-semibold text-sm mb-2 line-clamp-3" title={name}>{name}</h3>

        <div className="mb-4 flex items-baseline gap-3">
          {hasDiscount ? (
            <>
              <span className="text-gray-500 text-sm line-through">৳{price}</span>
              <span className="text-black font-bold text-lg">৳{discountedPrice ?? price}</span>
              {discountPercentage != null && (
                <span className="ml-auto text-sm text-green-600 font-semibold">-{discountPercentage}%</span>
              )}
            </>
          ) : (
            <span className="text-black font-bold text-lg">৳{price}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button size="sm" variant="outline" className="flex-1">Add to Cart</Button>
          <Button size="sm" className="bg-red-500 hover:bg-red-600 flex-1">Buy Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

