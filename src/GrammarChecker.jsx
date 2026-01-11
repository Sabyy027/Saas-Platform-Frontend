import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { CheckCircle2, Copy, CheckCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Textarea from './components/ui/Textarea';

const GrammarChecker = () => {
  const { user } = useUser();
  const [inputText, setInputText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCheck = async () => {
    setError('');
    setCorrectedText('');

    if (!user) {
      setError('Please sign in to check grammar');
      return;
    }

    if (!inputText.trim()) {
      setError('Please enter text to check');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/check-grammar`,
        {
          clerkId: user.id,
          text: inputText.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setCorrectedText(response.data.correctedText);
        setInputText('');
      }
    } catch (err) {
      console.error('Error checking grammar:', err);
      if (err.response?.status === 403) {
        setError('Insufficient Credits. Please purchase more credits.');
      } else {
        setError(err.response?.data?.message || 'Failed to check grammar. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(correctedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'Advanced Grammar',
      description: 'Detects complex grammar errors',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Cost: 1 Credit',
      description: 'Each check uses 1 credit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Style Improvement',
      description: 'Enhances writing clarity and flow',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-green-600 to-emerald-600 rounded-2xl shadow-lg shadow-green-200 mb-6"
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Grammar & Style Checker
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Perfect your writing with advanced grammar and style corrections
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="elevated" className="mb-8">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div>
                <Textarea
                  label="Text to Check"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here to check for grammar and style issues..."
                  rows={12}
                  helperText={`${inputText.length}/5000 characters`}
                  error={error}
                />
              </div>

              {/* Output Section */}
              <div>
                <label className="block text-slate-900 font-semibold mb-3 text-sm">
                  Corrected Text
                </label>
                <AnimatePresence mode="wait">
                  {correctedText ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative"
                    >
                      <textarea
                        value={correctedText}
                        readOnly
                        className="w-full h-[280px] px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 resize-none focus:outline-none"
                      />
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-slate-400">
                        Corrected text will appear here
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Check Button */}
            <Button
              onClick={handleCheck}
              disabled={loading || !inputText.trim()}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full mt-6"
              icon={<CheckCircle2 className="w-5 h-5" />}
            >
              {loading ? 'Checking Grammar...' : 'Check Grammar & Style'}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tips Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card hoverable className="h-full">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-4 shadow-lg`}>
                <tip.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">{tip.title}</h3>
              <p className="text-slate-500 text-sm">{tip.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GrammarChecker;
