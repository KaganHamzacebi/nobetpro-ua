'use client';

import { LoginType } from '@/libs/enums/LoginType';
import { emailLogin, emailSignup, googleLogin, resetPassword } from '@/libs/supabase/login-actions';
import {
  Anchor,
  Button,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconBrandGoogleFilled, IconLock } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export default function Login() {
  const searchParams = useSearchParams();
  const isSignup = searchParams.get('signup') === 'true';
  const isForgotPassword = searchParams.get('forgotPassword') === 'true';

  const [loading, setLoading] = useState<{ [K in LoginType]: boolean }>(
    Object.values(LoginType).reduce(
      (prev, type) => {
        prev[type] = false;
        return prev;
      },
      {} as Record<LoginType, boolean>
    )
  );

  const actionButtonLabel = () => {
    if (isSignup) return 'Sign Up';
    else if (isForgotPassword) return 'Recover Password';
    else return 'Log In';
  };

  const setLoadingState = (key: LoginType, state: boolean) => {
    setLoading(prevState => ({
      ...prevState,
      [key]: state
    }));
  };

  const socials = [
    {
      key: LoginType.Google,
      icon: <IconBrandGoogleFilled />,
      action: () => {
        setLoadingState(LoginType.Google, true);
        googleLogin();
      }
    }
  ];

  const isDisabled = useMemo(() => {
    return Object.values(loading).some(state => state);
  }, [loading]);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: value => (/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid email'),
      password: value => (value.length >= 6 ? null : 'Password should has minimum length of 6')
    }
  });

  const handleFormAction = useCallback(
    async (values: typeof form.values) => {
      setLoadingState(LoginType.Email, true);
      if (isSignup) {
        await emailSignup(values);
      } else if (isForgotPassword) {
        await resetPassword(values.email);
      } else {
        await emailLogin(values);
      }
      setLoadingState(LoginType.Email, false);
    },
    [form, isForgotPassword, isSignup]
  );

  return (
    <form className="w-full max-w-[400px]" onSubmit={form.onSubmit(handleFormAction)}>
      <Stack className="rounded border border-silver border-opacity-50 p-4">
        <Text fw={600} size="lg">
          Login
        </Text>
        <Group gap="sm" grow>
          {socials.map(social => (
            <Button
              onClick={social.action}
              className="w-full"
              key={social.key}
              variant="default"
              disabled={isDisabled}
              loading={loading[social.key]}>
              {social.icon}
            </Button>
          ))}
        </Group>
        <Divider label="or continue with" />
        <Stack gap="xs">
          <TextInput
            autoFocus
            variant="default"
            label="Email"
            leftSection={<IconAt size={16} />}
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          {!isForgotPassword && (
            <PasswordInput
              variant="default"
              label="Password"
              leftSection={<IconLock size={16} />}
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
          )}
          <Button loading={loading[LoginType.Email]} disabled={isDisabled} type="submit">
            {actionButtonLabel()}
          </Button>
        </Stack>
        <Stack mt={2} gap="xs">
          <Anchor
            component={Link}
            href="/?forgotPassword=true"
            size="xs"
            c="dimmed"
            underline="hover"
            className={`${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            Forgot your password?
          </Anchor>
          {isSignup ? (
            <Anchor
              component={Link}
              href="/"
              size="xs"
              c="dimmed"
              underline="hover"
              className={`${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              Already have an account? Log in
            </Anchor>
          ) : (
            <Anchor
              component={Link}
              href="/?signup=true"
              size="xs"
              c="dimmed"
              underline="hover"
              className={`${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              Don&apos;t have an account? Sign up
            </Anchor>
          )}
        </Stack>
      </Stack>
    </form>
  );
}
