import { useState, useRef } from 'react';
import axios from 'axios';
import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  Eraser, 
  Upload, 
  Download, 
  X, 
  Sparkles, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const BackgroundRemover = () => {
  const { user } = useUser();
  const clerk = useClerk();
  const [file, setFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, WebP)');
        return;
      }
      setFile(selected);
      setProcessedImage(null);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, WebP)');
        return;
      }
      setFile(selected);
      setProcessedImage(null);
      setError('');
    }
  };

  const handleRemoveBg = async () => {
    if (!file) return;
    if (!user) {
      clerk.openSignIn();
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('clerkId', user.id);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/image/remove-bg`, formData);

      if (response.data.success) {
        setProcessedImage(response.data.image);
        window.dispatchEvent(new Event('credit_update'));
      }
    } catch (err) {
      console.error('BG Removal failed:', err);
      setError(err.response?.data?.details || 'Failed to remove background');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `nobg-${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Eraser className="w-8 h-8 text-indigo-600" />
          </div>
          Background Remover
        </h1>
        <p className="text-slate-600 mt-2">
          Instantly remove backgrounds from your photos using AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload / Original Image */}
        <Card className="p-6">
           <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
             <ImageIcon className="w-5 h-5 text-slate-500" />
             Original Image
           </h3>
           
           {!file ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl h-80 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="font-medium text-slate-900">Upload Image</p>
              <p className="text-slate-500 text-sm mt-1">PNG, JPG up to 5MB</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
           ) : (
             <div className="relative h-80 bg-slate-100 rounded-xl overflow-hidden group">
               <img 
                 src={URL.createObjectURL(file)} 
                 alt="Original" 
                 className="w-full h-full object-contain"
               />
               <button 
                 onClick={() => { setFile(null); setProcessedImage(null); }}
                 className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-slate-600"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
           )}

           <div className="mt-6">
             <Button
               onClick={handleRemoveBg}
               disabled={!file || loading}
               loading={loading}
               className="w-full h-12 text-lg"
               icon={<Sparkles className="w-5 h-5" />}
             >
               {loading ? 'Processing...' : 'Remove Background (5 Credits)'}
             </Button>
             {error && (
               <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
             )}
           </div>
        </Card>

        {/* Result Image */}
        <Card className="p-6">
           <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
             <Eraser className="w-5 h-5 text-indigo-500" />
             Result
           </h3>

           <div className="h-80 bg-[url('https://media.istockphoto.com/id/1146663236/vector/checkerboard-background-checker-box-pattern-abstract-seamless-checkered-texture-vector.jpg?s=612x612&w=0&k=20&c=L_qgI3oI2oM6N_I_X8DkGg2_tC9_wbq9YxVw6_Vw8_w=')] bg-cover rounded-xl overflow-hidden flex items-center justify-center border border-slate-200">
             {loading ? (
               <div className="text-center bg-white/90 p-6 rounded-2xl shadow-sm backdrop-blur">
                 <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
                 <p className="font-medium text-slate-700">Removing background...</p>
                 <p className="text-xs text-slate-500 mt-1">Downloading AI model (first run slow)</p>
               </div>
             ) : processedImage ? (
               <img 
                 src={processedImage} 
                 alt="No Background" 
                 className="w-full h-full object-contain" 
               />
             ) : (
               <div className="text-center text-slate-500 bg-white/80 p-6 rounded-xl backdrop-blur">
                 <p>Processed image will appear here</p>
               </div>
             )}
           </div>

           <div className="mt-6">
             <Button
               onClick={handleDownload}
               disabled={!processedImage}
               variant="outline"
               className="w-full h-12 text-lg"
               icon={<Download className="w-5 h-5" />}
             >
               Download Result
             </Button>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default BackgroundRemover;
