"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Trash } from "lucide-react"

import { deleteJob } from "@/lib/job-actions"
import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"




interface DeleteJobButtonProps {
  id: string
  title: string
  className?: string
  iconClassName?: string
}

export function DeleteJobButton({
  id,
  title,
  className,
  iconClassName,
}: DeleteJobButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteJob(id)

      if (!result.ok) {
        console.error(result.error)
        return
      }

      router.refresh()
    })
  }

  return (
        <AlertDialog>
      <AlertDialogTrigger
        render={<button
      type="button"
      aria-label={`Delete ${title}`}
      disabled={isPending}

      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Trash className={iconClassName ?? "size-4"} />
    </button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{`Delete ${title}`} </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View{" "}
            <a href="#">Settings</a> delete any memories saved during this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
  )
}
