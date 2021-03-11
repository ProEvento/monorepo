import Head from '@components/head'
// import Header from '@components/header'
import styles from './page.module.css'
import Grid from "@components/grid"


type Props = {
  header?: boolean,
  footer?: boolean,
  title?: string,
  description?: string,
  image?: string,
  children?: React.ReactNode
}

const Page = ({
  header = true,
  footer = true,
  title,
  description,
  image,
  children
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <Head
        title={`${title ? `${title} - ` : ''} ProEvento`}
        description={description}
        image={image}
      />

    </div>
  )
}

export default Page
