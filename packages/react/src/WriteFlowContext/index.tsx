import { useContext, createContext } from 'react';
import { WriteFlow } from '@/components/WriteFlow/types';

export const WriteFlowContext = createContext<WriteFlow | null>(null);

export const useWriteFlowContext = () => {
  return useContext(WriteFlowContext);
};
