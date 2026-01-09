import * as ActionCable from "@rails/actioncable";

const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

// Store subscription globally to prevent duplicates
let notificationSubscription = null;

export const subscribeToNotifications = (callback) => {
    // Only create subscription if it doesn't exist
    if (!notificationSubscription) {
        notificationSubscription = cable.subscriptions.create("NotificationChannel", {
            connected() {
                console.log("Connected to ActionCable ✅");
            },
            received(data) {
                console.log("Notification received:", data);
                callback(data);
            },
        });
    }
    return notificationSubscription;
};
