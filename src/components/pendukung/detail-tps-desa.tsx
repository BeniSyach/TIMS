import React from 'react';

import type { pendukungDesa } from '@/api/get-pendukung-desa';

import { Border } from '../border';
import { PendukungHome } from './pendukung-home';

type Props = pendukungDesa;

export const CardTpsDesaDetail = ({ name, pendukung_id, nik, tps }: Props) => {
  return (
    <Border>
      <PendukungHome
        text={name}
        subText={Number(nik)}
        profil={tps}
        id={pendukung_id}
      />
    </Border>
  );
};
