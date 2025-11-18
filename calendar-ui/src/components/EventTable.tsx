import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  Badge,
  Button,
  makeStyles,
} from '@fluentui/react-components';
import { CheckmarkCircle24Regular } from '@fluentui/react-icons';
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
  createColumnHelper,
  SortingFn,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { set } from 'zod';

const useStyles = makeStyles({
  statusBadge: {
    paddingTop: '8px',
  },
});

// Dummy data interface
type EventRow = {
  date: string;
  id: string;
  title: string;
  category: string;
  type: string;
  status: 'New' | 'Reviewed' | 'Changed' | 'Deleted';
  confirmed: boolean;
  dateCreated: string;
  dateModified: Date | undefined;
};

// Dummy table data
const eventData: EventRow[] = [
  {
    date: 'Jan 21 – Mar 29',
    id: 'PSFS-113714',
    title: '$6M to increase Indigenous learners...',
    category: 'Release',
    type: 'News Release',
    status: 'New',
    confirmed: false,
    dateCreated: 'Jan 03 2025',
    //dateCreated:  new Date('2025-01-03T10:30:00Z'), we'll probably use actual dates in the future
    dateModified: new Date('2025-11-14T19:34:00Z'),
  },
  {
    date: 'Feb 4 – Mar 27',
    id: 'TACS-116305',
    title: 'Royal BC Museum Phase 2 Conversations',
    category: 'Issue',
    type: 'Issue',
    status: 'Reviewed',
    confirmed: true,
    dateCreated: 'Jan 03 2025',
    dateModified: new Date('2025-11-14T03:30:00Z'),
  },
  {
    date: 'Feb 29 – Apr 8',
    id: 'MOTI-112502',
    title: 'Pattullo Bridge Project milestone',
    category: 'Release',
    type: 'News Release',
    status: 'Changed',
    confirmed: true,
    dateCreated: 'Jan 03 2025',
    dateModified: undefined,
  },
  {
    date: 'Mar 1 – Mar 31',
    id: 'HLTH-116081',
    title: 'Pharmacy Appreciation Month',
    category: 'Event',
    type: 'Awareness Date',
    status: 'Reviewed',
    confirmed: true,
    dateCreated: 'Jan 03 2025',
    dateModified: new Date('2025-09-10T10:30:00Z'),
  },
];

const getLastModifiedString = (modified: Date | undefined) => {
  if (!modified) {
    return undefined;
  }
  const rightNow = new Date();
  const difference = rightNow.getTime() - modified.getTime();
  const diffDays = Math.floor(difference / (1000 * 3600 * 24));
  if (diffDays < 1) {
    // todo: needs debugging, but I shan't bother now.
    const hoursAgo = difference / (1000 * 3600);
    if (hoursAgo < 1) {
      if (Math.floor(difference / (1000 * 60)) < 2) {
        return 'Modified just now';
      } else {
        return `Modified ${Math.floor(difference / (1000 * 60))} minutes ago`;
      }
    } else {
      return `Modified ${Math.floor(difference / (1000 * 3600))} hours ago`;
    }
  } else if (diffDays < 30) {
    //we might want to be more precise about calculating months, etc. but not now
    return `Modified ${diffDays} days ago`;
  } else if (diffDays > 30 && diffDays < 365) {
    return `Modified ${rightNow.getMonth() - modified.getMonth()} months ago`;
  } else {
    return `Modified ${Math.floor(diffDays / 365)} years ago`;
  }
};

const sortStatusFn: SortingFn<EventRow> = (rowA, rowB) => {
  const a = rowA.original.dateModified;
  const b = rowB.original.dateModified;
  if (a && !b) return 1;
  else if (!a && b) return -1;
  else if (a && b) return b.getTime() - a.getTime();
  return 0;
};

// Status colors map
const statusColor: Record<string, 'brand' | 'danger' | 'warning' | 'success'> =
  {
    New: 'success',
    Reviewed: 'brand',
    Changed: 'warning',
    Deleted: 'danger',
  };

interface EventTableProps {
  filters: ColumnFiltersState;
  globalFilterString: string;
}

export const EventTable: React.FC<EventTableProps> = ({
  filters,
  globalFilterString,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // for when column filters change. May not end up using this...
  useEffect(() => {
    setColumnFilters(filters);
  }, [filters]);

  // this might be redundant. Alex should give this some more thought.
  useEffect(() => {
    setGlobalFilter(globalFilterString);
  }, [globalFilterString, globalFilter]);

  const styles = useStyles();
  const columnHelper = createColumnHelper<EventRow>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('id', {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('title', {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('category', {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('type', {
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor('status', {
        //id: 'status', // Unique ID for this display column
        header: 'Status',
        sortingFn: sortStatusFn,

        cell: ({ row }) => (
          <div className={styles.statusBadge}>
            <Badge
              appearance="filled"
              color={
                statusColor[row.original.status as keyof typeof statusColor]
              }
              shape="circular"
              size="large"
            >
              {row.original.status}
            </Badge>
            {row.original.dateModified && (
              <div>{getLastModifiedString(row.original.dateModified)}</div>
            )}
            <div>Created {row.original.dateCreated}</div>
          </div>
        ),
      }),
      columnHelper.accessor('confirmed', {
        cell: (info) => (info.getValue() ? <CheckmarkCircle24Regular /> : null),
      }),
    ],
    [columnHelper, styles.statusBadge]
  );

  const table = useReactTable({
    data: eventData,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize: 5 }, // Show 2 rows per page for dem
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
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
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: false,
    manualSorting: false,
    enableColumnFilters: true,
  });

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: 8 }}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeaderCell
                  key={header.id}
                  onClick={
                    header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                  style={{
                    cursor: header.column.getCanSort() ? 'pointer' : undefined,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === 'asc' && ' ▲'}
                  {header.column.getIsSorted() === 'desc' && ' ▼'}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/details', { state: row.original })}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div
        style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// This component renders a table of events with columns for date, ID, title, category, type, status, and confirmation status.
// It uses Fluent UI components for styling and TanStack Table for data management.
