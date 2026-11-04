// src/components/SiteHeader.jsx
// Shared top navigation + full-screen menu for every public page.
// Replaces the menu overlay that used to be copy-pasted into each page.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MENU_ITEMS } from './siteNav';

const Wordmark = ({ onClick }) =>
  onClick ? (
    <button type="button" className="fx-wordmark" onClick={onClick} aria-label="Kakkhean">
      KAKKHEAN
    </button>
  ) : (
    <Link to="/" className="fx-wordmark" aria-label="Kakkhean, home">
      KAKKHEAN
    </Link>
  );

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const SiteHeader = ({ active, onLogoClick, transparent = false }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`fx-nav${transparent ? ' fx-nav--clear' : ''}`}>
        <Wordmark onClick={onLogoClick} />
        <div className="fx-nav-right">
          {active && active !== 'HOME' && <span className="fx-nav-label">{active}</span>}
          <button
            type="button"
            className="fx-btn fx-btn--outline fx-btn--sm"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fx-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="fx-nav fx-nav--menu">
              <Wordmark />
              <button
                type="button"
                className="fx-btn fx-btn--outline fx-btn--sm"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <motion.ul className="fx-menu-list" variants={listVariants} initial="hidden" animate="visible">
              {MENU_ITEMS.map((item, index) => (
                <motion.li key={item.label} variants={itemVariants}>
                  <Link
                    to={item.to}
                    className="fx-menu-link"
                    aria-current={item.label === active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="fx-menu-index">{String(index + 1).padStart(2, '0')}</span>
                    <span>{item.label}</span>
                    <ArrowUpRight className="fx-menu-arrow" size={32} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SiteHeader;
