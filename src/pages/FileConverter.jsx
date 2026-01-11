import { useState, useRef } from 'react';
import axios from 'axios';
import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  FileText, 
  ArrowRight, 
  Download, 
  Upload, 
  X, 
  FileType, 
  Loader2,
  FileJson,
  FileCode,
  Table
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const FileConverter = () => {
  const { user } = useUser();
  const clerk = useClerk();
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const formats = {
    'pdf': { label: 'PDF Document', icon: FileType, creates: ['txt', 'docx'] },
    'docx': { label: 'Word Document', icon: FileText, creates: ['pdf', 'txt', 'html'] },
    'txt': { label: 'Text File', icon: FileText, creates: ['pdf', 'docx'] },
    'md': { label: 'Markdown', icon: FileCode, creates: ['html'] },
    'html': { label: 'HTML', icon: FileCode, creates: ['md'] },
    'csv': { label: 'CSV Spreadsheet', icon: Table, creates: ['json'] },
    'json': { label: 'JSON Data', icon: FileJson, creates: ['csv'] }
  };

  const getExtension = (filename) => filename.split('.').pop().toLowerCase();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const ext = getExtension(selected.name);
      if (!formats[ext]) {
        setError(`.${ext} files are not supported yet.`);
        return;
      }
      setFile(selected);
      setTargetFormat(formats[ext].creates[0]); // Default to first option
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    if (selected) {
      const ext = getExtension(selected.name);
      if (!formats[ext]) {
        setError(`.${ext} files are not supported yet.`);
        return;
      }
      setFile(selected);
      setTargetFormat(formats[ext].creates[0]);
      setError('');
    }
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;

    if (!user) {
      clerk.openSignIn();
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('clerkId', user.id);
    formData.append('targetFormat', targetFormat);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/convert`, formData, {
        responseType: 'blob'
      });

      // Download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Construct filename: original_name_no_ext.target
      const name = file.name.substring(0, file.name.lastIndexOf('.'));
      link.setAttribute('download', `${name}.${targetFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Update credits via event
      window.dispatchEvent(new Event('credit_update'));

    } catch (err) {
      console.error('Conversion failed:', err);
      // Try to read blob as text to get error message
      if (err.response && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          setError(json.error || 'Conversion failed');
        } catch {
          setError('Conversion failed');
        }
      } else {
         setError('Failed to convert file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileType className="w-8 h-8 text-indigo-600" />
          </div>
          Universal File Converter
        </h1>
        <p className="text-slate-600 mt-2">
          Convert between PDF, Word, Text, Markdown, JSON, and CSV formats instantly.
        </p>
      </div>

      <Card className="p-8">
        {!file ? (
          <div 
            className="border-2 border-dashed border-slate-300 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50 transition-all"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Click or Drag file here</h3>
            <p className="text-slate-500 text-sm mt-1">Supports PDF, DOCX, MD, CSV, JSON</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt,.md,.html,.csv,.json"
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* File Selection */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{file.name}</h4>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setError(''); }}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Conversion Options */}
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
               <div className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg uppercase text-sm">
                 {getExtension(file.name)}
               </div>
               <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 md:rotate-0" />
               <div className="w-full md:w-48">
                 <select
                   value={targetFormat}
                   onChange={(e) => setTargetFormat(e.target.value)}
                   className="w-full px-4 py-2Rounded-lg border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                 >
                   {formats[getExtension(file.name)]?.creates.map(fmt => (
                     <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                   ))}
                 </select>
               </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <Button
              onClick={handleConvert}
              loading={loading}
              className="w-full h-14 text-lg"
              icon={<Download className="w-5 h-5" />}
            >
              {loading ? 'Converting...' : 'Convert & Download (1 Credit)'}
            </Button>
          </div>
        )}
      </Card>
      
      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(formats).slice(0, 4).map(([ext, info]) => (
          <div key={ext} className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
            <info.icon className="w-5 h-5 text-slate-400" />
            <div className="text-sm">
              <div className="font-medium text-slate-700">.{ext}</div>
              <div className="text-xs text-slate-400">to {info.creates.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileConverter;
