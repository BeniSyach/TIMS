import React from 'react';
import { Link } from 'expo-router';

import { Button } from '@/ui';

export const AddPost = () => {
  return (
    <>
      <Link href="/feed/add-post" asChild>
        <Button
          className="mb-3"
          label="Tambah Pendukung/Relawan"
          variant="secondary"
        />
      </Link>
    </>
  );
};
