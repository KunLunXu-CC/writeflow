import { createContext, useContext } from 'react';
import type { WriteFlow } from '../../WriteFlow';

export const WriteFlowContext = createContext<WriteFlow | null>(null);

export const useWriteFlowContext = () => useContext(WriteFlowContext);
