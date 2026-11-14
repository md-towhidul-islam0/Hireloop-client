"use server"

import { revalidatePath } from "next/cache"

export type DeleteJobResult =
  | { ok: true }
  | { ok: false; error: string }

export async function deleteJob(id: string): Promise<DeleteJobResult> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/jobs/${id}`, {
      method: "DELETE",
      cache: "no-store",
    })

    if (!res.ok) {
      return {
        ok: false,
        error: `DELETE /jobs/${id} failed with status ${res.status}`,
      }
    }

    revalidatePath("/dashbord/recruiter/all-jobs")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const getjob=async(query="")=>{
  const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs?${query}`)
  const data=await res.json();
  return data;
}
export const getjobC=async()=>{
  const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobsforC`)
  const data=await res.json();
  return data;
}
export const geteachjob=async(id:string)=>{
  const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobsforC/${id}`)
  const data=await res.json();
  return data;
}

export const postApplecation = async (data: {
  jobID: string;
  userID: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/appli`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to submit application");
  }

  return res.json();
};


export const getAppli=async(id:string)=>{
  const res=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/appli/${id}`)
  const data=await res.json();
  return data;
}

export const checkIsJobhere=async (UserId:string,JobID:string)=>{
  const res=await getAppli(UserId);
  console.log("Hello")
  console.log(res);
}