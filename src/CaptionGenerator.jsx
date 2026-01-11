import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Upload, Type, Copy, CheckCircle, Sparkles, AlertCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

const CaptionGenerator = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [mood, setMood] = useState('creative');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError('');
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('mood', mood);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/image/caption`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success) {
        setCaption(response.data.caption);
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError('Failed to generate caption. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'AI Vision',
      description: 'Advanced image analysis technology',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Cost: 1 Credit',
      description: 'Each caption uses 1 credit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Viral Captions',
      description: 'Optimized for social media engagement',
      color: 'from-pink-500 to-rose-500'
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-600 to-rose-600 rounded-2xl shadow-lg shadow-pink-200 mb-6"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Social Caption Generator
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Generate viral captions for your photos using advanced AI analysis
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
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-pink-500 hover:bg-pink-50/50 transition-all duration-300 group cursor-pointer relative min-h-[300px] flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-[250px] rounded-lg shadow-sm object-contain" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 pointer-events-none">
                      <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-slate-900 font-bold text-lg block mb-1">
                          Click to Upload Photo
                        </span>
                        <span className="text-slate-500 text-sm">
                          Upload any image for analysis
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Select Mood:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Professional', 'Funny', 'Creative', 'Inspirational', 'Sarcastic', 'Minimal'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m.toLowerCase())}
                        className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all border ${
                          mood === m.toLowerCase()
                            ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:bg-slate-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!file || loading}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  {loading ? 'Analyzing Image...' : 'Generate Caption'}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Result Section */}
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-slate-900 font-bold text-lg">AI Generated Caption</h3>
                   {caption && (
                     <Button
                       onClick={copyToClipboard}
                       variant="outline"
                       size="sm"
                       icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     >
                       {copied ? 'Copied!' : 'Copy'}
                     </Button>
                   )}
                </div>
                
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                   {caption ? (
                     <motion.p 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="text-slate-800 text-xl font-medium leading-relaxed text-center font-serif italic"
                     >
                       "{caption}"
                     </motion.p>
                   ) : (
                     <div className="flex flex-col items-center gap-4 text-slate-400">
                       <Type className="w-16 h-16 opacity-30" />
                       <p className="font-medium">Generated caption will appear here</p>
                     </div>
                   )}
                </div>
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

export default CaptionGenerator;
