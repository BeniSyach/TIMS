import { Link } from 'expo-router';
import React from 'react';

import { Pressable, Text } from '@/ui';

import { Border } from '../border';
import { Title } from '../title';

interface Props {
  selected: string;
  id: number;
}

const Statistics: React.FC<Props> = ({ selected, id }) => (
  <>
    {selected === 'penduduk' && (
      <Link href={`/feed/${id}`} asChild>
        <Pressable>
          <Title text="Total Penduduk Deli Serdang" />
          <Border className="bg-indigo-500">
            <Text className="bg-indigo-500 text-center text-xl font-bold">
              2 018 164
            </Text>
          </Border>
        </Pressable>
      </Link>
    )}
    {selected === 'pendukung' && (
      <Link href={`/pendukung/${id}`} asChild>
        <Pressable>
          <Title text="Total Penduduk" />
          <Border className="bg-amber-700">
            <Text className="bg-amber-700 text-center text-xl font-bold">
              100
            </Text>
          </Border>
        </Pressable>
      </Link>
    )}
    {selected === 'relawan' && (
      <Link href={`/feed/${id}`} asChild>
        <Pressable>
          <Title text="Total Relawan" />
          <Border className="bg-green-500">
            <Text className="bg-green-500 text-center text-xl font-bold">
              1213
            </Text>
          </Border>
        </Pressable>
      </Link>
    )}
  </>
);

export default Statistics;
