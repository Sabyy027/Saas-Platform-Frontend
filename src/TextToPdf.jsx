import { useState } from 'react';
import axios from 'axios';
import { FileDown, FileText, Loader2, Type, AlertCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import Textarea from './components/ui/Textarea';

const TextToPdf = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!text) {
      setError('Please enter some text to convert');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pdf/from-text`,
        { title, text },
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title || 'document'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (err) {
      console.error('Generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'Professional Formatting',
      description: 'Clean PDF layout generation',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Cost: 1 Credit',
      description: 'Each generation uses 1 credit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Custom Titles',
      description: 'Add custom titles to documents',
      color: 'from-red-500 to-orange-500'
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-600 to-orange-600 rounded-2xl shadow-lg shadow-red-200 mb-6"
        >
          <FileDown className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Text to PDF Generator
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Convert your text content into professional PDF documents instantly
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
                label="Document Title (Optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Project Proposal"
                icon={<Type className="w-5 h-5" />}
              />

              <Textarea
                label="Your Content"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your content here..."
                rows={12}
                error={error}
              />

               {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={loading || !text}
                loading={loading}
                variant="primary"
                size="lg"
                className="w-full"
                icon={<FileDown className="w-5 h-5" />}
              >
                {loading ? 'Generating PDF...' : 'Download PDF'}
              </Button>
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

export default TextToPdf;
