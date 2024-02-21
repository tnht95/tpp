import { Activity, Response } from '@/models';

import { errHandler, QueryWIthTargetInput } from '.';

export const filterActivitiesAction = async ([userId, queryInput]: [
  number,
  QueryWIthTargetInput
]) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const query: string[] = [];

  for (const key in queryInput) {
    if (queryInput[key as keyof QueryWIthTargetInput]) {
      query.push(`${key}=${queryInput[key as keyof QueryWIthTargetInput]}`);
    }
  }

  return fetch(`${baseUrl}/users/${userId}/activities?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<Activity[]>) => r.data);
};
