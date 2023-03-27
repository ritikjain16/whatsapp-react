importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyB4VOR7cKFi9fAh2s1OkJfCw5C5AO1uIPI",
  authDomain: "whatsapp-clone-87385.firebaseapp.com",
  projectId: "whatsapp-clone-87385",
  storageBucket: "whatsapp-clone-87385.appspot.com",
  messagingSenderId: "19266839150",
  appId: "1:19266839150:web:6a869d571ad1466dbe3c7f",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image ? payload.notification.image : "./w3.png",
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: "vibration-sample",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
