import React from 'react';
import { Package } from 'lucide-react';

const Orders = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Package className="h-6 w-6 text-blue-600" />
        My Orders
      </h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">You have no orders yet.</p>
      </div>
    </div>
  );
};

export default Orders;

