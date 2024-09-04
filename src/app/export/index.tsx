import { Env } from '@env';
import * as DocumentPicker from 'expo-document-picker';
import { Stack } from 'expo-router';
import React, { useState } from 'react';

import { getToken } from '@/core/auth/utils';
import { ActivityIndicator, Button, Modal, Text, useModal, View } from '@/ui';

const UploadFileForm: React.FC = () => {
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [statusMessage, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
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

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token.access}`,
        },
      });

      const result = await response.json();
      console.log('Upload result:', result);
      setStatus(result.message);
      present();
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Gagal Import Data');
      present();
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Stack.Screen
        options={{
          title: 'Import Data Pendukung',
          headerBackTitle: 'Import Data Pendukung',
        }}
      />
      {fileUri ? (
        <Text>Selected file: {fileUri}</Text>
      ) : (
        <Text>No file selected</Text>
      )}
      <Button label="Pick Document" onPress={pickDocument} />
      {fileUri && (
        <Button
          label={uploading ? 'Uploading...' : 'Upload File'}
          onPress={uploadFile}
          disabled={uploading}
        />
      )}
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
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
    </View>
  );
};

export default UploadFileForm;
