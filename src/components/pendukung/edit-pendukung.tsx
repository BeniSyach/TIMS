import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { Pendukung } from '@/api';
import { getAllDesa } from '@/api/desa';
import { getAllKecamatan } from '@/api/kecamatan';
import type { Option } from '@/ui';
import { Button, ControlledInput, Select, View } from '@/ui';

const schema = z.object({
  name: z.string({ required_error: 'Nama Lengkap Tidak Boleh Kosong' }),
  nik: z.string({ required_error: 'Nik Tidak Boleh Kosong' }).min(16),
  email: z
    .string({
      required_error: 'Email Tidak Boleh Kosong',
    })
    .email('Harus Format Email'),
  address: z.string({ required_error: 'Alamat Tidak Boleh Kosong' }),
  tps: z.string({ required_error: 'TPS Tidak Boleh Kosong' }),
  phone: z.string({ required_error: 'No Hp Tidak Boleh Kosong' }),
  kecamatan: z.string({ required_error: 'Kecamatan Tidak Boleh Kosong' }),
  desa: z.string({ required_error: 'Desa Tidak Boleh Kosong' }),
});

export type FormType = z.infer<typeof schema>;

export type PendukungFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  loading: boolean;
  data: Pendukung;
};

export const EditPendukung = ({
  onSubmit = () => {},
  loading,
  data,
}: PendukungFormProps) => {
  const { handleSubmit, control, setValue, reset } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const [kecamatan, setKecamatan] = React.useState<
    string | number | undefined
  >();
  const [desa, setDesa] = React.useState<string | number | undefined>();

  const { data: dataKec } = getAllKecamatan();
  const { data: dataDesa } = getAllDesa({
    //@ts-ignore
    variables: { id: kecamatan },
  });

  React.useEffect(() => {
    if (kecamatan) setValue('kecamatan', kecamatan.toString());
    if (desa) setValue('desa', desa.toString());
  }, [kecamatan, desa, setValue]);

  React.useEffect(() => {
    if (data) {
      reset({
        email: data.email || '',
        name: data.name || '',
        nik: data.nik.toString() || '',
        address: data.address || '',
        phone: data.phone || '',
        tps: data.tps || '',
      });
      setKecamatan(data.kecamatan);
      setDesa(data.desa);
    }
  }, []);

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

  return (
    <View className="flex-1 justify-center p-4">
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
        multiline
        testID="nik-input"
      />
      <ControlledInput
        name="email"
        label="Email"
        control={control}
        multiline
        testID="email-input"
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
        value={kecamatan}
        onSelect={(option) => setKecamatan(option)}
      />
      <Select
        label="Desa"
        options={optionsDesa}
        value={desa}
        onSelect={(option) => setDesa(option)}
      />
      <ControlledInput
        name="tps"
        label="TPS"
        control={control}
        keyboardType="numeric"
        multiline
        testID="tps-input"
      />
      <ControlledInput
        name="phone"
        label="No. Hp"
        control={control}
        keyboardType="numeric"
        multiline
        testID="phone-input"
      />
      <Button
        label="Edit Data Pendukung"
        loading={loading}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
        testID="add-post-button"
        className="mb-10"
      />
    </View>
  );
};
