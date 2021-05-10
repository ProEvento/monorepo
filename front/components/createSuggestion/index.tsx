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
import { GroupType } from '../../../api/types';

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

const CreateSuggestion = ({ userContext, group }: { userContext: CustomUserContext, group: GroupType}) => {
  const router = useRouter();
  const { user } = userContext;
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [response, setResponse] = useState("")
  const [date, setDate] = useState<number>(-1)
  const [topic, setTopic] = useState(topics[0])
  const group_id = group.id
  console.log("group id",group_id)
  const Topic_id = "Food"
  const classes = useStyles();

  const fields: FormEntry[] = [
    { name: "Title", key: "title", type: "text", set: setTitle, value: title, required: true },
    { name: "Description", key: "description", type: "multitext", rows: 5, set: setDescription, value: description, required: true },
  ];

  const handleChange = (e: string) => {
    setDate(e)
  }

  const topicChange = (e: any) => {
    setTopic(e)
  }

  
  //CHANGE submit to create suggestion
  const submit = async (e: any) => {
      e.preventDefault();
      const toSend = {
        name,
        description,
        group_id,
        time: (new Date(date)).toISOString(),
        Topic_id,
        userId: user.id,
        User_id: user.id.toString()
      }
      const data = await makeServerCall({ apiCall: "groups/createSuggestion", method: "POST", queryParameters: { name: title, description: description, id: user.id, group_id: group_id, topicName: Topic_id } })
      if (data.msg === "success") {
        location.reload(); 
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
          <Typography variant="h6">Please fill out the form below to suggest an event.</Typography>
        </div>  
        {response && response !== "success" && <Typography variant="h6">‼️{response}‼️</Typography>}
        <div className={classes.row}>
          <ControlledTextField entry={fields[0]} />
        </div>
        <div className={classes.row}>
          <ControlledTextField entry={fields[1]} />
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
            {topics.map(top => <option key={top} value={top}>{top}</option>)}
          </select>
        </div>
        <br></br>
       
        <Button id="save" onClick={submit} size="large" variant="contained" color="primary">Suggest</Button>
    </form>
    )

}



const ControlledTextField = ({entry}: { entry: FormEntry }) => {
  return <TextField onChange={(e) => { entry.set(e.target.value) }} required={entry.required} style={{margin: 'var(--gap-double)'}} variant={"outlined"} id={entry.key} label={entry.name} value={entry.value} multiline={entry.type === "multitext"} rows={entry.rows} />
}

export default CreateSuggestion