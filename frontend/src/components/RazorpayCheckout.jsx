import React, { useState } from 'react';
import axios from 'axios';

// Ensure you have configured the .NET Microservice URL
const PAYMENT_API_URL = 'http://localhost:5001/api/payment'; 
const SPRING_BOOT_API_URL = 'http://localhost:8080/api/orders'; // Adjust as needed

const RazorpayCheckout = ({ amount, onPaymentSuccess, userDetails }) => {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await loadRazorpayScript();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 1. Create Order via .NET Microservice
            const result = await axios.post(`${PAYMENT_API_URL}/create-order`, {
                amount: amount // Amount in INR
            });

            if (!result) {
                alert('Server error. Are you online?');
                setLoading(false);
                return;
            }

            const { amount: orderAmount, orderId, keyId } = result.data;

            const options = {
                key: keyId, 
                amount: orderAmount.toString(),
                currency: 'INR',
                name: 'Kitchen Cloud',
                description: 'Order Payment',
                order_id: orderId,
                handler: async function (response) {
                    const data = {
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    };

                    // 2. Verify Payment via .NET Microservice
                    const verifyRes = await axios.post(`${PAYMENT_API_URL}/verify-payment`, data);

                    if (verifyRes.data.status === 'success') {
                         // 3. Notify Spring Boot Backend (Optional but recommended)
                         try {
                             await axios.post(`${SPRING_BOOT_API_URL}/place-order`, {
                                 paymentId: data.paymentId,
                                 orderDetails: userDetails, // Pass necessary details
                                 status: 'PAID'
                             });
                             alert('Payment Successful and Order Placed!');
                             if (onPaymentSuccess) onPaymentSuccess(data);
                         } catch (err) {
                             console.error("Order placement failed", err);
                             alert("Payment successful but order placement failed via Spring Boot.");
                         }
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: userDetails?.name || "User Name",
                    email: userDetails?.email || "user@example.com",
                    contact: userDetails?.phone || "9999999999",
                },
                notes: {
                    address: "Kitchen Cloud Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert("Error in payment flow");
        }
        setLoading(false);
    };

    return (
        <button 
            onClick={handlePayment} 
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
            {loading ? 'Processing...' : 'Proceed to Pay'}
        </button>
    );
};

export default RazorpayCheckout;
