import React from 'react';
import ProductCard from './ProductCard';

const products = [
    { name: '9V Battery Connector with DC Jack', price: 20, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
    { name: 'New Leader 9v Battery', price: 70, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
    { name: '18650 Li-ion Rechargeable Battery (3.7V, 2200mAh)', price: 85, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
    { name: '3S 12V 10A BMS Lithium Battery Protection Board', price: 85, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
    { name: 'T Connector Male-Female Pair', price: 60, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
    { name: 'LiPo Battery 1100mAh 3S 25C', price: 1150, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
    { name: 'IMAX B3 LIPO Battery Charger', price: 400, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
    { name: 'Another Product Example', price: 120, image: 'https://placehold.co/200x200/f0f0f0/333?text=DEMO' },
];


const CompletePackage = () => {
    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Complete Package</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.name} product={product} />
                ))}
            </div>
        </section>
    );
};

export default CompletePackage;

