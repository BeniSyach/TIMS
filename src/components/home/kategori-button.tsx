import React from 'react';

import { Button, View } from '@/ui';

interface Props {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const KategoriButton: React.FC<Props> = ({ selected, setSelected }) => {
  return (
    <View className="flex-row justify-between p-4">
      <Button
        variant="blue"
        size="default"
        label="Penduduk"
        className="mr-2 flex-1"
        active={selected === 'penduduk' ? true : false}
        onPress={() => setSelected('penduduk')}
      />
      <Button
        variant="blue"
        size="default"
        label="Timses"
        className="mx-2 flex-1"
        active={selected === 'timses' ? true : false}
        onPress={() => setSelected('timses')}
      />
      <Button
        variant="blue"
        size="default"
        label="Pendukung"
        className="ml-2 flex-1"
        active={selected === 'pendukung' ? true : false}
        onPress={() => setSelected('pendukung')}
      />
    </View>
  );
};

export default KategoriButton;
