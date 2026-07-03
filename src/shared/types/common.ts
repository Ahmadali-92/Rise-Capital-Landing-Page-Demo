import {ReactNode} from 'react';

// Children-only props shared across providers / wrappers.
export interface NodeChildrenProps {
  children: ReactNode;
}

// Standard success envelope returned by every backend endpoint:
// { success: true, data: <payload> }
export interface ApiEnvelope<T = unknown> {
  success: true;
  data: T;
}

// Error envelope returned on failure:
// { success: false, error: { code, message, details? } }
export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
