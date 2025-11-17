import { 
  Button,
  Input, 
  tokens,
  Option,
  Combobox,
  SelectionEvents,
  OptionOnSelectData,
  Tab,
  TabList,
  SelectTabData,
  SelectTabEvent,
} from "@fluentui/react-components";
import { ColumnFiltersState } from "@tanstack/react-table";
import React from "react";
import { set } from "zod";

interface FilterProps {
  filters: ColumnFiltersState,
  onFiltersChanged: any
}

export const CalendarFilters: React.FC<FilterProps> = ({filters, onFiltersChanged}) => {
  
  const categoryFilters = ["Event", "Release", "Issue"];
  const [categoryFilter, setCategoryFilter] = React.useState<string>();
  const [titleFilter, setTitleFilter] = React.useState<string>();
  const [tabFilterValue, setTabFilterValue] = React.useState<string>('all');

  const handleCategoryChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    setCategoryFilter(data.optionText);
  };

  const filterData = {
    category: {id: 'category', value: ''},
    title: {id: 'title', value: ''},
    tabListFilter: {id: 'tabListFilter', value: tabFilterValue }
  };

    const applyFilters = (tabValue?: string) => {
    const currentTabValue = tabValue || tabFilterValue; // Use passed value if provided, else fall back to state
    if (categoryFilter) {
      filterData.category = { id: "category", value: categoryFilter };
    } else {
      filterData.category = { id: "category", value: "" };
    }
    if (titleFilter) {
      filterData.title = { id: "title", value: titleFilter };
    } else {
      filterData.title = { id: "title", value: "" };
    }
    filterData.tabListFilter = { id: "mine", value: currentTabValue };
    const filterArr: ColumnFiltersState = [filterData.category, filterData.title, filterData.tabListFilter];
    onFiltersChanged(filterArr);
  };
  
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    const newValue = data.value as string;
    setTabFilterValue(newValue);
    applyFilters(newValue); // Pass the new value directly to avoid stale state
  };

  return(
  <div>
    <TabList
      selectedValue= {tabFilterValue}
      onTabSelect={onTabSelect}
    >
      <Tab value="all">All</Tab>
      <Tab value="mine">My entries</Tab>
      <Tab value="recent">Recent</Tab>
      <Tab value="ministry">HLTH</Tab> {/* I assume this becomes user's ministry, whatever it is */}
      <Tab value="shared">Shared</Tab>
    </TabList>

    <Input placeholder="Search by event title..."
      onChange={(_, data) => { setTitleFilter(data.value) }}
    />

    <Combobox placeholder="Category filter..."
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
      onClick={(tabFilterValue) => applyFilters}
    >Filter</Button>

  </div>
  )
};
