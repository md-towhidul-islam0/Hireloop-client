/* -------------------------------------------------------------------------- */
/*                    Suspense fallback for the job posts page                */
/* -------------------------------------------------------------------------- */

const skeletonBar = "animate-pulse rounded bg-white/[0.06]"

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-[#232327] bg-[#151516] p-4">
      <div className="flex items-start gap-3">
        <div className="size-10 shrink-0 animate-pulse rounded-lg bg-white/[0.06]" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className={`${skeletonBar} h-3 w-40 max-w-full`} />
          <div className={`${skeletonBar} h-2.5 w-24`} />
        </div>
        <div className={`${skeletonBar} h-7 w-16 shrink-0 rounded-full`} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="col-span-2 flex flex-col gap-2">
          <div className={`${skeletonBar} h-2 w-24`} />
          <div className={`${skeletonBar} h-3 w-40 max-w-full`} />
          <div className={`${skeletonBar} h-2.5 w-48 max-w-full`} />
        </div>
        <div className="flex flex-col gap-2">
          <div className={`${skeletonBar} h-2 w-10`} />
          <div className={`${skeletonBar} h-6 w-20 rounded-full`} />
        </div>
        <div className="flex flex-col gap-2">
          <div className={`${skeletonBar} h-2 w-20`} />
          <div className={`${skeletonBar} h-3 w-24`} />
        </div>
        <div className="flex flex-col gap-2">
          <div className={`${skeletonBar} h-2 w-16`} />
          <div className={`${skeletonBar} h-3 w-24`} />
        </div>
        <div className="flex flex-col gap-2">
          <div className={`${skeletonBar} h-2 w-14`} />
          <div className={`${skeletonBar} h-3 w-24`} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={`${skeletonBar} h-9 flex-1 rounded-lg`} />
        <div className={`${skeletonBar} size-9 rounded-lg`} />
        <div className={`${skeletonBar} size-9 rounded-lg`} />
      </div>
    </div>
  )
}

export function AllJobsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading job posts"
      className="min-h-svh bg-[#131314] px-4 py-6 text-[#F4F4F5] sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1395px] flex-col">
        {/* Heading + action */}
        <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className={`${skeletonBar} h-4 w-full max-w-52`} />
            <div className={`${skeletonBar} h-[42px] w-full max-w-72`} />
            <div className={`${skeletonBar} h-4 w-full max-w-[420px]`} />
          </div>
          <div className="h-10 w-full shrink-0 animate-pulse rounded-[12px] bg-[#5C53FE]/30 sm:w-[150px]" />
        </div>

        {/* Mobile/tablet card skeletons */}
        <div className="grid gap-3 lg:grid-cols-2 xl:hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>

        {/* Desktop table skeleton */}
        <div className="hidden overflow-hidden rounded-[16px] border border-[#232327] bg-[#151516] xl:block">
          <div className="flex items-center gap-4 border-b border-[#232327] bg-[#0B0B0C] px-5 py-4">
            <div className={`${skeletonBar} h-3 w-32`} />
            <div className={`${skeletonBar} h-3 w-28`} />
            <div className={`${skeletonBar} h-3 w-12`} />
            <div className={`${skeletonBar} h-3 w-24`} />
            <div className={`${skeletonBar} h-3 w-20`} />
            <div className={`${skeletonBar} h-3 w-14`} />
            <div className={`${skeletonBar} h-3 w-16`} />
            <div className={`${skeletonBar} ml-auto h-3 w-14`} />
          </div>

          <div className="divide-y divide-[#232327]">
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} className="flex items-center gap-4 px-5 py-[18px]">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="size-9 shrink-0 animate-pulse rounded-lg bg-white/[0.06]" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className={`${skeletonBar} h-3 w-40 max-w-full`} />
                    <div className={`${skeletonBar} h-2.5 w-24`} />
                  </div>
                </div>
                <div className="hidden min-w-0 flex-1 flex-col gap-2 lg:flex">
                  <div className={`${skeletonBar} h-3 w-32`} />
                  <div className={`${skeletonBar} h-2.5 w-36`} />
                </div>
                <div className={`${skeletonBar} hidden h-7 w-16 rounded-full md:block`} />
                <div className={`${skeletonBar} hidden h-3 w-24 lg:block`} />
                <div className={`${skeletonBar} hidden h-3 w-20 xl:block`} />
                <div className={`${skeletonBar} hidden h-7 w-16 rounded-full md:block`} />
                <div className="flex shrink-0 items-center gap-2">
                  <div className={`${skeletonBar} h-8 w-[81px] rounded-lg`} />
                  <div className={`${skeletonBar} size-8 rounded-lg`} />
                  <div className={`${skeletonBar} size-8 rounded-lg`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
