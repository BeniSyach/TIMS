import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';
import { getDetailTimses, useAddPost } from '@/api';
import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { useAuth } from '@/core';
import type { Option } from '@/ui';
import {
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Select,
  showErrorMessage,
  Text,
  View,
} from '@/ui';

const schema = z.object({
  email: z
  .string({
    required_error: 'Email is required',
  })
  .email('Invalid email format'),
  name: z.string().min(10),
  nik: z.string().min(10),
  address: z.string().min(120),
  phone: z.string().min(120),
  body: z.string().min(120),
  title : z.string().min(10)
});

type FormType = z.infer<typeof schema>;

const options: Option[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

export default function ProfilePage() {
  const signOut = useAuth.use.signOut();
  const {data, isError, isPending } = getDetailTimses();
  console.log('data profile', data)
  const [value, setValue] = React.useState<string | number | undefined>();

  const { control, handleSubmit, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { mutate: addPost } = useAddPost();

  useEffect(() => {
    if (data) {
      reset({
        email: data.email || '',
        name: data.name || '',
        nik: data.nik.toString() || '' ,
        address : data.address ||'',
        phone : data.phone ||'',
      });
    }
  }, [data, reset]);

  const onSubmit = (data: FormType) => {
    console.log(data);
    addPost(
      { ...data, userId: 1 },
      {
        onSuccess: () => {
          showMessage({
            message: 'Post added successfully',
            type: 'success',
          });
        },
        onError: () => {
          showErrorMessage('Error adding post');
        },
      }
    );
  };

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
          options={options}
          value={value}
          onSelect={(option) => setValue(option)}
        />
        <Select
          label="Desa"
          options={options}
          value={value}
          onSelect={(option) => setValue(option)}
        />
        <ControlledInput
          name="phone"
          label="No. Hp"
          control={control}
          multiline
          testID="phone-input"
        />
        <Select
          label="Status"
          options={options}
          value={value}
          onSelect={(option) => setValue(option)}
        />
        <Button
          label="Edit"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
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
    </SafeAreaView>
  );
}
