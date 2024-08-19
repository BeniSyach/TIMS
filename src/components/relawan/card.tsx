import React from 'react';

import type { Relawan } from '@/api/relawan';

import { Border } from '../border';
import { RelawanHome } from './relawan-home';

type Props = Relawan;

export const CardRelawan = ({ title, url, id }: Props) => {
  return (
    <Border>
      <RelawanHome text={title} subText={title} profil={url} />
    </Border>
  );
};
