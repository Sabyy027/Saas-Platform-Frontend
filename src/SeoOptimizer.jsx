import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Search, Lightbulb, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Textarea from './components/ui/Textarea';
import Input from './components/ui/Input';

const SeoOptimizer = () => {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [optimizedContent, setOptimizedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async () => {
    setError('');
    setOptimizedContent('');

    if (!user) {
      setError('Please sign in to optimize content');
      return;
    }

    if (!content.trim()) {
      setError('Please enter content to optimize');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/optimize-seo`,
        {
          clerkId: user.id,
          content: content.trim(),
          keywords: keywords.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setOptimizedContent(response.data.optimizedContent);
        setContent('');
        setKeywords('');
      }
    } catch (err) {
      console.error('Error optimizing SEO:', err);
      if (err.response?.status === 403) {
        setError('Insufficient Credits. Please purchase more credits.');
      } else {
        setError(err.response?.data?.message || 'Failed to optimize content. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'Keyword Optimization',
      description: 'Smart keyword placement for better ranking',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Cost: 1 Credit',
      description: 'Each optimization uses 1 credit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'SEO Best Practices',
      description: 'Follows Google SEO guidelines',
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-2xl shadow-lg shadow-blue-200 mb-6"
        >
          <Search className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          SEO Optimizer
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Optimize your content for search engines and improve rankings
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
            <div className="space-y-6">
              <Input
                label="Target Keywords (comma separated)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., AI tools, content creation, SEO optimization"
                helperText="Enter keywords you want to rank for"
              />

              <Textarea
                label="Content to Optimize"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here for SEO optimization..."
                rows={10}
                helperText={`${content.length}/5000 characters`}
                error={error}
              />

              {/* Optimize Button */}
              <Button
                onClick={handleOptimize}
                disabled={loading || !content.trim()}
                loading={loading}
                variant="primary"
                size="lg"
                className="w-full"
                icon={<Search className="w-5 h-5" />}
              >
                {loading ? 'Optimizing Content...' : 'Optimize for SEO'}
              </Button>

              {/* Optimized Result */}
              {optimizedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Optimized Content</h2>
                  <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {optimizedContent}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
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

export default SeoOptimizer;
