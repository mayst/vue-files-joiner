import AuthComponent from '@/views/auth/auth.component.vue';
import LoginComponent from '@views/auth/pages/login/login.component.vue';
import PasswordExpiredComponent from '@/views/auth/pages/password-expired/password-expired.component.vue';
import ResetPasswordComponent from '@views/auth/pages/reset-password/reset-password.component.vue';
import LogoutComponent from '@views/auth/pages/logout/logout.component.vue';

export default [
  {
    path: '/login',
    component: AuthComponent,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginComponent,
        meta: { unprotected: true, showUnauthorizedOnly: true, fullLayout: true },
      },
    ],
  },
  {
    path: '/password-expired',
    name: 'password_expired',
    component: PasswordExpiredComponent,
    meta: { unprotected: true, fullLayout: true },
  },
  {
    path: '/reset-password',
    name: 'reset_password',
    component: ResetPasswordComponent,
    meta: { unprotected: true, showUnauthorizedOnly: true, fullLayout: true },
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutComponent,
    meta: {
      fullLayout: true,
      unprotected: true,
    },
  },
];
