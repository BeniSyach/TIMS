import * as React from 'react';

import { Image } from '@/ui';
// TODO: should be updated to simple images
export const Cover = () => (
  <Image
    source={require('../../assets/icon.png')}
    className="h-44 w-full"
    contentFit="cover"
  />
);
