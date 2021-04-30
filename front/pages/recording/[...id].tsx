import { useState, useCallback, useEffect } from "react"
import Page from '@components/page'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType, EventType } from '../../../api/types';
import { useRouter } from 'next/router'
import { connect, Room as RoomType } from 'twilio-video'
import Room from '../../components/meeting/room'
import {CircularProgress, Button, Typography} from '@material-ui/core/';
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import makeServerCall from '../../lib/makeServerCall';
import styles from '@components/meeting/participant.module.css';

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (context: GetServerSidePropsContext) => {
    const eventData = await makeServerCall({ apiCall: `events/${context.params.id}`, method: "GET" })
    if (eventData.error) {
      console.log(eventData.error)
      return { props: { }}
    }

     const recordingData = await makeServerCall({ apiCall: `events/getHostRecording`, queryParameters: { id: context.params.id.toString() }, method: "GET" })
     return { 
      props: {
        event: eventData,
        recordings: recordingData
      }
    }
  },
});



// console.log(data)
// const { data: twilioToken, error: twilioError } = useSWR(() => `/api/getTwilioToken?username=${data.username}`, textFetcher, { 
//   refreshInterval: 100000
// });
const Meeting = ({ userContext, event, recordings }: { userContext: CustomUserContext, event: EventType, recordings: any[]}) => {
    const router = useRouter()
    const { id } = router.query
    const username = userContext.user ? userContext.user.username : "";
    const [roomName, setRoomName] = useState(event ? event.title : "");
    const [token, setToken] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    // TODO: get roomName from Event API

    if (!event) {
      return <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>This is an invalid recording. Check out the <Link href="/explore">Explore page to find another</Link>.</Page>
    }

    const dateEvent = new Date(event.time)
    if (Date.now() < dateEvent.getTime()) {
      return <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>You're too early! Come back when the Event time has ended.</Page>
    }

    if (event.started !== true) {
      if (event.host.username !== username)
        return <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>This event hasn't started yet. Check out the <Link href="/explore">Explore page to find another</Link> or wait for the host to start.</Page>
    }
  
    console.log(recordings)
    let render;
    if (connecting) {
        render = <div style={{position: "absolute", left: "50%", top: "50%"}}><CircularProgress /></div>
    } else if (!connecting ) {
        render = (<Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>
              <div className={styles.participant}>
                <h3>{event.host.firstName} {event.host.lastName}</h3>
                {/*@ts-ignore*/}
                <video src={recordings.videoRecordings[0].url} autoPlay={true} />
               {/*@ts-ignore*/}
                <audio src={recordings.audioRecordings[0].url} autoPlay={true} muted={false} />
              </div>
          </Page>)
    } else {
        render = <div>nothing</div>
    }

    return render;

}


export default withUserProp(Meeting)
