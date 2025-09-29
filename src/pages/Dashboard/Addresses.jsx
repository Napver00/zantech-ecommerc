import React from 'react';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Addresses = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <MapPin className="h-6 w-6 text-blue-600" />
        Addresses
      </h2>
      <p className="text-gray-600 mb-6">The following addresses will be used on the checkout page by default.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Billing Address</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <address className="text-gray-600 not-italic">
              {user.address ? (
                <>
                  {user.name} <br />
                  {user.address}
                </>
              ) : (
                'You have not set up this type of address yet.'
              )}
            </address>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Shipping Address</h3>
           <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <address className="text-gray-600 not-italic">
               {user.address ? (
                <>
                  {user.name} <br />
                  {user.address}
                </>
              ) : (
                'You have not set up this type of address yet.'
              )}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;

