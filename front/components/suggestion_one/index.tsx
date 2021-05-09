import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {Avatar, Button} from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import EventIcon from '@material-ui/icons/Event';
import Typography from '@material-ui/core/Typography';
import { DBUser, User, CustomUserContext } from 'types';
import Link from '@components/link'
import { DataUsageOutlined } from '@material-ui/icons';
import makeServerCall from '@lib/makeServerCall';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 1
    },
    inline: {
      display: 'inline',
    },
  }),
);

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
  const { name, description, time } = suggested_event;
//   const name = suggested_event[2]
//   const time = suggested_event[4]
  console.log("test array", name)
  const date = new Date(time)


  return (
      <div className="grid-container">
      <div className="date">
        <div className="number">{date.getDate()}</div>
        <div className="day">{days[date.getDay()]}</div>
      </div>
      <div className="info">
        <Typography variant="h4">{name}</Typography>
        {/*@ts-ignore */}
        <Typography variant="h5">{date.toLocaleDateString("en-US", options)} @ {date.toLocaleTimeString("en-US")}</Typography>
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

        .grid-container:hover {
          transform: scale(1.05);
          text-decoration: none;
        }
        .users { grid-area: users; display: flex; justify-content: center; align-items: center;}
        .info {
          display: flex;
          flex-direction: column;
          grid-area: info;
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

const sug_Event = ({ suggested_event } : { suggested_event: any }) => {
    const classes = useStyles();
    return (<Item suggested_event={event} />)
}

export default sug_Event