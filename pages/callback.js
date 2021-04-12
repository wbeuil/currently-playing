import { useEffect } from "react";
import { useRouter } from "next/router";

import { setCookie, destroyCookie, BASE_COOKIE_OPTIONS } from "../lib/cookies";

export default function Callback() {
  const router = useRouter();
  const { code, error } = router.query;

  useEffect(() => {
    if (code) {
      fetch(`/api/auth?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          destroyCookie(null, "error");

          setCookie(
            null,
            "refresh_token",
            data.refresh_token,
            BASE_COOKIE_OPTIONS
          );

          if (typeof window !== "undefined") {
            router.push("/");
          }
        })
        .catch((err) => console.error(err));
    }

    if (error) {
      destroyCookie(null, "refresh_token");

      setCookie(null, "error", error, BASE_COOKIE_OPTIONS);

      if (typeof window !== "undefined") {
        router.push("/");
      }
    }
  }, [code, error]);

  return <div />;
}
