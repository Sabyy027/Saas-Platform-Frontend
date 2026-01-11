import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Copy, CheckCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Textarea from './components/ui/Textarea';
import { SkeletonText } from './components/ui/LoadingSpinner';

const ArticleGenerator = () => {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setError('');
    setArticle('');

    if (!user) {
      setError('Please sign in to generate articles');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a topic for your article');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/generate-article`,
        {
          clerkId: user.id,
          prompt: prompt.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setArticle(response.data.content);
        setCreditsRemaining(response.data.creditsRemaining);
        setPrompt('');
      }
    } catch (err) {
      console.error('Error generating article:', err);

      if (err.response?.status === 403) {
        setError('Insufficient Credits. Please purchase more credits to continue.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid request. Please check your input.');
      } else if (err.response?.status === 503) {
        setError('AI service is currently unavailable. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to generate article. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'Be Specific',
      description: 'Use detailed topics for better results',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: '1 Credit Per Article',
      description: 'Each generation uses one credit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Quick Generate',
      description: 'Press Ctrl+Enter for faster workflow',
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200 mb-6"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          AI Article Generator
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Transform your ideas into professional blog articles instantly
        </p>

        {creditsRemaining !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 inline-block px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-full"
          >
            <span className="text-indigo-700 font-semibold">
              Credits Remaining: {creditsRemaining}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="elevated" className="mb-8">
          {/* Input Section */}
          <div className="p-8 border-b border-slate-100">
            <Textarea
              label="What would you like to write about?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="E.g., The future of AI in healthcare, Benefits of meditation, How to start a podcast..."
              rows={5}
              helperText="Press Ctrl+Enter to generate or click the button below"
              error={error}
            />

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full mt-6"
              icon={<Sparkles className="w-5 h-5" />}
            >
              {loading ? 'Generating Article...' : 'Generate Article'}
            </Button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                <div className="space-y-6">
                  <div className="h-8 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
                  <SkeletonText lines={12} />
                </div>
              </div>
            </div>
          )}

          {/* Output Section */}
          <AnimatePresence>
            {article && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-8 bg-slate-50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Your Article</h2>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                <div className="prose prose-slate max-w-none">
                  <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-slate-900 mb-4 mt-6" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-900 mb-3 mt-5" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-slate-900 mb-2 mt-4" {...props} />,
                        p: ({ node, ...props }) => <p className="text-slate-600 mb-4 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2 ml-4" {...props} />,
                        ol: ({ node, ...props}) => <ol className="list-decimal list-inside text-slate-600 mb-4 space-y-2 ml-4" {...props} />,
                        li: ({ node, ...props }) => <li className="text-slate-600" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-slate-900 font-semibold" {...props} />,
                        em: ({ node, ...props }) => <em className="text-indigo-600" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-mono text-sm" {...props} />,
                      }}
                    >
                      {article}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!article && !loading && (
            <div className="p-12 text-center">
              <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">
                Enter a topic above and click generate to create your article
              </p>
            </div>
          )}
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

export default ArticleGenerator;
