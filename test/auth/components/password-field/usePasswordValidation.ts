import { ValidationResponse } from '@views/auth/models/validation-response';
import { ref, Ref, watch, reactive } from '@vue/composition-api';
import i18n from '@/plugins/i18n';
import { containsSubsequence } from '@views/auth/validators/sequence-validatior';

interface UsePasswordValidationReturnType {
  validationResponse: Array<ValidationResponse>;
  validationPassed: Ref<boolean>;
}

export const usePasswordValidation = (password: Ref<string>): UsePasswordValidationReturnType => {
  const validationPassed = ref(false);

  const validationResponse = reactive<Array<ValidationResponse>>([
    {
      valid: false,
      text: i18n.t('VALIDATIONS.NO_SPACE'),
      validate(item: string): boolean {
        return !item.includes(' ');
      },
    },
    {
      valid: false,
      text: i18n.t('VALIDATIONS.LENGTH_BETWEEN_8_AND_16'),
      validate(item: string): boolean {
        return item.length >= 8 && item.length <= 16;
      },
    },
    {
      valid: false,
      text: i18n.t('VALIDATIONS.AT_LEAST_ONE_DIGIT'),
      validate(item: string): boolean {
        return /\d/.test(item);
      },
    },
    {
      valid: false,
      text: i18n.t('VALIDATIONS.LOWER_AND_UPPER_CASE'),
      validate(item: string): boolean {
        return /(?=.*[a-z])(?=.*[A-Z])/.test(item);
      },
    },
    {
      valid: false,
      text: i18n.t('VALIDATIONS.ONLY_ENGLISH_CHARS'),
      validate(item: string): boolean {
        return /^[A-Za-z0-9]+$/.test(item);
      },
    },

    {
      valid: false,
      text: i18n.t('VALIDATIONS.NO_ALPHABETIC_SEQUENCES'),
      validate(item: string): boolean {
        const psw = String(item || '');

        return !containsSubsequence({
          target: psw.toLocaleLowerCase(),
          pattern: 'abcdefghijklmnopqrstuvwxyz',
          subsequenceLength: 3,
        });
      },
    },
    {
      valid: false,
      text: i18n.t('VALIDATIONS.NO_KEYBOARD_SEQUENCES'),
      validate(item: string): boolean {
        const psw = String(item || '');
        const includesQazLike = /qaz|wsx|edc|rfv|tgb|yhn|ujm/.test(psw.toLocaleLowerCase());

        const includesQwertyLike = containsSubsequence({
          target: psw.toLocaleLowerCase(),
          pattern: 'qwertyuiopasdfghjklzxcvbnm',
          subsequenceLength: 4,
        });

        return !includesQwertyLike && !includesQazLike;
      },
    },
    {
      valid: false,
      text: i18n.t('VALIDATIONS.NO_NUMERIC_SEQUENCES'),
      validate(item: string): boolean {
        const psw = String(item || '');

        return !containsSubsequence({
          target: psw.toLocaleLowerCase(),
          pattern: '01234567890',
          subsequenceLength: 3,
        });
      },
    },
  ]);

  const getValidationResults = (): void => {
    validationPassed.value = true;
    for (const index in validationResponse) {
      const result = validationResponse[index].validate(password.value);
      validationResponse[index].valid = result;

      if (!result) {
        validationPassed.value = result;
      }
    }
  };

  watch(password, getValidationResults);

  return {
    validationResponse,
    validationPassed,
  };
};
