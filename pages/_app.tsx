import type { AppProps } from "next/app";
import { wrapper } from "@/store/store";
import React from "react";
import { appDispatch, appSelector } from "@/store/hooks";
import { getSession } from "@/features/admin/login";
import { Provider, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// add bootstrap css
// import "bootstrap/dist/css/bootstrap.css";
import "@/public/static/css/stylesheet.css";
import "@/public/static/css/font.css";

//slide
import "../public/static/css/embla.css";

function MyApp({ Component, pageProps }: AppProps) {
  const store: any = useStore();
  const dispatch = appDispatch();
  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={null}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
