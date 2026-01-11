import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Upload, FileText, Copy, CheckCircle, AlertCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

const PdfToText = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Please upload a valid PDF file');
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pdf/to-text`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setText(response.data.text);
        setMetadata(response.data.info);
      }
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('Failed to convert PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'Accurate Extraction',
      description: 'Maintains original text structure',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Cost: 1 Credit',
      description: 'Each page costs 1 credit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Metadata Support',
      description: 'Extracts page count and version info',
      color: 'from-purple-500 to-indigo-500'
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-200 mb-6"
        >
          <FileText className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          PDF to Text Converter
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Extract editable text from any PDF document instantly
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
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 group cursor-pointer relative min-h-[250px] flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-4 pointer-events-none">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-slate-900 font-bold text-lg block mb-1">
                        {file ? file.name : 'Click to Upload PDF'}
                      </span>
                      <span className="text-slate-500 text-sm">
                        Supported formats: PDF (Max 10MB)
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={!file || loading}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<FileText className="w-5 h-5" />}
                >
                  {loading ? 'Extracting Text...' : 'Extract Text'}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Result Section */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-900 font-bold text-lg">Extracted Content</h3>
                  {text && (
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    >
                      {copied ? 'Copied!' : 'Copy Text'}
                    </Button>
                  )}
                </div>

                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 overflow-y-auto max-h-[500px]">
                  {text ? (
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                      {text}
                    </p>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                      <FileText className="w-16 h-16 opacity-30" />
                      <p className="font-medium">Extracted text will appear here</p>
                    </div>
                  )}
                </div>

                {metadata && (
                  <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Pages: {metadata.pages}</span>
                    <span>PDF Version: {metadata.version}</span>
                  </div>
                )}
              </div>
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

export default PdfToText;
