import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  CodeXml,
  Megaphone,
  Palette,
  ShieldCheck,
  Users,
} from "lucide-react"

import type { CategoryIconKey } from "@/lib/browse-jobs"

/** Shared category icon map so cards and the details page stay in sync. */
export const categoryIcons: Record<CategoryIconKey, LucideIcon> = {
  code: CodeXml,
  design: Palette,
  product: Briefcase,
  marketing: Megaphone,
  finance: ShieldCheck,
  operations: Users,
  other: Briefcase,
}
