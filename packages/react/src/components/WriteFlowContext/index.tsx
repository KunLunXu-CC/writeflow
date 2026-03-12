import { WriteFlow } from '@kunlunxu/wf-core';
import { createContext, useContext } from 'react';

export const WriteFlowContext = createContext<WriteFlow | null>(null);

export const useWriteFlowContext = () => useContext(WriteFlowContext);
