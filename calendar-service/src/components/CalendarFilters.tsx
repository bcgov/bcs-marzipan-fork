import { Button, Combobox, Input, tokens } from "@fluentui/react-components";

export const CalendarFilters = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacingHorizontalM, alignItems: "center", marginBottom: tokens.spacingVerticalL }}>
    <Button>All</Button>
    <Button>My Activities</Button>
    <Button>Shared With Me</Button>
    <Button>Watchlist</Button>
    <Input placeholder="Search events..." />
    <Combobox placeholder="Type filter...">
      <option value="Event">Event</option>
      <option value="Press Release">Press Release</option>
    </Combobox>
    {/* <DatePicker placeholder="From date" />
    <DatePicker placeholder="To date" /> */}
    <Button appearance="outline">Filter</Button>
  </div>
);
