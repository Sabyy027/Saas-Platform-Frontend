import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Shield, Copy, CheckCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Textarea from './components/ui/Textarea';

const PlagiarismChecker = () => {
  const { user } = useUser();
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setError('');
    setResult(null);

    if (!user) {
      setError('Please sign in to check plagiarism');
      return;
    }

    if (!inputText.trim()) {
      setError('Please enter text to check');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/check-plagiarism`,
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
        setResult(response.data.report);
        setInputText('');
      }
    } catch (err) {
      console.error('Error checking plagiarism:', err);
      if (err.response?.status === 403) {
        setError('Insufficient Credits. Please purchase more credits.');
      } else {
        setError(err.response?.data?.message || 'Failed to check plagiarism. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'Comprehensive Scan',
      description: 'Scans billions of web pages',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Cost: 2 Credits',
      description: 'Each check uses 2 credits',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Detailed Report',
      description: 'Get similarity percentage and sources',
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl shadow-lg shadow-emerald-200 mb-6"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Plagiarism Checker
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Scan your content against billions of web pages to ensure originality
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
            <Textarea
              label="Paste your text here to check for plagiarism..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the text you want to scan for plagiarism..."
              rows={10}
              helperText={`${inputText.length}/5000 characters`}
              error={error}
            />

            {/* Check Button */}
            <Button
              onClick={handleCheck}
              disabled={loading || !inputText.trim()}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full mt-6"
              icon={<Shield className="w-5 h-5" />}
            >
              {loading ? 'Checking Plagiarism...' : 'Check Plagiarism'}
            </Button>

            {/* Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Plagiarism Report</h2>
                  
                  {/* Similarity Score */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-600 font-medium">Similarity Score</span>
                      <span className={`text-2xl font-bold ${
                        result.similarityPercentage > 30 ? 'text-red-600' :
                        result.similarityPercentage > 15 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {result.similarityPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          result.similarityPercentage > 30 ? 'bg-red-600' :
                          result.similarityPercentage > 15 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${result.similarityPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Sources */}
                  {result.sources && result.sources.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Matching Sources:</h3>
                      <div className="space-y-2">
                        {result.sources.map((source, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg border border-slate-200">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                            >
                              {source.title || source.url}
                            </a>
                            <p className="text-slate-500 text-xs mt-1">Match: {source.percentage}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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

export default PlagiarismChecker;
