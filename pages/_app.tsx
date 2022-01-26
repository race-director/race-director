import { getAnalytics } from "firebase/analytics";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { createContext, useEffect, useState } from "react";
import { ChangeLog } from "../components/Changelog";
import { useFirebaseUser } from "../components/Hooks/Auth";
import "../styles/globals.css";
import { user } from "../types";
import { firebaseApp } from "../utils/firebase";
import { userPrefersDarkMode } from "../utils/other";

export const Auth = createContext<[user, boolean]>([null, true]);
export const DarkMode = createContext<[() => void, boolean]>([() => {}, true]);

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useFirebaseUser(firebaseApp);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    // Change live state
    setDarkMode(!darkMode);
    // Set the dark mode in local storage
    localStorage.setItem("darkmode", (!darkMode).toString());
  };

  useEffect(() => {
    // Ensures it's called client side
    setDarkMode(userPrefersDarkMode());
  }, []);

  useEffect(() => {
    // Initialize Firebase Analytics
    getAnalytics(firebaseApp);
    // Gets called when any page is loaded
  }, []);

  return (
    <Auth.Provider value={[user, loading]}>
      <DarkMode.Provider value={[toggleDarkMode, darkMode]}>
        <div className={`${darkMode && "dark"}`}>
          <ChangeLog></ChangeLog>
          <NextNProgress
            startPosition={0.2}
            color="#00acc1"
            stopDelayMs={200}
            options={{ showSpinner: false, trickleSpeed: 400 }}
          ></NextNProgress>
          <Component {...pageProps} />
        </div>
      </DarkMode.Provider>
    </Auth.Provider>
  );
}

export default MyApp;
