import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Sparkles, PenTool, Wand2, Shield, ArrowRight, CheckCircle2, Zap, Users, Lock, HelpingHand } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Logo from './components/Logo';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import AnimatedBackground from './components/AnimatedBackground';
import ArticleGenerator from './ArticleGenerator';
import AIHumanizer from './AIHumanizer';
import PlagiarismChecker from './PlagiarismChecker';
import SeoOptimizer from './SeoOptimizer';
import GrammarChecker from './GrammarChecker';
import Paraphraser from './Paraphraser';
import PdfToText from './PdfToText';
import TextToPdf from './TextToPdf';
import ImageConverter from './ImageConverter';
import CaptionGenerator from './CaptionGenerator';
import ImageGenerator from './pages/ImageGenerator';
import FileConverter from './pages/FileConverter';
import BackgroundRemover from './pages/BackgroundRemover';

const Typewriter = () => {
  const words = ["Content Creation", "SEO Ranking", "Perfect Grammar", "PDF Workflow", "Creative Design"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText.length === word.length) {
          setTimeout(() => setIsDeleting(true), 2000); 
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <span className="inline-block min-w-[280px] text-left">
      <span className="text-indigo-600">
        {currentText}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-1 h-[0.9em] bg-indigo-600 ml-1 align-middle"
      />
    </span>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPricing, setShowPricing] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'generator': return <ArticleGenerator />;
      case 'humanizer': return <AIHumanizer />;
      case 'plagiarism': return <PlagiarismChecker />;
      case 'seo': return <SeoOptimizer />;
      case 'grammar': return <GrammarChecker />;
      case 'paraphrase': return <Paraphraser />;
      case 'pdf-to-text': return <PdfToText />;
      case 'text-to-pdf': return <TextToPdf />;
      case 'image-converter': return <ImageConverter />;
      case 'caption-generator': return <CaptionGenerator />;
      case 'image-generator': return <ImageGenerator />;
      case 'file-converter': return <FileConverter />;
      case 'bg-remover': return <BackgroundRemover />;
      case 'pricing': return <Pricing />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2, ease: "easeInOut" } },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <SignedOut>
        <div className="min-h-screen relative overflow-hidden flex flex-col">
          <AnimatedBackground />

          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer" 
                onClick={() => setShowPricing(false)}
              >
                <Logo className="w-12 h-auto" />
                <span className="text-slate-900 font-bold text-2xl tracking-tight">Extra<span className="text-indigo-600">Hands</span>.ai</span>
              </div>
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <motion.button 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Try Now — It's Free
                  </motion.button>
                </SignUpButton>
              </div>
            </div>
          </motion.nav>

          <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 lg:py-32">
            <AnimatePresence mode="wait">
            {showPricing ? (
              <motion.div 
                key="pricing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-7xl mx-auto pt-4"
              >
                <Pricing />
              </motion.div>
            ) : (
            <motion.div 
              key="hero"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto text-center"
            >
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full mb-8 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-700 text-sm font-semibold">AI Features as a Service</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight flex flex-col items-center justify-center lg:block"
              >
                Your Extra Hands for <br className="hidden lg:block"/>
                <Typewriter />
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Don't do it alone. Let AI handle the heavy lifting for your writing, editing, and content creation needs.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <SignInButton mode="modal">
                  <button className="btn-spacious w-full sm:w-auto text-white font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowPricing(true)}
                  className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white text-slate-900 font-semibold text-lg px-10 py-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-200 shadow-sm"
                >
                  View Pricing
                </motion.button>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
              >
                {[
                  { icon: Users, label: 'Creator Focused', value: 'Built for You' },
                  { icon: Zap, label: 'Lightning Fast', value: 'AI Processing' },
                  { icon: Lock, label: 'Enterprise', value: 'Security' }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                    <div className="text-2xl font-bold text-slate-900">{stat.label}</div>
                    <div className="text-sm text-slate-500">{stat.value}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            )}
            </AnimatePresence>
          </div>

          {!showPricing && (
          <div className="pb-20 px-4">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: PenTool,
                  title: "For Writers",
                  desc: "AI article generation, paraphrasing, and SEO optimization tools.",
                  color: "from-indigo-500 to-violet-500"
                },
                {
                  icon: Wand2,
                  title: "For Editors",
                  desc: "Advanced grammar checking, PDF tools, and text enhancements.",
                  color: "from-violet-500 to-fuchsia-500"
                },
                {
                  icon: Shield,
                  title: "Secure & Original",
                  desc: "Enterprise-grade plagiarism checking and content verification.",
                  color: "from-fuchsia-500 to-pink-500"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg shadow-indigo-500/20">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-indigo-600 font-bold text-2xl mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
          )}
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;
