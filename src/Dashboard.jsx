import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  FolderOpen,
  User,
  Mail,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Layout,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  X,
  Send,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Settings,
  Search,
  Bell,
  Globe,
  Menu
} from 'lucide-react';

const Dashboard = ({ images, setImages }) => {
  const [activePage, setActivePage] = useState('Home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedWork, setSelectedWork] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const imageInputRef = useRef(null);

  const navItems = [
    { label: 'Home', icon: Home },
    { label: 'About', icon: User },
    { label: 'Work', icon: FolderOpen },
    { label: 'Contact', icon: Mail },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/yourusername' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/yourusername' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/yourusername' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/yourusername' },
  ];

  const workProjects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      thumbnail: '01',
      category: 'Web Development',
      client: 'TechStore Inc.',
      year: '2024',
      service: 'Full Stack Development',
      topic: 'Modern E-Commerce Solution',
      description: 'Developed a comprehensive e-commerce platform with advanced features including real-time inventory management, secure payment processing, and personalized user experiences.',
      primaryImage: 'Primary View',
      secondaryImage: 'Detail View'
    },
    {
      id: 2,
      title: 'Brand Identity Design',
      thumbnail: '02',
      category: 'Branding',
      client: 'Creative Studio',
      year: '2024',
      service: 'Brand Design & Strategy',
      topic: 'Complete Brand Transformation',
      description: 'Created a complete brand identity system including logo design, color palette, typography, and brand guidelines. The project involved extensive market research.',
      primaryImage: 'Brand System',
      secondaryImage: 'Applications'
    },
    {
      id: 3,
      title: 'Mobile App Design',
      thumbnail: '03',
      category: 'UI/UX Design',
      client: 'FitLife App',
      year: '2023',
      service: 'Mobile UI/UX Design',
      topic: 'Fitness Tracking Application',
      description: 'Designed an intuitive fitness tracking application focusing on user engagement and gamification. Features personalized workout plans and progress tracking.',
      primaryImage: 'App Interface',
      secondaryImage: 'User Flow'
    },
    {
      id: 4,
      title: 'Corporate Website',
      thumbnail: '04',
      category: 'Web Design',
      client: 'Global Corp',
      year: '2023',
      service: 'Web Design & Development',
      topic: 'Professional Corporate Presence',
      description: 'Built a sophisticated corporate website showcasing company values, services, and portfolio. Integrated with CMS for easy content management.',
      primaryImage: 'Homepage',
      secondaryImage: 'Interior Pages'
    },
  ];

  const handleFormSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImage = () => {
    if (imageInputRef.current && imageInputRef.current.value) {
      setImages([...images, imageInputRef.current.value]);
      imageInputRef.current.value = '';
    }
  };

  const renderHome = () => (
    <div className="grid grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-500">
      {/* Hero Welcome Card */}
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-[#18181b] text-white p-8 md:p-12 rounded-[25px] relative overflow-hidden shadow-2xl h-full flex flex-col justify-center min-h-[300px]">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight tracking-tighter uppercase">
              Creative Designer <br /> & Developer
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
              Crafting beautiful digital experiences that make an impact for brands across the globe.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setActivePage('Work')} className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition shadow-lg">View Projects</button>
              <button onClick={() => setActivePage('Contact')} className="bg-zinc-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-700 transition">Get In Touch</button>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-zinc-700/20 rounded-full blur-[100px]"></div>
        </div>
      </div>

      {/* Gallery Management Card */}
      <div className="col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[25px] shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h2 className="text-lg md:text-xl font-bold dark:text-white tracking-tight">Gallery</h2>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Management</p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-xl text-zinc-400"><Layout size={18} /></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 mb-8">
          {images && images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden shadow-inner border border-zinc-100 dark:border-zinc-800">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}></div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="bg-red-500 text-white p-2 rounded-xl"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <input
            ref={imageInputRef}
            type="text"
            placeholder="Paste image URL..."
            className="w-full px-5 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all outline-none text-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAddImage()}
          />
          <button
            onClick={handleAddImage}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-2xl font-bold text-xs tracking-tight hover:opacity-90 transition shadow-xl"
          >
            Add Image
          </button>
        </div>
      </div>

      {/* Featured Works List */}
      <div className="col-span-12 bg-white dark:bg-zinc-900 rounded-[25px] p-6 md:p-10 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-bold dark:text-white tracking-tighter uppercase">Projects Timeline</h3>
          <button onClick={() => setActivePage('Work')} className="text-[10px] font-bold text-zinc-400 hover:text-black dark:hover:text-white transition flex items-center gap-2 uppercase">VIEW ALL <ArrowRight size={14} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {workProjects.slice(0, 4).map((p) => (
            <div key={p.id} className="group cursor-pointer" onClick={() => { setSelectedWork(p); setActivePage('Work'); }}>
              <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 rounded-[25px] mb-4 md:mb-6 flex items-center justify-center text-4xl md:text-5xl font-bold opacity-20 dark:opacity-40 group-hover:scale-105 transition-transform duration-500 border border-zinc-100 dark:border-zinc-700">
                {p.thumbnail}
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{p.category}</div>
                <h4 className="text-sm md:text-base font-bold dark:text-white">{p.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto py-6 md:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-center lg:text-left">
        <div className="w-full lg:w-1/2 bg-zinc-950 dark:bg-zinc-900 rounded-[25px] h-[300px] md:h-[400px] flex items-center justify-center border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="text-center relative z-10 px-6">
            <div className="text-5xl md:text-6xl font-bold mb-4 kakkhean-logo text-white tracking-tighter">KAKKHEAN</div>
            <p className="text-zinc-500 font-mono tracking-widest text-[10px] md:text-xs italic uppercase">Cambodia / Local</p>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.05),_transparent)]"></div>
        </div>
        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white tracking-tighter leading-none uppercase">About <br className="hidden lg:block" /> The Studio</h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            With over 5 years of experience in digital design and engineering, I help businesses bring their
            vision to life through minimal design and efficient engineering. Our methodology focuses on clean typography, open space, and perfect motion.
          </p>
          <div className="grid grid-cols-2 gap-4 md:gap-8 pt-8 border-t dark:border-zinc-800">
            <div>
              <div className="text-xl md:text-2xl font-bold dark:text-white">Cambodia</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Location</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold dark:text-white">Active.24</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Availability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWork = () => {
    if (selectedWork && activePage === 'Work') return renderWorkDetail();
    return (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold dark:text-white tracking-tighter leading-none uppercase">Works</h1>
          <div className="text-zinc-400 font-mono mb-2 text-[10px] md:text-xs uppercase tracking-widest">/ Selected Projects</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {workProjects.map((project) => (
            <div key={project.id} onClick={() => setSelectedWork(project)} className="group cursor-pointer">
              <div className="aspect-[16/10] bg-zinc-50 dark:bg-zinc-900 rounded-[25px] overflow-hidden mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm relative">
                <div className="absolute inset-0 flex items-center justify-center text-[6rem] md:text-[8rem] font-bold opacity-5 dark:opacity-20 transition-transform duration-700 group-hover:scale-110">
                  {project.thumbnail}
                </div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                  <div className="bg-white text-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-2xl">
                    View Case Study <ArrowRight size={14} />
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">{project.category}</div>
                <h3 className="text-xl md:text-2xl font-bold dark:text-white group-hover:underline underline-offset-8 uppercase">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkDetail = () => (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-left-4 duration-500 max-w-6xl mx-auto py-6 md:py-12">
      <button
        onClick={() => setSelectedWork(null)}
        className="flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white font-bold text-[10px] md:text-xs transition-all hover:-translate-x-1 uppercase"
      >
        <ArrowLeft size={16} /> Back to projects
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 pt-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{selectedWork.category}</div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold dark:text-white leading-none tracking-tighter uppercase">{selectedWork.title}</h1>
        </div>
      </div>

      <div className="aspect-video bg-zinc-950 dark:bg-zinc-900 rounded-[25px] shadow-2xl flex items-center justify-center text-white relative overflow-hidden border border-zinc-800">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.1),_transparent)]"></div>
        <div className="text-center relative z-10 px-4">
          <div className="text-6xl md:text-8xl font-bold mb-4 opacity-20">{selectedWork.thumbnail}</div>
          <div className="text-sm md:text-lg tracking-[0.5em] md:tracking-[1em] text-zinc-500 uppercase font-mono">{selectedWork.primaryImage}</div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-8 md:space-y-16 animate-in fade-in duration-700 max-w-7xl mx-auto py-4 md:py-6">
      <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold dark:text-white tracking-tighter leading-none uppercase">Contact</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[25px] p-6 md:p-12 shadow-sm order-2 lg:order-1">
          <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-10 dark:text-white tracking-tighter uppercase">Say Hello</h2>
          {formSubmitted ? (
            <div className="text-center py-12 md:py-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 animate-in zoom-in duration-500">
              <div className="text-4xl md:text-5xl mb-4 md:mb-6">🤟</div>
              <h3 className="text-2xl md:text-3xl font-bold dark:text-white mb-2 tracking-tighter uppercase">Message Sent!</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">I'll get back to you shortly.</p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 dark:text-white border-2 border-transparent focus:border-black dark:focus:border-white transition-all outline-none font-bold text-sm" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Your Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 dark:text-white border-2 border-transparent focus:border-black dark:focus:border-white transition-all outline-none font-bold text-sm" placeholder="email@address.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Message</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 dark:text-white border-2 border-transparent focus:border-black dark:focus:border-white transition-all outline-none h-32 md:h-40 resize-none font-bold text-sm" placeholder="Tell me about your project..." />
              </div>
              <button
                onClick={handleFormSubmit}
                className="w-full md:w-auto bg-black dark:bg-white dark:text-black text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 uppercase tracking-tighter"
              >
                Send Message <Send size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6 md:space-y-8 order-1 lg:order-2">
          <div className="bg-zinc-950 dark:bg-zinc-900 text-white rounded-[25px] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-zinc-800">
            <h2 className="text-xl font-bold mb-8 md:mb-10 tracking-tighter uppercase">Direct Contact</h2>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 md:gap-5 group transition-colors">
                <div className="p-3.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl group-hover:bg-white/10 transition-colors"><Mail size={18} md:size={20} /></div>
                <div>
                  <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Email address</div>
                  <span className="text-base md:text-lg font-bold tracking-tight">hello@kakkhean.com</span>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-5">
                <div className="p-3.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl"><Globe size={18} md:size={20} /></div>
                <div>
                  <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Office</div>
                  <span className="text-base md:text-lg font-bold tracking-tight">Phnom Penh, KH</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} className="p-6 md:p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[25px] flex flex-col items-center gap-2 md:gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all shadow-sm text-zinc-400 hover:text-black dark:hover:text-white hover:scale-105">
                <social.icon size={20} md:size={24} />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest font-mono italic">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedWork && activePage === 'Work') return renderWorkDetail();
    switch (activePage) {
      case 'Home': return renderHome();
      case 'About': return renderAbout();
      case 'Work': return renderWork();
      case 'Contact': return renderContact();
      default: return renderHome();
    }
  };

  return (
    <div className="h-screen bg-[#f4f4f5] dark:bg-[#09090b] font-sans transition-colors duration-500 overflow-hidden flex flex-col lg:flex-row">

      {/* MOBILE HEADER - Visible only on small screens */}
      <header className="lg:hidden h-20 bg-[#0a0a0b] text-white flex items-center justify-between px-6 shrink-0 border-b border-white/5 z-50">
        <div className="kakkhean-logo text-xl font-bold tracking-tighter">
          KAKKHEAN
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 bg-white/10 rounded-xl"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* SIDEBAR / NAVIGATION RAIL */}
      <aside className={`
            fixed inset-0 lg:static z-[100] lg:z-auto
            w-full lg:w-[320px] 
            bg-[#0a0a0b] text-white py-12 
            flex flex-col overflow-y-auto shrink-0 
            transition-all duration-500 ease-in-out
            border-r border-white/5
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        <div className="px-10 mb-20 hidden lg:flex items-center justify-between">
          <div className="kakkhean-logo text-2xl font-bold tracking-tighter text-white">
            KAKKHEAN
          </div>
          <MoreHorizontal size={18} className="text-zinc-700" />
        </div>

        <nav className="flex-1 space-y-3 px-6 md:px-8 pt-8 lg:pt-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActivePage(item.label);
                  setSelectedWork(null);
                  setMobileMenuOpen(false); // Close menu on click
                }}
                className={`w-full group flex items-center gap-5 py-4 px-4 rounded-[25px] transition-all relative overflow-hidden ${isActive
                  ? 'bg-white/10 text-white shadow-2xl translate-x-1'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                  }`}
              >
                <div className={`p-2.5 rounded-xl transition-all ${isActive ? 'bg-white text-black scale-105 shadow-xl' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
                  <Icon size={18} />
                </div>
                <span className={`font-bold text-sm tracking-tight ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-300 underline-offset-4 group-hover:underline'}`}>
                  {item.label.toUpperCase()}
                </span>
                {isActive && <div className="absolute right-6 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>}
              </button>
            );
          })}
        </nav>

        <div className="px-10 mt-auto pt-10 pb-8 lg:pb-0">
          <div className="bg-zinc-900/50 p-6 rounded-[25px] border border-white/5 relative overflow-hidden mb-10 text-center">
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center font-bold text-xs bg-black shadow-inner">40%</div>
              <div className="text-[8px] uppercase font-bold tracking-widest text-zinc-500 leading-tight">Project Visibility</div>
            </div>
            <button className="w-full bg-white text-black py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition hover:bg-zinc-200 shadow-xl">Complete</button>
          </div>

          <div className="flex items-center gap-3 py-4 lg:p-3 hover:bg-white/5 rounded-[25px] transition cursor-pointer group">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden shrink-0 shadow-2xl flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <h5 className="font-bold text-sm tracking-tighter text-white truncate">Andre Lacerda</h5>
              <p className="text-[8px] text-zinc-500 truncate font-bold font-mono tracking-tighter mt-1">USER_ROLE</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 bg-[#f4f4f5] dark:bg-[#09090b] flex flex-col overflow-hidden transition-colors duration-500 relative">

        {/* DESKTOP HEADER AREA - Hide on mobile */}
        <header className="hidden lg:flex h-24 px-12 items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-3xl relative z-20 shrink-0">
          <div className="flex-1 max-w-xl relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center gap-3 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-12 pl-12 pr-6 bg-zinc-100 dark:bg-zinc-900/80 rounded-[25px] border-none focus:ring-2 ring-black/5 dark:ring-white/10 dark:text-white font-bold text-sm transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-4 ml-12">
            <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center relative shadow-sm border border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 group">
              <Bell size={18} className="text-zinc-500 dark:text-zinc-400 group-hover:text-red-400" />
              <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
            </div>
            <div className="w-12 h-12 bg-zinc-950 dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer hover:opacity-80 transition-all hover:scale-105 active:scale-95">
              <Plus size={18} className="text-white dark:text-black" />
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-white dark:bg-[#09090b] transition-colors duration-500 relative scroll-smooth">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grain-y.com/wp-content/uploads/2021/04/grain.png')]"></div>
          <div className="relative z-10 h-full">
            {renderContent()}
          </div>
        </div>

        {/* MOBILE NAV MASK */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;