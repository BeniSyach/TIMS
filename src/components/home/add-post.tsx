import { Link } from 'expo-router';
import React from 'react';

import { Button } from '@/ui';

export const AddPost = () => {
  return (
    <>
      <Link href="/pendukung/add-post" asChild>
        <Button
          className="mb-3"
          label="Tambah Pendukung/Relawan"
          variant="secondary"
        />
      </Link>
    </>
  );
};
