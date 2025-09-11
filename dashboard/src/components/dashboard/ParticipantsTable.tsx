// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious
// } from '@/components/ui/pagination';
// import { Search, QrCode, Download, FileSpreadsheet } from 'lucide-react';
// import { Participant } from '@/types/participant';
// import * as XLSX from 'xlsx';

// interface ParticipantsTableProps {
//   participants: Participant[];
//   onRowClick: (participant: Participant) => void;
// }

// export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
//   participants,
//   onRowClick
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Filter participants based on search term
//   const filteredParticipants = participants.filter(participant =>
//     participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     participant.phone.includes(searchTerm)
//   );

//   // Calculate pagination
//   const totalItems = filteredParticipants.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

//   // Reset to first page when search changes
//   React.useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   const downloadCSV = () => {
//     const headers = ['Name', 'Email', 'Phone', 'Status', 'Registered At', 'Program ID'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredParticipants.map(p => [
//         `"${p.name}"`,
//         `"${p.email}"`,
//         `"${p.phone}"`,
//         p.hasClaimed ? 'Claimed' : 'Unclaimed',
//         `"${formatDate(p.registeredAt)}"`,
//         `"${p.programId}"`
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `pazzin-participants-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const downloadXLSX = () => {
//     const data = filteredParticipants.map(p => ({
//       'Name': p.name,
//       'Email': p.email,
//       'Phone': p.phone,
//       'Status': p.hasClaimed ? 'Claimed' : 'Unclaimed',
//       'Registered At': formatDate(p.registeredAt),
//       'Program ID': p.programId,
//       'Claimed At': p.claimedAt ? formatDate(p.claimedAt) : 'N/A'
//     }));

//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Participants');
//     XLSX.writeFile(wb, `pazzin-participants-${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <Card className="bg-dashboard-card border-dashboard-border">
//       <CardHeader>
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <CardTitle className="text-lg font-semibold">Participants ({totalItems})</CardTitle>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
//             <div className="flex gap-2">
//               <Button
//                 onClick={downloadCSV}
//                 variant="outline"
//                 size="sm"
//                 className="whitespace-nowrap"
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 CSV
//               </Button>
//               <Button
//                 onClick={downloadXLSX}
//                 variant="outline"
//                 size="sm"
//                 className="whitespace-nowrap"
//               >
//                 <FileSpreadsheet className="h-4 w-4 mr-2" />
//                 XLSX
//               </Button>
//             </div>
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Search by name, email, or phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 bg-dashboard-card border-dashboard-border"
//               />
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-dashboard-border">
//                 <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
//                 <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
//                 <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
//                 <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
//                 <th className="text-left py-3 px-4 font-medium text-muted-foreground">Registered At</th>
//                 <th className="text-left py-3 px-4 font-medium text-muted-foreground">QR</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentParticipants.map((participant) => (
//                 <tr
//                   key={participant._id}
//                   onClick={() => onRowClick(participant)}
//                   className="border-b border-dashboard-border hover:bg-dashboard-card-hover cursor-pointer transition-colors duration-200"
//                 >
//                   <td className="py-3 px-4">
//                     <div className="font-medium text-foreground">{participant.name}</div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="text-muted-foreground">{participant.email}</div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="text-muted-foreground">{participant.phone}</div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <Badge
//                       variant={participant.hasClaimed ? "default" : "secondary"}
//                       className={participant.hasClaimed
//                         ? "bg-kpi-success text-white"
//                         : "bg-kpi-neutral text-white"
//                       }
//                     >
//                       {participant.hasClaimed ? 'Claimed' : 'Unclaimed'}
//                     </Badge>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="text-muted-foreground">
//                       {formatDate(participant.registeredAt)}
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     <QrCode className="h-4 w-4 text-primary hover:text-primary/80" />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {totalItems === 0 && (
//             <div className="text-center py-8 text-muted-foreground">
//               No participants found matching your search.
//             </div>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="mt-6 flex items-center justify-between">
//             <div className="text-sm text-muted-foreground">
//               Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} participants
//             </div>
//             <Pagination>
//               <PaginationContent>
//                 <PaginationItem>
//                   <PaginationPrevious
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                   />
//                 </PaginationItem>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1)
//                   .filter(page => {
//                     const distance = Math.abs(page - currentPage);
//                     return distance === 0 || distance === 1 || page === 1 || page === totalPages;
//                   })
//                   .map((page, index, array) => {
//                     const showEllipsis = index > 0 && array[index - 1] !== page - 1;
//                     return (
//                       <React.Fragment key={page}>
//                         {showEllipsis && (
//                           <PaginationItem>
//                             <span className="flex h-9 w-9 items-center justify-center">...</span>
//                           </PaginationItem>
//                         )}
//                         <PaginationItem>
//                           <PaginationLink
//                             onClick={() => setCurrentPage(page)}
//                             isActive={currentPage === page}
//                             className="cursor-pointer"
//                           >
//                             {page}
//                           </PaginationLink>
//                         </PaginationItem>
//                       </React.Fragment>
//                     );
//                   })}

//                 <PaginationItem>
//                   <PaginationNext
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, QrCode, Download, FileSpreadsheet } from "lucide-react";
import { Participant } from "@/types/participant";
import * as XLSX from "xlsx";
import { useDashboardData } from "@/hooks/useDatabaseData";

interface ParticipantsTableProps {
  onRowClick: (participant: Participant) => void;
}

export const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  onRowClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use the custom hook to get the real-time participants data
  const { participantsTable } = useDashboardData();

  // Filter participants based on search term
  const filteredParticipants = participantsTable.filter((participant) => {
    // Normalize phone numbers to digits only
    const normalizedPhone = String(participant.phone ?? "").replace(/\D/g, "");
    const normalizedSearchTerm = searchTerm.replace(/\D/g, "").trim();

    // Name & email safe lookups
    const name = (participant.name ?? "").toLowerCase();
    const email = (participant.email ?? "").toLowerCase();
    const term = searchTerm.toLowerCase();

    // Only check phone if user actually typed digits
    const matchesPhone =
      normalizedSearchTerm.length > 0 &&
      normalizedPhone.includes(normalizedSearchTerm);

    return name.includes(term) || email.includes(term) || matchesPhone;
  });

  // Calculate pagination
  const totalItems = filteredParticipants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, participantsTable]); // Add participantsTable to dependencies to reset pagination on new data

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Registered At",
      "Program ID",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredParticipants.map((p) =>
        [
          `"${p.name}"`,
          `"${p.email}"`,
          `"${p.phone}"`,
          p.hasClaimed ? "Claimed" : "Unclaimed",
          `"${formatDate(p.registeredAt)}"`,
          // `"${p.programId}"`
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pazzin-participants-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadXLSX = () => {
    const data = filteredParticipants.map((p) => ({
      Name: p.name,
      Email: p.email,
      Phone: p.phone,
      Status: p.hasClaimed ? "Claimed" : "Unclaimed",
      "Registered At": formatDate(p.registeredAt),
      // 'Program ID': p.programId,
      "Claimed At": p.claimedAt ? formatDate(p.claimedAt) : "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(
      wb,
      `pazzin-participants-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-dashboard-card border-dashboard-border">
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle className="text-lg font-semibold">
            Participants ({totalItems})
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex gap-2">
              <Button
                onClick={downloadCSV}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                onClick={downloadXLSX}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                XLSX
              </Button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-dashboard-card border-dashboard-border"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dashboard-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Registered At
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  QR
                </th>
              </tr>
            </thead>
            <tbody>
              {currentParticipants.map((participant) => (
                <tr
                  key={participant._id} // Use participant.id for the key
                  onClick={() => onRowClick(participant)}
                  className="border-b border-dashboard-border hover:bg-dashboard-card-hover cursor-pointer transition-colors duration-200"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">
                      {participant.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-muted-foreground">
                      {participant.email}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-muted-foreground">
                      {participant.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={participant.hasClaimed ? "default" : "secondary"}
                      className={
                        participant.hasClaimed
                          ? "bg-kpi-success text-white"
                          : "bg-kpi-neutral text-white"
                      }
                    >
                      {participant.hasClaimed ? "Claimed" : "Unclaimed"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-muted-foreground">
                      {formatDate(participant.registeredAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <QrCode className="h-4 w-4 text-primary hover:text-primary/80" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalItems === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No participants found matching your search.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} participants
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    const distance = Math.abs(page - currentPage);
                    return (
                      distance === 0 ||
                      distance === 1 ||
                      page === 1 ||
                      page === totalPages
                    );
                  })
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && array[index - 1] !== page - 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center">
                              ...
                            </span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
