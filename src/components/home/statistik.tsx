import { Link } from 'expo-router';
import React from 'react';

import type { totalSuara } from '@/api/dashboard/total-suara';
import { Pressable, Text } from '@/ui';

import { Border } from '../border';
import { Title } from '../title';

interface Props {
  selected: string;
  data: totalSuara;
}

const Statistics: React.FC<Props> = ({ selected, data }) => (
  <>
    {selected === 'penduduk' && (
      <>
        <Title text="Total DPT" />
        <Border className="bg-indigo-500">
          <Text className="bg-indigo-500 text-center text-xl font-bold">
            {data.total_penduduk}
          </Text>
        </Border>
      </>
    )}
    {selected === 'timses' && (
      <Link href={`/timses`} asChild>
        <Pressable>
          <Title text="Total Timses" />
          <Border className="bg-amber-700">
            <Text className="bg-amber-700 text-center text-xl font-bold">
              {data.total_timses}
            </Text>
          </Border>
        </Pressable>
      </Link>
    )}
    {selected === 'pendukung' && (
      <Link href={`/relawan`} asChild>
        <Pressable>
          <Title text="Total Pendukung" />
          <Border className="bg-green-500">
            <Text className="bg-green-500 text-center text-xl font-bold">
              {data.total_pendukung}
            </Text>
          </Border>
        </Pressable>
      </Link>
    )}
  </>
);

export default Statistics;
