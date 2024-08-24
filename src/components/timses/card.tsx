import React from 'react';

import type { Timses } from '@/api';

import { Border } from '../border';
import { TimsesHome } from './timses-home';

type Props = Timses;

export const CardTimses = ({ name, timses_id, nik, phone }: Props) => {
  return (
    <Border>
      <TimsesHome text={name} subText={nik} profil={phone} id={timses_id} />
    </Border>
  );
};
