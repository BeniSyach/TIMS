import React, { useEffect } from "react";
import { useAuth } from "@/core";
import { Stack, useLocalSearchParams } from "expo-router";
import { Env } from '@env';
import { getToken } from "@/core/auth/utils";
import { ActivityIndicator, FocusAwareStatusBar, Button, View, Text } from "@/ui";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Modal } from "react-native";

export default function DetailBerkas() {
  const local = useLocalSearchParams<{ id: string }>();
  const signOut = useAuth.use.signOut();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [image, setImageUri] = React.useState<string | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  const getPhoto = async (id: string) => {
    console.log('url get Berkas saksi', Env.API_URL_SAKSI);
    console.log('url get id Berkas saksi', id);
    const token = await getToken();
    if (!token?.access) {
      console.error('Token is invalid or missing');
      setError('Gagal mendapatkan token. Silakan coba lagi.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${Env.API_URL_SAKSI}/api/v1/saksi/dokumen/lihat/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      });
      console.log('hasil response', response);
      if (response.ok) {
        // Convert the response to a blob
        const blob = await response.blob();

        // Convert the blob to base64
        const base64Data = await convertBlobToBase64(blob);
        const base64Image = `data:image/jpeg;base64,${base64Data}`;

        // Set the image URI as the base64 encoded image
        setImageUri(base64Image);
      } else {
        console.error('Failed to fetch image');
      }
    } catch (error) {
      console.error('Error during get berkas:', error);
      setError('Error Server');
    } finally {
      setLoading(false);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result?.toString() || '';
        resolve(base64String.split(',')[1] || '');
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Read blob as Data URL (base64 encoded string)
    });
  };

  // Function to download the image
  const downloadImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      if (image) {
        const base64Data = image.split(',')[1]; // Extract base64 part
        const fileUri = `${FileSystem.documentDirectory}berkas_image.jpg`;

        // Write the base64 data to a file
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Save the file to the user's gallery
        await MediaLibrary.saveToLibraryAsync(fileUri);
        alert('Image downloaded successfully!');
      } else {
        alert('Image not available for download.');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  useEffect(() => {
    getPhoto(local.id || '');
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center p-3">
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 px-2">
      <FocusAwareStatusBar />
      <Stack.Screen
        options={{
          title: 'Data Berkas Saksi',
          headerBackTitle: 'Data Berkas Saksi',
        }}
      />
      {image ? (
        <View className="flex-1 justify-center items-center">
          <Button label="Lihat Foto" variant="blue" onPress={() => setIsVisible(true)} />
          <Button label="Download Foto" onPress={downloadImage} />
          <Modal visible={isVisible} transparent={true}>
            <ImageViewer
              imageUrls={[{ url: image }]} // The base64 image URL is passed here
              enableSwipeDown={true}
              onSwipeDown={() => setIsVisible(false)}
            />
            <Button label="Tutup Foto" onPress={() => setIsVisible(false)} />
          </Modal>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text  className="text-xl font-bold" >Gagal Ambil Photo</Text>
        </View>
      )}
    </View>
  );
}
