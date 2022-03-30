import { UserDetailsResp } from '@views/auth/models/user-details-resp';
import { TokensResp } from '@/views/auth/models/tokens-resp';

export interface LoginVerifyResp extends TokensResp {
  userDetails: UserDetailsResp;
  isPasswordExpired: boolean;
  isBackofficeUser: boolean;
  hasMultipleCompanies: boolean;
  actions: Array<string>;
  pages: Array<string>;
  trustToken?: string;
}
