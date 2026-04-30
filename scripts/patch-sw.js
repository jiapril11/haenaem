const fs = require("fs");
const path = require("path");

const swPath = path.join(process.cwd(), "public/sw.js");
console.log("📂 Looking for sw.js at:", swPath);

if (!fs.existsSync(swPath)) {
  console.error("sw.js not found, skipping patch");
  process.exit(0);
}

const pushHandler = `self.addEventListener("push", function(event) {
  var title = "해냄!";
  var body = "";
  try {
    if (event.data) {
      var data = event.data.json();
      title = data.title || title;
      body = data.body || body;
    }
  } catch(e) {}
  event.waitUntil(self.registration.showNotification(title, { body: body, icon: "/icon-192.png" }));
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
