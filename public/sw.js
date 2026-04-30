self.addEventListener("push", function (event) {
  var title = "해냄!";
  var body = "";
  try {
    if (event.data) {
      var data = event.data.json();
      title = data.title || title;
      body = data.body || body;
    }
  } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "/icon-192.png",
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if ("focus" in clientList[i]) return clientList[i].focus();
      }
      return self.clients.openWindow("/");
    })
  );
});

importScripts("/workbox-sw.js");
