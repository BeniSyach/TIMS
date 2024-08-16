import React from 'react';

import { View } from '@/ui';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Border: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <View
      className={`my-2 rounded-xl border border-neutral-900 p-3 dark:border-neutral-700 dark:bg-neutral-800 ${className}`}
    >
      {children}
    </View>
  );
};
