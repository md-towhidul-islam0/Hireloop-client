"use client"

import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import logo from "@/components/ui/images/logo.png"
import { authClient } from "@/lib/auth-client"





const Navbar = () => {
  const { data: session, isPending } = authClient.useSession()
  console.log(session?.user?.role);
  const navLinks = [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Company", href: "/company" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: `/dashbord/${session?.user?.role}` },
  ]
  const HandelSignOut = async () => {
    await authClient.signOut();
  }
  return (
    <header className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 rounded-2xl bg-card px-5 py-4 sm:px-8 sm:py-6">
        <Link
          href="/"
          aria-label="Hireloop home"
          className="flex shrink-0 items-center"
        >
          <Image
            src={logo}
            alt="Hireloop"
            priority
            className="h-auto w-32 sm:w-44"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {isPending ? "Loading...." : session ? <> <div className="flex gap-4 items-center "> <div>Weclome,{session?.user?.name}</div>   <Button
            onClick={HandelSignOut}

            className=" cursor-pointer h-11 rounded-xl bg-red-500 px-3 text-sm font-medium text-white shadow-none hover:bg-red-800 sm:h-9">
            SignOut
          </Button></div></> : <>

            <span aria-hidden="true" className="h-5 w-px bg-border" />
            <Link href="/SignIn" >
              <Button

                variant="ghost"
                className="cursor-pointer h-auto bg-transparent px-0 text-sm font-medium text-indigo-500 hover:bg-transparent hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign In
              </Button>
            </Link>

            <Link href={"/SignUp"}>
              <Button

                className=" cursor-pointer h-11 rounded-xl bg-indigo-600 px-6 text-sm font-medium text-white shadow-none hover:bg-indigo-500 sm:h-12">
                Get Started
              </Button>
            </Link>
          </>}
        </div>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="size-11 lg:hidden"
              />
            }
          >
            <MenuIcon />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 gap-6 p-6">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation links
            </SheetDescription>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <span aria-hidden="true" className="h-px w-full bg-border" />

            <div className="flex flex-col gap-3">
              <Button
                render={<Link href="/sign-in" />}
                variant="ghost"
                className="h-11 justify-start bg-transparent px-3 text-sm font-medium text-indigo-500 hover:bg-muted hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign In
              </Button>
              <Button className="h-11 rounded-xl bg-indigo-600 px-6 text-sm font-medium text-white shadow-none hover:bg-indigo-500">
                Get Started
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export default Navbar
