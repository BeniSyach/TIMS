import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { useAddPost } from '@/api';
import type { Option } from '@/ui';
import {
  Button,
  ControlledInput,
  ScrollView,
  Select,
  showErrorMessage,
} from '@/ui';

const schema = z.object({
  title: z.string().min(10),
  body: z.string().min(120),
});

type FormType = z.infer<typeof schema>;

const options: Option[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

export default function AddPost() {
  const [value, setValue] = React.useState<string | number | undefined>();
  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { mutate: addPost, isPending } = useAddPost();

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
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tambah Data',
          headerBackTitle: 'Tambah Data Pendukung/Relawan',
        }}
      />
      <ScrollView className="flex-1 p-4">
        <ControlledInput
          name="title"
          label="Nama Lengkap"
          control={control}
          testID="title"
        />
        <ControlledInput
          name="body"
          label="NIK"
          control={control}
          multiline
          testID="body-input"
        />
        <Select
          label="Jenis Kelamin"
          options={options}
          value={value}
          onSelect={(option) => setValue(option)}
        />
        <ControlledInput
          name="title"
          label="Alamat"
          control={control}
          testID="title"
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
          name="body"
          label="TPS"
          control={control}
          multiline
          testID="body-input"
          disabled
        />
        <ControlledInput
          name="body"
          label="No. Hp"
          control={control}
          multiline
          testID="body-input"
        />
        <Select
          label="Status"
          options={options}
          value={value}
          onSelect={(option) => setValue(option)}
        />
        <Button
          label="Add Post"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
          className="mb-10"
        />
      </ScrollView>
    </>
  );
}
