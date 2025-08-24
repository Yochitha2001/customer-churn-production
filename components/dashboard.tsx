"use client";

import * as React from "react";
import {
  ChevronsRight,
  GanttChartSquare,
  Users,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { DashboardHeader } from "@/components/dashboard-header";
import { CustomerTable } from "@/components/customer-table";
import { ChurnAnalysisCard } from "@/components/churn-analysis-card";
import { CustomerPredictionView } from "@/components/customer-prediction-view";
import type { Customer } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export function Dashboard() {
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    // Delay clearing the customer to allow the sheet to animate out
    setTimeout(() => {
        setSelectedCustomer(null);
    }, 300);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <GanttChartSquare />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Customers">
                <Users />
                <span>Customers</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <DashboardHeader />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <ChurnAnalysisCard />
          <CustomerTable onSelectCustomer={handleSelectCustomer} />
        </main>
        <CustomerPredictionView
          isOpen={isSheetOpen}
          onClose={handleSheetClose}
          customer={selectedCustomer}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
