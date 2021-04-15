import { useState } from "react";
import { UserContext } from "@auth0/nextjs-auth0";
import {TextField, Button, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import makeServerCall from '../../lib/makeServerCall';
import { withUserProp } from "@lib/withUserProp";
import { CustomUserContext } from "types";
import topics from '../../topics.json';

type FormEntry = {
  name: string,
  key: string,
  type: "text" | "multitext" | "checkbox",
  rows?: number,
  set: Function,
  value: string | boolean,
  required?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 'var(--gap)',
      marginBottom: 'var(--gap)'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
      flex: 1
    }
  }),
);

const CreateEvent = ({ userContext }: { userContext: CustomUserContext}) => {
  const router = useRouter();
  const { user } = userContext;
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState("")
  const [priv, setPriv] = useState(false)
  const [response, setResponse] = useState("")
  const [date, setDate] = useState<number>(-1)
  const [topic, setTopic] = useState(topics[0])

  const classes = useStyles();

  const fields: FormEntry[] = [
    { name: "Title", key: "title", type: "text", set: setTitle, value: title, required: true },
    { name: "Description", key: "description", type: "multitext", rows: 5, set: setDescription, value: description, required: true },
    { name: "Event Image URL", key: "picture", type: "text", set: setPicture, value: picture, required: false },
  ];

  const handleChange = (e: string) => {
    setDate(e)
  }

  const topicChange = (e: any) => {
    setTopic(e)
  }

  const handleClick = () => { 
    setPriv(!priv)
  }
  
  const submit = async (e: any) => {
      e.preventDefault();
      const toSend = {
        title,
        description,
        priv,
        picture,
        time: (new Date(date)).toISOString(),
        userId: user.id,
        User_id: user.id.toString()
      }
      const data = await makeServerCall({ apiCall: "events/createEventByUser", method: "POST", 
          queryParameters: toSend,
      })
      if (data.msg === "success") {
        const addTopic = {
          id : data.event.id,
          searchTitle : topic
        }
        const eventData = await makeServerCall({ apiCall: "events/setTopic", method: "POST", 
          queryParameters: addTopic,
        })
        router.push(`/event/${data.event.id}`)
      } else {
        // it didnt work
      }
    }


  if (response.toLowerCase() === "success") {
    router.push("/")
    return <></>
  }

  return (
    <form className={classes.root}>
        <div className={classes.row}>
          <Typography variant="h6">Please provide some information about your event.</Typography>
        </div>  
        {response && response !== "success" && <Typography variant="h6">‼️{response}‼️</Typography>}
        <div className={classes.row}>
          <Typography variant="subtitle2">You can edit this information later.</Typography>
        </div>
        <div className={classes.row}>
          <ControlledTextField entry={fields[0]} />
        </div>
        <div className={classes.row}>
          <ControlledTextField entry={fields[1]} />
        </div>
        <div className={classes.row}>
          <ControlledTextField entry={fields[2]} />
        </div>
        
        <div>
            Date:
            <Datetime onChange={handleChange}/>
        </div>
        <br></br>
        <br></br>
        <div>
          Pick a topic: {" "}
          <select value={topic} onChange={(e) => { topicChange(e.target.value) }}>
            {topics.map(top => <option value={top}>{top}</option>)}
          </select>
        </div>
        <br></br>
        <div className={classes.row}>
            Private
          <input onClick={handleClick} checked={priv} type="checkbox" />
        </div>
        <Button id="save" onClick={submit} size="large" variant="contained" color="primary">Save & Go to ProEvento</Button>
    </form>
    )

}



const ControlledTextField = ({entry}: { entry: FormEntry }) => {
  return <TextField onChange={(e) => { entry.set(e.target.value) }} required={entry.required} style={{margin: 'var(--gap-double)'}} variant={"outlined"} id={entry.key} label={entry.name} value={entry.value} multiline={entry.type === "multitext"} rows={entry.rows} />
}

export default CreateEvent