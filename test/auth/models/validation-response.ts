import { TranslateResult } from 'vue-i18n';

export interface ValidationResponse {
  valid: boolean;
  text: TranslateResult;
  validate: (arg: string) => boolean;
}
