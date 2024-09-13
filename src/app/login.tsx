import { Env } from '@env';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { useAuth } from '@/core';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { Button, FocusAwareStatusBar, Modal, Text, useModal, View } from '@/ui';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  useSoftKeyboardEffect();
  const { ref, present, dismiss } = useModal();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    console.log('data login', data);
    setLoading(true);
    console.log('url login', Env.API_URL);
    try {
      const response = await fetch(`${Env.API_URL}/api/v1/timses/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        signIn({
          access: result.access_token,
          timsesId: result.data.timses_id,
          role: data.login
        });
        router.push('/');
      } else {
        console.error('Login failed:', result.message);
        setError(result.message);
        present();
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error Server');
      present();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} loading={loading} />
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Login Error"
        onDismiss={dismiss}
      >
        <View style={{ padding: 20 }}>
          <Text className="text-center dark:text-black">{error}</Text>
          <Button label="Tutup" variant="blue" onPress={dismiss} />
        </View>
      </Modal>
    </>
  );
}
