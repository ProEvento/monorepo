import { useRouter } from 'next/router'
import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { CustomUserContext } from '../../types';
import {EventType} from '../../../api/types'
import {  GetServerSideProps } from 'next'
import makeServerCall from '../../lib/makeServerCall';


export const getServerSideProps: GetServerSideProps = async (context) => {

  const data = await makeServerCall({ apiCall: `events/${context.params.event}`, method: "GET" })

  return { 
    props: {
      event : data
     }
  }
}

const Event = ({event, userContext }: { userContext: CustomUserContext, event:EventType}) => {
  return (
    <Page  header={false} activePage={"Event"} title={"Event"} userContext={userContext}>
      <h1>{event.title}</h1>
      <h1>{event.getuser}</h1>
      <h4>Description: {event.description}</h4>
      <h4>Hosted By: {event.User_id}</h4>
      <h3>Event id: {event.id}</h3>

    </Page>
  )
}

export default withPageAuthRequired(withUserProp(Event))

