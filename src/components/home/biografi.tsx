import React from 'react';

import { Border } from '../border';
import { SubTitle } from '../sub-title';
import { Title } from '../title';

export const Biografi = () => {
  return (
    <Border>
      <Title text="Biografi" />
      <SubTitle text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. LoremIpsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." />
    </Border>
  );
};
