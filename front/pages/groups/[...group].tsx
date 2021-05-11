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
import DisplaySuggestionComponent from '@components/suggestion'
import sug_Event from '@components/suggestion_one'
import Typography from '@material-ui/core/Typography';

const containerStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      height: 140,
      flex: 1,
      justifyContent: 'center',
      background: 'white',
      marginBottom: 'calc(2 * var(--gap))',
      borderRadius: 12,
    },
  })
);

const Item = ({ suggested_event}) => {
  console.log("test", suggested_event)
const [response, setResponse] = useState("")
const classes = containerStyles();
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const options = { weekday: "long", year: 'numeric', month: 'long', day: 'numeric' };
const { name, description, time, id, votes } = suggested_event;
const date = new Date(time)

const submit = () => {
  const data = makeServerCall({ apiCall: "groups/vote", method: "GET", queryParameters: {id:id}})
  location.reload()
}

return (
    <div className="grid-container">
    <div className="date">
      <div className="number">{date.getDate()}</div>
      <div className="day">{days[date.getDay()]}</div>
    </div>
    <div className="info">
      <Typography variant="h4">{name}</Typography>
      {/*@ts-ignore */}
      <Typography variant="h5">{description}</Typography>
      <Typography variant="h5">Votes: {votes}</Typography>
    </div>
    <div className="voting">
        <br></br>
        <Button id="save" onClick={submit} size="large" variant="contained" color="primary">Vote</Button>

    </div>

    <style jsx>{`

      .grid-container {
        display: grid;
        grid-template-columns: 0.6fr 1.8fr 0.6fr;
        grid-template-rows: 1fr;
        gap: 0px 0px;
        grid-template-areas:
          "date info users";
        color: #535353;
        padding: var(--gap-double) 0px;
        background: #FFFFFF;
        border: 1px solid #000000;
        box-sizing: border-box;
        border-radius: 12px;
        margin-bottom: 24px;
        transition: all .2s ease-in-out;
      }
      .users { grid-area: users; display: flex; justify-content: center; align-items: center;}
      .info {
        display: flex;
        flex-direction: column;
        grid-area: info;
        margin-left: var(--gap);
      }
      .voting{
        display: flex;
        flex-direction: column;
        grid-area: users;
        margin-left: var(--gap);
      }
      .date {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: .5fr 1.5fr;
        gap: 0px 0px;
        grid-template-areas:
          "day day day"
          "number number number";
        grid-area: date;
        border-right: 1px solid #373737;
      }
      .number { 
        grid-area: number;
        font-size: 48px;
        margin: 0 auto;
        font-weight: 500;
      }
      .day {
        grid-area: day;
        font-size: 14px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        font-weight: 500;
       }
      `}</style>
  </div>
  )
}
export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context) => {
    const data = await makeServerCall({ apiCall: `groups/${context.params.group}`, method: "GET" })
    console.log(data)

    const group_id = context.params.group
    console.log(group_id)

    const suggestions = await makeServerCall({ apiCall: `groups/getActiveSuggestions`, method: "GET", queryParameters: {id: context.params.group} });

    async function getVoteStats() {
      //@ts-ignore
      const data = await makeServerCall({ apiCall: `groups/getStats`, method: "GET", queryParameters: { groupId: group_id}})
      return data
    }

    return { 
      props: {
        suggested: suggestions,
        group: data,
        stats: await getVoteStats()
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

async function getSuggested(value) {
  const data = await makeServerCall({ apiCall: `groups/getActiveSuggestions`, method: "GET", queryParameters: {id: "1"}})
  console.log(data)
  return data
}


const Group = ({group, userContext, suggested, stats }: { userContext: CustomUserContext, group:any, suggested: any[], stats: []}) => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [badge, setBadge] = useState("")
  const [inGroup, setInGroup] = useState(false)
  const [invited, setInvited] = useState(false)
  // const [suggested, setSuggested] = useState([]);
  const { user  } = userContext;
  console.log(suggested[0])
  

  
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

  const formatDate = () => {
    const dayNum = new Date(group.pollTime).getDay();
    let day = "";
    if (dayNum === 0) {
      day = "Sunday";
    }
    else if (dayNum === 1) {
      day = "Monday";
    }
    else if (dayNum === 2) {
      day = "Tuesday";
    }
    else if (dayNum === 3) {
      day = "Wednesday";
    }
    else if (dayNum === 4) {
      day = "Thursday";
    }
    else if (dayNum === 5) {
      day = "Friday";
    }
    else if (dayNum === 6) {
      day = "Saturday";
    }
    const time = new Date(group.pollTime).toLocaleString().split(",")[1];
    return day + " at " + time;
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

  const getPrettyStats = () => {
    let res = new Map();
    for (const stat of stats) {
      res.set(stat['User']['username'], (res.get(stat['User']['username']) || 0) + 1)
    }
    
    res[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    const elements = []
    for (const [key, value] of res) {
      elements.push({ key, value })
    }

    return elements.length ? <ol>
      {elements.map(({key, value}) => <li>{key}: {value}</li> )}
    </ol> : <p>No winners have been chosen yet! Check back sometime next week!</p>

  }

  const handleMessage = async () => {
    // find chat between two
    const response = await makeServerCall({ apiCall: `chats/getGroupchat/${group.id}`, method: "GET" })

    window.location.href = `http://localhost:3000/chats/${response.id}`
  }
  const finalTime = formatDate();
  return (
    <Page header={false} activePage={"Group"} title={group.name} userContext={userContext}>

      <h1>{group.name}</h1>
      <img id="pic" src={group.logo} className={styles.img} />

      <h5>Created on {new Date(group.createdAt).toLocaleDateString("en-US")} by {group.owner.firstName} {group.owner.lastName}</h5>
      {group.categories &&
      <h5>Categories: {getCategories(group)}</h5>
    }
      <h5>Weekly poll close time: {finalTime}</h5>
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
          <div style={{width: "100%"}}>{inGroup &&
            <div>
            <CreateSuggestionComponent userContext={userContext} group= {group} />
            <div>
              {suggested.map((e) =>  <Item suggested_event={e} /> )}
            
            </div>

            <div>
            <p>Group event submission</p>
            </div>
              {getPrettyStats()}
            </div>
          }</div>
          
      </div>

    </Page>
  )
}


export default withUserProp(Group)