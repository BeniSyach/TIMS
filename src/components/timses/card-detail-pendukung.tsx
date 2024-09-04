import React from 'react';

import type { PendukungTimses } from '@/api/get-pendukung-timses';

import { Border } from '../border';
import { CardPendukungTimsesComponent } from './card-pendukung-timses';

type Props = PendukungTimses;

export const CardPendukungTimses = ({
  name,
  pendukung_id,
  nik,
  tps,
}: Props) => {
  return (
    <Border>
      <CardPendukungTimsesComponent
        text={name}
        subText={nik}
        profil={tps}
        id={pendukung_id}
      />
    </Border>
  );
};
