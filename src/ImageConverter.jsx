import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Upload, Image as ImageIcon, Loader2, Download, AlertCircle, Lightbulb, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

const ImageConverter = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', format);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/image/convert`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `converted-image.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('Failed to convert image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tips = [
    {
      icon: Lightbulb,
      title: 'Multiple Formats',
      description: 'Support for PNG, JPG, WebP, and AVIF',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Fast Conversion',
      description: 'Lightning fast image processing',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'High Quality',
      description: 'Maintains original image quality',
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
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl shadow-lg shadow-indigo-200 mb-6"
        >
          <ImageIcon className="w-8 h-8 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Image Converter
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
          Convert images to PNG, JPG, WebP, or AVIF formats instantly
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
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-300 group cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-4 pointer-events-none">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-slate-900 font-bold text-lg block mb-1">
                        {file ? file.name : 'Click to Upload Image'}
                      </span>
                      <span className="text-slate-500 text-sm">
                        Supports: PNG, JPG, WebP, AVIF
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Convert to:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['png', 'jpeg', 'webp', 'avif'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all border ${
                          format === fmt
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={!file || loading}
                  loading={loading}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<Download className="w-5 h-5" />}
                >
                  {loading ? 'Converting...' : 'Convert & Download'}
                </Button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
                {previewUrl ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-[350px] max-w-full rounded-xl shadow-lg object-contain" 
                    />
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-400">
                    <ImageIcon className="w-16 h-16 opacity-30" />
                    <p className="font-medium">Image preview will appear here</p>
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

export default ImageConverter;
