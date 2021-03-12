import { useRouter } from 'next/router'

const Event = () => {
  const router = useRouter()
  const { event } = router.query

  return <p>Event to lookup: {event}</p>
}

export default Event
