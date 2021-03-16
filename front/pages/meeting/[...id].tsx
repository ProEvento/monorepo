import { useState, useCallback, useEffect } from "react"
import Page from '@components/page'
import { CustomUserContext } from '../../types';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { UserType } from '../../../api/types';
import { useRouter } from 'next/router'
import { connect, Room as RoomType } from 'twilio-video'
import Room from '../../components/meeting/room'
import CircularProgress from '@material-ui/core/CircularProgress';

// console.log(data)
// const { data: twilioToken, error: twilioError } = useSWR(() => `/api/getTwilioToken?username=${data.username}`, textFetcher, { 
//   refreshInterval: 100000
// });
const User = ({userContext }: { userContext: CustomUserContext}) => {
    const router = useRouter()
    const { id } = router.query
    const username = userContext.user.username;
    const roomId = Array.isArray(id) ? id[0] : id
    const [roomName, setRoomName] = useState(roomId);
    const [token, setToken] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    // TODO: get roomName from Event API
    const [room, setRoom] = useState<RoomType | undefined>();
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
              trackPub.track.stop();
            });
            prevRoom.disconnect();
          }
          return null;
        });
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
    console.log(room, connecting, token)

    let render;
    if (!connecting && !token) {
        return <div>Error.</div>
    } else if (token && connecting) {
        return <div style={{position: "absolute", left: "50%", top: "50%"}}><CircularProgress /></div>
    } else if (token && !connecting && room) {
        render = <Room roomName={roomName} room={room} handleLogout={handleLogout} />
    } else {
        render = (
            <Page header={false} activePage={"Meeting"} title={"Meeting"} userContext={userContext}>
                {!token && "No token! "}
            </Page>
        )
    }

    return render;

}


export default withPageAuthRequired(withUserProp(User))
