import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Env } from '@env';
import {ActivityIndicator, Button, Text, View} from '@/ui';

const UploadFileForm: React.FC = () => {
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      });

      console.log('data', result);

      // if (result && result.uri) {
      //   setFileUri(result);
      // }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const uploadFile = async () => {
    if (!fileUri) return;

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
        },
      });

      const result = await response.json();
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
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
    </View>
  );
};

export default UploadFileForm;
