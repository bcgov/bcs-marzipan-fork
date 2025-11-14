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
  TabListProps,
  SelectTabData,
  SelectTabEvent,
  TabValue,
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
  const [categoryFilter, setCategoryFilter] = React.useState<string>(); // this may end up being <string[]>
  const [titleFilter, setTitleFilter] = React.useState<string>(); // this may end up being <string[]>
  const [tabFilterValue, setTabFilterValue] = React.useState<string>('all');

  const handleCategoryChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    setCategoryFilter(data.optionText);
  };

  const filterData = {
    category: {id: 'category', value: ''},
    title: {id: 'title', value: ''},
    tabListFilter: {id: 'tabListFilter', value: tabFilterValue }
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
    
    filterData.tabListFilter = {id: 'tabListFilter', value: '' }
    const filterArr: ColumnFiltersState = [ filterData.category, filterData.title]

    onFiltersChanged(filterArr);
  };
  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setTabFilterValue(data.value as string);
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
      onClick={applyFilters}
    >Filter</Button>

  </div>
  )
};
