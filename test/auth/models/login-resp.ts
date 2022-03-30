import { BaseResponse } from '@/shared/models/base-response';

export interface LoginResp extends BaseResponse {
  id?: string;
  isBeforeLock?: boolean;
  maskedPhoneNum?: string;
  maskedEmailAddress?: string;
}
