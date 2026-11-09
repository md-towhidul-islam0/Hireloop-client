

import { JobfromType } from '@/app/dashbord/recruiter/add-jobs/page';
import React from 'react';

export const Addjob =async (AddedUrl:string,Data:JobfromType) => {

        const res=await fetch(`${process.env.BACKEND_URL}/${AddedUrl}`,{
        method:"POST",
        body:JSON.stringify(Data),
        headers:{
            'Content-Type':'application/json',
        }
    })

    return res.json();
};

