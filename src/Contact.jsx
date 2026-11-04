// src/Contact.jsx
import React, { useState } from 'react';
import './Contact.css';
import { useSiteData } from './SiteDataContext';
import { submitContactMessage } from './services/api';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { footerColumns } from './components/siteNav';

const Contact = () => {
  const { contactData } = useSiteData();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await submitContactMessage(formData.name, formData.email, formData.message);
      setSubmitStatus({ success: true, message: 'Message sent successfully.' });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus({ success: false, message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fx-page contact-page">
      <SiteHeader active="CONTACT" />

      <section className="fx-section">
        <div className="fx-container contact-grid">
          <div className="contact-lead">
            <p className="fx-eyebrow">Contact</p>
            <h1 className="fx-display-xl contact-email">{contactData.email}</h1>
            <p className="contact-meta">
              {contactData.address}
              <br />
              {contactData.phone}
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="contact-name" className="fx-eyebrow">Name</label>
              <input
                id="contact-name"
                type="text"
                className="contact-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email" className="fx-eyebrow">Email</label>
              <input
                id="contact-email"
                type="email"
                className="contact-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message" className="fx-eyebrow">Message</label>
              <textarea
                id="contact-message"
                className="contact-input contact-textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className="fx-btn fx-btn--primary contact-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>

            {submitStatus && (
              <p
                className={`contact-status ${submitStatus.success ? 'contact-status--ok' : 'contact-status--error'}`}
                role="status"
              >
                {submitStatus.message}
              </p>
            )}
          </form>
        </div>
      </section>

      <SiteFooter columns={footerColumns(contactData)} />
    </div>
  );
};

export default Contact;
