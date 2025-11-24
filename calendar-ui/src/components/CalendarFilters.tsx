import {
  Input,
  Tab,
  TabList,
  SelectTabData,
  SelectTabEvent,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MenuItemCheckbox,
  MenuProps,
  MenuCheckedValueChangeData,
} from '@fluentui/react-components';
import { FilterAddRegular, FilterRegular } from '@fluentui/react-icons';

import { ColumnFiltersState } from '@tanstack/react-table';
import React, { useEffect } from 'react';
import { set } from 'zod';

interface FilterProps {
  filters: ColumnFiltersState;
  onFiltersChanged: (filters: ColumnFiltersState) => void;
}

export const CalendarFilters: React.FC<FilterProps> = ({
  filters,
  onFiltersChanged,
}) => {
  const [titleFilter, setTitleFilter] = React.useState<string>();
  const [tabFilterValue, setTabFilterValue] = React.useState<string>('all');

  const [checkedStatusValues, setCheckedStatusValues] = React.useState<
    Record<string, string[]>
  >({ status: [] });
  // ({ status: ["new", "reviewed", "changed", "deleted"] });
  const [checkedCategoryValues, setCheckedCategoryValues] = React.useState<
    Record<string, string[]>
  >({ category: [] });
  // ({ category: ["release", "issue", "event"] });
  const onStatusChange: MenuProps['onCheckedValueChange'] = (
    _,
    { name, checkedItems }: MenuCheckedValueChangeData
  ) => {
    console.log('on status change');
    setCheckedStatusValues((s) => {
      return s ? { ...s, [name]: checkedItems } : { [name]: checkedItems };
    });
  };

  const onCategoryChange: MenuProps['onCheckedValueChange'] = (
    _, // e: MenuCheckedValueChangeEvent,
    { name, checkedItems }: MenuCheckedValueChangeData
  ) => {
    console.log('on category change');
    setCheckedCategoryValues((s) => {
      return s ? { ...s, [name]: checkedItems } : { [name]: checkedItems };
    });
  };

  const filterData = {
    category: { id: 'category', value: [''] },
    status: { id: 'status', value: [''] },
    title: { id: 'title', value: '' },
    tabListFilter: { id: 'tabListFilter', value: tabFilterValue },
  };

  const applyFilters = (tabValue?: string) => {
    const currentTabValue = tabValue || tabFilterValue; // Use passed value if provided, else fall back to state
    filterData.category = {
      id: 'category',
      value: checkedCategoryValues.category || [],
    };
    filterData.status = {
      id: 'status',
      value: checkedStatusValues.status || [],
    };
    if (titleFilter) {
      filterData.title = { id: 'title', value: titleFilter };
    } else {
      filterData.title = { id: 'title', value: '' };
    }
    filterData.tabListFilter = { id: 'mine', value: currentTabValue };
    const filterArr: ColumnFiltersState = [
      filterData.category,
      filterData.status,
      filterData.title,
      filterData.tabListFilter,
    ];

    onFiltersChanged(filterArr);
  };

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    const newValue = data.value as string;
    setTabFilterValue(newValue);
    applyFilters(newValue); // Pass the new value directly to avoid stale state
  };

  const handleClearFilters = () => {
    setCheckedCategoryValues({ category: [] });
    setCheckedStatusValues({ status: [] });
    setTitleFilter('');
    setTabFilterValue('all');
  };

  useEffect(() => {
    applyFilters();
  }, [checkedStatusValues, checkedCategoryValues]);

  return (
    <div>
      <TabList selectedValue={tabFilterValue} onTabSelect={onTabSelect}>
        <Tab value="all">All</Tab>
        <Tab value="mine">My entries</Tab>
        <Tab value="recent">Recent</Tab>
        <Tab value="ministry" disabled>
          HLTH
        </Tab>{' '}
        {/* I assume this becomes user's ministry, whatever it is */}
        <Tab value="shared">Shared</Tab>
      </TabList>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton className="dropdownItem" disabled>
            Date
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>{/* I assum this will be a range */}</MenuList>
        </MenuPopover>
      </Menu>
      <Menu
        checkedValues={checkedCategoryValues}
        onCheckedValueChange={onCategoryChange}
      >
        <MenuTrigger disableButtonEnhancement>
          <MenuButton>
            {' '}
            {`Categories${
              checkedCategoryValues['category']?.length > 0
                ? ' (' + checkedCategoryValues['category'].length + ')'
                : ''
            } `}{' '}
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItemCheckbox name="category" value="release">
              Release
            </MenuItemCheckbox>
            <MenuItemCheckbox name="category" value="issue">
              Issue
            </MenuItemCheckbox>
            <MenuItemCheckbox name="category" value="event">
              Event
            </MenuItemCheckbox>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu
        checkedValues={checkedStatusValues}
        onCheckedValueChange={onStatusChange}
      >
        <MenuTrigger disableButtonEnhancement>
          <MenuButton>{`Status${
            checkedStatusValues['status']?.length > 0
              ? ' (' + checkedStatusValues['status'].length + ')'
              : ''
          } `}</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItemCheckbox name="status" value="new">
              New
            </MenuItemCheckbox>
            <MenuItemCheckbox name="status" value="reviewed">
              Reviewed
            </MenuItemCheckbox>
            <MenuItemCheckbox name="status" value="changed">
              Changed
            </MenuItemCheckbox>
            <MenuItemCheckbox name="status" value="deleted">
              Deleted
            </MenuItemCheckbox>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Look ahead</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Reports</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Location</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Category</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Representatives</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Leads</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Updated</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Tags</MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="subtle" icon={<FilterRegular />}>
            Filter
          </MenuButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem onClick={handleClearFilters}>Reset all</MenuItem>
            <MenuItem disabled>Save</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Input
        placeholder="Search by event title..."
        onChange={(_, data) => {
          setTitleFilter(data.value);
        }}
      />
    </div>
  );
};
