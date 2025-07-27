import { Bell, Search } from "lucide-react"
import { AuthButton } from "@/components/auth/auth-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/icons/logo"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="lg:hidden" />
        <Logo className="hidden h-8 w-8 text-primary md:block" />
        <h1 className="hidden text-xl font-semibold md:block">Drishti.ai</h1>
      </div>

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search incidents, cameras..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <AuthButton />
      </div>
    </header>
  )
}
