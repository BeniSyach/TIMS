import React from 'react';

import { Text, View } from '@/ui';

import { Border } from '../border';
import { Title } from '../title';

const TotalSuara: React.FC = () => (
  <>
    <Title text="Total Suara" />
    <Border>
      <View className="relative h-8 w-full rounded-full bg-neutral-300">
        <View
          className="absolute left-0 top-0 h-full rounded-full bg-blue-500"
          style={{ width: '50%' }}
        >
          <Text
            className="absolute inset-0 flex items-center justify-center text-center text-white"
            style={{ width: '50%' }}
          >
            50%
          </Text>
        </View>
        <View
          className="absolute left-0 top-0 h-full rounded-full bg-orange-500"
          style={{ width: '50%', left: '50%' }}
        >
          <Text
            className="absolute inset-0 flex items-center justify-center text-center text-white"
            style={{ width: '50%' }}
          >
            50%
          </Text>
        </View>
      </View>
    </Border>
  </>
);

export default TotalSuara;
