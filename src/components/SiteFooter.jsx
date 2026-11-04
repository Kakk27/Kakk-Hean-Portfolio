// src/components/SiteFooter.jsx
// Shared footer + hairline strip. Columns are built from the admin-editable contact data
// so every page shows the same, current details.
import React from 'react';

const STRIP_TEXT = 'Crafted by Kakkhean Portfolio';

const SiteFooter = ({ columns }) => (
  <>
    <footer className="fx-footer">
      <div className="fx-container fx-footer-grid">
        {columns.map((col) => (
          <div className="fx-footer-col" key={col.title}>
            <h3 className="fx-footer-title">{col.title}</h3>
            {col.lines.filter(Boolean).map((line, i) =>
              typeof line === 'string' ? (
                <span key={i}>{line}</span>
              ) : (
                <a key={i} href={line.href} target={line.href?.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                  {line.label}
                </a>
              )
            )}
          </div>
        ))}
      </div>
    </footer>

    <div className="fx-strip" aria-hidden="true">
      <div className="fx-strip-track">
        {Array.from({ length: 12 }).map((_, i) => (
          <span className="fx-strip-item" key={i}>
            {STRIP_TEXT}
          </span>
        ))}
      </div>
    </div>
  </>
);

export default SiteFooter;
