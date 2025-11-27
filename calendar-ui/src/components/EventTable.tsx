import { Icon } from '@fluentui/react';
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

import {
  Calendar24Regular,
  CheckmarkCircle24Regular,
  Clock20Regular,
  Location20Regular,
} from '@fluentui/react-icons';
import {
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
  FilterFn,
} from '@tanstack/react-table';

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { set } from 'zod';

const useStyles = makeStyles({
  statusBadge: {
    paddingTop: '8px',
  },
  overviewInline: {
    display: 'inline',
  },
  overviewTitle: {
    fontWeight: 700,
  },
  overviewConfidential: {
    color: 'red',
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
  mine: boolean;
  sharedWithMe: boolean;
  ministry: string;
  confidential: string | undefined;
  summary: string | undefined;
  representatives: string[] | undefined;
  leads: string[] | undefined;
  commsMaterials: string[] | undefined;
  reports: string[] | undefined;
  tags: string[] | undefined;
  startDate: Date;
  endDate: Date | undefined;
  location: string | undefined;
};

// Dummy table data
export const eventData: EventRow[] = [
  {
    startDate: new Date('2025-01-21T09:30:00'),
    endDate: new Date('2025-03-29'),
    date: 'Jan 21 – Mar 29',
    id: 'PSFS-113714',
    title: '$6M to increase Indigenous learners...',
    category: 'Release',
    type: 'News Release',
    status: 'New',
    confirmed: false,
    dateCreated: 'Jan 03 2025',
    //dateCreated:  new Date('2025-01-03T10:30:00Z'), we'll probably use actual dates in the future
    dateModified: undefined,
    mine: true,
    sharedWithMe: false,
    ministry: 'hlth',
    confidential: undefined,
    summary:
      'Lorem ipsum dolor sit amet. Sed optio deserunt est ullam unde et dolorem saepe non asperiores pariatur id dignissimos cupiditate. Est laborum cumque ad unde odit aut sapiente impedit vel laboriosam omnis non rerum laudantium quo dolore sunt ab sapiente consectetur.',
    representatives: ['Premier Eby', 'Minister Gauss', 'Minister Euler'],
    leads: ['Johannes Kepler', 'Tycho Brahe', 'Caroline Herschel'],
    commsMaterials: [
      'Event or media plan',
      'Media advisory',
      'Q&As',
      'Speaking notes',
    ],
    reports: ['Report One', 'Report Two'],
    tags: undefined,
    location: undefined,
  },
  {
    date: 'Feb 4 – Mar 27',
    startDate: new Date('2025-02-04T09:30:00'),
    endDate: new Date('2025-03-27'),
    id: 'TACS-116305',
    title: 'Royal BC Museum Phase 2 Conversations',
    category: 'Issue',
    type: 'Issue',
    status: 'Reviewed',
    confirmed: true,
    dateCreated: 'Jan 03 2025',
    dateModified: new Date('2025-11-16T03:30:00Z'),
    mine: false,
    sharedWithMe: true,
    ministry: 'hlth',
    confidential: 'CONFIDENTIAL Issue',
    summary: undefined,
    representatives: ['Minister Smith', 'Deputy Minister Johnson'],
    leads: ['Lead One', 'Lead Two'],
    commsMaterials: ['Event or media plan', 'Media advisory'],
    reports: ['Report One', 'Report Two'],
    tags: ['ECC'],
    location: 'BC Legislature, Victoria BC',
  },
  {
    date: 'Feb 29 – Apr 8',
    startDate: new Date('2025-02-29T09:30:00'),
    endDate: new Date('2025-04-08'),
    id: 'MOTI-112502',
    title: 'Pattullo Bridge Project milestone',
    category: 'Release',
    type: 'News Release',
    status: 'Changed',
    confirmed: true,
    dateCreated: 'Jan 03 2025',
    dateModified: new Date('2025-11-16T03:30:00Z'),
    mine: false,
    sharedWithMe: false,
    ministry: 'citz',
    confidential: 'Confidential',
    summary:
      'Lorem ipsum dolor sit amet. Sed optio deserunt est ullam unde et dolorem saepe non asperiores pariatur id dignissimos cupiditate. Est laborum cumque ad unde odit aut sapiente impedit vel laboriosam omnis non rerum laudantium quo dolore sunt ab sapiente consectetur.',
    representatives: undefined,
    leads: undefined,
    commsMaterials: undefined,
    reports: ['Report One'],
    tags: ['Infrastructure', 'Transportation'],
    location: undefined,
  },

  {
    date: 'Mar 1 – Mar 31',
    startDate: new Date('2025-03-01T09:30:00'),
    endDate: new Date('2025-03-31'),
    id: 'HLTH-116081',
    title: 'Pharmacy Appreciation Month',
    category: 'Event',
    type: 'Awareness Date',
    status: 'Reviewed',
    confirmed: true,
    dateCreated: 'Jan 03 2025',
    dateModified: new Date('2025-09-10T10:30:00Z'),
    mine: false,
    sharedWithMe: false,
    ministry: 'hlth',
    confidential: undefined,
    summary:
      'Lorem ipsum dolor sit amet. Sed optio deserunt est ullam unde et dolorem saepe non asperiores pariatur id dignissimos cupiditate. Est laborum cumque ad unde odit aut sapiente impedit vel laboriosam omnis non rerum laudantium quo dolore sunt ab sapiente consectetur.',
    representatives: undefined,
    leads: undefined,
    commsMaterials: undefined,
    reports: undefined,
    tags: ['Health', 'Pharmacy'],
    location: undefined,
  },
];

const getLastModifiedString = (modified: Date | undefined) => {
  if (!modified) {
    return undefined;
  }
  const rightNow = new Date();
  const difference = rightNow.getTime() - modified.getTime();
  const diffDays = getDaysDifference(modified, rightNow);
  if (diffDays < 1) {
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

const getDaysDifference = (date1: Date, date2: Date): number => {
  // Calculate the difference in milliseconds
  const diffInMs = Math.abs(date1.getTime() - date2.getTime());

  // Convert milliseconds to days
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const diffInDays = diffInMs / oneDayInMs;

  // Round the result to the nearest whole day
  return Math.floor(diffInDays); // "round" and "ciel" are also options. I think floor makes most sense.
};

const multiColumnTabFilterFn: FilterFn<EventRow> = (
  row,
  columnId,
  filterValue
) => {
  // Check if the filterValue exists in firstName, lastName, or email
  const lowerCaseFilter = String(filterValue).toLowerCase();
  if (lowerCaseFilter === 'recent' && row.original.dateModified) {
    const rightNow = new Date();
    return getDaysDifference(rightNow, row.original.dateModified) < 2;
  }
  return (
    filterValue === 'all' ||
    (lowerCaseFilter === 'mine' && row.original.mine) ||
    (lowerCaseFilter === 'shared' && row.original.sharedWithMe) ||
    String(row.original.ministry).toLowerCase().includes(lowerCaseFilter)
  );
};
// const arrayIncludesFilterFn: FilterFn<EventRow> = (
//   row,
//   columnId: string,
//   filterValue: string[] | string | undefined
// ) => {
//   if (filterValue && filterValue.length) {
//     // don't filter anything if no filter selected
//     return filterValue.includes(row.original.category.toLocaleLowerCase());
//   } else return true;
// };

// I'd love to consolidate this with the function above, but not bothering right now
const arrayIncludesStatusFilterFn: FilterFn<EventRow> = (
  row,
  columnId: string,
  filterValue: string[] | string | undefined
) => {
  if (filterValue && filterValue.length) {
    // don't filter anything if no filter selected
    return filterValue.includes(row.original.status.toLocaleLowerCase());
  }
  return true;
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
      columnHelper.display({
        id: 'select', // Unique ID for your checkbox column
        size: 20, // Narrow for checkboxes
        enableResizing: false, // Disable resizing for this column
        enablePinning: true,
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            //  indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            title="these checkboxes don't do anything yet"
          />
        ),
      }),
      columnHelper.accessor('id', {
        header: 'Overview',
        enableResizing: false,
        enablePinning: true,
        size: 200,
        cell: ({ row }) => (
          <div>
            {/* todo: Let's make these complicated columns separate components, and pass everything in as props*/}
            <div className={styles.overviewInline}>
              <div>
                {row.original.id}
                {row.original.confidential && (
                  <span className={styles.overviewConfidential}>
                    {` ${row.original.confidential.toUpperCase()}`}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.overviewTitle}>{row.original.title}</div>
            <div>
              <Badge
                className={row.original.category}
                appearance={
                  row.original.category === 'Release' ? 'filled' : 'outline'
                }
              >
                {row.original.category}
              </Badge>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('summary', {
        header: 'Summary',
        size: 250,
        enableResizing: false,
        cell: ({ row }) => (
          <div>
            {row.original.summary}
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {row.original.tags && row.original.tags.length
                ? row.original.tags.map((tag) => (
                    <Badge key={tag} appearance="filled">
                      {tag}
                    </Badge>
                  ))
                : null}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('date', {
        header: 'Schedule',
        cell: ({ row }) => {
          const start: Date = row.original.startDate;
          const end: Date | undefined = row.original.endDate;

          const dateLine = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Calendar24Regular />
              <span>
                {start.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
                {end
                  ? ` – ${end.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}`
                  : ''}
              </span>
            </div>
          );

          const timeLine = (
            <div
              style={{ marginTop: 6, display: 'flex', alignItems: 'center' }}
            >
              <Clock20Regular />
              <span>
                {start.toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
                {end
                  ? ` – ${end.toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}`
                  : ''}
              </span>
            </div>
          );

          const locationLine = row.original.location ? (
            <div
              style={{ marginTop: 6, display: 'flex', alignItems: 'center' }}
            >
              <Location20Regular />
              <span>{row.original.location}</span>
            </div>
          ) : null;

          return (
            <div>
              {dateLine}
              {timeLine}
              {locationLine}
            </div>
          );
        },
      }),
      columnHelper.accessor('representatives', {
        header: 'Representatives',
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {row.original.representatives && row.original.representatives.length
              ? row.original.representatives.map((rep) => (
                  <Badge key={rep} appearance="outline">
                    {rep}
                  </Badge>
                ))
              : null}
          </div>
        ),
      }),
      columnHelper.accessor('leads', {
        header: 'Leads',
        size: 80,
        cell: ({ row }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {row.original.leads && row.original.leads.length
              ? row.original.leads.map((lead) => (
                  <div key={lead} style={{ fontWeight: 'bold' }}>
                    {lead}
                  </div>
                ))
              : null}
          </div>
        ),
      }),
      columnHelper.accessor('commsMaterials', {
        header: 'Comms Materials',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('reports', {
        header: 'Reports',
        size: 100,
        filterFn: (row, columnId, filterValue) => {
          // filterValue is an array of selected report names
          if (!filterValue || !filterValue.length) return true;
          const reports = row.original.reports || [];
          // Only show rows that have at least one selected report
          return filterValue.some((val: string) => reports.includes(val));
        },
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {row.original.reports && row.original.reports.length
              ? row.original.reports.map((report) => (
                  <Badge key={report} appearance="filled">
                    {report}
                  </Badge>
                ))
              : null}
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        //id: 'status', // Unique ID for this display column
        header: 'Status',
        size: 100,
        filterFn: arrayIncludesStatusFilterFn,
        sortingFn: sortStatusFn,
        sortUndefined: -1,

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
        size: 20,
        cell: (info) => (info.getValue() ? <CheckmarkCircle24Regular /> : null),
      }),

      // TODO: make all these a 'tabListFilter' column with all the values, and custom filter to victory.
      columnHelper.accessor('category', {
        enableHiding: true,
        cell: (info) => info.getValue(),
        filterFn: (row, columnId, filterValue) => {
          // Expecting filterValue to be an array of selected category strings
          if (!filterValue) return true;
          const selected = Array.isArray(filterValue) ? filterValue : [filterValue];
          if (selected.length === 0) return true;
          const lowerSelected = selected.map((s: string) => String(s).toLowerCase());
          const rowCat = String(row.original.category || '').toLowerCase();
          return lowerSelected.includes(rowCat);
        },
      }),
      columnHelper.accessor('title', {
        enableHiding: true,
        cell: (info) => info.getValue(),
        filterFn: multiColumnTabFilterFn,
      }),
      columnHelper.accessor('mine', {
        enableHiding: true,
        cell: (info) => info.getValue(),
        filterFn: multiColumnTabFilterFn,
      }),
      columnHelper.accessor('sharedWithMe', {
        enableHiding: true,
        cell: (info) => (info.getValue() ? <CheckmarkCircle24Regular /> : null),
        filterFn: multiColumnTabFilterFn,
      }),
      columnHelper.accessor('ministry', {
        enableHiding: true,
        cell: (info) => info.getValue(),
        filterFn: multiColumnTabFilterFn,
      }),
    ],
    [columnHelper, styles.statusBadge]
  );

  // Date range filter function
  const dateRangeFilterFn: FilterFn<EventRow> = (row, columnId, value) => {
    if (!value || !value.start || !value.end) return true;
    const start = new Date(value.start);
    const end = new Date(value.end);
    // Event must start and end within the range
    return (
      row.original.startDate >= start &&
      row.original.endDate !== undefined &&
      row.original.endDate <= end
    );
  };

  const table = useReactTable({
    data: eventData,
    columns,
    enableRowSelection: true,
    state: {
      sorting,
      pagination: { pageIndex, pageSize: 5 },
      globalFilter,
      columnFilters,
      columnVisibility: {
        sharedWithMe: false,
        mine: false,
        ministry: false,
        title: false,
        category: false,
      },
      columnPinning: { left: ['select', 'id'] },
    },
    filterFns: {
      multiColumn: multiColumnTabFilterFn,
      dateRange: dateRangeFilterFn,
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
    <div
      style={{
        // padding: '0px, 100px, 0px, 24px',
        background: '#fff',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <div
        style={{
          overflowX: 'auto',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          WebkitOverflowScrolling: 'touch',
        }}
      >
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
                      cursor: header.column.getCanSort()
                        ? 'pointer'
                        : undefined,
                      width: header.getSize(),
                      position: header.column.getIsPinned()
                        ? 'sticky'
                        : 'relative', // Make pinned columns sticky
                      left: header.column.getIsPinned()
                        ? header.column.id === 'id' // Only offset the 'id' column. This was a freaking ordeal
                          ? `${header.column.getStart('left') + 16}px`
                          : `${header.column.getStart('left')}px`
                        : 'auto',
                      zIndex: header.column.getIsPinned() ? 1 : 'auto', // Ensure it stays on top
                      background: header.column.getIsPinned()
                        ? '#fff'
                        : 'transparent', // Optional: Match table background
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
                onClick={() => {
                  void navigate('/details', { state: row.original });
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      position: cell.column.getIsPinned()
                        ? 'sticky'
                        : 'relative', // Make pinned cells sticky
                      left: cell.column.getIsPinned()
                        ? cell.column.id === 'id'
                          ? `${cell.column.getStart('left') + 16}px`
                          : `${cell.column.getStart('left')}px`
                        : 'auto',
                      zIndex: cell.column.getIsPinned() ? 1 : 'auto', // Ensure it stays on top
                      background: cell.column.getIsPinned()
                        ? '#fff'
                        : 'transparent', // Optional: Match row background
                      boxSizing: 'border-box', // Include padding in width calculation
                      width: cell.column.columnDef.size,
                      minWidth: cell.column.columnDef.size,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
