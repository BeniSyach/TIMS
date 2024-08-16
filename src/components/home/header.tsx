import React from 'react';

import { Border } from '../border';
import { HeaderHome } from '../header-home';
import { ProfilHome } from '../profil-home';

export const Header = () => {
  return (
    <>
      <HeaderHome text="TIMS" subText="Aplikasi Tim Sukses" />

      <Border>
        <ProfilHome
          text="Raisa"
          subText="Calon DPRD Kota/Kab"
          profil="icon.png"
        />
      </Border>
    </>
  );
};
