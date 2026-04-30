const fs = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "../public/sw.js");

if (!fs.existsSync(swPath)) {
  console.error("sw.js not found, skipping patch");
  process.exit(0);
}

const pushHandler = `self.addEventListener("push", function(event) {
  if (!event.data) return;
  var data = event.data.json();
  var title = data.title || "해냄!";
  var options = { body: data.body || "", icon: "/icon-192.png" };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if ("focus" in clientList[i]) return clientList[i].focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
`;

const original = fs.readFileSync(swPath, "utf8");
fs.writeFileSync(swPath, pushHandler + original);
console.log("✅ sw.js patched with push handler");
