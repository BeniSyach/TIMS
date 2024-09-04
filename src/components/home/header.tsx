import React from 'react';

import { Border } from '../border';
import { HeaderHome } from '../header-home';
import { ProfilHome } from '../profil-home';
import { DataBiografi } from '@/api/biografi';

interface Props {
  data: DataBiografi;
}

export const Header = ({data}: Props) => {
  return (
    <>
      <HeaderHome />
      <Border>
        <ProfilHome
          text={data.nama_lengkap}
          subText={data.jabatan}
          profil="icon.png"
        />
      </Border>
    </>
  );
};
