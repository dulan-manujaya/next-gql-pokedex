import { Hydrate, QueryClientProvider } from "react-query";
import Layout from "./components/Layout";
import { queryClient } from "../src/api";
import { WatchListProvider } from "../context/watchList";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <WatchListProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Hydrate>
      </QueryClientProvider>
    </WatchListProvider>
  );
}

export default MyApp;
