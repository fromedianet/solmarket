import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';

const fetcher = url =>
  fetch(url)
    .then(r => r.json())
    .then(data => {
      return { user: data?.user || null };
    });

// @ts-ignore
export function useUser({ redirectTo, redirectIfFound } = {}) {
  const { data, error } = useSWR('/api/user', fetcher);
  const history = useHistory();
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      history.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);

  return error ? null : user;
}
