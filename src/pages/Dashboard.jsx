import { 
  PenTool, 
  Wand2, 
  Search, 
  TrendingUp, 
  FileText, 
  Repeat, 
  Image as ImageIcon, 
  FileType, 
  Eraser, 
  ArrowRight,
  Sparkles,
  Zap,
  LayoutTemplate
} from 'lucide-react';
import { motion } from 'framer-motion';

const ToolCard = ({ icon: Icon, title, description, badge, onClick, color, delay, featured }) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: delay }}
    onClick={onClick}
    className={`group relative p-6 border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-left w-full h-full flex flex-col ${
      featured 
        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 border-transparent text-white ring-4 ring-indigo-50/50' 
        : 'bg-white border-slate-100 hover:shadow-indigo-100/50'
    }`}
  >
    {badge && (
      <span className={`absolute top-4 right-4 text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm ${
        featured ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-indigo-100 text-indigo-700'
      }`}>
        {badge}
      </span>
    )}
    
    <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
      featured ? 'bg-white/10 backdrop-blur-md text-white' : `${color}`
    }`}>
      <Icon className="w-7 h-7" />
    </div>

    <div className="mt-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-lg font-bold transition-colors ${
          featured ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600'
        }`}>
          {title}
        </h3>
        <ArrowRight className={`w-5 h-5 transform group-hover:translate-x-1 transition-all ${
          featured ? 'text-white/50 group-hover:text-white' : 'text-slate-300 group-hover:text-indigo-600'
        }`} />
      </div>
      <p className={`text-sm leading-relaxed ${
        featured ? 'text-indigo-100' : 'text-slate-500 group-hover:text-slate-600'
      }`}>
        {description}
      </p>
    </div>
  </motion.button>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="mb-6 flex items-end gap-3 pb-2">
    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

const Dashboard = ({ onNavigate }) => {
  const sections = [
    {
      id: "featured",
      type: "grid", 
      tools: [
        { id: 'image-generator', icon: Sparkles, title: 'AI Image Generator', description: 'Turn text into stunning visual art in seconds.', color: 'bg-purple-50 text-purple-600', badge: 'Hot', featured: true },
        { id: 'bg-remover', icon: Eraser, title: 'Background Remover', description: 'Instantly remove backgrounds from any photo.', color: 'bg-pink-50 text-pink-600', badge: 'New', featured: true },
        { id: 'file-converter', icon: FileType, title: 'Universal Converter', description: 'Convert PDF, DOCX, MD, CSV freely.', color: 'bg-blue-50 text-blue-600', badge: 'Pro', featured: true },
      ]
    },
    {
      title: "Visual Studio",
      description: "Create, edit, and enhance images",
      icon: ImageIcon,
      tools: [
        { id: 'image-generator', icon: Sparkles, title: 'Text to Image', description: 'Generate unique images from prompts', color: 'bg-purple-50 text-purple-600' },
        { id: 'bg-remover', icon: Eraser, title: 'Background Remover', description: 'Clean product photos instantly', color: 'bg-pink-50 text-pink-600' },
        { id: 'caption-generator', icon: Type, title: 'Caption Generator', description: 'Perfect captions for social media', color: 'bg-teal-50 text-teal-600' },
        { id: 'image-converter', icon: ImageIcon, title: 'Image Converter', description: 'Optimize format and size', color: 'bg-cyan-50 text-cyan-600', badge: 'Soon' },
      ]
    },
    {
      title: "Writer's Room",
      description: "Generate and polish text content",
      icon: PenTool,
      tools: [
        { id: 'generator', icon: PenTool, title: 'Article Generator', description: 'SEO-ready blog posts', color: 'bg-indigo-50 text-indigo-600' },
        { id: 'humanizer', icon: Wand2, title: 'AI Humanizer', description: 'Make AI text sound natural', color: 'bg-emerald-50 text-emerald-600' },
        { id: 'seo', icon: TrendingUp, title: 'SEO Optimizer', description: 'Rank higher on Google', color: 'bg-orange-50 text-orange-600' },
        { id: 'paraphrase', icon: Repeat, title: 'Paraphraser', description: 'Rewrite in different tones', color: 'bg-blue-50 text-blue-600' },
        { id: 'grammar', icon: FileText, title: 'Grammar Polish', description: 'Fix errors and flow', color: 'bg-rose-50 text-rose-600' },
        { id: 'plagiarism', icon: Search, title: 'Plagiarism Scan', description: 'Ensure 100% originality', color: 'bg-slate-50 text-slate-600' },
      ]
    },
    {
      title: "Editor's Desk",
      description: "Document and file utilities",
      icon: FileType,
      tools: [
        { id: 'file-converter', icon: FileType, title: 'Universal Converter', description: 'PDF to Word, Markdown, etc.', color: 'bg-blue-50 text-blue-600' },
        { id: 'pdf-to-text', icon: FileText, title: 'PDF to Text', description: 'Extract raw text from PDFs', color: 'bg-red-50 text-red-600' },
        { id: 'text-to-pdf', icon: FileText, title: 'Text to PDF', description: 'Create PDFs from text', color: 'bg-rose-50 text-rose-600' },
      ]
    }
  ];

  // Helper to deduplicate IDs if we show them in Featured AND category?
  // Actually, featured ones are shortcuts. It's okay to have them twice or just have text versions below.
  // I will hide duplicates from the category lists if they are in featured? No, usually users expect to find them in the category too.
  // I'll show "Featured" at the top as big cards, and compact versions below?
  // Let's simpler: The top "Featured" are the "Star" tools. The categories list EVERYTHING.

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center pt-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide mb-4">
          <Zap className="w-3.5 h-3.5" />
          Creative Suite v2.0
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          What will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">create</span> today?
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Access our most powerful AI tools to generate images, remove backgrounds, write articles, and convert files instantly.
        </p>
      </motion.div>

      {/* Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {sections[0].tools.map((tool, idx) => (
          <ToolCard
            key={`featured-${tool.id}`}
            {...tool}
            delay={idx * 0.1}
            onClick={() => onNavigate(tool.id)}
          />
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-16">
        {sections.slice(1).map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <SectionHeader {...section} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.tools.map((tool, toolIdx) => (
                <ToolCard
                  key={tool.id}
                  {...tool}
                  delay={(sectionIdx * 0.1) + (toolIdx * 0.05)}
                  onClick={() => onNavigate(tool.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Import Type for icon usage
import { Type } from 'lucide-react';

export default Dashboard;
