import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { getAllDesa } from '@/api/desa';
import { getAllKecamatan } from '@/api/kecamatan';
import type { Option } from '@/ui';
import { Button, ControlledInput, Image, Select, View } from '@/ui';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getAllTps } from '@/api/list-tps';

const schema = z.object({
  tps: z.string({ required_error: 'TPS Tidak Boleh Kosong' }),
  desa: z.string({ required_error: 'Desa Tidak Boleh Kosong' }),
  kecamatan: z.string({ required_error: 'Kecamatan Tidak Boleh Kosong' }),
  suara: z.string({ required_error: 'Suara Tidak Boleh Kosong' }),
  bukti_photo: z.string({ required_error: 'Photo Tidak Boleh Kosong' }),
  mimeType: z.string({ required_error: 'mimeType Tidak Boleh Kosong' }),
  name: z.string({ required_error: 'name Tidak Boleh Kosong' }),
  id: z.string().array().optional(),
});

type FormTypeEdit = {
  id: string | undefined;
  tps: string | undefined;
  desa: string | undefined;
  kecamatan: string | undefined;
  suara: string | undefined;
}

export type FormType = z.infer<typeof schema>;

export type SaksiFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  loading: boolean;
  dataBerkas : FormTypeEdit;
};

export const EditSaksi = ({
  onSubmit = () => {},
  loading,
  dataBerkas
}: SaksiFormProps) => {
  const [image, setImage] = React.useState<string | null>(null);
  const [mimeType, setmimeType] = React.useState<string>('');
  const [name, setname] = React.useState<string>('');
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [activeInput, setActiveInput] = React.useState('');
  const { handleSubmit, control, setValue, reset, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  console.log('kesalahan', errors)
  const [kecamatan, setKecamatan] = React.useState<
    string | number | undefined
  >();
  const [desa, setDesa] = React.useState<string | number | undefined>();
  const [tps, setTps] = React.useState<string | number | undefined>();

  const { data: dataKec } = getAllKecamatan();
  const { data: dataTps } = getAllTps();
  const { data: dataDesa } = getAllDesa({
    //@ts-ignore
    variables: { id: kecamatan },
  });

  React.useEffect(() => {
    reset({
      suara: dataBerkas.suara || '',
    });
    setTps(dataBerkas.tps);
    setDesa(dataBerkas.desa);
    setKecamatan(dataBerkas.kecamatan);
    if (kecamatan) setValue('kecamatan', kecamatan.toString());
    if (desa) setValue('desa', desa.toString());
    if (tps) setValue('tps', tps.toString());
    if (image) setValue('bukti_photo', image.toString());
    if (mimeType) setValue('mimeType', mimeType.toString());
    if (name) setValue('name', name.toString());
  }, [kecamatan, desa, image, setValue]);

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

  const optionsTps: Option[] =
    dataTps?.data?.map((dataT) => ({
      value: dataT.tps_master_id,
      label: dataT.name_tps,
    })) || [];

    useEffect(() => {
      Voice.onSpeechResults = onSpeechResults;
  
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, [activeInput]);

    const onSpeechResults = (event: SpeechResultsEvent) => {
      if (event.value && event.value.length > 0) {
        if(activeInput === 'suara'){
          reset({
            suara: event.value[0] || ''
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

    const getFileSize = async (uri: string) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob.size;
      } catch (error) {
        console.error('Error getting file size:', error);
        return 0;
      }
    };

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const imagemimeType = result.assets[0].mimeType;
        const imagename = result.assets[0].fileName;
        setValue('mimeType', imagemimeType ?? '');
        setmimeType(imagemimeType ?? '');
        setValue('name', imagename ?? '');
        setname(imagename ?? '')
        let compressedImageUri = imageUri;
        let compressedImageSize = 0;
    
        // Try different compression qualities until the file size is below 2 MB
        for (let quality = 0.9; quality >= 0.1; quality -= 0.1) {
          const compressedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [],
            { compress: quality, format: ImageManipulator.SaveFormat.JPEG } // Compress and save as JPEG
          );
    
          // Get the file size of the compressed image
          compressedImageSize = await getFileSize(compressedImage.uri);
          
          if (compressedImageSize < 2 * 1024 * 1024) { // Check if the size is below 2 MB
            compressedImageUri = compressedImage.uri;
            break;
          }
        }
    
        console.log('Compressed Image URI:', compressedImageUri);
        console.log('Compressed Image Size:', compressedImageSize);
    
        setImage(compressedImageUri);
        setValue('bukti_photo', compressedImageUri);
      }
    };

  return (
    <View className="flex-1 justify-center p-4">
      <Select
        label="No TPS"
        options={optionsTps}
        value={tps}
        onSelect={(option) => setTps(option)}
        placeholder='Pilih No TPS...'
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
      <ControlledInput
        name="suara"
        label="Hasil Suara"
        control={control}
        keyboardType="numeric"
        multiline
        testID="suara-input"
        onFocus={() => setActiveInput('suara')}
      />
      {image && (
        <View className="items-center my-10">
          <Image
            source={{ uri: image }}
            className="w-[100%] h-44"
            style={{ resizeMode: 'contain' }} 
          />
        </View>
      )}
      <Button label="Ambil Foto" onPress={pickImage} />
       {image && <Image source={{ uri: image }} />}
       
      <Button
        label="Update Data Berkas Saksi"
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
