import '../styles/globals.css'
import UserContextProvider from "../context/UserContextProvider"

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  )
}

export default MyApp
