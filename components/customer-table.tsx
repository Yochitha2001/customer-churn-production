"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customers } from "@/lib/data";
import type { Customer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

type CustomerTableProps = {
  onSelectCustomer: (customer: Customer) => void;
};

export function CustomerTable({ onSelectCustomer }: CustomerTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Users className="text-accent" />
            At-Risk Customers
        </CardTitle>
        <CardDescription>
          A list of customers with a high probability of churn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Monthly Spend</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">{customer.email}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={customer.status === "At Risk" ? "destructive" : customer.status === 'Churned' ? 'outline' : 'secondary'}
                    className={cn(
                        customer.status === 'Active' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800'
                    )}
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.plan}</TableCell>
                <TableCell className="text-right">
                  ${customer.monthlySpend.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectCustomer(customer)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
