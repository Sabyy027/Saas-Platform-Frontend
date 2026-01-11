import { useState, useEffect } from 'react';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  PenTool, 
  FileText, 
  Image as ImageIcon, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  ChevronRight,
  Sparkles,
  HelpingHand,
  FileType,
  Eraser
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Logo';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(true);
  const [credits, setCredits] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    writers: true,
    editors: true,
    creators: true
  });

  useEffect(() => {
    const fetchCredits = async () => {
      if (user) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/credits`);
          if (response.data.success) {
            setCredits(response.data.data.creditBalance);
          }
        } catch (error) {
          console.error('Error fetching credits:', error);
        }
      }
    };

    fetchCredits();

    // Listen for updates (e.g. after purchase)
    const handleCreditUpdate = () => fetchCredits();
    window.addEventListener('credit_update', handleCreditUpdate);

    return () => {
      window.removeEventListener('credit_update', handleCreditUpdate);
    };
  }, [user]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'main' },
    { 
      id: 'writers', 
      label: 'For Writers', 
      icon: PenTool, 
      category: 'group',
      items: [
        { id: 'generator', label: 'Article Generator' },
        { id: 'humanizer', label: 'AI Humanizer' },
        { id: 'plagiarism', label: 'Plagiarism Checker' },
        { id: 'seo', label: 'SEO Optimizer' },
        { id: 'grammar', label: 'Grammar Checker' },
        { id: 'paraphrase', label: 'Paraphraser' },
      ]
    },
    { 
      id: 'editors', 
      label: 'For Editors', 
      icon: FileText, 
      category: 'group',
      items: [
        { id: 'file-converter', label: 'Universal Converter', badge: 'Pro' },
        { id: 'pdf-to-text', label: 'PDF to Text', badge: 'New' },
        { id: 'text-to-pdf', label: 'Text to PDF', badge: 'New' },
      ]
    },
    { 
      id: 'creators', 
      label: 'For Creators', 
      icon: ImageIcon, 
      category: 'group',
      items: [
        { id: 'image-generator', label: 'AI Image Generator', badge: 'Hot' },
        { id: 'bg-remover', label: 'Background Remover', badge: 'New' },
        { id: 'image-converter', label: 'Image Converter' },
        { id: 'caption-generator', label: 'Caption Generator' },
      ]
    },
    { id: 'pricing', label: 'Credits & Plans', icon: CreditCard, category: 'main' },
  ];

  return (
    <>
      {/* Mobile Menu Button - Only show when closed */}
      {!isOpen && (
        <button 
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white text-slate-700 shadow-md rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar Container */}
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-auto" />
            <span className="text-slate-900 font-bold text-xl tracking-tight">Extra<span className="text-indigo-600">Hands</span>.ai</span>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => (
              item.category === 'group' ? (
                <div key={item.id} className="mb-4">
                  <button
                    onClick={() => toggleCategory(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    {expandedCategories[item.id] ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategories[item.id] && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-3">
                          {item.items.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                onTabChange(subItem.id);
                                if (window.innerWidth < 768) setIsOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                                activeTab === subItem.id
                                  ? 'bg-indigo-50 text-indigo-600 font-medium translate-x-1'
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              <span className="truncate">{subItem.label}</span>
                              {subItem.badge && (
                                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                  {subItem.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mb-1 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-indigo-600'}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              )
            ))}
          </div>
        </div>

        {/* Credit Balance */}
        <div className="px-6 mb-2">
           <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Available Credits</span>
               <div className="bg-white p-1 rounded-md shadow-sm">
                 <Sparkles className="w-3 h-3 text-indigo-600" />
               </div>
             </div>
             <div className="flex items-end gap-1">
               <span className="text-2xl font-black text-indigo-600">{credits !== null ? credits : '-'}</span>
               <span className="text-xs font-medium text-indigo-400 mb-1.5">credits</span>
             </div>
             <button 
               onClick={() => onTabChange('pricing')}
               className="w-full mt-3 bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors shadow-sm"
             >
               Buy More
             </button>
           </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <UserButton afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-white shadow-sm"
                }
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
