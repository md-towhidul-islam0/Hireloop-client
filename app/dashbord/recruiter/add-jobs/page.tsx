"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  MapPin,
} from "lucide-react"
import { Addjob } from "@/lib/dataManu"

export interface JobfromType{
    
      title: string,
      companyName: string,
      category: string,
      jobType: string,
      isRemote: string,
      location: string,
      deadline: string,
      minSalary:string,
      maxSalary: string,
      frequency: string,
      responsibilities:string,
      qualifications: string,
    
}


const labelClass = "text-sm leading-[18px] font-medium text-[#F4F4F5]"

const inputClass =
  "h-11 w-full rounded-xl border border-transparent bg-[#1E1E21] px-4 text-sm text-white outline-none transition placeholder:text-[#7C7F87] focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/20"

const inputWithIconClass =
  "h-11 w-full rounded-xl border border-transparent bg-[#1E1E21] pr-4 pl-11 text-sm text-white outline-none transition placeholder:text-[#7C7F87] focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/20"

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-transparent bg-[#1E1E21] px-4 pr-10 text-sm text-white outline-none transition focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/20"

const textareaClass =
  "min-h-[98px] w-full resize-y rounded-xl border border-transparent bg-[#1E1E21] px-4 py-3.5 text-sm leading-[22px] text-[#F4F4F5] outline-none transition placeholder:text-[#7C7F87] focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/20"

const iconClass =
  "pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#A0A0AB]"

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"] as const

const jobCategories = [
  "Engineering & Tech",
  "Design & Creative",
  "Product & Management",
  "Marketing & Sales",
  "Finance & Accounting",
  "Operations & Support",
  "Other",
] as const

const salaryFrequencies = ["per hour", "per month", "per year"] as const

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-[18px] items-center justify-between gap-3">
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
          {required ? " *" : ""}
        </label>
        {hint ? (
          <span className="text-xs leading-4 font-medium text-[#5A5A60]">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl bg-[#151516] p-6">
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="size-2 rounded-full bg-[#5C53FE]" />
        <h2 className="text-base leading-6 font-medium text-white">{title}</h2>
      </div>
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </section>
  )
}

export default function AddJobPage() {
  const [captured, setCaptured] = useState(false)

  const handleSubmit =async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const job = {
      title: formData.get("title"),
      companyName: formData.get("companyName"),
      category: formData.get("category"),
      jobType: formData.get("jobType"),
      isRemote: formData.get("isRemote") === "on",
      location: formData.get("location"),
      deadline: formData.get("deadline"),
      minSalary: formData.get("minSalary"),
      maxSalary: formData.get("maxSalary"),
      frequency: formData.get("frequency"),
      responsibilities: formData.get("responsibilities"),
      qualifications: formData.get("qualifications"),
    }

    // Backend wiring comes later; capture the payload from the form for now.
    console.log("New job posting:", job)

    // const res=await fetch(`http://localhost:5000/jobs`,{
    //     method:"POST",
    //     body:JSON.stringify(job),
    //     headers:{
    //         'Content-Type':'application/json',
    //     }
    // })
    // console.log(res);
    const da=await Addjob('jobs',job);
    console.log(da);
    setCaptured(true)
  }

  return (
    <div className="min-h-svh bg-[#131314] px-4 py-6 text-[#F4F4F5] sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-[984px] flex-col"
      >
        {/* Top bar */}
        <div className="flex flex-col gap-4 border-b border-[#2A2A2B]/40 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs leading-4 font-medium">
              <Link
                href="/dashbord/recruiter/jobs"
                className="text-[#A0A0AB] transition-colors hover:text-white"
              >
                Manage Jobs
              </Link>
              <ChevronRight className="size-3 text-[#5A5A60]" />
              <span className="text-[#C3C0FF]">Create New Listing</span>
            </div>

            <h1 className="mt-3 text-[32px] leading-[42px] font-medium tracking-[-0.8px] text-white">
              Post a New Job
            </h1>
            <p className="mt-1 max-w-[476px] text-[13px] leading-5 text-[#A0A0AB]">
              Fill in the position specifications to attract qualified talent
              across our network.
            </p>
            {captured ? (
              <p
                role="status"
                className="mt-2 text-xs leading-4 font-medium text-emerald-400"
              >
                Job data captured — check the console for the payload.
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#5C53FE] px-[22px] text-sm leading-5 font-bold text-white  transition-colors hover:bg-[#6C64FF] focus-visible:ring-2 focus-visible:ring-[#C3C0FF]/60 focus-visible:outline-none"
          >
            Publish Job
            <ArrowUpRight className="size-4" />
          </button>
        </div>

        {/* Form sections */}
        <div className="mt-6 flex flex-col gap-6 pb-10">
          <SectionCard title="1. Basic Information">
            <Field label="Job Title" htmlFor="title" required>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Frontend Developer"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company Name" htmlFor="companyName" required>
                <div className="relative">
                  <Building2 className={iconClass} />
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    placeholder="HirePulse Network"
                    className={inputWithIconClass}
                  />
                </div>
              </Field>

              <Field label="Job Category" htmlFor="category" required>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    defaultValue="Engineering & Tech"
                    className={selectClass}
                  >
                    {jobCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#A0A0AB]" />
                </div>
              </Field>
            </div>

            <Field label="Job Type" htmlFor="jobType" required>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {jobTypes.map((jobType) => (
                  <label key={jobType} className="cursor-pointer">
                    <input
                      id={jobType === "Full-time" ? "jobType" : undefined}
                      type="radio"
                      name="jobType"
                      value={jobType}
                      defaultChecked={jobType === "Full-time"}
                      className="peer sr-only"
                    />
                    <span className="flex h-11 items-center justify-center rounded-xl border border-transparent bg-[#1E1E21] px-3 text-sm leading-[18px] text-[#A0A0AB] transition-colors peer-checked:border-[#5C53FE]/50 peer-checked:bg-[#232327] peer-checked:font-medium peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#5C53FE]/40">
                      {jobType}
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          </SectionCard>

          <SectionCard title="2. Location, Compensation & Timeline">
            <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#232327] bg-[#1E1E21] px-3.5 py-3">
              <span className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#232327] text-[#C3C0FF]">
                  <Globe2 className="size-5" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm leading-[18px] font-medium text-white">
                    Remote Work Allowed (isRemote)
                  </span>
                  <span className="text-[13px] leading-5 text-[#A0A0AB]">
                    Enable worldwide or distributed candidate applications
                  </span>
                </span>
              </span>

              <input type="checkbox" name="isRemote" className="peer sr-only" />
              <span
                aria-hidden="true"
                className="relative h-6 w-11 shrink-0 rounded-full bg-[#1F1F1F] transition-colors peer-checked:bg-[#5C53FE] after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Job Location (location)"
                htmlFor="location"
                required
                hint="Required"
              >
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    placeholder="New York, USA"
                    className={inputWithIconClass}
                  />
                </div>
              </Field>

              <Field
                label="Application Deadline (deadline)"
                htmlFor="deadline"
              >
                <div className="relative">
                  <CalendarDays className={iconClass} />
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className={`${inputWithIconClass} [color-scheme:dark]`}
                  />
                </div>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Min Salary / Rate" htmlFor="minSalary">
                <div className="relative">
                  <CircleDollarSign className={iconClass} />
                  <input
                    id="minSalary"
                    name="minSalary"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="25"
                    className={inputWithIconClass}
                  />
                </div>
              </Field>

              <Field label="Max Salary / Rate" htmlFor="maxSalary">
                <div className="relative">
                  <CircleDollarSign className={iconClass} />
                  <input
                    id="maxSalary"
                    name="maxSalary"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="40"
                    className={inputWithIconClass}
                  />
                </div>
              </Field>

              <Field label="Frequency" htmlFor="frequency">
                <div className="relative">
                  <select
                    id="frequency"
                    name="frequency"
                    defaultValue="per hour"
                    className={selectClass}
                  >
                    {salaryFrequencies.map((frequency) => (
                      <option key={frequency} value={frequency}>
                        {frequency}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#A0A0AB]" />
                </div>
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="3. Responsibilities & Requirements">
            <Field
              label="Key Responsibilities"
              htmlFor="responsibilities"
              required
            >
              <textarea
                id="responsibilities"
                name="responsibilities"
                required
                placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences..."
                className={textareaClass}
              />
            </Field>

            <Field
              label="Qualifications & Requirements"
              htmlFor="qualifications"
              required
            >
              <textarea
                id="qualifications"
                name="qualifications"
                required
                placeholder="• 3+ years of experience with React, TypeScript, and modern state architectures..."
                className={textareaClass}
              />
            </Field>
          </SectionCard>
        </div>
      </form>
    </div>
  )
}
