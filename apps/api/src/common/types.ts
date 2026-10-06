import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  display_name: string;
  status: 'active' | 'suspended' | 'disabled';
  organization_id: string;
  organization_name: string;
  role: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: AuthenticatedUser;
      sessionId?: string;
    }
  }
}

export type AppRequest = Request;
