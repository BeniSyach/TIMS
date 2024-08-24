import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { Option } from '@/ui';
import { Button, ControlledInput, Select, View } from '@/ui';

const schema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(10),
  body: z
    .string({
      required_error: 'Body is required',
    })
    .min(120),
});

export type FormType = z.infer<typeof schema>;

const options: Option[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

export type PendukungFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  loading: boolean;
};

export const PostPendukung = ({
  onSubmit = () => {},
  loading,
}: PendukungFormProps) => {
  const [value, setValue] = React.useState<string | number | undefined>();
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <View className="flex-1 justify-center p-4">
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
        loading={loading}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
        testID="add-post-button"
        className="mb-10"
      />
    </View>
  );
};
