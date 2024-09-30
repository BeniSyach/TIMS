import React from 'react';

import type { Pendukung } from '@/api/pendukung';

import { Border } from '../border';
import { PendukungHome } from './pendukung-home';

type Props = Pendukung;

export const CardPendukung = ({
  name,
  pendukung_id,
  nik,
  tps,
  aktif,
  phone,
  kecamatan,
  desa,
  address
}: Props) => {
  return (
    <Border>
      <PendukungHome
        text={name}
        subText={nik}
        profil={tps}
        id={pendukung_id}
        aktif={aktif}
        hp={phone}
        kecamatan={kecamatan}
        desa={desa}
        address={address}
      />
    </Border>
  );
};
