import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  FolderOpen,
  User,
  Mail,
  Plus,
  MoreHorizontal,
  Layout,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  X,
  Send,
  ArrowRight,
  ArrowLeft,
  Search,
  Bell,
  Globe,
  Menu
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ images, setImages, aboutData, setAboutData }) => {
  const [activePage, setActivePage] = useState('Home');
  const [selectedWork, setSelectedWork] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

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

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    topic: '',
    description: '',
    thumbnail: '',
    images: [''],
    client: '',
    year: new Date().getFullYear().toString(),
    service: '',
  });

  const [workProjects, setWorkProjects] = useState([
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
  ]);

  const handleAddProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleImageUpload = (e, isMain = true, index = 0) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMain) {
          setNewProject(prev => ({ ...prev, thumbnail: reader.result }));
        } else {
          const updatedImages = [...newProject.images];
          updatedImages[index] = reader.result;
          setNewProject(prev => ({ ...prev, images: updatedImages }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addProjectImageField = () => {
    setNewProject({ ...newProject, images: [...newProject.images, ''] });
  };

  const removeProjectImageField = (index) => {
    const updatedImages = newProject.images.filter((_, i) => i !== index);
    setNewProject({ ...newProject, images: updatedImages });
  };

  const handleAddProjectSubmit = () => {
    if (!newProject.title || !newProject.description) return;

    const project = {
      id: workProjects.length + 1,
      title: newProject.title,
      thumbnail: newProject.thumbnail || (workProjects.length + 1).toString().padStart(2, '0'),
      category: newProject.service || 'Project',
      client: newProject.client || 'Client Name',
      year: newProject.year,
      service: newProject.service,
      topic: newProject.topic,
      description: newProject.description,
      primaryImage: 'Primary View',
      secondaryImage: 'Detail View',
      images: newProject.images
    };

    setWorkProjects([project, ...workProjects]);
    setShowAddProjectModal(false);
    setNewProject({
      title: '', topic: '', description: '', thumbnail: '', images: [''], client: '', year: new Date().getFullYear().toString(), service: ''
    });
  };

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
    <div className="grid-layout animate-fade-in">
      {/* Hero Welcome Card */}
      <div className="hero-card">
        <div className="hero-content">
          <div className="hero-text-wrap">
            <h1 className="hero-title">
              Creative Designer <br /> & Developer
            </h1>
            <p className="hero-subtitle">
              Crafting beautiful digital experiences that make an impact for brands across the globe.
            </p>
            <div className="hero-actions">
              <button onClick={() => setActivePage('Work')} className="btn-primary">View Projects</button>
              <button onClick={() => setActivePage('Contact')} className="btn-secondary">Get In Touch</button>
            </div>
          </div>
          <div className="hero-glow"></div>
        </div>
      </div>

      {/* Gallery Management Card */}
      <div className="gallery-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Gallery</h2>
            <p className="card-subtitle">Management</p>
          </div>
          <div className="icon-box-alt"><Layout size={18} /></div>
        </div>

        <div className="gallery-grid">
          {images && images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="gallery-item group">
              <div className="gallery-img-bg" style={{ backgroundImage: `url(${img})` }}></div>
              <div className="gallery-overlay">
                <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="btn-remove-img"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-input-group">
          <input
            ref={imageInputRef}
            type="text"
            placeholder="Paste image URL..."
            className="input-styled"
            onKeyDown={(e) => e.key === 'Enter' && handleAddImage()}
          />
          <button onClick={handleAddImage} className="btn-full">
            Add Image
          </button>
        </div>
      </div>

      {/* Featured Works List */}
      <div className="featured-section">
        <div className="section-header">
          <h3 className="card-title text-uppercase">Projects Timeline</h3>
          <button onClick={() => setActivePage('Work')} className="link-view-all">VIEW ALL <ArrowRight size={14} /></button>
        </div>
        <div className="projects-grid">
          {workProjects.slice(0, 4).map((p) => (
            <div key={p.id} className="project-thumb-item group" onClick={() => { setSelectedWork(p); setActivePage('Work'); }}>
              <div className="project-thumb-box">
                {p.thumbnail}
              </div>
              <div>
                <div className="card-subtitle mb-1">{p.category}</div>
                <h4 className="font-bold dark:text-white mb-1">{p.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleAboutChange = (e) => {
    setAboutData({ ...aboutData, [e.target.name]: e.target.value });
  };

  const renderAbout = () => (
    <div className="about-container animate-fade-in">
      {/* Left Side: Preview Style Block */}
      <div className="about-preview">
        <div className="relative z-10 px-6 text-center">
          <div className="kakkhean-logo text-white text-4xl mb-4">KAKKHEAN</div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{aboutData.location} / Local</p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.05),_transparent)]"></div>
      </div>

      {/* Right Side: Editable Form */}
      <div className="about-form">
        <div className="form-group">
          <label className="form-label">Studio Heading</label>
          <input
            type="text"
            name="title"
            value={aboutData.title}
            onChange={handleAboutChange}
            className="input-large"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bio / Agency Description</label>
          <textarea
            name="bio"
            value={aboutData.bio}
            onChange={handleAboutChange}
            rows={6}
            className="textarea-styled"
          />
        </div>

        <div className="image-upload-grid">
          <button className="btn-upload-placeholder group">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
              <Plus size={14} className="text-zinc-400" />
            </div>
            <span className="card-subtitle">Add Main Image</span>
          </button>
          <button className="btn-upload-placeholder group">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
              <Layout size={14} className="text-zinc-400" />
            </div>
            <span className="card-subtitle">Add Image Slider</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-8 pt-6 border-t dark:border-zinc-800">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={aboutData.location}
              onChange={handleAboutChange}
              className="input-large text-lg"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <input
              type="text"
              name="availability"
              value={aboutData.availability}
              onChange={handleAboutChange}
              className="input-large text-lg"
            />
          </div>
        </div>

        <div className="pt-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="card-subtitle text-blue-500">Changes are automatically saved across the site</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWork = () => {
    if (selectedWork && activePage === 'Work') return renderWorkDetail();
    return (
      <div className="animate-fade-in max-w-7xl mx-auto pb-12 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-end gap-2 mb-8">
          <h1 className="text-5xl md:text-7xl font-bold dark:text-white tracking-tighter uppercase">Works</h1>
          <div className="card-subtitle">/ Selected Projects</div>
        </div>
        <div className="work-gallery-grid">
          {workProjects.map((project) => (
            <div key={project.id} onClick={() => setSelectedWork(project)} className="group cursor-pointer">
              <div className="project-card-media">
                <div className="absolute inset-0 flex items-center justify-center text-8xl font-bold opacity-20 transition-transform duration-700 group-hover:scale-110">
                  {project.thumbnail && (project.thumbnail.startsWith('http') || project.thumbnail.startsWith('data:')) ? (
                    <img src={project.thumbnail} alt={project.title} className="project-img" />
                  ) : (
                    project.thumbnail
                  )}
                </div>
                <div className="project-hover-overlay">
                  <div className="badge-case-study">
                    View Case Study <ArrowRight size={14} />
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="card-subtitle mb-1">{project.category}</div>
                <h3 className="text-2xl font-bold dark:text-white uppercase">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWorkDetail = () => (
    <div className="animate-slide-in-left max-w-6xl mx-auto py-12 space-y-12">
      <button
        onClick={() => setSelectedWork(null)}
        className="back-btn"
      >
        <ArrowLeft size={16} /> Back to projects
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div>
          <div className="card-subtitle mb-2">{selectedWork.category}</div>
          <h1 className="text-5xl lg:text-7xl font-bold dark:text-white leading-none tracking-tighter uppercase">{selectedWork.title}</h1>
        </div>
      </div>

      <div className="work-detail-media">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.1),_transparent)]"></div>
        <div className="text-center relative z-10 px-4">
          <div className="text-huge-thumb mb-4">{selectedWork.thumbnail}</div>
          <div className="tracking-widest-xl">{selectedWork.primaryImage}</div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="contact-container animate-fade-in">
      <h1 className="text-5xl lg:text-7xl font-bold dark:text-white tracking-tighter leading-none uppercase">Contact</h1>
      <div className="contact-grid">
        <div className="contact-form-wrapper">
          <h2 className="text-2xl font-bold mb-10 dark:text-white tracking-tighter uppercase">Say Hello</h2>
          {formSubmitted ? (
            <div className="success-message-box">
              <div className="text-5xl mb-6">🤟</div>
              <h3 className="text-3xl font-bold dark:text-white mb-2 tracking-tighter uppercase">Message Sent!</h3>
              <p className="card-subtitle">I'll get back to you shortly.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="form-label">Your Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-styled text-sm font-bold" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <label className="form-label">Your Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-styled text-sm font-bold" placeholder="email@address.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="form-label">Message</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} className="input-styled h-40 font-bold text-sm resize-none" placeholder="Tell me about your project..." />
              </div>
              <button
                onClick={handleFormSubmit}
                className="btn-full text-sm uppercase tracking-tighter flex items-center justify-center gap-3 w-auto px-8 py-4"
              >
                Send Message <Send size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="contact-info-wrapper space-y-8">
          <div className="contact-info-card">
            <h2 className="text-xl font-bold mb-10 tracking-tighter uppercase">Direct Contact</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-5 group transition-colors">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors"><Mail size={20} /></div>
                <div>
                  <div className="card-subtitle mb-1">Email address</div>
                  <span className="text-lg font-bold tracking-tight">hello@kakkhean.com</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/5 rounded-2xl"><Globe size={20} /></div>
                <div>
                  <div className="card-subtitle mb-1">Office</div>
                  <span className="text-lg font-bold tracking-tight">Phnom Penh, KH</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} className="p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[25px] flex flex-col items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all shadow-sm text-zinc-400 hover:text-black dark:hover:text-white hover:scale-105">
                <social.icon size={24} />
                <span className="card-subtitle font-mono italic">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddProjectModal = () => (
    <div className="modal-backdrop">
      <div className="modal-overlay" onClick={() => setShowAddProjectModal(false)}></div>
      <div className="modal-content">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl z-20 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold dark:text-white tracking-tighter uppercase">Add New Project</h2>
            <p className="card-subtitle mt-1">Showcase your latest work</p>
          </div>
          <button onClick={() => setShowAddProjectModal(false)} className="btn-icon">
            <X size={20} className="icon-close-modal" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="form-label">Topic Name</label>
              <input type="text" name="topic" value={newProject.topic} onChange={handleAddProjectChange} className="input-styled font-bold text-xs" placeholder="e.g. Modern E-Commerce" />
            </div>
            <div className="space-y-2">
              <label className="form-label">Project Title</label>
              <input type="text" name="title" value={newProject.title} onChange={handleAddProjectChange} className="input-styled font-bold text-xs" placeholder="e.g. E-Commerce Platform" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="form-label">Description</label>
            <textarea name="description" value={newProject.description} onChange={handleAddProjectChange} rows={4} className="input-styled font-bold text-xs resize-none leading-relaxed" placeholder="Brief description of the project..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="form-label">Client Name</label>
              <input type="text" name="client" value={newProject.client} onChange={handleAddProjectChange} className="input-styled font-bold text-xs" placeholder="Client Name" />
            </div>
            <div className="space-y-2">
              <label className="form-label">Year</label>
              <input type="text" name="year" value={newProject.year} onChange={handleAddProjectChange} className="input-styled font-bold text-xs" placeholder="2024" />
            </div>
            <div className="space-y-2">
              <label className="form-label">Service (Tag)</label>
              <input type="text" name="service" value={newProject.service} onChange={handleAddProjectChange} className="input-styled font-bold text-xs" placeholder="Web Dev" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-widest">Images</h3>

            <div className="space-y-2">
              <label className="form-label">Main Image / Thumbnail</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="input-styled input-file"
                />
                {newProject.thumbnail && newProject.thumbnail.startsWith('data:') && (
                  <img src={newProject.thumbnail} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="form-label">Secondary Images</label>
              {newProject.images.map((img, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false, idx)}
                      className="input-styled input-file"
                    />
                    {newProject.images.length > 1 && (
                      <button onClick={() => removeProjectImageField(idx)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {img && img.startsWith('data:') && (
                    <img src={img} alt={`Preview ${idx}`} className="h-20 w-20 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800" />
                  )}
                </div>
              ))}
              <button onClick={addProjectImageField} className="card-subtitle text-blue-500 hover:text-blue-600 flex items-center gap-1">
                <Plus size={12} /> Add another image
              </button>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 sticky bottom-0 z-20 flex justify-end gap-3">
          <button onClick={() => setShowAddProjectModal(false)} className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Cancel</button>
          <button onClick={handleAddProjectSubmit} className="btn-primary uppercase tracking-widest text-xs btn-add">Save Project</button>
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
    <div className="dashboard-container">
      {/* MOBILE HEADER */}
      <header className="mobile-header">
        <div className="kakkhean-logo">KAKKHEAN</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn-icon">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="kakkhean-logo">KAKKHEAN</div>
          <MoreHorizontal size={18} className="text-zinc-700" />
        </div>

        <nav className="nav-container">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActivePage(item.label);
                  setSelectedWork(null);
                  setMobileMenuOpen(false);
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-icon-box">
                  <Icon size={18} />
                </div>
                <span className="nav-label">
                  {item.label.toUpperCase()}
                </span>
                {isActive && <div className="active-indicator"></div>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="project-visibility-card">
            <div className="pv-circle">40%</div>
            <div className="card-subtitle mb-4">Project Visibility</div>
            <button className="btn-complete">Complete</button>
          </div>

          <div className="user-profile group">
            <div className="user-avatar">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop" alt="User" />
            </div>
            <div>
              <h5 className="font-bold text-sm tracking-tighter truncate">Andre Lacerda</h5>
              <p className="card-subtitle truncate mt-1">USER_ROLE</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="main-area">
        {/* DESKTOP HEADER */}
        <header className="desktop-header">
          <div className="search-bar">
            <div className="search-icon-wrapper">
              <Search size={18} />
            </div>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="header-actions">
            <div className="action-btn btn-bell group">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </div>
            <div onClick={() => setShowAddProjectModal(true)} className="action-btn btn-add">
              <Plus size={18} />
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <div className="content-wrapper">
          <div className="bg-grain"></div>
          <div className="content-inner">
            {renderContent()}
          </div>
        </div>

        {/* MOBILE NAV MASK */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        )}

        {/* ADD PROJECT MODAL */}
        {showAddProjectModal && renderAddProjectModal()}
      </main>
    </div>
  );
};

export default Dashboard;