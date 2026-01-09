import consumer from "./consumer"

// Use a global flag to ensure only ONE subscription is ever created
// This prevents duplicates even across page reloads or HMR updates
if (!window.__notificationChannelSubscribed__) {
  window.__notificationChannelSubscribed__ = true

  consumer.subscriptions.create("NotificationChannel", {
    connected() {
      console.log("ActionCable connected ✅")
    },

    disconnected() {
      // Reset the flag when disconnected so it can reconnect if needed
      window.__notificationChannelSubscribed__ = false
    },

    received(data) {
      console.log("Notification received:", data)
      // Dispatch a browser event so Alpine can pick it up
      window.dispatchEvent(new CustomEvent('notification', { detail: data }))
    }
  })
}
