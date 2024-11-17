import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';

export const removeQueryParam = (
  param: string,
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams
) => {
  const params = new URLSearchParams(searchParams.toString()); // Convert search params to URLSearchParams
  params.delete(param); // Remove the specified query parameter

  // Replace the current URL with the updated search parameters
  router.replace(`${window.location.pathname}?${params.toString()}`);
};
