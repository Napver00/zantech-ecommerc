import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { config } from '../config';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, User, AlertCircle, CheckCircle, MapPin, CreditCard, Truck, Tag, Shield, Lock } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, token, setIsAuthSheetOpen } = useAuth();
    const navigate = useNavigate();

    const [orderInfo, setOrderInfo] = useState(null);
    const [shippingOption, setShippingOption] = useState('localPickup');
    const [paymentMethod, setPaymentMethod] = useState('1');
    const [couponCode, setCouponCode] = useState('');
    const [coupon, setCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [isCouponLoading, setIsCouponLoading] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    
    const [formData, setFormData] = useState({
        user_name: '',
        userphone: '',
        address: '',
        trxed: '',
        paymentphone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, user_name: user.name, userphone: user.phone, address: user.address || '' }));
        } else {
            setIsGuestCheckout(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchOrderInfo = async () => {
            try {
                const res = await fetch(`${config.baseURL}/documents/order-info`);
                const data = await res.json();
                if (data.success) setOrderInfo(data.data);
            } catch (error) {
                console.error("Failed to fetch order info:", error);
            }
        };
        fetchOrderInfo();
    }, []);
    
    const shippingCharge = orderInfo ? 
        (shippingOption === 'localPickup' ? 0 : 
         shippingOption === 'insideDhaka' ? orderInfo.insideDhaka : 
         orderInfo.outsideDhaka) : 0;
    const discountAmount = coupon ? coupon.discount : 0;
    const subtotalAfterDiscount = cartTotal + shippingCharge - discountAmount;
    const bkashChargePercentage = orderInfo?.bkashChangedParsentage || 0;
    const bkashCharge = paymentMethod === '2' ? subtotalAfterDiscount * (bkashChargePercentage / 100) : 0;
    const grandTotal = subtotalAfterDiscount + bkashCharge;
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsCouponLoading(true);
        setCouponError('');
        try {
            const response = await fetch(`${config.baseURL}/check-coupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coupon_code: couponCode, total_amount: cartTotal }),
            });
            const data = await response.json();
            if (data.success) {
                setCoupon(data.data);
            } else {
                setCouponError(data.message || 'Invalid coupon code.');
                setCoupon(null);
            }
        } catch (error) {
            setCouponError('Failed to apply coupon.');
        } finally {
            setIsCouponLoading(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setOrderError('');
        
        // Validate cart
        if (cartItems.length === 0) {
            setOrderError("Your cart is empty.");
            return;
        }
        
        // Validate guest checkout
        if (!user && !isGuestCheckout) {
            setOrderError("Please sign in or continue as guest to place order.");
            return;
        }
        
        // Validate guest information
        if (!user && isGuestCheckout) {
            if (!formData.user_name?.trim()) {
                setOrderError("Please enter your full name.");
                return;
            }
            if (!formData.userphone?.trim()) {
                setOrderError("Please enter your phone number.");
                return;
            }
            if (!formData.address?.trim()) {
                setOrderError("Please enter your full address.");
                return;
            }
        }
        
        // Validate logged-in user information
        if (user) {
            if (!user.id) {
                setOrderError("User information is missing. Please try logging in again.");
                return;
            }
            if (!user.address || !user.address.trim()) {
                setOrderError("Please add your shipping address in your dashboard before placing an order.");
                return;
            }
        }
        
        // Validate bKash payment fields
        if (paymentMethod === '2') {
            if (!formData.paymentphone?.trim()) {
                setOrderError("Please enter your bKash number.");
                return;
            }
            if (!formData.trxed?.trim()) {
                setOrderError("Please enter your transaction ID.");
                return;
            }
        }
        
        setIsPlacingOrder(true);

        const orderData = {
            product_subtotal: cartTotal,
            total: grandTotal,
            shipping_charge: shippingCharge,
            payment_type: parseInt(paymentMethod),
            products: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity })),
            ...(user && { user_id: user.id }),
            ...((!user && isGuestCheckout) && { 
                user_name: formData.user_name.trim(), 
                userphone: formData.userphone.trim(), 
                address: formData.address.trim() 
            }),
            ...(coupon && { coupon_id: coupon.coupon_id }),
            ...(paymentMethod === '2' && { 
                trxed: formData.trxed.trim(), 
                paymentphone: formData.paymentphone.trim() 
            }),
        };

        try {
            const response = await fetch(`${config.baseURL}/orders/place-order`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(orderData),
            });
            const data = await response.json();
            if (data.success) {
                setOrderSuccess(true);
                clearCart();
                setTimeout(() => navigate('/'), 5000);
            } else {
                setOrderError(data.message || 'Failed to place order. Please try again.');
            }
        } catch (error) {
            setOrderError('An unexpected error occurred. Please check your connection and try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
                    <div className="text-center bg-white p-16 rounded-3xl shadow-2xl max-w-2xl w-full border border-green-100">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-16 w-16 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                        <p className="text-lg text-gray-600 mb-6">Thank you for your purchase. We'll process your order shortly.</p>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-green-800">You will be redirected to the homepage in 5 seconds...</p>
                        </div>
                        <Button onClick={() => navigate('/')} size="lg" className="bg-blue-600 hover:bg-blue-700">
                            Continue Shopping
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                {/* Progress Header */}
                <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">Secure Checkout</h1>
                        <p className="text-sm sm:text-base text-gray-600 flex items-center justify-center gap-2">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            Your information is safe and secure
                        </p>
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-blue-100">
                                ✓
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-900 hidden sm:inline">Shipping</span>
                        </div>
                        <div className="w-8 sm:w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-blue-100">
                                ✓
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-900 hidden sm:inline">Payment</span>
                        </div>
                        <div className="w-8 sm:w-16 h-1 bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">
                                3
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-400 hidden sm:inline">Confirm</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Information Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                            <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-5 sm:p-6">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold">Shipping Information</h2>
                                </div>
                            </div>
                            <div className="p-8">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 text-green-600 bg-green-50 p-4 rounded-xl border border-green-200">
                                            <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-gray-900">Logged in as {user.name}</span>
                                                <p className="text-sm text-gray-600 mt-1">Your order will be delivered to your registered address</p>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <User className="h-5 w-5 text-gray-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Name</p>
                                                    <p className="text-gray-900 font-semibold">{user.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <svg className="h-5 w-5 text-gray-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                                                    <p className="text-gray-900 font-semibold">{user.phone}</p>
                                                </div>
                                            </div>
                                            {user.address && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">Address</p>
                                                        <p className="text-gray-900 font-semibold">{user.address}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Details in Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        {!isGuestCheckout ? (
                                            <div className="text-center space-y-6 py-6">
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                        <User className="h-10 w-10 text-white" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign in for faster checkout</h3>
                                                    <p className="text-gray-600 mb-6">Access your saved addresses, track orders, and enjoy exclusive benefits</p>
                                                    <Button 
                                                        type="button"
                                                        onClick={() => setIsAuthSheetOpen(true)} 
                                                        size="lg"
                                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                                                    >
                                                        <User className="mr-2 h-5 w-5" />
                                                        Sign In Now
                                                    </Button>
                                                </div>
                                                
                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center">
                                                        <div className="w-full border-t-2 border-gray-200"></div>
                                                    </div>
                                                    <div className="relative flex justify-center">
                                                        <span className="px-6 bg-white text-gray-500 font-medium">or</span>
                                                    </div>
                                                </div>

                                                <button 
                                                    type="button"
                                                    onClick={() => setIsGuestCheckout(true)} 
                                                    className="text-gray-600 hover:text-blue-600 font-semibold underline decoration-2 underline-offset-4 transition-colors"
                                                >
                                                    Continue as Guest
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-5">
                                                <div className="flex items-center justify-between pb-4 border-b">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <p className="font-semibold text-gray-900">Guest Checkout</p>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setIsGuestCheckout(false)} 
                                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                                                    >
                                                        ← Sign In Instead
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="user_name" className="text-gray-700 font-medium flex items-center gap-2">
                                                            Full Name <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input 
                                                            id="user_name" 
                                                            name="user_name" 
                                                            value={formData.user_name} 
                                                            onChange={handleInputChange} 
                                                            placeholder="Enter your full name"
                                                            className="mt-2 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            required={isGuestCheckout} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="userphone" className="text-gray-700 font-medium flex items-center gap-2">
                                                            Phone Number <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input 
                                                            id="userphone" 
                                                            name="userphone" 
                                                            value={formData.userphone} 
                                                            onChange={handleInputChange}
                                                            placeholder="e.g., 01712345678"
                                                            className="mt-2 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            required={isGuestCheckout} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="address" className="text-gray-700 font-medium flex items-center gap-2">
                                                            Full Address <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input 
                                                            id="address" 
                                                            name="address" 
                                                            value={formData.address} 
                                                            onChange={handleInputChange}
                                                            placeholder="House, Road, Area, City"
                                                            className="mt-2 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            required={isGuestCheckout} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                            <div className="bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 p-5 sm:p-6">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold">Payment Method</h2>
                                </div>
                            </div>
                            <div className="p-8">
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                    <div className={`p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === '1' ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}>
                                        <div className="flex items-center space-x-3">
                                            <RadioGroupItem value="1" id="cash" />
                                            <Label htmlFor="cash" className="flex-1 cursor-pointer font-medium text-gray-900">
                                                Cash on Delivery
                                            </Label>
                                            <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                Most Popular
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === '2' ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}>
                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem value="2" id="bkash" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="bkash" className="cursor-pointer font-medium text-gray-900 flex items-center gap-2">
                                                    bKash Payment
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/BKash_logo.svg/320px-BKash_logo.svg.png" alt="bKash" className="h-5" />
                                                </Label>
                                                <p className="text-xs text-orange-600 mt-1 font-medium">+ {bkashChargePercentage}% processing fee</p>
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                                
                                {paymentMethod === '2' && (
                                    <div className="mt-6 p-6 border-t-2 border-gray-200 space-y-5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
                                        <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-orange-200">
                                            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Payment Instructions</p>
                                                <p className="text-sm text-gray-600 mt-1">Send money to <strong className="text-gray-900">01xxxxxxxxx</strong> and provide transaction details below</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="paymentphone" className="text-gray-700 font-medium">Your bKash Number</Label>
                                            <Input 
                                                id="paymentphone" 
                                                name="paymentphone" 
                                                value={formData.paymentphone} 
                                                onChange={handleInputChange} 
                                                placeholder="01712345678"
                                                className="mt-2 h-12 rounded-xl"
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="trxed" className="text-gray-700 font-medium">Transaction ID (TrxID)</Label>
                                            <Input 
                                                id="trxed" 
                                                name="trxed" 
                                                value={formData.trxed} 
                                                onChange={handleInputChange}
                                                placeholder="Enter your TrxID"
                                                className="mt-2 h-12 rounded-xl"
                                                required 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 sticky top-24 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                            <div className="bg-gradient-to-r from-green-600 via-green-600 to-teal-600 p-5 sm:p-6">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold">Order Summary</h2>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Cart Items */}
                                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900 whitespace-nowrap">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Section */}
                                <div className="space-y-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                                    <div className="flex items-center gap-2 text-orange-700">
                                        <Tag className="h-5 w-5" />
                                        <Label htmlFor="coupon" className="font-semibold">Have a Coupon?</Label>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input 
                                            id="coupon" 
                                            value={couponCode} 
                                            onChange={(e) => setCouponCode(e.target.value)} 
                                            placeholder="Enter code"
                                            className="h-11 rounded-xl border-orange-200 focus:border-orange-400"
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={handleApplyCoupon} 
                                            disabled={isCouponLoading}
                                            className="bg-orange-600 hover:bg-orange-700 rounded-xl px-6"
                                        >
                                            {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                                        </Button>
                                    </div>
                                    {couponError && (
                                        <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {couponError}
                                        </p>
                                    )}
                                    {coupon && (
                                        <p className="text-green-700 text-xs font-semibold flex items-center gap-1 bg-green-100 p-2 rounded-lg">
                                            <CheckCircle className="h-3 w-3" />
                                            Coupon applied successfully!
                                        </p>
                                    )}
                                </div>

                                {/* Shipping Options */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Truck className="h-5 w-5" />
                                        <h3 className="font-semibold">Shipping Method</h3>
                                    </div>
                                    <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-3">
                                        <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingOption === 'localPickup' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                                            <div className="flex items-start space-x-3">
                                                <RadioGroupItem value="localPickup" id="localPickup" className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor="localPickup" className="font-semibold cursor-pointer text-gray-900 flex items-center gap-2">
                                                        Local Pickup
                                                        <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">FREE</span>
                                                    </Label>
                                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Pocket Gate, Road 08, Block C, Bashundhara R/A, Dhaka - 1229</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingOption === 'insideDhaka' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <RadioGroupItem value="insideDhaka" id="insideDhaka" />
                                                    <Label htmlFor="insideDhaka" className="cursor-pointer font-medium text-gray-900">Inside Dhaka</Label>
                                                </div>
                                                <span className="font-semibold text-gray-900">৳{orderInfo?.insideDhaka || '...'}</span>
                                            </div>
                                        </div>
                                        <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingOption === 'outsideDhaka' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <RadioGroupItem value="outsideDhaka" id="outsideDhaka" />
                                                    <Label htmlFor="outsideDhaka" className="cursor-pointer font-medium text-gray-900">Outside Dhaka</Label>
                                                </div>
                                                <span className="font-semibold text-gray-900">৳{orderInfo?.outsideDhaka || '...'}</span>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">৳{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">{shippingCharge === 0 ? 'FREE' : `৳${shippingCharge.toLocaleString()}`}</span>
                                    </div>
                                    {coupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span className="flex items-center gap-1">
                                                <Tag className="h-4 w-4" />
                                                Discount
                                            </span>
                                            <span className="font-semibold">- ৳{discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {paymentMethod === '2' && bkashCharge > 0 && (
                                        <div className="flex justify-between text-orange-600">
                                            <span className="text-sm">bKash Fee ({bkashChargePercentage}%)</span>
                                            <span className="font-semibold">৳{bkashCharge.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Grand Total */}
                                <div className="pt-4 border-t-2 border-gray-300">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-blue-600">৳{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                {/* Error Alert */}
                                {orderError && (
                                    <Alert variant="destructive" className="border-2 border-red-400 bg-red-50">
                                        <AlertCircle className="h-5 w-5" />
                                        <AlertDescription className="font-semibold text-red-800">{orderError}</AlertDescription>
                                    </Alert>
                                )}
                                
                                {/* Place Order Button */}
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl transition-all" 
                                    disabled={isPlacingOrder || cartItems.length === 0}
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-5 w-5 mr-2" />
                                            Place Secure Order
                                        </>
                                    )}
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-4 w-4 text-green-600" />
                                        <span>Secure Payment</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-300"></div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                        <span>Safe Checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;