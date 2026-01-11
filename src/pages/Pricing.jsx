import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import { Check, CreditCard, Loader2, Zap, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Load Razorpay Script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const { user } = useUser();
  const clerk = useClerk();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [purchasedCredits, setPurchasedCredits] = useState(0);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for trying out our AI tools',
      price: 99,
      credits: 50,
      features: [
        '50 AI Credits',
        'Basic Generators',
        'Standard Support',
        'Email Support',
        'Basic Analytics'
      ],
      color: 'from-indigo-500 to-purple-500',
      popular: false,
      icon: Sparkles
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      description: 'Best for professionals and creators',
      price: 199,
      credits: 120,
      features: [
        '120 AI Credits',
        'All AI Tools',
        'SEO Optimizer',
        'Priority Support',
        'Advanced Analytics',
        'API Access',
        'Custom Templates'
      ],
      color: 'from-indigo-600 to-purple-600',
      popular: true,
      icon: Star
    },
    {
      id: 'enterprise',
      name: 'Power User',
      description: 'For teams and power users',
      price: 499,
      credits: 500,
      features: [
        '500 AI Credits',
        'Everything Unlocked',
        'Bulk Processing',
        '24/7 Support',
        'Dedicated Manager',
        'Custom Integration',
        'White-label Options'
      ],
      color: 'from-indigo-700 to-purple-700',
      popular: false,
      icon: Zap
    }
  ];

  const handlePurchase = async (plan) => {
    setError('');
    
    if (!user) {
      clerk.openSignIn();
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Razorpay SDK failed to load. Check your connection.');
      return;
    }

    setLoading(true);

    try {
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { amount: plan.price }
      );

      if (!orderResponse.data.success) {
        throw new Error('Order creation failed');
      }

      const { order } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AI SaaS Platform",
        description: `Purchase ${plan.credits} Credits`,
        image: user.imageUrl, 
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                clerkId: user.id,
                credits: plan.credits,
                userData: {
                   email: user.primaryEmailAddress?.emailAddress,
                   firstName: user.firstName,
                   lastName: user.lastName,
                   photoUrl: user.imageUrl
                }
              }
            );

            if (verifyResponse.data.success) {
              setPurchasedCredits(plan.credits);
              setPaymentStatus('success');
              // Refresh credits in Sidebar
              window.dispatchEvent(new Event('credit_update'));
            } else {
              setPaymentStatus('error');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setPaymentStatus('error');
          }
        },
        prefill: {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          contact: ""
        },
        theme: {
          color: "#6366f1"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Payment initialization failed:', err);
      const errorMessage = err.response?.data?.details || err.message || 'Failed to start payment';
      setError(`Payment Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-indigo-700 text-sm font-semibold">Simple, Transparent Pricing</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Choose Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Perfect Plan</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Pay with Razorpay. Top up your credits instantly and start creating amazing content.
        </p>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-full"
        >
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              billingCycle === 'yearly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Pricing Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-8 mb-16"
      >
        {plans.map((plan, index) => {
          const price = billingCycle === 'yearly' ? Math.round(plan.price * 12 * 0.8) : plan.price;
          
          return (
          <motion.div
            key={plan.id}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
            )}

            <Card
              variant={plan.popular ? 'elevated' : 'default'}
              className={`h-full ${
                plan.popular 
                  ? 'border-2 border-indigo-200 shadow-xl shadow-indigo-100' 
                  : ''
              }`}
              hoverable={false}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                <plan.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-900">₹{price}</span>
                  <span className="text-slate-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {plan.credits} AI Credits {billingCycle === 'yearly' ? '(per month)' : 'included'}
                </p>
              </div>

              <div className={`h-1 w-full bg-gradient-to-r ${plan.color} rounded-full mb-8`}></div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-r ${plan.color}`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePurchase(plan)}
                disabled={loading}
                loading={loading}
                variant={plan.popular ? 'primary' : 'outline'}
                size="lg"
                className="w-full"
                icon={<CreditCard className="w-5 h-5" />}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </Button>
            </Card>
          </motion.div>
          );
        })}
      </motion.div>

      {/* Trust Badge */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pb-16"
      >
        <div className="inline-flex items-center gap-2 text-slate-500">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span className="font-medium">Secured by Razorpay. 100% Safe Payment.</span>
        </div>
      </motion.div>

      {/* Payment Status Modal */}
      <AnimatePresence>
        {paymentStatus !== 'idle' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-slate-100 relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                paymentStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {paymentStatus === 'success' ? (
                  <Check className="w-10 h-10 text-green-600" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </h3>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                {paymentStatus === 'success' 
                  ? `${purchasedCredits} AI credits have been added to your account.`
                  : 'There was an issue verifying your payment. Please try again or contact support.'
                }
              </p>

              <Button 
                onClick={() => setPaymentStatus('idle')}
                className="w-full py-4 text-lg"
                variant={paymentStatus === 'success' ? 'primary' : 'outline'}
              >
                {paymentStatus === 'success' ? 'Start Creating' : 'Close'}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;
