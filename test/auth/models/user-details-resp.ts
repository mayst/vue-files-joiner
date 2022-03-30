export interface UserDetailsResp {
  idNumber: number;
  firstName: string;
  lastName: string;
  lastSuccessLogin: string;
  email: string;
  phoneNum: string;
  totpEnabled: boolean;
  isBackofficeUser?: boolean;
  avatar?: string;
  initials: {
    text: string;
    color: string;
  };
}
