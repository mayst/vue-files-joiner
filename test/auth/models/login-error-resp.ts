import { ErrorResponse } from '@/shared/models/error-response';

export interface LoginErrorResp extends ErrorResponse {
  id?: string;
  isBeforeLock?: boolean;
}
