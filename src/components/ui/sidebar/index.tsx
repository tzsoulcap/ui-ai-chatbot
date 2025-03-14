
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import * as React from "react"

// Import all components from their respective files
import { SidebarProvider, useSidebar } from "./sidebar-context"
import { Sidebar } from "./sidebar"
import { 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarInput, 
  SidebarSeparator 
} from "./sidebar-sections"
import { 
  SidebarTrigger, 
  SidebarRail, 
  SidebarInset 
} from "./sidebar-controls"
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupAction, 
  SidebarGroupContent 
} from "./sidebar-group"
import { 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  sidebarMenuButtonVariants
} from "./sidebar-menu"
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "./sidebar-submenu"

// Wrapper component to add TooltipProvider
const SidebarWithProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <SidebarProvider 
        defaultOpen={defaultOpen} 
        open={openProp} 
        onOpenChange={setOpenProp}
        ref={ref}
        style={style}
        {...props}
      >
        <TooltipProvider delayDuration={0}>
          <div
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarProvider>
    )
  }
)
SidebarWithProvider.displayName = "SidebarProvider"

// Override the original SidebarProvider with the wrapper
const EnhancedSidebarProvider = SidebarWithProvider

// Export all components
export {
  EnhancedSidebarProvider as SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider as OriginalSidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
}
