<template>
	<payroll-modal-form
	  :title="$t('AUTH.USER_COMPANIES')"
	  name="user-companies"
	  :errors="error"
	  :loading="loading"
	  :is-saving="loading"
	  :open-event="openEvent"
	  :close-event="closeEvent"
	  @submit="save"
	>
	  <template v-slot:content>
	    <div class="hrm-height-180 hrm-width-400">
	      <validation-provider v-slot="{ errors }" name="AUTH.SELECT_USER_COMPANY" rules="required">
	        <payroll-select
	          class="hrm-height-37"
	          v-if="companies"
	          v-model="indexNum"
	          label="AUTH.SELECT_USER_COMPANY"
	          placeholder="AUTH.SELECT_USER_COMPANY"
	          item-text="indexName"
	          item-value="indexNum"
	          :error-messages="errors"
	          :items="companies"
	        >
	        </payroll-select>
	      </validation-provider>
	    </div>
	  </template>
	</payroll-modal-form>
</template>

<script lang="ts">
import { CLOSE_USER_COMPANIES_MODAL, OPEN_USER_COMPANIES_MODAL } from '../../constants';
import {
  AUTH_FORM_ERRORS,
  AUTH_FORM_LOADING,
  SELECT_USER_COMPANY,
  SET_AUTH_FORM_LOADING,
  SET_AUTH_SUCCESS_OPERATION,
  USER_COMPANIES,
} from '@views/auth/store/constants';
import { defineComponent, ref, computed } from '@vue/composition-api';
import useAuthStore from '@views/auth/composables/use-auth-store';
import usePromise from '@/shared/composables/use-promise';

const openEvent: string = OPEN_USER_COMPANIES_MODAL;
const closeEvent: string = CLOSE_USER_COMPANIES_MODAL;

export default defineComponent({
  setup() {
    const { useActions, useGetters } = useAuthStore();

    const { [SELECT_USER_COMPANY]: selectUserCompany } = useActions([SELECT_USER_COMPANY]);

    const { [USER_COMPANIES]: companies } = useGetters([USER_COMPANIES]);

    const indexNum = ref<number>();

    const {
      loading,
      error,
      createPromise: save,
    } = usePromise(async () => {
      if (!indexNum.value) {
        return;
      }
      await selectUserCompany(indexNum.value);
    });

    return {
      openEvent,
      closeEvent,

      loading,
      error,
      companies,

      indexNum,
      close,
      save,
    };
  },
});
</script>

<style lang="scss">
</style>
