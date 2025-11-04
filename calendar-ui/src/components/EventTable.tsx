import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  Badge,
  Button,
} from "@fluentui/react-components";
import { CheckmarkCircle24Regular } from "@fluentui/react-icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { set } from "zod";

// Dummy data interface
type EventRow = {
  date: string;
  id: string;
  title: string;
  category: string;
  type: string;
  status: "New" | "Reviewed" | "Changed" | "Deleted";
  confirmed: boolean;
};

// Dummy table data
const eventData: EventRow[] = [
  {
    date: "Jan 21 – Mar 29",
    id: "PSFS-113714",
    title: "$6M to increase Indigenous learners...",
    category: "Release",
    type: "News Release",
    status: "New",
    confirmed: false,
  },
  {
    date: "Feb 4 – Mar 27",
    id: "TACS-116305",
    title: "Royal BC Museum Phase 2 Conversations",
    category: "Issue",
    type: "Issue",
    status: "Reviewed",
    confirmed: true,
  },
  {
    date: "Feb 29 – Apr 8",
    id: "MOTI-112502",
    title: "Pattullo Bridge Project milestone",
    category: "Release",
    type: "News Release",
    status: "Changed",
    confirmed: true,
  },
  {
    date: "Mar 1 – Mar 31",
    id: "HLTH-116081",
    title: "Pharmacy Appreciation Month",
    category: "Event",
    type: "Awareness Date",
    status: "Reviewed",
    confirmed: true,
  },
];

// Status colors map
const statusColor: Record<string, "brand" | "danger" | "warning" | "success"> = {
  New: "success",
  Reviewed: "brand",
  Changed: "warning",
  Deleted: "danger",
};

interface EventTableProps {
  filters: ColumnFiltersState,
}


export const EventTable: React.FC<EventTableProps> = ({filters}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  //for when column filters change. May not end up using this... 
  useEffect(() => {
    setColumnFilters(filters);
 },[filters]);

  const columns = useMemo<ColumnDef<EventRow>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "id",
        header: "Activity ID",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: info => info.getValue(),
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: info => (
          <Badge appearance="tint" color={statusColor[info.getValue() as keyof typeof statusColor]} shape="rounded">
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: "confirmed",
        header: "Confirmed",
        cell: info => (info.getValue() ? <CheckmarkCircle24Regular /> : null),
      },
    ],
    []
  );

  const table = useReactTable({
    data: eventData,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize: 5 }, // Show 2 rows per page for dem
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: updater => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize: 2 });
        setPageIndex(newState.pageIndex);
      } else {
        setPageIndex(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side filtering
    onColumnFiltersChange: setColumnFilters,
    manualPagination: false,
    manualSorting: false,
    enableColumnFilters: true,
  });

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: 8 }}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHeaderCell
                  key={header.id}
                  onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                  style={{ cursor: header.column.getCanSort() ? "pointer" : undefined }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/details", { state: row.original })}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};
// This component renders a table of events with columns for date, ID, title, category, type, status, and confirmation status.
// It uses Fluent UI components for styling and TanStack Table for data management.