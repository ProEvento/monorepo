/**
 * This file handles creating the User object in the database if it doesn't exist, and passing the user object to Components.
 */
import { useUser } from '@auth0/nextjs-auth0';

export const withUserProp = (Component: any) => {
  return (props: any) => {
    const user = useUser();

    return <Component userContext={user} {...props} />;
  };
};
