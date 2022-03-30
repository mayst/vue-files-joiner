import {
  LOGIN_BY_PASSWORD,
  CHANGE_PASSWORD,
  LOGIN_VERIFY,
  GET_USER_COMPANIES,
  SELECT_USER_COMPANY,
  SEND_FORGOT_PASSWORD_MAIL,
  RESET_PASSWORD,
  VALIDATE_RESET_PASSWORD_TOKEN,
  LOGOUT,
  REFRESH_AUTH_TOKEN,
} from '@views/auth/store/constants';
import { inject, injectable } from 'tsyringe';
import { LoginReq } from '@/views/auth/models/login-req';
import { LoginVerifyReq } from '@/views/auth/models/login-verify-req';
import { LoginVerifyResp } from '@/views/auth/models/login-verify-resp';
import { LoginResp } from '@/views/auth/models/login-resp';
import { UserCompaniesResp } from '@/views/auth/models/user-companies-resp';
import { TokensResp } from '@/views/auth/models/tokens-resp';
import { BaseResponse } from '@/shared/models/base-response';
import { BaseAuth } from '@/views/auth/models/base-auth';
import { ChangePasswordReq } from '@views/auth/models/change-password-req';
import { ResetPasswordReq } from '@views/auth/models/reset-password-req';
import { ValidateResetPasswordReq } from '@views/auth/models/validate-reset-password-req';
import { DOMAIN } from '@/shared/constants/domain';
import { ApiService } from '@/shared/services';

@injectable()
export default class AuthApiService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private readonly axiosAuthRequestConfig: { baseURL: string } = {
    baseURL: `${DOMAIN}/auth/hrmx`,
  };

  private readonly baseSessionApi: string = `${DOMAIN}/api/hrmx/session/`;

  public loginByPassword(loginByPasswordData: LoginReq): Promise<LoginResp> {
    return this.apiService.post<LoginResp>(LOGIN_BY_PASSWORD, loginByPasswordData, this.axiosAuthRequestConfig);
  }

  public loginVerify(loginVerifyReq: LoginVerifyReq): Promise<LoginVerifyResp> {
    return this.apiService.post<LoginVerifyResp>(LOGIN_VERIFY, loginVerifyReq, this.axiosAuthRequestConfig);
  }

  public getUserCompanies(token: string | null): Promise<UserCompaniesResp> {
    return this.apiService.post<UserCompaniesResp>(
      GET_USER_COMPANIES,
      {},
      {
        baseURL: this.baseSessionApi,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  public selectUserCompany({ newIndexNum, token }: { newIndexNum: number; token: string | null }): Promise<LoginVerifyResp> {
    return this.apiService.post<LoginVerifyResp>(
      SELECT_USER_COMPANY,
      { newIndexNum },
      {
        baseURL: this.baseSessionApi,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }

  public sendForgotPasswordMail(forgotPasswordData: BaseAuth): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(SEND_FORGOT_PASSWORD_MAIL, forgotPasswordData, this.axiosAuthRequestConfig);
  }

  public changePassword(password: ChangePasswordReq): Promise<TokensResp> {
    return this.apiService.post<TokensResp>(CHANGE_PASSWORD, password, { baseURL: this.baseSessionApi });
  }

  public resetPassword(resetPasswordData: ResetPasswordReq): Promise<LoginVerifyResp> {
    return this.apiService.post<LoginVerifyResp>(RESET_PASSWORD, resetPasswordData, this.axiosAuthRequestConfig);
  }

  public validateResetPasswordToken(validateResetPasswordData: ValidateResetPasswordReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(VALIDATE_RESET_PASSWORD_TOKEN, validateResetPasswordData, this.axiosAuthRequestConfig);
  }

  public logout(): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(LOGOUT, {}, { baseURL: this.baseSessionApi });
  }

  public async refreshToken(refreshToken: string): Promise<TokensResp> {
    const response = await this.apiService.unsafeRequest({
      baseURL: this.baseSessionApi,
      url: REFRESH_AUTH_TOKEN,
      method: 'post',
      data: { refreshToken },
    });

    return response.data;
  }
}
