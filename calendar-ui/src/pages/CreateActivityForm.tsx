/**
 * CreateActivityForm
 *
 * This is a new iteration for the create form (duplicating pages CalendarEntryForm and DynamicCalendarEntryForm).
 *
 * Features:
 * - Two-step conversational flow: category selection first, then full form
 * - Uses React-Hook-Form with Zod validation
 * - Uses Shadcn UI components
 * - Single column layout
 * - All fields from the activity schema
 *
 * Design Reference: Figma design at node-id=1298-29798 ("2.0.0 Create entry form (v5 single page)")
 *
 * GAPS IDENTIFIED:
 *
 * 1. JUNCTION TABLE RELATIONSHIPS:
 *    - The form collects category data in Step 1, but the backend createActivity endpoint
 *      does not currently handle junction table relationships (categories, tags, jointOrgs, etc.)
 *    - The backend create method only handles direct activity fields and returns empty arrays
 *      for junction table data (see activities.service.ts:41-65)
 *    - TODO: Either:
 *      a) Extend the CreateActivityRequest schema and backend API to accept junction table data
 *      b) Create separate API endpoints to add junction table relationships after activity creation
 *      c) Implement a transaction-based approach to create activity and relationships together
 *
 * 2. MISSING FORM FIELDS FOR JUNCTION TABLES:
 *    - Tags: Form does not include tag selection (tags are collected via junction table)
 *    - Joint Organizations: Form does not include multi-select for joint organizations
 *    - Related Activities: Form does not include selection for related activities
 *    - Comms Materials: Form does not include multi-select for comms materials
 *    - Translation Languages: Form does not include multi-select for translation languages
 *    - Representatives Attending: Form does not include selection for representatives
 *    - Shared With: Form does not include multi-select for shared organizations
 *    - Can Edit/Can View: Form does not include user permission fields
 *    - TODO: Add these fields to the form once backend supports junction table creation
 *
 * 3. MOCK DATA:
 *    - All lookup data is currently mocked (see mockLookups.ts)
 *    - TODO: Replace with API calls to fetch real data from backend endpoints
 *
 * 4. TYPES:
 *    - The form uses a FormData type that extends CreateActivityRequest with categories
 *    - This is a temporary workaround until junction tables are properly handled
 *    - TODO: Create proper form types that match the full activity schema including junction tables
 *
 * 5. VALIDATION:
 *    - Form validation uses createActivityRequestSchema which doesn't include junction table fields
 *    - TODO: Create a comprehensive form schema that includes all fields including junction tables
 */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createActivityRequestSchema,
  type CreateActivityRequest,
} from '@corpcal/shared/schemas';
import { createActivity } from '../api/activitiesApi';
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
import {
  mockCategories,
  mockActivityStatuses,
  mockSchedulingStatuses,
  mockPitchStatuses,
  mockCities,
  mockOrganizations,
  mockSystemUsers,
  mockMinistries,
  mockCommsMaterials,
  mockTranslationLanguages,
  mockTags,
  lookAheadStatusOptions,
  lookAheadSectionOptions,
  calendarVisibilityOptions,
} from '../data/mockLookups';
import { X } from 'lucide-react';

type FormData = CreateActivityRequest & {
  categories?: string[]; // For category selection step
};

