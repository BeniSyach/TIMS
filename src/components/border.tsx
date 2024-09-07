import React from 'react';

import { View } from '@/ui';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Border: React.FC<Props> = ({ children, className = '' }) => {
  const combinedClassName = className ? className : 'dark:bg-neutral-800';
  return (
    <View
      className={`my-2 rounded-xl border border-neutral-900 p-3 dark:border-neutral-700 ${combinedClassName}`}
    >
      {children}
    </View>
  );
};
