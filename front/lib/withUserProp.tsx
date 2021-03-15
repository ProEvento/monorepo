/**
 * This file handles creating the User object in the database if it doesn't exist, and passing the user object to Components.
 */

import { useUser, UserContext } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'
import useSWR from 'swr';
import { CustomUserContext } from '../types';
import CircularProgress from '@material-ui/core/CircularProgress';

const fetcher = async url => {
  const res = await fetch(url)


  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    //@ts-expect-error
    error.info = await res.json()
    //@ts-expect-error
    error.status = res.status
    throw error
  }

  return res.json()
}


export const withUserProp = (Component: any) => {
  return (props: any) => {
    const user = useUser();
    const router = useRouter();
    const { data, error } = useSWR(() => `/api/getUserByEmail?email=${user.user.email}`, fetcher, { refreshInterval: 15000 });
    const isLoading = !data && !error;
    if (typeof window !== "undefined" && !isLoading && error && error.status === 404) {
      router.push("/signup")
    }
    const mergedUser: (CustomUserContext) = (user.user && data) ? {
      ...user,
      user: {
        ...user.user,
        ...data
      }
     } : {
       user: undefined,
       isLoading: false,
       checkSession: () => undefined
     }

     if (user.isLoading || (isLoading && user.user !== undefined)) {
       return <div style={{position: "absolute", left: "50%", top: "50%"}}><CircularProgress /></div>
     }

    return <Component userContext={mergedUser} {...props} />;
  };
};
