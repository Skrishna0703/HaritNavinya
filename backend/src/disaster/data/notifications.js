// In-memory notifications settings
const notifications = {
  "user1": { sms: true, whatsapp: true, phone: false, push: true },
  "user2": { sms: true, whatsapp: false, phone: true, push: true },
  "user3": { sms: false, whatsapp: true, phone: false, push: true }
};

export function getNotifications(userId) {
  return notifications[userId] || { sms: true, whatsapp: true, phone: false, push: true };
}

export function updateNotifications(userId, settings) {
  notifications[userId] = { ...getNotifications(userId), ...settings };
  return notifications[userId];
}

export { notifications };
