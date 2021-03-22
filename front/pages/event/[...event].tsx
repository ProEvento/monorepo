import { useRouter } from 'next/router'
import Page from '@components/page'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { withUserProp } from '../../lib/withUserProp';
import { CustomUserContext } from '../../types';
import {EventType} from '../../../api/types'
import {  GetServerSideProps } from 'next'
import makeServerCall from '../../lib/makeServerCall';
import Moment from 'moment';


export const getServerSideProps: GetServerSideProps = async (context) => {

  const data = await makeServerCall({ apiCall: `events/${context.params.event}`, method: "GET" })

  return { 
    props: {
      event : data
     }
  }
}

Moment.locale('en');

const Event = ({event, userContext }: { userContext: CustomUserContext, event:EventType}) => {
  return (
    <Page  header={false} activePage={"Event"} title={"Event"} userContext={userContext}>
      <h1>{event.title}</h1>
      <h4> When: {Moment(event.time).format('LT ddd MMM YY')} </h4>
      {event.private
        ? <h5>Private Event </h5>
        : <h5>Open Event</h5>
      }
      <h5>Hosted By: {event.User_id}</h5>
      <h4>{event.description}</h4>
      <h4>Meeting URL: proevento.com/meeting/{event.id}</h4>
    </Page>
  )
}


export default withPageAuthRequired(withUserProp(Event))

