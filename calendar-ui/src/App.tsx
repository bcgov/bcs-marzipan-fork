import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

import { CalendarEntriesList } from './pages/CalendarEntriesList';
import { EntryDetails } from './pages/EntryDetails';
import { Dashboard } from './pages/Dashboard';
import './styles/App.css';
import PitchSubmissionsPage from './pages/PitchSubmissions';
import { CalendarEntryForm } from './pages/CalendarEntryForm';
import DraftsPage from './pages/Drafts';
import { CreateActivityFormv2 } from './pages/CreateActivityFormv2';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<CalendarEntriesList />} />
          <Route path="/drafts" element={<DraftsPage />} />
          {/* <Route path="/calendar" element={<CalendarCardView />} /> Card view, need to be removed. Maybe kept for mobile view */}
          <Route path="/pitch" element={<PitchSubmissionsPage />} />
          <Route path="/entry-form" element={<CalendarEntryForm />} />
          <Route path="/entry-form-temp" element={<CreateActivityFormv2 />} />
          {/* merge with Wizard */}

          <Route path="/details" element={<EntryDetails />} />
          {/* Add more routes here */}
        </Route>
      </Routes>
    </FluentProvider>
  );
}

export default App;
