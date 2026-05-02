// Drop-in replacement: useSupport() now reads from the Zustand store.
// All existing consumers (SupportWidget, MessageList, MessageInput) work unchanged.
import { useSupportStore } from '../store/useSupportStore';

export const useSupport = useSupportStore;
export default useSupportStore;
