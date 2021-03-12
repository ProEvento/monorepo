import { useRouter } from 'next/router'

const User = () => {
  const router = useRouter()
  const { user } = router.query

  return <p>Username to lookup: {user}</p>
}

export default User
