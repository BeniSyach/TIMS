import React from 'react';

import type { pendukungDesa } from '@/api/get-pendukung-desa';

import { Border } from '../border';
import { CardDetailTPSDesa } from './card-detail-tps-desa';

type Props = pendukungDesa;

export const CardTpsDesaDetail = ({ name, pendukung_id, nik, tps }: Props) => {
  return (
    <Border>
      <CardDetailTPSDesa
        text={name}
        subText={Number(nik)}
        profil={tps}
        id={pendukung_id}
        aktif={true}
      />
    </Border>
  );
};
