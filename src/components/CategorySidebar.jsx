import React from 'react';

const categories = [
  '3D Solution', 'Accessories', 'Battery', 'Basic Components', 
  'Display', 'Microcontroller', 'Project Kits', 'Robotics', 
  'Sensor', 'Starter Kits', 'Wireless'
];

const CategorySidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <h2 className="bg-blue-800 text-white font-semibold p-3 rounded-t-lg text-sm">
        BROWSE CATEGORIES
      </h2>
      <ul className="divide-y divide-gray-200">
        {categories.map(category => (
          <li key={category}>
            <a href="#" className="block p-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              {category}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;

