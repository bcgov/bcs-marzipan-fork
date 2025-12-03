import api from './axios.js';
import type { ActivityResponse } from '@corpcal/shared/api/types';
import type {
  CreateActivityRequest,
  UpdateActivityRequest,
  FilterActivities,
} from '@corpcal/shared/schemas';

export async function fetchActivities(
  filters?: FilterActivities
): Promise<ActivityResponse[]> {
  const res = await api.get<{ success: boolean; data: ActivityResponse[] }>(
    '/activities',
    {
      params: filters,
    }
  );
  return res.data.data;
}

export async function fetchActivity(id: number): Promise<ActivityResponse> {
  const res = await api.get<{ success: boolean; data: ActivityResponse }>(
    `/activities/${id}`
  );
  return res.data.data;
}

export async function createActivity(
  activity: CreateActivityRequest
): Promise<ActivityResponse> {
  console.log(
    'createActivity API call - URL:',
    api.defaults.baseURL + '/activities'
  );
  console.log('createActivity API call - Payload:', activity);
  try {
    const res = await api.post<{ success: boolean; data: ActivityResponse }>(
      '/activities',
      activity
    );
    console.log('createActivity API call - Success:', res.data);
    return res.data.data;
  } catch (error) {
    console.error('createActivity API call - Error:', error);
    throw error;
  }
}

export async function updateActivity(
  id: number,
  activity: UpdateActivityRequest
): Promise<ActivityResponse> {
  const res = await api.patch<{ success: boolean; data: ActivityResponse }>(
    `/activities/${id}`,
    activity
  );
  return res.data.data;
}

export async function deleteActivity(id: number): Promise<void> {
  await api.delete(`/activities/${id}`);
}
