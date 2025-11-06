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
import React from "react";
import { set } from "zod";

interface FilterProps {
  filters: ColumnFiltersState,
  onFiltersChanged: any
}

export const CalendarFilters: React.FC<FilterProps> = ({filters, onFiltersChanged}) => {
  const filterData = {
    category: {id: 'category', value: ''},
    title: {id: 'title', value: ''}
  }
  const categoryFilters = ["Event", "Release", "Issue"];
  const [categoryFilter, setCategoryFilter] = React.useState<string>(); // this may end up being <string[]>
  const [titleFilter, setTitleFilter] = React.useState<string>(); // this may end up being <string[]>

  const handleCategoryChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    setCategoryFilter(data.optionText);
  };

  const applyFilters = () => { // todo: need to rethink this so we can filter on multiple values
    if (categoryFilter) {
      filterData.category = { id: "category", value: categoryFilter };
    } else {
      filterData.category = { id: "category", value: '' };
    }
    if (titleFilter) {
      filterData.title = { id: "title", value: titleFilter };
    } else {
      filterData.title = { id: "title", value: '' };
    }

    const filterArr: ColumnFiltersState = [ filterData.category, filterData.title]
    console.log(filterArr);

    onFiltersChanged(filterArr);
  };

  return(
  <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacingHorizontalM, alignItems: "center", marginBottom: tokens.spacingVerticalL }}>
    <Button>All</Button>
    <Button>My Activities</Button>
    <Button>Shared With Me</Button>
    <Button>Watchlist</Button>
      <Input placeholder="Search by event title..."
        onChange={(_, data) => { setTitleFilter(data.value) }}
    />

    <Combobox placeholder="Type filter..."
      onOptionSelect={handleCategoryChange}
    >
      <Option text=''/>
      {categoryFilters.map((option) => (
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
