import { useState, useEffect } from "react";
import { UserContext } from "@auth0/nextjs-auth0";
import {TextField, Button, Typography} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import makeServerCall from '../../lib/makeServerCall';
import { withUserProp } from "@lib/withUserProp";
import { CustomUserContext } from "types";
import useSWR from 'swr';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
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
      justifyContent: 'center',
     
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 'var(--gap)',
      marginBottom: 'var(--gap)',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
  }),
);
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 'var(--gap)',
        width: 250,
      },
    },
  };
const CreateGroup = ({ userContext }: { userContext: CustomUserContext}) => {
  const router = useRouter();
  const { user } = userContext;
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState("")
  const [response, setResponse] = useState("")
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const classes = useStyles();

  const fields: FormEntry[] = [
    { name: "Title", key: "title", type: "text", set: setTitle, value: title, required: true },
    { name: "Description", key: "description", type: "multitext", rows: 5, set: setDescription, value: description, required: true },
    { name: "Group Image URL", key: "picture", type: "text", set: setPicture, value: picture, required: false },
  ];

  const topicChange = (e: any) => {
    setTitle(e)
  }

  const makeServerCallFetcher = async url => await makeServerCall({ apiCall: url, method: "GET" })

   const { data, error } = useSWR(`groups/getCategories`, makeServerCallFetcher, { 
    refreshInterval: 100000
   });

   if (error) {
       return <div>Error! {error}</div>
   }
   useEffect(() => {
    if (data) {
        setCategories(data)   
    }
  }, [data])

  const handleChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedCategories(value);
  };
  
  const submit = async (e: any) => {
      e.preventDefault();

      //const topicModel = await makeServerCall({ apiCall: `topics/getByTitle/${topic}`, method: "GET"})
      const categoryIds = selectedCategories.map((name) => {
          for (const cat of categories) {
              if (cat.name === name) {
                  return cat.id;
              }
          }
      })
    
      const toSend = {
        name: title,
        description,
        logo: picture,
        creatorId: user.id,
        categories: JSON.parse(JSON.stringify(categoryIds))
      }

      if (!title) {
          setResponse("Title must not be empty.")
          return;
      }

      if (!description) {
        setResponse("Title must not be empty.")
        return;
    }

    if (picture !== "" && !validURL(picture)) {
        setResponse("Logo must be a valid URL or empty.");
        return;
    }
      const data = await makeServerCall({ apiCall: "groups", method: "POST", 
          queryParameters: toSend,
      })
      if (data.msg === "success") {
        
        router.push(`/groups/${data.group.id}`)
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
          <Typography variant="h6">Please provide some information about your group.</Typography>
        </div>  
        {response && response !== "success" && <Typography variant="h6">‼️{response}‼️</Typography>}
        <div className={classes.row}>
          <Typography variant="subtitle2">You can edit this information and invite other users later.</Typography>
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
          Select categories: {" "}
          <Select
            multiple
            value={selectedCategories}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
                <div className={classes.chips}>
                {selectedCategories.map((value) => (
                    <Chip key={value} label={value} className={classes.chip} />
                ))}
                </div>
            )}
            MenuProps={MenuProps}
            >
            {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                    {category.name}
                </MenuItem>
            ))}
        </Select>
        </div>
        <br></br>
        <Button id="save" style={{marginTop: 'var(--gap)'}} onClick={submit} size="large" variant="contained" color="primary">Create Group</Button>
    </form>
    )

}


const ControlledTextField = ({entry}: { entry: FormEntry }) => {
  return <TextField onChange={(e) => { entry.set(e.target.value) }} required={entry.required} style={{margin: 'var(--gap-double)'}} variant={"outlined"} id={entry.key} label={entry.name} value={entry.value} multiline={entry.type === "multitext"} rows={entry.rows} />
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  
export default CreateGroup