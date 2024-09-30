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
import { getAllTps } from '@/api/list-tps';
import { getUnitMaster } from '@/api/unit-master';
import { getMasterBantuan } from '@/api/master-bantuan';
import { MultipleSelect } from '@/ui/multiple-select';

const schema = z.object({
  name: z.string({ required_error: 'Nama Lengkap Tidak Boleh Kosong' }),
  nik: z.string({ required_error: 'Nik Tidak Boleh Kosong' }).min(16),
  address: z.string({ required_error: 'Alamat Tidak Boleh Kosong' }),
  tps: z.string({ required_error: 'TPS Tidak Boleh Kosong' }),
  phone: z.string({ required_error: 'No Hp Tidak Boleh Kosong' }),
  kecamatan: z.string({ required_error: 'Kecamatan Tidak Boleh Kosong' }),
  desa: z.string({ required_error: 'Desa Tidak Boleh Kosong' }),
  unit: z.string({ required_error: 'unit Tidak Boleh Kosong' }).optional(),
  bantuan: z.string({ required_error: 'bantuan Tidak Boleh Kosong' }).optional(),
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
  const [tps, setTps] = React.useState<string | number | undefined>();
  const [unitValue, setUnitValue] = React.useState<string | number | undefined>();
  const [masterValue, setMasterValue] = React.useState<(string | number)[]>([]);

  const { data: dataKec } = getAllKecamatan();
  const { data: dataTps } = getAllTps();
  const { data: dataDesa } = getAllDesa({
    //@ts-ignore
    variables: { id: kecamatan },
  });
  const {data: unit} = getUnitMaster();
  const {data: master} = getMasterBantuan();

  React.useEffect(() => {
    if (kecamatan) setValue('kecamatan', kecamatan.toString());
    if (desa) setValue('desa', desa.toString());
    if (tps) setValue('tps', tps.toString());
    if (unitValue) setValue('unit', unitValue.toString());
    if (masterValue) setValue('bantuan', masterValue.toString());
  }, [kecamatan, desa, tps, unitValue, masterValue, setValue]);

  React.useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        nik: data.nik.toString() || '',
        address: data.address || '',
        phone: data.phone || '',
      });
      setKecamatan(data.kecamatan);
      setDesa(data.desa);
      setTps(data.tps);
      setUnitValue(data.unit);
      setMasterValue(data.bantuan.split(','));
    }
  }, []);

  const optionsKec: Option[] =
    dataKec?.data?.map((kecamatan) => ({
      value: kecamatan.id,
      label: kecamatan.name,
    })) || [];

    const optionsTps: Option[] =
    dataTps?.data?.map((DataTps) => ({
      value: DataTps.name_tps,
      label: DataTps.name_tps,
    })) || [];

  const optionsDesa: Option[] =
    dataDesa?.data?.map((desa) => ({
      value: desa.id,
      label: desa.name,
    })) || [];

    const optionsUnit: Option[] =
    unit?.data?.map((desa) => ({
      value: desa.unit_master_id,
      label: desa.nama_unit,
    })) || [];   

  const optionsBantuan: Option[] =
    master?.data?.map((desa) => ({
      value: desa.bantuan_id,
      label: desa.nama_bantuan,
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
        placeholder='Pilih Kecamatan...'
      />
      <Select
        label="Desa"
        options={optionsDesa}
        value={desa}
        onSelect={(option) => setDesa(option)}
        placeholder='Pilih Desa...'
      />
      <Select
        label="TPS"
        options={optionsTps}
        value={tps}
        onSelect={(option) => setTps(option)}
        placeholder='Pilih TPS...'
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
        label="Unit"
        options={optionsUnit}
        value={unitValue}
        onSelect={(option) => setUnitValue(option)}
        placeholder='Pilih Unit...'
      />
      <MultipleSelect
        label="Bantuan"
        options={optionsBantuan}
        value={masterValue}
        onSelect={(option) => setMasterValue(option)}
        placeholder='Pilih Bantuan...'
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
