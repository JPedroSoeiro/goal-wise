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

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const stats = [
    { category: "Times", count: 12 },
    { category: "Jogadores", count: 3 },
  ];

  const { data: session } = useSession();

  console.log(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your football management system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Statistics</CardTitle>
          <CardDescription>{session?.user.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => (
                <TableRow key={stat.category}>
                  <TableCell className="font-medium">{stat.category}</TableCell>
                  <TableCell className="text-right">{stat.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
