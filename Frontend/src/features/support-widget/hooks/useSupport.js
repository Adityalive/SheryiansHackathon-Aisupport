import { useContext } from 'react';
import { SupportContext } from '../context/SupportContextObject';

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};

export default useSupport;
