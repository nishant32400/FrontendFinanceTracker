
import '../styles/globals.css'
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <div className="pt-20 px-4">
        <Component {...pageProps} />
      </div>
    </>
  );
}