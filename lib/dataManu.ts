

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

export const countAddedJob=async(query:string)=>{
    const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/count?email=${query}`)
    const data=await res.json();
    return data.count;
}



