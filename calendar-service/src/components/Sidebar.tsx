import { DrawerProps } from "@fluentui/react-components";
import * as React from "react";
import {
  AppItem,
  Hamburger,
  NavCategory,
  NavCategoryItem,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
} from "@fluentui/react-nav"; // updated import
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  makeStyles,
  tokens,
  useRestoreFocusTarget,
} from "@fluentui/react-components";
import {
  Board20Filled,
  Board20Regular,
  HeartPulse20Filled,
  HeartPulse20Regular,
  MegaphoneLoud20Filled,
  MegaphoneLoud20Regular,
  NotePin20Filled,
  NotePin20Regular,
  Person20Filled,
  PersonLightbulb20Filled,
  PersonLightbulb20Regular,
  Person20Regular,
  PersonSearch20Filled,
  PersonSearch20Regular,
  PreviewLink20Filled,
  PreviewLink20Regular,
  bundleIcon,
  PersonCircle32Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    display: "flex",
    height: "100vh",
  },
  nav: {
    minWidth: "260px",
  },
  content: {
    flex: "1",
    padding: "2px",
    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  field: {
    display: "flex",
    marginTop: "4px",
    marginLeft: "8px",
    flexDirection: "column",
    gridRowGap: tokens.spacingVerticalS,
  },
});

const Person = bundleIcon(Person20Filled, Person20Regular);
const Dashboard = bundleIcon(Board20Filled, Board20Regular);
const Announcements = bundleIcon(MegaphoneLoud20Filled, MegaphoneLoud20Regular);
const EmployeeSpotlight = bundleIcon(
  PersonLightbulb20Filled,
  PersonLightbulb20Regular
);
const Search = bundleIcon(PersonSearch20Filled, PersonSearch20Regular);
const PerformanceReviews = bundleIcon(
  PreviewLink20Filled,
  PreviewLink20Regular
);
const JobPostings = bundleIcon(NotePin20Filled, NotePin20Regular);
const HealthPlans = bundleIcon(HeartPulse20Filled, HeartPulse20Regular);

type DrawerType = Required<DrawerProps>["type"];

export const Sidebar = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = React.useState(true);
  const [enabledLinks] = React.useState(true);
  const [type] = React.useState<DrawerType>("inline");
  const [isMultiple] = React.useState(true);
  const location = useLocation();

  const restoreFocusTargetAttributes = useRestoreFocusTarget();

  const linkDestination = enabledLinks ? "https://www.bing.com" : "";

  const pathToValue: Record<string, string> = {
    "/dashboard": "1",
    "/": "2",
  };

  const selectedValue = pathToValue[location.pathname] || "2";

  return (
    <div className={styles.root}>
      <NavDrawer
        selectedValue={selectedValue}
        open={isOpen}
        type={type}
        multiple={isMultiple}
        className={styles.nav}
      >
        <NavDrawerHeader>
          <Tooltip content="Close Navigation" relationship="label">
            <Hamburger onClick={() => setIsOpen(!isOpen)} />
          </Tooltip>
        </NavDrawerHeader>

        <NavDrawerBody>
          <AppItem icon={<PersonCircle32Regular />} as="a" href={linkDestination}>
            Marzipan HR
          </AppItem>
          <NavItem icon={<Dashboard />} value="1">
          <Link to="/dashboard" style={{textDecoration: "none", color: "inherit"}}>
            Dashboard
          </Link>
          </NavItem>
          <NavItem icon={<Announcements />} value="2">
          <Link to="/" style={{textDecoration: "none", color: "inherit"}}>
            Calendar
          </Link>
          </NavItem>
          <NavItem icon={<EmployeeSpotlight />} value="3">
          <Link to="/drafts" style={{textDecoration: "none", color: "inherit"}}>
            Drafts
            </Link>
          </NavItem>
          <NavItem icon={<Search />} value="4">
          <Link to="/pitch" style={{textDecoration: "none", color: "inherit"}}>
            Pitch
            </Link>
          </NavItem>

          <NavSectionHeader>Reporting</NavSectionHeader>
          <NavCategory value="6">
            <NavCategoryItem icon={<JobPostings />}>Reports</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem as="a" href={linkDestination} value="7">
                Analytics
              </NavSubItem>
              <NavSubItem as="a" href={linkDestination} value="8">
                Submissions
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>

          <NavSectionHeader>Manage</NavSectionHeader>
          <NavItem icon={<HealthPlans />} value="10">
            Users
          </NavItem>
          <NavCategory value="11">
            <NavCategoryItem icon={<Person />} value="12">
              Settings
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem as="a" href={linkDestination} value="13">
                Form Templates
              </NavSubItem>
              <NavSubItem as="a" href={linkDestination} value="14">
                Data Retention
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
        </NavDrawerBody>
      </NavDrawer>

      <div className={styles.content}>
        {!isOpen && (
          <Tooltip content="Toggle navigation pane" relationship="label">
            <Hamburger
              onClick={() => setIsOpen(!isOpen)}
              {...restoreFocusTargetAttributes}
              aria-expanded={isOpen}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};