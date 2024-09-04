import { Env } from '@env';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getDetailTimses } from '@/api';
import { getAllDesa } from '@/api/desa';
import { getAllKecamatan } from '@/api/kecamatan';
import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { useAuth } from '@/core';
import { getToken } from '@/core/auth/utils';
import type { Option } from '@/ui';
import {
  ActivityIndicator,
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  Modal,
  SafeAreaView,
  ScrollView,
  Select,
  Text,
  useModal,
  View,
} from '@/ui';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  name: z.string(),
  nik: z.string().min(16),
  address: z.string(),
  phone: z.string(),
});

const schemaPassword = z.object({
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

type FormType = z.infer<typeof schema>;

type FormTypePassword = z.infer<typeof schemaPassword>;

const options: Option[] = [
  { value: 'false', label: 'Tidak Aktif' },
  { value: 'true', label: 'Aktif' },
];

export default function ProfilePage() {
  const signOut = useAuth.use.signOut();
  const { data, isError, isPending } = getDetailTimses();
  const [loading, setLoading] = React.useState(false);
  const [loadingPassword, setLoadingPassword] = React.useState(false);
  const { ref, present, dismiss } = useModal();
  const [error, setError] = React.useState<string | null>(null);
  const { data: dataKec } = getAllKecamatan();
  // console.log('kec', dataKec);
  // console.log('data profile', data);
  const [valueKec, setValueKec] = React.useState<string | number | undefined>();
  const { data: dataDesa } = getAllDesa({
    //@ts-ignore
    variables: { id: valueKec },
  });
  // console.log('desa', dataDesa);
  const [valueDesa, setValueDesa] = React.useState<
    string | number | undefined
  >();
  const [valueStatus, setValueStatus] = React.useState<
    string | number | undefined
  >();
  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { control: controlPassword, handleSubmit: handleSubmitPassword } =
    useForm<FormTypePassword>({
      resolver: zodResolver(schemaPassword),
    });

  const optionsKec: Option[] =
    dataKec?.data?.map((kecamatan) => ({
      value: kecamatan.id,
      label: kecamatan.name,
    })) || [];

  const optionsDesa: Option[] =
    dataDesa?.data?.map((desa) => ({
      value: desa.id,
      label: desa.name,
    })) || [];

  useEffect(() => {
    if (data) {
      reset({
        email: data.email || '',
        name: data.name || '',
        nik: data.nik.toString() || '',
        address: data.address || '',
        phone: data.phone || '',
      });
      setValueKec(data.kecamatan);
      setValueDesa(data.desa);
      setValueStatus(data.aktif.toString());
    }
  }, [data, reset]);

  const onSubmit = async (Fromdata: FormType) => {
    console.log('data yang akan diedit', Fromdata);
    setLoading(true);
    const token = await getToken();

    if (!token?.access) {
      console.error('Token is invalid or missing');
      setError('Gagal mendapatkan token. Silakan coba lagi.');
      present();
      setLoading(false);
      return;
    }

    console.log('token', token.access);
    console.log('id timses', data?.timses_id);
    try {
      const response = await fetch(
        `${Env.API_URL}/api/v1/timses/timses-mlm/update/${data?.timses_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
          body: JSON.stringify({
            nik: Number(Fromdata.nik),
            name: Fromdata.name,
            phone: Fromdata.phone,
            email: Fromdata.email,
            kabupaten: '1207',
            kecamatan: valueKec,
            desa: valueDesa,
            address: Fromdata.address,
          }),
        }
      );

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil kirim data');
        setError('Berhasil Edit Data');
        present();
      } else {
        console.error('Edit Data Timses failed:', result.message);
        setError(result.message);
        present();
      }
    } catch (error) {
      console.error('Error during Edit Data Timses:', error);
      setError('Gagal Edit Data Timses');
      present();
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (FromdataPassword: FormTypePassword) => {
    console.log('Password data yang akan diedit', FromdataPassword);
    setLoadingPassword(true);
    const token = await getToken();

    if (!token?.access) {
      console.error('Token is invalid or missing');
      setError('Gagal mendapatkan token. Silakan coba lagi.');
      present();
      setLoadingPassword(false);
      return;
    }

    console.log('token', token.access);

    try {
      const response = await fetch(
        `${Env.API_URL}/api/v1/timses/timses-mlm/update-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.access}`,
          },
          body: JSON.stringify({
            password: FromdataPassword.password,
          }),
        }
      );

      const result = await response.json();
      console.log('data response', result);
      if (response.ok) {
        console.log('berhasil Ubah Password');
        setError('Berhasil Ubah Password');
        present();
      } else {
        console.error('Edit Password Data Timses failed:', result.message);
        setError(result.message);
        present();
      }
    } catch (error) {
      console.error('Error during Edit Password Data Timses:', error);
      setError('Gagal Edit Password Data Timses');
      present();
    } finally {
      setLoadingPassword(false);
    }
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <Text className="text-center">Error Mengambil Data Profile</Text>
        <Button
          label="Sign Out"
          onPress={signOut}
          className="mt-4"
          variant="blue"
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <FocusAwareStatusBar />
      <ScrollView className="p-4">
        <ControlledInput
          name="email"
          label="Nama Lengkap"
          control={control}
          testID="email"
        />
        <ControlledInput
          name="name"
          label="Nama Lengkap"
          control={control}
          testID="name"
        />
        <ControlledInput
          name="nik"
          label="NIK"
          control={control}
          keyboardType="numeric"
          testID="nik"
        />
        <ControlledInput
          name="address"
          label="Alamat"
          control={control}
          testID="address"
        />
        <Select
          label="Kecamatan"
          options={optionsKec}
          value={valueKec}
          onSelect={(option) => setValueKec(option)}
        />
        <Select
          label="Desa"
          options={optionsDesa}
          value={valueDesa}
          onSelect={(option) => setValueDesa(option)}
        />
        <ControlledInput
          name="phone"
          label="No. Hp"
          control={control}
          keyboardType="numeric"
          multiline
          testID="phone-input"
        />
        <Select
          label="Status"
          options={options}
          value={valueStatus}
          onSelect={(option) => setValueStatus(option)}
        />
        <Button
          label="Edit Data"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
          className="mb-10"
          variant="blue"
        />

        <ControlledInput
          name="password"
          label="Password"
          control={controlPassword}
          placeholder="*******"
          secureTextEntry={true}
          testID="password-input"
        />

        <Button
          label="Edit Password"
          loading={loadingPassword}
          onPress={handleSubmitPassword(onSubmitPassword)}
          testID="add-post-button"
          className="mb-10"
          variant="blue"
        />

        <View className="my-8">
          <ItemsContainer>
            <Item text="settings.logout" onPress={signOut} />
          </ItemsContainer>
        </View>
      </ScrollView>
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Edit Data Error"
        onDismiss={dismiss}
      >
        <View style={{ padding: 20 }}>
          <Text className="text-center dark:text-black">{error}</Text>
          <Button label="Tutup" variant="blue" onPress={dismiss} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
