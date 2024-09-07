import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getAllDesa } from '@/api/desa';
import { getAllKecamatan } from '@/api/kecamatan';
import type { Option } from '@/ui';
import { Button, ControlledInput, Select, View } from '@/ui';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { Alert } from 'react-native';

const schema = z.object({
  name: z.string({ required_error: 'Nama Lengkap Tidak Boleh Kosong' }),
  nik: z.string({ required_error: 'Nik Tidak Boleh Kosong' }).min(16),
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
};

export const PostPendukung = ({
  onSubmit = () => {},
  loading,
}: PendukungFormProps) => {

  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [activeInput, setActiveInput] = React.useState('');
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
      Voice.onSpeechResults = onSpeechResults;
  
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, [activeInput]);

    const onSpeechResults = (event: SpeechResultsEvent) => {
      if (event.value && event.value.length > 0) {
        if(activeInput === 'name'){
          reset({
            name: event.value[0] || ''
          });
        }else if (activeInput === 'nik'){
          reset({
            nik: event.value[0] || ''
          });
        }else if (activeInput === 'address'){
          reset({
            address: event.value[0] || ''
          });
        }else if (activeInput === 'tps'){
          reset({
            tps: event.value[0] || ''
          });
        }else if (activeInput === 'phone'){
          reset({
            phone: event.value[0] || ''
          });
        }else{
          Alert.alert('Input tidak valid', `Harap masukkan data yang benar.`);
        }

        setIsListening(false);
      }
    };
  
    const startListening = () => {
      setIsListening(true);
      Voice.start('id-ID'); // Menggunakan bahasa Indonesia
    };
  
    const stopListening = () => {
      Voice.stop();
      setIsListening(false);
    };

  return (
    <View className="flex-1 justify-center p-4">
      <ControlledInput
        name="name"
        label="Nama Lengkap"
        control={control}
        testID="name"
        onFocus={() => setActiveInput('name')}
      />
      <ControlledInput
        name="nik"
        label="NIK"
        control={control}
        keyboardType="numeric"
        multiline
        testID="nik-input"
        onFocus={() => setActiveInput('nik')}
      />
      <ControlledInput
        name="address"
        label="Alamat"
        control={control}
        testID="address"
        onFocus={() => setActiveInput('address')}
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
        onFocus={() => setActiveInput('tps')}
      />
      <ControlledInput
        name="phone"
        label="No. Hp"
        control={control}
        keyboardType="numeric"
        multiline
        testID="phone-input"
        onFocus={() => setActiveInput('phone')}
      />
      <Button
        label="Tambah Data Pendukung"
        loading={loading}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
        testID="add-post-button"
      />

      <Button
        label={isListening ? "Berhenti Mendengarkan" : "Mulai Bicara"}
        onPress={isListening ? stopListening : startListening}
        disabled={isListening || !activeInput}
        className="mb-10"
      />
    </View>
  );
};
