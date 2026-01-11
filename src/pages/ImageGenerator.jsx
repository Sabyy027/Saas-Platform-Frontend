import { useState } from 'react';
import axios from 'axios';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Download, ImageIcon, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';

const ImageGenerator = () => {
  const { user } = useUser();
  const clerk = useClerk();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const styles = [
    { id: 'photorealistic', label: 'Photorealistic' },
    { id: 'anime', label: 'Anime/Manga' },
    { id: 'digital-art', label: 'Digital Art' },
    { id: 'oil-painting', label: 'Oil Painting' },
    { id: 'isometric', label: 'Isometric 3D' },
    { id: 'cinematic', label: 'Cinematic' }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!user) {
      clerk.openSignIn();
      return;
    }

    setLoading(true);
    setError('');
    setImage(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/image/generate`, {
        clerkId: user.id,
        prompt: prompt,
        style: style
      });

      if (response.data.success) {
        setImage(response.data.image);
        // Dispatch credit update
        window.dispatchEvent(new Event('credit_update'));
      }
    } catch (err) {
      console.error('Generation failed:', err);
      const msg = err.response?.data?.details || err.response?.data?.error || 'Failed to generate image. Try again.';
      if (msg.includes('Insufficient credits')) {
        setError('Not enough credits! Please upgrade your plan.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <ImageIcon className="w-8 h-8 text-indigo-600" />
          </div>
          AI Image Generator
        </h1>
        <p className="text-slate-600 mt-2">
          Turn your text descriptions into stunning images using Google's Imagen 3.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <Card>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What would you like to create?
                </label>
                <div className="relative">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A futuristic city with flying cars at sunset..."
                    className="h-32 resize-none text-lg"
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                    {prompt.length}/500
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Choose a Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                        style === s.id
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium ring-1 ring-indigo-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !prompt.trim()}
                loading={loading}
                className="w-full h-12 text-lg"
                icon={<Wand2 className="w-5 h-5" />}
              >
                {loading ? 'Generating...' : 'Generate Image (5 Credits)'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:h-full">
          <Card className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50/50 border-dashed border-2 border-slate-200 relative overflow-hidden group">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
                    <div className="relative z-10 w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-500 font-medium animate-pulse">Creating your masterpiece...</p>
                  <p className="text-xs text-slate-400 mt-2">This may take 10-15 seconds</p>
                </motion.div>
              ) : image ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full h-full flex flex-col"
                >
                  <img
                    src={image}
                    alt={prompt}
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="p-2 bg-white/90 backdrop-blur text-slate-700 rounded-lg shadow hover:bg-white transition-all"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-6 text-slate-400"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-lg font-medium text-slate-500">Ready to Visualize</p>
                  <p className="text-sm mt-1">Enter a prompt and choose a style to begin.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
