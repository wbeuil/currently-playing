import { useState } from "react";
import Head from "next/head";

import { parseCookies, BASE_COOKIE_OPTIONS } from "../lib/cookies";

import styles from "../styles/Home.module.css";

export default function Home({ refreshToken, error }) {
  const [hidden, setHidden] = useState(true);

  const connectToSpotify = (event) => {
    event.preventDefault();

    const scope = "user-read-currently-playing";
    const client_id = process.env.CLIENT_ID;
    const redirect_uri = process.env.REDIRECT_URI;

    document.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=${redirect_uri}`;
  };

  const copyToClipboard = async () => {
    const url = `http://localhost:3000/widget.html?refresh_token=${refreshToken}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Could not copy URL:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Currently Playing</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.form}>
          <h1 className={styles.title}>Currently Playing App</h1>

          <p className={styles.subtitle}>
            Get visual feedback of what you're currently playing on Spotify in
            your OBS screens.
          </p>

          <button className={styles.button} onClick={connectToSpotify}>
            Connect to Spotify
            <span className={styles.icon}>
              <svg
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m15.9153601 8.86521859c-3.2234336-1.91430926-8.54041533-2.09032397-11.61756805-1.15639517-.49413085.14986328-1.01668199-.12908541-1.16642585-.62321626-.14974386-.49436968.12896601-1.01656258.6234551-1.16678409 3.53235494-1.07220902 9.4043681-.86514694 13.1152455 1.33766404.4445744.26390265.5903777.83792078.3268332 1.28165936-.2636638.44445506-.8381596.59097477-1.2815399.32707212zm-.1055611 2.83534141c-.2260487.3669561-.70585.4819508-1.0723284.2567379-2.6873888-1.6519589-6.78528355-2.1304467-9.96465377-1.1653511-.41233297.1245477-.84783206-.1079493-.97297684-.5194464-.1243089-.41233298.10830756-.84699618.51980464-.97237979 3.63206477-1.10206226 8.14706897-.56828631 11.23365537 1.32858869.3664784.2256905.4818313.7057306.256499 1.0718507zm-1.2236246 2.7229739c-.1795971.2945918-.5633904.3870174-.8569075.2074203-2.3483754-1.4352244-5.30408509-1.7594306-8.78497305-.9642597-.33543102.076902-.66966791-.1333843-.74621162-.4686959-.07690195-.335431.13254839-.6696679.46869589-.7462116 3.80927361-.8708787 7.07688998-.4960414 9.71269238 1.1146006.2938753.1794777.3864204.5633904.2067039.8571463zm-4.586055-14.4235339c-5.52284966 0-10.0001194 4.47703092-10.0001194 9.99988059 0 5.52320791 4.47726974 10.00011941 10.0001194 10.00011941 5.5229691 0 10-4.4769115 10-10.00011941 0-5.52284967-4.4770309-9.99988059-10-9.99988059z"
                  fill="#ffffff"
                  fillRule="evenodd"
                />
              </svg>
            </span>
          </button>

          {error && (
            <>
              <p className={styles.error} style={{ marginBottom: "16px" }}>
                You did not authorize this application to connect to your
                Spotify account or an error occured while authorizing.
              </p>
              <p className={styles.error}>Please retry in a few moments.</p>
            </>
          )}

          {!refreshToken && !error && (
            <p className={styles.empty}>
              Once your Spotify account is connected to this application, you'll
              find the widget URL here instead of this message.
            </p>
          )}

          {refreshToken && !error && (
            <>
              <p className={styles.subtitle}>Below your widget URL:</p>

              <div className={styles.textbox}>
                <input
                  type="text"
                  readOnly="readonly"
                  className={hidden ? styles["input-blurred"] : styles.input}
                  value={`http://localhost:3000/widget.html?refresh_token=${refreshToken}`}
                />
                {hidden && (
                  <>
                    <div className={styles.blur} />
                    <button
                      className={styles.hidden}
                      onClick={() => setHidden(false)}
                    >
                      Click to show URL
                    </button>
                  </>
                )}
              </div>

              <button className={styles.copy} onClick={copyToClipboard}>
                Copy
              </button>
            </>
          )}
        </div>

        <div className={styles.background}>
          <svg
            className={styles.top}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
          >
            <path
              className={styles.path}
              d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
              fill="currentColor"
            ></path>
          </svg>
          <div className={styles.bottom} />
        </div>
      </main>
    </div>
  );
}

Home.getInitialProps = async (ctx) => {
  return {
    refreshToken: parseCookies(ctx, BASE_COOKIE_OPTIONS)["refresh_token"] || "",
    error: parseCookies(ctx, BASE_COOKIE_OPTIONS)["error"] || "",
  };
};
