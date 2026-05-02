import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSupportStore } from '../features/support-widget/store/useSupportStore';
import SupportWidget from '../features/support-widget/components/SupportWidget';

const WidgetEmbedPage = () => {
  const { tenantId } = useParams();

  useEffect(() => {
    // Set the tenant and force the widget open on mount
    if (tenantId) {
      useSupportStore.setState({ tenantId, isOpen: true });
    }
  }, [tenantId]);

  return (
    <>
      {/* Override widget positioning so it fills the iframe completely */}
      <style>{`
        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: transparent;
        }
        .support-widget-container {
          position: fixed !important;
          bottom: 0 !important;
          right: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        .support-window {
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          margin-bottom: 0 !important;
          border-radius: 0 !important;
        }
        /* Hide the floating bubble — the external widget.js button controls open/close */
        .support-fab {
          display: none !important;
        }
      `}</style>
      <SupportWidget />
    </>
  );
};

export default WidgetEmbedPage;
