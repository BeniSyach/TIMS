import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getAllDesa } from '@/api/desa';
import { getAllKecamatan } from '@/api/kecamatan';
import type { Option } from '@/ui';
import { Button, ControlledInput, Select, Text, View, ActivityIndicator, Pressable } from '@/ui';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { Alert } from 'react-native';
import { getAllTps } from '@/api/list-tps';
import * as Location from "expo-location";
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
  longitude: z.string({ required_error: 'longitude Tidak Boleh Kosong' }),
  latitude: z.string({ required_error: 'latitude Tidak Boleh Kosong' }),
  unit: z.string({ required_error: 'unit Tidak Boleh Kosong' }).optional(),
  bantuan: z.string({ required_error: 'bantuan Tidak Boleh Kosong' }).optional(),
});

export type FormType = z.infer<typeof schema>;

export type PendukungFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  loading: boolean;
  resetForm: () => void;
};

export const PostPendukung = ({
  onSubmit = () => {},
  loading,
  resetForm,
}: PendukungFormProps) => {
  const [location, setLocation] = React.useState<Location.LocationObject | null>(null);
  const [watcher, setWatcher] = React.useState<Location.LocationSubscription | null>(null);
  const [errorMsg, setErrorMsg] =  React.useState<string | null>(null);
  const [updating, setUpdating] = React.useState(false);
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [activeInput, setActiveInput] = React.useState('');
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

  // select
  const { data: dataKec } = getAllKecamatan();
  const { data: dataTps } = getAllTps();
  const { data: dataDesa } = getAllDesa({
    //@ts-ignore
    variables: { id: kecamatan },
  });
  const {data: unit} = getUnitMaster();
  const {data: master} = getMasterBantuan();

  React.useEffect(() => {
    resetForm(); 
    reset(); 
    setKecamatan(undefined); // Kembalikan pilihan select ke default/placeholder
    setDesa(undefined);
    setTps(undefined);
    setUnitValue(undefined);
    setMasterValue([]);
  }, [resetForm]);

  React.useEffect(() => {
    if (kecamatan) setValue('kecamatan', kecamatan.toString());
    if (desa) setValue('desa', desa.toString());
    if (tps) setValue('tps', tps.toString());
    if (location?.coords.latitude) setValue('longitude', location.coords.latitude.toString());
    if (location?.coords.longitude) setValue('latitude', location.coords.longitude.toString());
    if (unitValue) setValue('unit', unitValue.toString());
    if (masterValue) setValue('bantuan', masterValue.toString());
  }, [kecamatan, desa, tps, location, unitValue, masterValue, setValue]);

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

    useEffect(() => {
      Voice.onSpeechResults = onSpeechResults;
  
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, [activeInput]);

    const onSpeechResults = (event: SpeechResultsEvent) => {
      if (event.value && event.value.length > 0) {
        const spokenText = event.value[0] || '';
        if(activeInput === 'name'){
          setValue('name', spokenText);
        }else if (activeInput === 'nik'){
          const nikWithoutSpaces = spokenText.replace(/\s+/g, '');
          setValue('nik', nikWithoutSpaces);
        }else if (activeInput === 'address'){
          setValue('address', spokenText);
        }else if (activeInput === 'phone'){
          const phoneWithoutSpaces = spokenText.replace(/\s+/g, '');
          setValue('phone', phoneWithoutSpaces);
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

    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission Untuk Akses Lokasi Di Tolak');
        return;
      }

      const locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, 
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
  
      setWatcher(locationWatcher);
      setUpdating(true);
    };

    const stopLocationUpdates = () => {
      if (watcher) {
        watcher.remove();
        setWatcher(null);
        setUpdating(false);
      }
    };
  
    useEffect(() => {
      return () => {
        if (watcher) {
          watcher.remove();
        }
      };
    }, [watcher]);

  return (
    <View className="flex-1 justify-center p-4">
        <ControlledInput
          name="name"
          label="Nama Lengkap"
          control={control}
          testID="name"
          placeholder='Masukkan Nama Lengkap'
          onFocus={() => setActiveInput('name')}
        />
      <ControlledInput
        name="nik"
        label="NIK"
        control={control}
        keyboardType="numeric"
        multiline
        testID="nik-input"
        placeholder='Masukkan NIK'
        onFocus={() => setActiveInput('nik')}
      />
      <ControlledInput
        name="address"
        label="Alamat"
        control={control}
        testID="address"
        placeholder='Masukkan Alamat'
        onFocus={() => setActiveInput('address')}
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
        placeholder='Pilih No TPS...'
      />
      <ControlledInput
        name="phone"
        label="No. Hp"
        control={control}
        keyboardType="numeric"
        multiline
        testID="phone-input"
        placeholder='Masukkan No Hp'
        onFocus={() => setActiveInput('phone')}
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

      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        <View>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      ) : (
        <>
        <Text>Latitude: Silahkan Klik Tombol Mulai Ambil Lokasi</Text>
        <Text>Longitude: Silahkan Klik Tombol Mulai Ambil Lokasi</Text>
        </>
      )}

      {!updating ? (
        <Button label="Mulai Ambil Lokasi" onPress={startLocationUpdates} />
      ) : (
        <Button label="Stop Pencarian Lokasi" onPress={stopLocationUpdates} />
      )}

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
