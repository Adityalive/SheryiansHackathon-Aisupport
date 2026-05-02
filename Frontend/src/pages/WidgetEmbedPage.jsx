// The /embed route is no longer used since widget.js is now self-contained.
// Keeping this as a redirect fallback in case old script tags are still in use.
import React from 'react';

const WidgetEmbedPage = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b' }}>
    Widget not found. Please update your embed script.
  </div>
);

export default WidgetEmbedPage;
