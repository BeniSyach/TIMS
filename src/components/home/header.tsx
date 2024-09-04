import React from 'react';

import type { DataBiografi } from '@/api/biografi';

import { Border } from '../border';
import { HeaderHome } from '../header-home';
import { ProfilHome } from '../profil-home';

interface Props {
  data: DataBiografi[];
}

export const Header = ({ data }: Props) => {
  console.log('data profile', data);
  const [firstItem, secondItem] = data;
  return (
    <>
      <HeaderHome />
      <Border>
        {secondItem && (
          <ProfilHome
            text={secondItem.nama_lengkap}
            subText={secondItem.jabatan}
            profil="bupati.jpg"
          />
        )}
      </Border>
      <Border>
        {firstItem && (
          <ProfilHome
            text={firstItem.nama_lengkap}
            subText={firstItem.jabatan}
            profil="wakilbupati.jpg"
          />
        )}
      </Border>
    </>
  );
};
