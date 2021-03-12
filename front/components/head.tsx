import NextHead from 'next/head'


type Props = {
    title?: string,
    description?: string,
    image?: string,
    children?: React.ReactNode
}

const Head = ({
  title = "ProEvento",
  children
}: Props) => {
  return (
    <NextHead>
      {/* Title */}
      <title>{title}</title>

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Favicons */}
      {/* <link rel="manifest" href="/favicons/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicons/favicon-32x32.png"
        key="dynamic-favicon"
      /> */}
      {children}
    </NextHead>
  )
}

export default Head
