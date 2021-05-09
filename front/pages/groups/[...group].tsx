import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import Page from '@components/page'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { CustomUserContext } from '../../types';
import {EventType, UserType} from '../../../api/types'
import { GetServerSideProps } from 'next'
import makeServerCall from '../../lib/makeServerCall';
import {Grid, Button, InputLabel} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react'
import Link from 'next/link';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import {TextField} from '@material-ui/core';
import { getEnabledCategories } from "node:trace_events";
import { Label } from "@material-ui/icons";
import User from '@components/user'
import CreateSuggestionComponent from '@components/createSuggestion'

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    const data = await makeServerCall({ apiCall: `groups/${context.params.group}`, method: "GET" })
    console.log(data)
    return { 
      props: {
        group: data
      }
    }
  }
})

//have username -> make call to see if attending?


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: 'var(--button2)',
      width: 200,
    },
    root: {
        maxWidth: 800,
        margin: "0 auto",
        marginTop: 'var(--gap-double)'
    },
    img: {
      height: 100
    }
  }),
);

async function getUsers(value) {
    const data = await makeServerCall({apiCall: "search/user", method: "GET", queryParameters: {query: value}})
    return data
}

const Group = ({group, userContext}: { userContext: CustomUserContext, group:any}) => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [badge, setBadge] = useState("")
  const [inGroup, setInGroup] = useState(false)
  const [invited, setInvited] = useState(false)


  useEffect(() => {
      //@ts-ignore
      if (!userContext.user.notifications) {
          return
      }
    //@ts-ignore
    for (const notif of userContext.user.notifications) {
        if (notif.text.indexOf(`http://localhost:3000/groups/${group.id}`)) {
            setInvited(true)
        }
    }
  }, [userContext.user.notifications])
  const router = useRouter();

  const styles = useStyles()
  // console.log(targetUser)
  
  const { user, error, isLoading } = userContext;

  const getCategories = ({ categories }) => {
    if (categories.length > 1) { 
        const mapped = categories.map((e) => `${e.name}`)
        return mapped.join(", ");
    } else {
        return categories[0] ? categories[0].name : ""
    }
  }

  const leaveGroup = async () => {
    await makeServerCall({ apiCall: `groups/removeUserFromGroup`, method: "POST", queryParameters: { userId: user.id, groupId: group.id } }).then((data) => console.log(data))
    location.reload(); 
  }

  const joinGroup = async () => {
    console.log("Group joined")
    await makeServerCall({ apiCall: `groups/addUserToGroup`, method: "POST", queryParameters: { userId: user.id, groupId: group.id } }).then((data) => console.log(data))
    location.reload();
  }

  const deleteGroup = async () => {
    await makeServerCall({ apiCall: `groups/${group.id}`, method: "DELETE", queryParameters: { userId: user.id } }).then((data) => console.log(data))
  }

  const requestToJoin = async () => {
    await makeServerCall({ apiCall: `users/notifications/${group.owner.id}`, method: "POST", 
        queryParameters: { 
            text: `${user.username} has requested to join <a href="http://localhost:3000/groups/${group.id}">${group.name}</a>! Click <a href="http://localhost:3000/groups/${group.id}">Here</a> to send them an invite!`
        },
    })
  }


  //console.log(event)
  const openAttendEvent = ((e) => {

  })
  // console.log(userContext.user)
  // if(event.topic != null){
  //   tags = true
  //   console.log(event.topic.title)
  // }


  // console.log(events)
  


  const isOwner = user.username === (group.owner ? group.owner.username : user.username);
  if (!inGroup && isOwner) {
      setInGroup(true)
  } else if (!inGroup) {
      for (const member of group.users) {
          if (member.username === user.username) {
              setInGroup(true)
          }
      }
  }

  const handleMessage = async () => {
    // find chat between two
    const response = await makeServerCall({ apiCall: `chats/getGroupchat/${group.id}`, method: "GET" })

    window.location.href = `http://localhost:3000/chats/${response.id}`
  }

  return (
    <Page header={false} activePage={"Group"} title={group.name} userContext={userContext}>
       
      <h1>{group.name}</h1>
      <img id="pic" src={group.logo} className={styles.img} />

      <h5>Created on {new Date(group.createdAt).toLocaleDateString("en-US")} by {group.owner.firstName} {group.owner.lastName}</h5>
      {group.categories &&
      <h5>Categories: {getCategories(group)}</h5>
    }
      <h4>{group.description}</h4>
      <br />
      <br />  
      <Button variant="outlined" color="primary" id="messageUser" onClick={() => {handleMessage()}}> Message </Button>
      {inGroup && !isOwner &&
          <Button onClick={leaveGroup} className={styles.button}>Leave Group</Button>
      }

      {invited && !inGroup &&
        <Button onClick={joinGroup} className={styles.button}>Join Group</Button>}
      
      {!inGroup && !invited &&
        <Button onClick={requestToJoin} className={styles.button}>Request to join</Button>
      }
    
      <form>
          {/* <TextField id="username" onChange={(e) => {setUsername(e.target.value) }} label="Username" value={username} />
          <Button id='sendinvite' onClick={inviteUser}  color="primary">Invite User</Button> */}
      </form>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{marginBottom: 24}}>
           <h3>Members</h3>

          {group.users && group.users.length === 1 &&
            <h5>No members are currently in this group.</h5>
          }
                
            {group.users &&  group.users.length > 1 && <div>{group.users.map((attendee) => <User key={attendee.username} username={attendee.username} imgURL={attendee.picture} firstName={attendee.firstName} lastName={attendee.lastName}/>)}</div>}

            {isOwner && <Button onClick={deleteGroup} color="secondary" variant="contained">Delete Group</Button>}
              
          </div>
          <div style={{marginLeft: 24, marginBottom: 24}}>
            {inGroup && <div>
              
              <InputLabel>Invite users:</InputLabel>
              <TextField id="search" onChange={(e) => {setSearch(e.target.value) }} label="Search for users..." value={search} />
              {/*@ts-ignore*/}
              <Button onClick={async () => setResults((await getUsers(search)).results)} variant="contained" color="primary">Search</Button>
              {results && <div>{results.map((attendee) => <User key={attendee.username} group={group} username={attendee.username} imgURL={attendee.picture} firstName={attendee.firstName} lastName={attendee.lastName}/>)}</div>}
            </div>}
          </div>

          <CreateSuggestionComponent userContext={userContext} group= {group} />

      </div>

    </Page>
  )
}


export default withUserProp(Group)