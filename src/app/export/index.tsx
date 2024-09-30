import { Env } from '@env';
import * as DocumentPicker from 'expo-document-picker';
import { Stack } from 'expo-router';
import React, { useState } from 'react';

import { getToken } from '@/core/auth/utils';
import { ActivityIndicator, Button, Modal, SafeAreaView, ScrollView, Text, useModal, View } from '@/ui';
import { Border } from '@/components/border';

type LogItem = {
  message: string;
  nik_timses: string;
};

const UploadFileForm: React.FC = () => {
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [statusMessage, setStatus] = useState<string | null>(null);
  const [log, setLog] = useState<LogItem[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // state untuk persentase
  const { ref, present, dismiss } = useModal();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
      });

      console.log('data', result);

      if (result?.assets?.[0]?.uri) {
        setFileUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const uploadFile = async () => {
    if (!fileUri) return;

    const token = await getToken();
    if (!token?.access) {
      console.error('Token is invalid or missing');
      setStatus('Gagal mendapatkan token. Silakan coba lagi.');
      present();
      setUploading(false);
      return;
    }

    setUploading(true);
    const apiUrl = `${Env.API_URL}/api/v1/timses/dokumen/import`;

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: 'uploaded_file.xlsx',
      } as any);


      const xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl);

      // Set headers
      xhr.setRequestHeader('Authorization', `Bearer ${token.access}`);

      // Event listener untuk progress upload
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress); 
          console.log(`Upload Progress: ${progress}%`);
        }
      };

      // Event listener untuk selesai upload
      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          console.log('Upload result:', result);
          setStatus(result.message);
          setLog(result.log)
          present();
        } else {
          const result = JSON.parse(xhr.responseText);
          console.log('Upload result:', result);
          setStatus('Gagal Import Data');
          present();
        }
        setUploading(false);
      };

      // Event listener untuk error
      xhr.onerror = () => {
        console.error('Error uploading file:', xhr.responseText);
        setStatus('Gagal Import Data');
        setUploading(false);
        present();
      };

      xhr.send(formData); // Kirim data
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Gagal Import Data');
      setUploading(false);
      present();
    }
  };

  return (
    <View className='mx-6'>
      <ScrollView>
      <Stack.Screen
        options={{
          title: 'Import Data Pendukung',
          headerBackTitle: 'Import Data Pendukung',
        }}
      />
      {fileUri ? (
        <Border>
        <Text className='text-lg'>Letak File: {fileUri}</Text>
        </Border>
      ) : (
        <Border>
        <Text className='text-center text-xl'>File Belum Ada di Upload</Text>
        </Border>
      )}
      <Button label="Ambil Dokumen" onPress={pickDocument} />

      {fileUri && (
        <Button
          label={uploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
          onPress={uploadFile}
          disabled={uploading}
        />
      )}
  {log && log.length > 0 ? (
        <View>
          <Text>Log File :</Text>
          {log.map((item, index) => (
            <Border>
            <View key={index} style={{ padding: 10 }}>
              <Text>{`Error Log #${index + 1}: ${item.message}`}</Text>
              <Text>{`NIK Pendukung Sudah Ada dengan NIK Timses: ${item.nik_timses}`}</Text>
            </View>
            </Border>
          ))}
        </View>
      ) : (
        <Text className='text-center my-5'>Belum Ada Logs Tersedia</Text>
      )}
      {uploading && (
        <View>
          <Text className='text-2xl text-center'>Uploading: {uploadProgress}%</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Modal
        ref={ref}
        snapPoints={['40%']}
        title="Status Import Data"
        onDismiss={dismiss}
      >
        <View style={{ padding: 20 }}>
          <Text className="text-center dark:text-black">{statusMessage}</Text>
          <Button label="Tutup" variant="blue" onPress={dismiss} />
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
};

export default UploadFileForm;
