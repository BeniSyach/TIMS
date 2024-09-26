import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button, ControlledInput, Option, Select, Text, View } from '@/ui';

const optionsLogin: Option[] = [
  { value: 'Timses', label: 'Timses' },
  { value: 'Saksi', label: 'Saksi' },
  { value: 'Bupati', label: 'Bupati' },
];

const schema = z.object({
  email: z
    .string({
      required_error: 'Email Tidak Boleh Kosong',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password Tidak Boleh Kosong',
    })
    .min(6, 'Password Harus Lebih dari 6 karakter'),
    login: z.string({ required_error: 'login Tidak Boleh Kosong' }),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  loading: boolean;
};

export const LoginForm = ({ onSubmit = () => {}, loading }: LoginFormProps) => {
  const [Login, setLogin] =  React.useState<string | number | undefined>();
  const { handleSubmit, control, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  React.useEffect(() => {
    if (Login) setValue('login', Login.toString());
  }, [Login, setValue]);
  return (
    <View className="flex-1 justify-center p-4">
      <Text testID="form-title" className="pb-6 text-center text-2xl">
        Masuk
      </Text>

      <ControlledInput
        testID="email-input"
        control={control}
        name="email"
        label="Email"
      />
      <ControlledInput
        testID="password-input"
        control={control}
        name="password"
        label="Password"
        placeholder="*******"
        secureTextEntry={true}
      />
      <Select
        label="Login Sebagai"
        options={optionsLogin}
        value={Login}
        onSelect={(option) => setLogin(option)}
      />
      <Button
        testID="login-button"
        label="Login"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
};
