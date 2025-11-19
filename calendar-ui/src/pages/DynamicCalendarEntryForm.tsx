import * as React from 'react';
import { calendarWizardSchema } from '../schemas/calendarWizard.schema';
import { createActivity } from '../api/activitiesApi';
import type { CreateActivityRequest } from '@corpcal/shared/schemas';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Wizard from '../components/DynamicWizard/Wizard';

const makeStyles = () => ({
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '1rem',
  },
});

export const DynamicCalendarEntryForm: React.FC = () => {
  const styles = makeStyles();

  // Transform wizard form values to CreateActivityRequest
  const transformWizardDataToRequest = (
    formValues: Record<string, any>
  ): CreateActivityRequest => {
    const details = formValues.details || {};
    const schedule = formValues.schedule || {};

    // Combine date and time fields into ISO datetime strings (ISO 8601 format)
    const startDateTime =
      schedule.startDate && schedule.startTime
        ? `${schedule.startDate}T${schedule.startTime}:00.000Z`
        : null;
    const endDateTime =
      schedule.endDate && schedule.endTime
        ? `${schedule.endDate}T${schedule.endTime}:00.000Z`
        : null;

    // Map timeframe to isConfirmed flag
    const isConfirmed = schedule.timeframe?.toLowerCase() === 'confirmed';

    // Build the request object
    const request: CreateActivityRequest = {
      title: details.title || null,
      details: details.summary || null,
      startDateTime: startDateTime || null,
      endDateTime: endDateTime || null,
      leadOrganization: details.ministry || null,
      isIssue: !!formValues.events?.issue,
      isConfirmed,
      // Set defaults for required boolean fields
      isActive: true,
      isAllDay: false,
      isAtLegislature: false,
      isConfidential: false,
      isCrossGovernment: false,
      isMilestone: false,
      hqSection: 0,
    };

    return request;
  };

  // This is the function that will send the data to your API
  const handleSubmit = async (formValues: Record<string, any>) => {
    try {
      const request = transformWizardDataToRequest(formValues);
      await createActivity(request);
      // Optionally show a success message or redirect
      alert('Calendar entry saved!');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save entry';
      // Optionally show an error message
      alert(`Failed to save entry: ${errorMessage}`);
      console.error(err);
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={styles.container}>
        <Wizard
          title="New Calendar Entry"
          entryId="HLTH-000001"
          schema={calendarWizardSchema}
          initialValues={{
            // 👇 pre-fill dummy values for testing
            details: {
              title: 'Test Event',
              summary: 'Testing dynamic wizard form',
            },
            schedule: {
              startDate: new Date().toISOString().split('T')[0], // today
              startTime: '09:00',
              endDate: new Date().toISOString().split('T')[0],
              endTime: '10:00',
            },
            events: {
              topic: 'Press Briefing',
              tags: ['Policy', 'Health'],
            },
            comms: {
              channels: ['Email'],
            },
            sharing: {
              sharedWith: ['HR', 'Finance'],
            },
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </FluentProvider>
  );
};
