import { 
  Button,
  Input, 
  tokens,
  Option,
  Combobox,
  SelectionEvents,
  OptionOnSelectData,
} from "@fluentui/react-components";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { set } from "zod";

interface FilterProps {
  filters: ColumnFiltersState,
  onFiltersChanged: any
}


export const CalendarFilters: React.FC<FilterProps> = ({filters, onFiltersChanged}) => {
  const filterTypes = ["Event", "Release", "Issue"];
  const [filterType, setFilterType] = React.useState<string>(); // this may end up being <string[]>

  const handleCategoryChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    setFilterType(data.optionText);
  };

  const applyFilters = () => {
    // this is placeholder. Of course we will need something more sophisticated as filtering becomes more sophisticated
    if(filterType){
      filters = [{id: "category", value: filterType}];
    } else { 
      filters = [];
    }
    onFiltersChanged(filters);
  };

  return(
  <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacingHorizontalM, alignItems: "center", marginBottom: tokens.spacingVerticalL }}>
    <Button>All</Button>
    <Button>My Activities</Button>
    <Button>Shared With Me</Button>
    <Button>Watchlist</Button>
    <Input placeholder="Search events..." title="Search by ID, Keywords, City" />

    <Combobox placeholder="Type filter..."
      onOptionSelect={handleCategoryChange}
    >
      <Option text=''/>
      {filterTypes.map((option) => (
          <Option key={option} >
            {option}
          </Option>
        ))}
    </Combobox>
    {/* <DatePicker placeholder="From date" />
    <DatePicker placeholder="To date" /> */}
    <Button appearance="outline"
      onClick={applyFilters}
    >Filter</Button>
  </div>
  )
};
