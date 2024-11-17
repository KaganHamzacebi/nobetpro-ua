'use client';

import { NotificationType } from '@/libs/enums/NotificationType';
import {
  showErrorNotification,
  showSuccessNotification,
  showWarningNotification
} from '@/libs/helpers/notification-service';
import { removeQueryParam } from '@/libs/helpers/remove-query-param';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const notificationMap = {
  [NotificationType.Unauthorized]: {
    handler: showWarningNotification,
    title: 'Unauthorized',
    message: 'You should sign in before continuing'
  },
  [NotificationType.LoginSuccess]: {
    handler: showSuccessNotification,
    title: 'Logged In',
    message: 'Successfully logged in'
  },
  [NotificationType.LoginFailed]: {
    handler: showErrorNotification,
    title: 'Login Failed',
    message: 'Check your credentials'
  },
  [NotificationType.SignoutSuccess]: {
    handler: showSuccessNotification,
    title: 'Logged Out',
    message: 'Successfully logged out'
  },
  [NotificationType.SignupFailed]: {
    handler: showErrorNotification,
    title: 'Signup Failed',
    message: 'Signup failed for an unknown reason, please try again later'
  }
};

export default function NotificationCenter() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    Object.entries(notificationMap).forEach(([key, { handler, title, message }]) => {
      const paramContent = params.get(key);
      if (paramContent) {
        const notificationMessage = paramContent !== 'true' ? paramContent : message;
        handler({ title, message: notificationMessage });
        removeQueryParam(key, router, params);
      }
    });
  }, [params, router]);

  return <></>;
}
