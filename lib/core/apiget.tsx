
import { headers } from "next/headers"
import { auth } from "../auth"
import { redirect } from "next/navigation";


export const GetSessionByserver=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })
    return session;
}

export const getToken=async()=>{
    const session=await GetSessionByserver();
    if (!session || !session.session?.token)
    {
        redirect('/unauth')
    }
    return session.session.token;
}

export const fetchWithtoken=async(api:string)=>{
    const token=await getToken();
    const res=await fetch(api,{
        headers:{
            authorization:`Bearer ${token}`
        }
    })
    return res;
}


export const CkeckRole=async(role:string)=>{
    const user=await GetSessionByserver();
    console.log(user?.user);
    if (!user?.user || user?.user.role!=role)
    {
        redirect('/unauth')
    }
    return
}