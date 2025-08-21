"use client";

import * as React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Teams {
  id: string;
  name: string;
  image: string;
}

export function TableTimes({ teams }: { teams: Teams[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Time</TableHead>
          <TableHead>Escudo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell className="font-medium">{team.name}</TableCell>
            <TableCell>
              <div className="aspect-square relative size-10">
                <Image
                  src={team.image || "/placeholder.svg"}
                  alt={team.name}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
