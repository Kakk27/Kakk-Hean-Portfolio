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
  Menu,
  LogOut,
  Image as ImageIcon,
  Calendar,
  Briefcase,
  Tag,
  Type,
  FileText,
  Layers
} from 'lucide-react';
import './Dashboard.css';
import { fetchProjects, createProject, updateProject } from './services/api';
import { projects as fallbackProjects } from './projectsData';
import { useSiteData } from './SiteDataContext';

const Dashboard = () => {
  const { images, setImages, aboutData, setAboutData, contactData, setContactData, workProjects, setWorkProjects, loadWorkProjects } = useSiteData();
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
    { name: 'GitHub', icon: Github, url: 'https://github.com/Kakk27' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/' },
    { name: 'Facebook', icon: Twitter, url: 'https://facebook.com/kakk.lmao' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/kakkfr_' },
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

  // workProjects, setWorkProjects, loadWorkProjects all come from context above
  const loadData = loadWorkProjects;

  const [isEditing, setIsEditing] = useState(false);

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

  const handleEditProject = (project) => {
    setNewProject({
      id: project.id,
      title: project.title,
      topic: project.topic || '',
      description: project.description,
      thumbnail: project.thumbnail,
      images: project.images.length > 0 ? project.images : [''],
      client: project.client,
      year: project.year,
      service: project.service,
      category: project.category
    });
    setIsEditing(true);
    setShowAddProjectModal(true);
  };

  const resetProjectForm = () => {
    setNewProject({
      title: '', topic: '', description: '', thumbnail: '', images: [''],
      client: '', year: new Date().getFullYear().toString(), service: ''
    });
    setIsEditing(false);
  };

  const handleAddProjectSubmit = async () => {
    if (!newProject.title || !newProject.description) return;

    try {
      if (isEditing) {
        // Optimistic update
        const prevProjects = [...workProjects];
        const updatedDocs = workProjects.map(p =>
          p.id === newProject.id ? { ...p, ...newProject, thumbnail: newProject.thumbnail } : p
        );
        setWorkProjects(updatedDocs);

        try {
          // API Call
          await updateProject(newProject.id, newProject);
          if (selectedWork && selectedWork.id === newProject.id) {
            setSelectedWork({ ...selectedWork, ...newProject });
          }
          // Re-sync from server to ensure data integrity
          await loadData();
        } catch (apiError) {
          // Rollback optimistic update on failure
          setWorkProjects(prevProjects);
          throw apiError;
        }
      } else {
        const tempId = `temp-${Date.now()}`;
        const payload = {
          ...newProject,
          id: tempId,
          category: newProject.service || 'Project'
        };
        // Optimistic add
        setWorkProjects(prev => [payload, ...prev]);

        try {
          // API call — server returns created object with real ID
          await createProject(payload);
          // Re-fetch to get real server IDs and data
          await loadData();
        } catch (apiError) {
          // Rollback: remove the optimistic entry
          setWorkProjects(prev => prev.filter(p => p.id !== tempId));
          throw apiError;
        }
      }

      setShowAddProjectModal(false);
      resetProjectForm();
    } catch (error) {
      console.error("Failed to save project", error);
      alert("Failed to save project. Please ensure backend is running.");
    }
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
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectedWork(null)}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back to projects
        </button>
        <button
          onClick={() => handleEditProject(selectedWork)}
          className="edit-project-btn"
        >
          Edit Project
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div>
          <div className="card-subtitle mb-2">{selectedWork.category}</div>
          <h1 className="text-5xl lg:text-7xl font-bold dark:text-white leading-none tracking-tighter uppercase">{selectedWork.title}</h1>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-video rounded-[30px] overflow-hidden border border-zinc-100 dark:border-zinc-800 relative group">
        {selectedWork.thumbnail && (selectedWork.thumbnail.startsWith('http') || selectedWork.thumbnail.startsWith('data:')) ? (
          <img src={selectedWork.thumbnail} alt={selectedWork.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
            <span className="text-9xl font-bold opacity-10">{selectedWork.thumbnail}</span>
          </div>
        )}
      </div>

      {/* Project Info & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Metadata */}
        <div className="lg:col-span-1 space-y-8">
          <div className="p-8 rounded-[25px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold dark:text-white mb-6 uppercase tracking-tighter">Project Info</h3>
            <div className="space-y-6">
              <div>
                <div className="card-subtitle mb-1">Client</div>
                <div className="text-lg font-bold dark:text-white">{selectedWork.client}</div>
              </div>
              <div>
                <div className="card-subtitle mb-1">Year</div>
                <div className="text-lg font-bold dark:text-white">{selectedWork.year}</div>
              </div>
              <div>
                <div className="card-subtitle mb-1">Services</div>
                <div className="text-lg font-bold dark:text-white">{selectedWork.service}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold dark:text-white mb-6 uppercase tracking-tighter">About The Project</h3>
          <div className="prose dark:prose-invert max-w-none text-zinc-500 text-lg leading-relaxed">
            {selectedWork.description ? selectedWork.description.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            )) : <p>No description available.</p>}
          </div>
        </div>
      </div>

      {/* Gallery */}
      {selectedWork.images && selectedWork.images.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-2xl font-bold dark:text-white uppercase tracking-tighter">Project Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedWork.images.map((img, idx) => (
              img && (img.startsWith('http') || img.startsWith('data:')) ? (
                <div key={idx} className="aspect-[4/5] rounded-[25px] overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:scale-[1.02] transition-transform duration-500">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}
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

        {/* ── Contact Settings (synced to public Contact page) ── */}
        <div className="contact-info-wrapper space-y-8">
          <div className="contact-info-card">
            <h2 className="text-xl font-bold mb-6 tracking-tighter uppercase">Contact Settings</h2>
            <p className="card-subtitle mb-6">These values appear on the public Contact page.</p>
            <div className="space-y-5">
              <div className="form-group">
                <label className="form-label">Public Email</label>
                <input
                  type="text"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="input-styled text-sm font-bold"
                  placeholder="hello@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="input-styled text-sm font-bold"
                  placeholder="+855 12 345 678"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Office / Address</label>
                <input
                  type="text"
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  className="input-styled text-sm font-bold"
                  placeholder="Phnom Penh, Cambodia"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input
                  type="text"
                  value={contactData.instagram}
                  onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                  className="input-styled text-sm font-bold"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="text"
                  value={contactData.linkedin}
                  onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                  className="input-styled text-sm font-bold"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="pt-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="card-subtitle text-blue-500">Changes sync live to the public Contact page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleCloseModal = () => {
    setShowAddProjectModal(false);
    resetProjectForm();
  };

  const renderAddProjectModal = () => (
    <div className="modal-backdrop">
      <div className="modal-overlay" onClick={handleCloseModal}></div>
      <div className="modal-content modal-modern">
        {/* Header */}
        <div className="modal-header-modern">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-black dark:bg-white rounded-lg text-white dark:text-black">
                {isEditing ? <FileText size={18} /> : <Plus size={18} />}
              </div>
              <h2 className="text-2xl font-bold dark:text-white tracking-tighter uppercase">
                {isEditing ? 'Edit Project' : 'New Project'}
              </h2>
            </div>
            <p className="card-subtitle ml-1">{isEditing ? 'Update project details' : 'Create a new portfolio entry'}</p>
          </div>
          <button onClick={handleCloseModal} className="btn-icon-modern">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-modern">
          {/* Section 1: Essentials */}
          <div className="form-section-modern">
            <h3 className="section-title-modern"><Layers size={14} /> Project Essentials</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="input-group-modern">
                <label className="label-modern">Project Title</label>
                <div className="input-wrapper-modern">
                  <Type size={16} className="input-icon-modern" />
                  <input
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={handleAddProjectChange}
                    className="input-field-modern"
                    placeholder="e.g. E-Commerce Platform"
                  />
                </div>
              </div>

              <div className="input-group-modern">
                <label className="label-modern">Topic / Category</label>
                <div className="input-wrapper-modern">
                  <Tag size={16} className="input-icon-modern" />
                  <input
                    type="text"
                    name="topic"
                    value={newProject.topic}
                    onChange={handleAddProjectChange}
                    className="input-field-modern"
                    placeholder="e.g. Modern Web Design"
                  />
                </div>
              </div>
            </div>

            <div className="input-group-modern mt-4">
              <label className="label-modern">Description</label>
              <div className="input-wrapper-modern items-start pt-3">
                <FileText size={16} className="input-icon-modern mt-1" />
                <textarea
                  name="description"
                  value={newProject.description}
                  onChange={handleAddProjectChange}
                  rows={4}
                  className="input-field-modern resize-y min-h-[100px]"
                  placeholder="Describe the project goals, challenges, and solution..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="form-section-modern">
            <h3 className="section-title-modern"><Briefcase size={14} /> Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="input-group-modern">
                <label className="label-modern">Client</label>
                <div className="input-wrapper-modern">
                  <User size={16} className="input-icon-modern" />
                  <input
                    type="text"
                    name="client"
                    value={newProject.client}
                    onChange={handleAddProjectChange}
                    className="input-field-modern"
                    placeholder="Client Name"
                  />
                </div>
              </div>
              <div className="input-group-modern">
                <label className="label-modern">Year</label>
                <div className="input-wrapper-modern">
                  <Calendar size={16} className="input-icon-modern" />
                  <input
                    type="text"
                    name="year"
                    value={newProject.year}
                    onChange={handleAddProjectChange}
                    className="input-field-modern"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div className="input-group-modern">
                <label className="label-modern">Service</label>
                <div className="input-wrapper-modern">
                  <Layers size={16} className="input-icon-modern" />
                  <input
                    type="text"
                    name="service"
                    value={newProject.service}
                    onChange={handleAddProjectChange}
                    className="input-field-modern"
                    placeholder="Development"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visuals */}
          <div className="form-section-modern">
            <h3 className="section-title-modern"><ImageIcon size={14} /> Visual Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Thumbnail */}
              <div className="md:col-span-1">
                <label className="label-modern mb-2 block">Thumbnail</label>
                <div className={`upload-zone-main group ${newProject.thumbnail ? 'has-image' : ''}`}>
                  {newProject.thumbnail ? (
                    <div className="relative w-full h-full">
                      <img src={newProject.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      <div className="image-overlay flex items-center justify-center">
                        <label className="cursor-pointer relative group">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm group-hover:bg-black/70 transition-colors">Change Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"
                            title=""
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-content">
                      <div className="upload-icon-wrapper">
                        <ImageIcon size={24} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">Upload Cover</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Images Gallery */}
              <div className="md:col-span-2">
                <label className="label-modern mb-2 block">Gallery Images</label>
                <div className="gallery-grid-modern">
                  {newProject.images.map((img, idx) => (
                    <div key={idx} className="gallery-item-modern group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false, idx)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-50"
                      />
                      {img ? (
                        <>
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <div className="image-overlay">
                            {newProject.images.length > 1 && (
                              <button
                                onClick={(e) => { e.preventDefault(); removeProjectImageField(idx); }}
                                className="btn-remove-mini relative z-50"
                              >
                                <X size={12} />
                              </button>
                            )}
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <Plus size={16} className="text-zinc-300 dark:text-zinc-700" />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addProjectImageField}
                    className="gallery-add-btn-modern"
                  >
                    <Plus size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer-modern">
          <button onClick={handleCloseModal} className="btn-cancel-modern">
            Cancel
          </button>
          <button onClick={handleAddProjectSubmit} className="btn-save-modern">
            {isEditing ? 'Save Changes' : 'Create Project'} <ArrowRight size={16} />
          </button>
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
          <button
            onClick={() => {
              localStorage.removeItem('isAdminAuthenticated');
              window.location.reload();
            }}
            className="nav-item text-red-500 hover:bg-red-500/10 mb-4"
          >
            <div className="nav-icon-box bg-red-500/10 text-red-500">
              <LogOut size={18} />
            </div>
            <span className="nav-label">LOGOUT</span>
          </button>
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
            <div onClick={() => {
              setIsEditing(false);
              setNewProject({ title: '', topic: '', description: '', thumbnail: '', images: [''], client: '', year: new Date().getFullYear().toString(), service: '' });
              setShowAddProjectModal(true);
            }} className="action-btn btn-add">
              <Plus size={18} />
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <div className="content-wrapper">

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