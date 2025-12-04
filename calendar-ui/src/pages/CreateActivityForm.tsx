import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  createActivityRequestSchema,
  type CreateActivityRequest,
} from '@corpcal/shared/schemas';
import { createActivity } from '../api/activitiesApi';
import { useMultiSelect } from '../hooks/useMultiSelect';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Combobox } from '../components/ui/combobox';
import {
  mockCategories,
  mockSchedulingStatuses,
  mockPitchStatuses,
  mockOrganizations,
  mockTags,
  mockSystemUsers,
  mockCommsMaterials,
  mockTranslationLanguages,
  mockGovernmentRepresentatives,
  lookAheadStatusOptions,
  lookAheadSectionOptions,
  calendarVisibilityOptions,
} from '../data/mockLookups';
import { X, Plus } from 'lucide-react';

type FormData = CreateActivityRequest & {
  categoryIds?: number[];
  relatedActivityIds?: number[];
  tagIds?: string[];
  jointOrganizationIds?: string[];
  commsMaterialIds?: number[];
  translationLanguageIds?: number[];
  jointEventOrganizationIds?: string[];
  representativeIds?: number[];
  sharedWithOrganizationIds?: string[];
  canEditUserIds?: number[];
  canViewUserIds?: number[];
};

export const CreateActivityForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJointOrganizations, setShowJointOrganizations] = useState(false);
  const [showJointEventOrganizations, setShowJointEventOrganizations] =
    useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createActivityRequestSchema) as any,
    defaultValues: {
      isAllDay: false,
      oicRelated: false,
      isIssue: false,
      notForLookAhead: false,
      planningReport: false,
      thirtySixtyNinetyReport: false,
      categoryIds: [],
      relatedActivityIds: [],
      tagIds: [],
      jointOrganizationIds: [],
      commsMaterialIds: [],
      translationLanguageIds: [],
      jointEventOrganizationIds: [],
      representativeIds: [],
      sharedWithOrganizationIds: [],
      canEditUserIds: [],
      canViewUserIds: [],
    } as FormData,
  });

  const [selectedCategories, toggleCategory] = useMultiSelect<
    FormData,
    'categoryIds',
    number
  >(form, 'categoryIds');
  const [selectedRelatedActivities, toggleRelatedActivity] = useMultiSelect<
    FormData,
    'relatedActivityIds',
    number
  >(form, 'relatedActivityIds');
  const [selectedTags, toggleTag] = useMultiSelect<FormData, 'tagIds', string>(
    form,
    'tagIds'
  );
  const [selectedJointOrganizations, toggleJointOrganization] = useMultiSelect<
    FormData,
    'jointOrganizationIds',
    string
  >(form, 'jointOrganizationIds');
  const [selectedCommsMaterials, toggleCommsMaterial] = useMultiSelect<
    FormData,
    'commsMaterialIds',
    number
  >(form, 'commsMaterialIds');
  const [selectedTranslationLanguages, toggleTranslationLanguage] =
    useMultiSelect<FormData, 'translationLanguageIds', number>(
      form,
      'translationLanguageIds'
    );
  const [selectedJointEventOrganizations, toggleJointEventOrganization] =
    useMultiSelect<FormData, 'jointEventOrganizationIds', string>(
      form,
      'jointEventOrganizationIds'
    );
  const [selectedRepresentatives, toggleRepresentative] = useMultiSelect<
    FormData,
    'representativeIds',
    number
  >(form, 'representativeIds');
  const [selectedSharedWith, toggleSharedWith] = useMultiSelect<
    FormData,
    'sharedWithOrganizationIds',
    string
  >(form, 'sharedWithOrganizationIds');
  const [selectedCanEdit, toggleCanEdit] = useMultiSelect<
    FormData,
    'canEditUserIds',
    number
  >(form, 'canEditUserIds');

  const handleCancel = () => {
    form.reset();
  };

  const onSubmit = async (data: FormData) => {
    console.log('onSubmit called with data:', data);
    setIsSubmitting(true);
    try {
      // Transform venueAddress to ensure it's a proper object or null
      let venueAddress = null;
      if (data.venueAddress) {
        if (
          typeof data.venueAddress === 'object' &&
          !Array.isArray(data.venueAddress) &&
          data.venueAddress !== null
        ) {
          const venue = data.venueAddress as {
            street?: string;
            city?: string;
            provinceOrState?: string;
            country?: string;
          };
          // Check if all required fields are present and not empty
          const hasValidFields =
            venue.street ||
            venue.city ||
            venue.provinceOrState ||
            venue.country;
          if (hasValidFields) {
            venueAddress = {
              street: venue.street || '',
              city: venue.city || '',
              provinceOrState: venue.provinceOrState || '',
              country: venue.country || '',
            };
          }
        }
      }

      // Prepare submit data with junction table arrays
      const formValues = form.getValues();
      const submitData = {
        ...data,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        venueAddress: venueAddress,
        categoryIds:
          formValues.categoryIds && formValues.categoryIds.length > 0
            ? formValues.categoryIds
            : undefined,
        tagIds:
          formValues.tagIds && formValues.tagIds.length > 0
            ? formValues.tagIds
            : undefined,
        relatedActivityIds:
          formValues.relatedActivityIds &&
          formValues.relatedActivityIds.length > 0
            ? formValues.relatedActivityIds
            : undefined,
        jointOrganizationIds:
          formValues.jointOrganizationIds &&
          formValues.jointOrganizationIds.length > 0
            ? formValues.jointOrganizationIds
            : undefined,
        commsMaterialIds:
          formValues.commsMaterialIds && formValues.commsMaterialIds.length > 0
            ? formValues.commsMaterialIds
            : undefined,
        translationLanguageIds:
          formValues.translationLanguageIds &&
          formValues.translationLanguageIds.length > 0
            ? formValues.translationLanguageIds
            : undefined,
        jointEventOrganizationIds:
          formValues.jointEventOrganizationIds &&
          formValues.jointEventOrganizationIds.length > 0
            ? formValues.jointEventOrganizationIds
            : undefined,
        representativeIds:
          formValues.representativeIds &&
          formValues.representativeIds.length > 0
            ? formValues.representativeIds
            : undefined,
        sharedWithOrganizationIds:
          formValues.sharedWithOrganizationIds &&
          formValues.sharedWithOrganizationIds.length > 0
            ? formValues.sharedWithOrganizationIds
            : undefined,
        canEditUserIds:
          formValues.canEditUserIds && formValues.canEditUserIds.length > 0
            ? formValues.canEditUserIds
            : undefined,
      };

      console.log('Submitting data to API:', submitData);
      await createActivity(submitData);
      alert('Activity created successfully!');
      // TODO: Navigate to activity detail page or list
      form.reset();
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to create activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
    console.error('Form values:', form.getValues());
  };

  // Mock related activities for selection (TODO: Replace with API call)
  const mockRelatedActivities = [
    { id: 1, title: 'Related Activity 1' },
    { id: 2, title: 'Related Activity 2' },
    { id: 3, title: 'Related Activity 3' },
  ];

  // Transform organizations for combobox
  const jointOrganizationOptions = mockOrganizations.map((org) => ({
    value: org.id,
    label: org.name,
  }));

  const ErrorFallback = ({
    error,
    resetErrorBoundary,
  }: {
    error: Error;
    resetErrorBoundary: () => void;
  }) => {
    return (
      <div className="mx-auto max-w-200 px-4 py-8" role="alert">
        <div className="mb-8">
          <h1 className="text-destructive mb-2 text-3xl font-bold">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-4">
            An error occurred while rendering the form. Please try again.
          </p>
          <details className="mb-4">
            <summary className="cursor-pointer text-sm font-medium">
              Error details
            </summary>
            <pre className="bg-muted mt-2 overflow-auto rounded p-4 text-sm">
              {error.message}
            </pre>
          </details>
          <Button onClick={resetErrorBoundary} variant="default">
            Try again
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="mx-auto max-w-200 px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Create New Activity</h1>
          <p className="text-muted-foreground">
            Fill in the activity details below
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submit event triggered');
              void form.handleSubmit(onSubmit, onError)(e);
            }}
            className="space-y-8"
          >
            {/* Overview Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Overview</h2>

              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Category *</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockCategories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={
                          selectedCategories.includes(category.id)
                            ? 'selected'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.displayName || category.name}
                        {/* {selectedCategories.includes(category.id) && (
                        <X className="ml-2 h-3 w-3" />
                      )} */}
                      </Badge>
                    ))}
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="text-muted-foreground mt-2 text-sm">
                      Please select at least one category
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter activity title"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leadOrgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Organization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lead organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockOrganizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!showJointOrganizations && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setShowJointOrganizations(!showJointOrganizations)
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add joint organization
                    </Button>
                  </div>
                )}
                {showJointOrganizations && (
                  <div>
                    <Label className="mb-3 block">Joint Organization</Label>
                    <Combobox
                      options={jointOrganizationOptions}
                      selectedValues={selectedJointOrganizations}
                      onSelect={toggleJointOrganization}
                      placeholder="Search organizations..."
                      searchPlaceholder="Search organizations..."
                      emptyMessage="No organizations found."
                    />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter activity summary"
                          rows={4}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isIssue"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Issue</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="oicRelated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Order in Council Related</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Related Activities</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockRelatedActivities.map((activity) => (
                      <Badge
                        key={activity.id}
                        variant={
                          selectedRelatedActivities.includes(activity.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleRelatedActivity(activity.id)}
                      >
                        {activity.title}
                        {selectedRelatedActivities.includes(activity.id) && (
                          <X className="ml-2 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    Select related activities if applicable
                  </FormDescription>
                </div>

                <div>
                  <Label className="mb-3 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={
                          selectedTags.includes(tag.id) ? 'default' : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.text}
                        {selectedTags.includes(tag.id) && (
                          <X className="ml-2 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    Select tags to categorize this activity
                  </FormDescription>
                </div>
              </div>
            </div>

            {/* Approvals Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Approvals</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="significance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Significance</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter significance"
                          rows={4}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pitchStatusId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pitch Status</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pitch status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockPitchStatuses.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={status.id.toString()}
                            >
                              {status.displayName || status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pitchComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pitch and Approval Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter pitch and approval notes"
                          rows={4}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Schedule</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="schedulingStatusId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduling Status</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select scheduling status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockSchedulingStatuses.map((status) => (
                            <SelectItem
                              key={status.id}
                              value={status.id.toString()}
                            >
                              {status.displayName || status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAllDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>All Day Event</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!form.watch('isAllDay') && (
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!form.watch('isAllDay') && (
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="schedulingConsiderations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduling Considerations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter scheduling considerations"
                          rows={4}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Comms Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Comms</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="commsLeadId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comms Lead</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select comms lead" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockSystemUsers.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-3 block">Comms Materials</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockCommsMaterials.map((material) => (
                      <Badge
                        key={material.id}
                        variant={
                          selectedCommsMaterials.includes(material.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleCommsMaterial(material.id)}
                      >
                        {material.displayName || material.name}
                        {selectedCommsMaterials.includes(material.id) && (
                          <X className="ml-2 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    Select comms materials if applicable
                  </FormDescription>
                </div>

                <FormField
                  control={form.control}
                  name="newsReleaseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>News Release</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter news release ID (UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a valid UUID (e.g.,
                        123e4567-e89b-12d3-a456-426614174001) or leave empty
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-3 block">Translations Required</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockTranslationLanguages.map((language) => (
                      <Badge
                        key={language.id}
                        variant={
                          selectedTranslationLanguages.includes(language.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleTranslationLanguage(language.id)}
                      >
                        {language.displayName || language.name}
                        {selectedTranslationLanguages.includes(language.id) && (
                          <X className="ml-2 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    Select translation languages if applicable
                  </FormDescription>
                </div>
              </div>
            </div>

            {/* Event Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Event</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="eventLeadOrgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Lead Organization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event lead organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockOrganizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!showJointEventOrganizations && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setShowJointEventOrganizations(
                          !showJointEventOrganizations
                        )
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add joint organization
                    </Button>
                  </div>
                )}
                {showJointEventOrganizations && (
                  <div>
                    <Label className="mb-3 block">
                      Joint event organization
                    </Label>
                    <Combobox
                      options={jointOrganizationOptions}
                      selectedValues={selectedJointEventOrganizations}
                      onSelect={toggleJointEventOrganization}
                      placeholder="Select"
                      searchPlaceholder="Search organizations"
                      emptyMessage="No organizations found."
                    />
                  </div>
                )}
                {/* <div>
                <Label className="mb-3 block">Joint Event Organizations</Label>
                <div className="flex flex-wrap gap-2">
                  {mockOrganizations.map((org) => (
                    <Badge
                      key={org.id}
                      variant={
                        selectedJointEventOrganizations.includes(org.id)
                          ? 'default'
                          : 'outline'
                      }
                      className="cursor-pointer px-4 py-2 text-sm"
                      onClick={() => toggleJointEventOrganization(org.id)}
                    >
                      {org.name}
                      {selectedJointEventOrganizations.includes(org.id) && (
                        <X className="ml-2 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
                <FormDescription className="mt-2">
                  Select joint event organizations if applicable
                </FormDescription>
              </div> */}

                <FormField
                  control={form.control}
                  name="eventLeadId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Planner</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event planner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockSystemUsers.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-3 block">
                    Representatives Attending
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {mockGovernmentRepresentatives.map((rep) => (
                      <Badge
                        key={rep.id}
                        variant={
                          selectedRepresentatives.includes(rep.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleRepresentative(rep.id)}
                      >
                        {rep.displayName || rep.name}
                        {selectedRepresentatives.includes(rep.id) && (
                          <X className="ml-2 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    Select representatives attending if applicable
                  </FormDescription>
                </div>
              </div>
            </div>

            {/* Venue Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Venue</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="venueAddress"
                  render={({ field }) => {
                    // Type guard helper
                    const getVenueValue = (): {
                      street: string;
                      city: string;
                      provinceOrState: string;
                      country: string;
                    } => {
                      if (
                        typeof field.value === 'object' &&
                        !Array.isArray(field.value) &&
                        field.value !== null
                      ) {
                        const venue = field.value as {
                          street?: string;
                          city?: string;
                          provinceOrState?: string;
                          country?: string;
                        };
                        return {
                          street: venue.street || '',
                          city: venue.city || '',
                          provinceOrState: venue.provinceOrState || '',
                          country: venue.country || '',
                        };
                      }
                      return {
                        street: '',
                        city: '',
                        provinceOrState: '',
                        country: '',
                      };
                    };

                    const currentVenue = getVenueValue();

                    return (
                      <div className="space-y-4">
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter street address"
                              value={currentVenue.street}
                              onChange={(e) => {
                                field.onChange({
                                  ...currentVenue,
                                  street: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter city"
                              value={currentVenue.city}
                              onChange={(e) => {
                                field.onChange({
                                  ...currentVenue,
                                  city: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        <FormItem>
                          <FormLabel>Province/State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter province or state"
                              value={currentVenue.provinceOrState}
                              onChange={(e) => {
                                field.onChange({
                                  ...currentVenue,
                                  provinceOrState: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter country"
                              value={currentVenue.country}
                              onChange={(e) => {
                                field.onChange({
                                  ...currentVenue,
                                  country: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* Reports Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Reports</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="thirtySixtyNinetyReport"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>30-60-90</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="planningReport"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Planning Report</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notForLookAhead"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Not for Look Ahead</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="lookAheadStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lookAheadStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-3 block">Section</Label>
                  <div className="flex flex-wrap gap-2">
                    {lookAheadSectionOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant={
                          form.watch('lookAheadSection') === option.value
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() =>
                          form.setValue('lookAheadSection', option.value as any)
                        }
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    Select the look ahead section
                  </FormDescription>
                </div>
              </div>
            </div>

            {/* Sharing Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Sharing</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockSystemUsers.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-3 block">Can Edit</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockSystemUsers.map((user) => (
                      <Badge
                        key={user.id}
                        variant={
                          selectedCanEdit.includes(user.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleCanEdit(user.id)}
                      >
                        {user.name}
                        {selectedCanEdit.includes(user.id) && (
                          <X className="ml-2 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    Select users who can edit this activity
                  </FormDescription>
                </div>

                <div>
                  <Label className="mb-3 block">Shared With</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockOrganizations.map((org) => (
                      <Badge
                        key={org.id}
                        variant={
                          selectedSharedWith.includes(org.id)
                            ? 'default'
                            : 'outline'
                        }
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleSharedWith(org.id)}
                      >
                        {org.name}
                        {selectedSharedWith.includes(org.id) && (
                          <X className="ml-2 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription className="mt-2">
                    These groups can view but not edit the entry
                  </FormDescription>
                </div>

                <FormField
                  control={form.control}
                  name="calendarVisibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calendar Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select calendar visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {calendarVisibilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ErrorBoundary>
  );
};
