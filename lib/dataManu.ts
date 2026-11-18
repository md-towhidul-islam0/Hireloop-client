
'use server'
import { JobfromType } from '@/app/dashbord/recruiter/add-jobs/page';
import { auth } from './auth';
import { headers } from 'next/headers';
import { fetchWithtoken, GetSessionByserver } from './core/apiget';

export const Addjob = async (Data: JobfromType) => {
    console.log("APi count")
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`, {
        method: "POST",
        body: JSON.stringify(Data),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return res.json();
};

export const countAddedJob = async (query: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/count?email=${query}`)
    const data = await res.json();
    return data.count;
}
export const toGetapplyedAPI = async (query: string) => {
    const res = await fetchWithtoken(`${process.env.NEXT_PUBLIC_BACKEND_URL}/appli?jobID=${query}`)
    const data = await res.json();
    return data;
}
export const toGetapplyeduserAPI = async (query: string) => {
    const res = await fetchWithtoken(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users?_id=${query}`);
    const data = await res.json();
    return data;
}


export const admingetUsers = async () => {
    const result = await auth.api.listUsers({
        query: {
            limit: 100,
            offset: 0,
            sortBy: "name",
            sortDirection: "asc",
        },
        // This endpoint requires an admin session.
        headers: await headers(),
    });

    return result.users;
}


