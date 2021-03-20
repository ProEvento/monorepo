import { useRouter } from 'next/router'
import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';


const Event = () => {
  const router = useRouter()
  const { event } = router.query
  
  return (
    <Page  header={false} activePage={"Event"} title={"Event"} userContext={userContext}>
      <p>Event to lookup: {event}</p>
    </Page>
  )
}

export default Event
