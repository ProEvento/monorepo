import { useEffect, useState } from "react"
import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { withUserProp } from '../../lib/withUserProp';
import { CustomUserContext } from '../../types';
import GroupPage from '@components/group';
// import Event from '@components/event';
import makeServerCall from '@lib/makeServerCall';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: 'inline',
    }
  }),
);

export const getServerSideProps = withPageAuthRequired();

const GroupsPage = ({ userContext }: { userContext: CustomUserContext}) => {
  const { user, error, isLoading } = userContext;
  const [groups, setGroups] = useState([]);
  //console.log(userContext)
  if (isLoading) {
    return <div></div>;
  }

  useEffect(() => {
    if (user)
      makeServerCall({ apiCall: `groups/getGroupsForUser`, queryParameters: { userId: user.id }, method: "GET" }).then((data) => {
        console.log(data)
        setGroups(data)
      });
  }, [user])

  const classes = useStyles();

  return (
    <Page header={false} activePage={"My Groups"} title={user ? `Welcome, ${user.name}!` : "My Groups"} userContext={userContext}>
        <GroupPage user={userContext.user} groups={groups} />
    </Page>
  )
}

export default withUserProp(GroupsPage)
