/**
 * This file handles creating the User object in the database if it doesn't exist, and passing the user object to Components.
 */
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router'

export const withUserProp = (Component: any) => {
  return (props: any) => {
    const user = useUser();
    const router = useRouter()

    // if (typeof window !== "undefined") {
    //   router.push("/signup")
    // }

    return <Component userContext={user} {...props} />;
  };
};
