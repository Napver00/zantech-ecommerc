import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="flex items-center gap-4 py-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-lg bg-gray-100" />
            <div className="flex-1">
                <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 disabled:opacity-50" disabled={item.quantity <= 1}>
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold">৳{(item.discountedPrice || item.price).toLocaleString()}</p>
                <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
        </div>
    );
};

export const Cart = () => {
    const { cartItems, cartTotal, clearCart } = useCart();

    return (
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
            <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
            </SheetHeader>
            {cartItems.length > 0 ? (
                <>
                    <div className="flex-1 overflow-y-auto px-6 -mx-6">
                        <div className="divide-y">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                    <SheetFooter className="p-6 bg-gray-50 -mx-6 -mb-6 border-t">
                        <div className="w-full space-y-4">
                             <div className="flex justify-between items-center font-semibold text-lg">
                                <span>Subtotal</span>
                                <span>৳{cartTotal.toLocaleString()}</span>
                            </div>
                            <Button onClick={() => alert('Proceeding to checkout!')} className="w-full" size="lg">
                                Buy All Cart Items
                            </Button>
                            <Button onClick={clearCart} variant="outline" className="w-full">
                                Clear Cart
                            </Button>
                        </div>
                    </SheetFooter>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm">Add items to see them here.</p>
                </div>
            )}
        </SheetContent>
    );
};
