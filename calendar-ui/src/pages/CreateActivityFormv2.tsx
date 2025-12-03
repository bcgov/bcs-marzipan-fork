import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
  mockSchedulingStatuses,
  mockPitchStatuses,
  mockOrganizations,
  mockTags,
} from '../data/mockLookups';
import { X } from 'lucide-react';

type FormData = CreateActivityRequest & {
  categories?: string[];
  relatedActivityIds?: string[];
  tagIds?: string[];
};

export const CreateActivityFormv2: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRelatedActivities, setSelectedRelatedActivities] = useState<
    string[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createActivityRequestSchema),
    defaultValues: {
      isAllDay: false,
      oicRelated: false,
      isIssue: false,
      categories: [],
      relatedActivityIds: [],
      tagIds: [],
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelection);
    form.setValue('categories', newSelection);
  };

  const handleRelatedActivityToggle = (activityId: string) => {
    const newSelection = selectedRelatedActivities.includes(activityId)
      ? selectedRelatedActivities.filter((id) => id !== activityId)
      : [...selectedRelatedActivities, activityId];
    setSelectedRelatedActivities(newSelection);
    form.setValue('relatedActivityIds', newSelection);
  };

  const handleTagToggle = (tagId: string) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newSelection);
    form.setValue('tagIds', newSelection);
  };

  const handleCancel = () => {
    form.reset();
    setSelectedCategories([]);
    setSelectedRelatedActivities([]);
    setSelectedTags([]);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Transform form data to match CreateActivityRequest
      // Remove junction table fields as they're not part of the direct schema
      const { categories, relatedActivityIds, tagIds, ...activityData } = data;

      // Convert date/time fields if needed
      const submitData: CreateActivityRequest = {
        ...activityData,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
      };

      await createActivity(submitData);
      alert('Activity created successfully!');
      // TODO: Navigate to activity detail page or list
      form.reset();
      setSelectedCategories([]);
      setSelectedRelatedActivities([]);
      setSelectedTags([]);
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to create activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock related activities for selection (TODO: Replace with API call)
  const mockRelatedActivities = [
    { id: 'act-1', title: 'Related Activity 1' },
    { id: 'act-2', title: 'Related Activity 2' },
    { id: 'act-3', title: 'Related Activity 3' },
  ];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Create New Activity</h1>
        <p className="text-muted-foreground">
          Fill in the activity details below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <Input placeholder="Enter activity title" {...field} />
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
                      onClick={() => handleRelatedActivityToggle(activity.id)}
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
                      onClick={() => handleTagToggle(tag.id)}
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
  );
};
