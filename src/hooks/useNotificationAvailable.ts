"use client";

import { useEffect, useState } from "react";

type NotificationState = "available" | "ios-browser" | "unsupported";

export function useNotificationAvailable(): NotificationState {
  const [state, setState] = useState<NotificationState>("unsupported");

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone =
      ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true) ||
      window.matchMedia("(display-mode: standalone)").matches;
    const hasPushSupport = "serviceWorker" in navigator && "PushManager" in window;

    if (isIOS) {
      setState(isStandalone ? "available" : "ios-browser");
    } else if (hasPushSupport) {
      setState("available");
    } else {
      setState("unsupported");
    }
  }, []);

  return state;
}
