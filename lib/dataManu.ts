

import { JobfromType } from '@/app/dashbord/recruiter/add-jobs/page';
import React from 'react';

export const Addjob =async (Data:JobfromType) => {
    console.log("APi count")
        const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`,{
        method:"POST",
        body:JSON.stringify(Data),
        headers:{
            'Content-Type':'application/json',
        }
    })

    return res.json();
};




