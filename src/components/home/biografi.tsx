import React from 'react';

import { Border } from '../border';
import { SubTitle } from '../sub-title';
import { Title } from '../title';
import { DataBiografi } from '@/api/biografi';

interface Props {
  data: DataBiografi;
}

export const Biografi = ({data} : Props) => {
  return (
    <Border>
      <Title text="Biografi" />
      <SubTitle text={data.deskripsi} />
    </Border>
  );
};
