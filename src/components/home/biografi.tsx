import React from 'react';

import type { DataBiografi } from '@/api/biografi';

import { Border } from '../border';
import { SubTitle } from '../sub-title';
import { Title } from '../title';

interface Props {
  data: DataBiografi[];
}

export const Biografi = ({ data }: Props) => {
  const [firstItem] = data;
  return (
    <Border>
      <Title text="Biografi" />
      <SubTitle text={firstItem.deskripsi} />
    </Border>
  );
};