export const CreateActivityForm: React.FC = () => {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createActivityRequestSchema),
    defaultValues: {
      isAllDay: false,
      oicRelated: false,
      notForLookAhead: false,
      planningReport: false,
      thirtySixtyNinetyReport: false,
      isActive: true,
      isConfidential: false,
      isIssue: false,
      hqSection: 0,
      rowVersion: 0,
      categories: [],
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (selectedCategories.length > 0) {
      form.setValue('categories', selectedCategories);
      setStep(2);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match CreateActivityRequest
      // Remove categories as it's not part of the direct schema (junction table)
      const { categories, ...activityData } = data;

      // Convert date/time fields if needed
      const submitData: CreateActivityRequest = {
        ...activityData,
        // Ensure dates are in correct format (YYYY-MM-DD)
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        // Ensure times are in correct format (HH:mm)
        startTime: data.startTime || null,
        endTime: data.endTime || null,
      };

      await createActivity(submitData);
      alert('Activity created successfully!');
      // TODO: Navigate to activity detail page or list
      form.reset();
      setStep(1);
      setSelectedCategories([]);
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to create activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Category Selection
  if (step === 1) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Create New Activity</h1>
          <p className="text-muted-foreground">
            Select one or more categories to get started
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {mockCategories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategories.includes(category.id)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => handleCategoryToggle(category.id)}
              >
                {category.displayName || category.name}
                {selectedCategories.includes(category.id) && (
                  <X className="ml-2 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>

          {selectedCategories.length > 0 && (
            <div className="mt-6">
              <Button onClick={handleNext} className="w-full">
                Next: Fill in Activity Details
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Full Form
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Create New Activity</h1>
        <p className="text-muted-foreground">Fill in the activity details</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter activity title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="significance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Significance</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter significance"
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Scheduling Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Scheduling</h2>

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
                      <Input type="date" {...field} value={field.value || ''} />
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
                      <Input type="date" {...field} value={field.value || ''} />
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
              name="schedulingStatusId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduling Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
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
              name="schedulingConsiderations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduling Considerations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter scheduling considerations"
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status & Flags Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Status & Flags</h2>

            <FormField
              control={form.control}
              name="activityStatusId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockActivityStatuses.map((status) => (
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
              name="pitchStatusId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pitch Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

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
                      <FormLabel>OIC Related</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isConfidential"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Confidential</FormLabel>
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
                      <FormLabel>Not For Look Ahead</FormLabel>
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
                      <FormLabel>30-60-90 Report</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Organizations Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Organizations</h2>

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

            <FormField
              control={form.control}
              name="contactMinistryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Ministry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact ministry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockMinistries.map((ministry) => (
                        <SelectItem key={ministry.id} value={ministry.id}>
                          {ministry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* People Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">People</h2>

            <FormField
              control={form.control}
              name="commsLeadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comms Lead</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select comms lead" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSystemUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.displayName || user.name}
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
              name="eventLeadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Lead</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event lead" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSystemUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.displayName || user.name}
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
              name="eventLeadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Lead Name (if not a system user)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event lead name"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Use this if the event lead is not a system user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videographerUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Videographer</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select videographer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSystemUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.displayName || user.name}
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
              name="graphicsUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graphics</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select graphics user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSystemUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.displayName || user.name}
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
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSystemUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.displayName || user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Venue Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Venue</h2>

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockCities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.displayName || city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Venue Address</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Street"
                  value={(form.watch('venueAddress') as any)?.street || ''}
                  onChange={(e) =>
                    form.setValue('venueAddress', {
                      ...((form.watch('venueAddress') as any) || {}),
                      street: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="City"
                  value={(form.watch('venueAddress') as any)?.city || ''}
                  onChange={(e) =>
                    form.setValue('venueAddress', {
                      ...((form.watch('venueAddress') as any) || {}),
                      city: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Province/State"
                  value={
                    (form.watch('venueAddress') as any)?.provinceOrState || ''
                  }
                  onChange={(e) =>
                    form.setValue('venueAddress', {
                      ...((form.watch('venueAddress') as any) || {}),
                      provinceOrState: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Country"
                  value={(form.watch('venueAddress') as any)?.country || ''}
                  onChange={(e) =>
                    form.setValue('venueAddress', {
                      ...((form.watch('venueAddress') as any) || {}),
                      country: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Comms Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Communications</h2>

            <FormField
              control={form.control}
              name="newsReleaseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>News Release ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter news release ID (UUID)"
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
              name="pitchComments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pitch Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter pitch comments"
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Look Ahead Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Look Ahead</h2>

            <FormField
              control={form.control}
              name="lookAheadStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Look Ahead Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select look ahead status" />
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

            <FormField
              control={form.control}
              name="lookAheadSection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Look Ahead Section</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select look ahead section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lookAheadSectionOptions.map((option) => (
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

          {/* Calendar Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Calendar</h2>

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

          {/* Comments Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Comments</h2>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter comments"
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

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
