import { notifications } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';

interface NotificationProps {
  title: string;
  message: string;
  isLoading?: boolean;
}

const CheckIcon = <IconCheck stroke={3} />;
const WarningIcon = <IconExclamationMark stroke={3} />;

const commonProps = (title: string, message: string, isLoading?: boolean) => ({
  title: title,
  message: message,
  radius: 'md',
  withBorder: true,
  loading: isLoading
});

export const showSuccessNotification = ({ title, message, isLoading }: NotificationProps) => {
  notifications.show({
    color: 'green',
    icon: CheckIcon,
    ...commonProps(title, message, isLoading)
  });
};

export const showWarningNotification = ({ title, message, isLoading }: NotificationProps) => {
  notifications.show({
    color: 'orange',
    icon: WarningIcon,
    ...commonProps(title, message, isLoading)
  });
};

export const showErrorNotification = ({ title, message, isLoading }: NotificationProps) => {
  notifications.show({
    color: 'red',
    icon: WarningIcon,
    ...commonProps(title, message, isLoading)
  });
};
