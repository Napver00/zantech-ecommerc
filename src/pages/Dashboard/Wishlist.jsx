import React from 'react';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Heart className="h-6 w-6 text-blue-600" />
        My Wishlist
      </h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">Your wishlist is currently empty.</p>
      </div>
    </div>
  );
};

export default Wishlist;