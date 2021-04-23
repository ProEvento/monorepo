import { useState, useCallback, useEffect } from "react"
import Page from '@components/page'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';
import { useRouter } from 'next/router'
import { connect, Room as RoomType } from 'twilio-video'
import Room from '../../components/meeting/room'
import {CircularProgress, Button, Typography} from '@material-ui/core/';
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import makeServerCall from '../../lib/makeServerCall';

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const data = await makeServerCall({ apiCall: `events/${context.params.id}`, method: "GET" })
    if (data.error) {
      console.log(data.error)
      return { props: { }}
    }
     return { 
      props: {
        event: data
      }
    }
  },
});



// console.log(data)
// const { data: twilioToken, error: twilioError } = useSWR(() => `/api/getTwilioToken?username=${data.username}`, textFetcher, { 
//   refreshInterval: 100000
// });
const Meeting = ({ userContext, event }: { userContext: CustomUserContext, event: any}) => {
    const router = useRouter()
    const { id } = router.query
    const username = userContext.user ? userContext.user.username : "";
    const [roomName, setRoomName] = useState(event ? event.title : "");
    const [token, setToken] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    // TODO: get roomName from Event API
    const [room, setRoom] = useState<RoomType | undefined>();
    const startEvent = async () => {
      await makeServerCall({ apiCall: `events/startEvent`, method: "PUT", queryParameters: { id: event.id }})
      router.reload()
    };
  
    const endEvent = async () => {
      await makeServerCall({ apiCall: `events/endEvent`, method: "PUT", queryParameters: { id: event.id } })
    }
  
    if (!event) {
      return <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>This is an invalid event. Check out the <Link href="/explore">Explore page to find another</Link>.</Page>
    }

    const dateEvent = new Date(event.time)
    if (Date.now() < dateEvent.getTime()) {
      return <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>You're too early! Come back when the Event time has been reached.</Page>
    }
    if (event.started !== true) {
      if (event.host.username !== username)
        return <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>This event hasn't started yet. Check out the <Link href="/explore">Explore page to find another</Link> or wait for the host to start.</Page>
      else
        return <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>
          <Typography align="center" style={{marginTop: 300}}><Button id="start" onClick={startEvent} style={{margin: "0 auto"}} variant="contained" color="primary" size="large">Start Meeting</Button></Typography>
        </Page>
    }
  
    useEffect(() => {
      setConnecting(true)
      handleJoin()
    }, []);
  
    const handleLeave = useCallback(event => {
        setToken(null);
    }, []);


    const handleJoin = useCallback(
        async () => {
          const { token } = await fetch(`/api/getTwilioToken?username=${username}&room=${roomName}`).then(res => res.json());
          connect(token, {
            name: roomName,
          }).then((room) => {
              setConnecting(false);
              setRoom(room);
            })
            .catch((err) => {
              console.error(err);
              setConnecting(false);
            });
          setToken(token);
        },
        [roomName]
    );

    const handleLogout = useCallback(() => {
        setRoom((prevRoom) => {
          if (prevRoom) {
            prevRoom.localParticipant.tracks.forEach((trackPub) => {
              //@ts-ignore
              trackPub.track.stop();
            });
            prevRoom.disconnect();
          }
          return null;
        });
        endEvent();
        router.push("/")
      }, []);
      

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

    let render;
    if (!connecting && !token) {
        render = <div>Error.</div>
    } else if (token && connecting) {
        render = <div style={{position: "absolute", left: "50%", top: "50%"}}><CircularProgress /></div>
    } else if (token && !connecting && room) {
        render = <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>
          <Room roomName={roomName} room={room} handleLogout={handleLogout} description={event.description}/></Page>
    } else {
        render = (
            <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>
                {!token && "No token! "}
            </Page>
        )
    }

    return render;

}


export default withUserProp(Meeting)
