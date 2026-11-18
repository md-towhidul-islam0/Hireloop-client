import { CkeckRole } from '@/lib/core/apiget';
import React from 'react';

const layout =async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
    await CkeckRole("recruiter")
    return (
        <div>
            {children}
        </div>
    );
};

export default layout;