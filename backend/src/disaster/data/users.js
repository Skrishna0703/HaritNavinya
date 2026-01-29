// In-memory users data
const users = {
  "user1": { id: "user1", name: "Farmer John", email: "john@farm.com", region: "pune", phone: "9876543210" },
  "user2": { id: "user2", name: "Farmer Priya", email: "priya@farm.com", region: "marathwada", phone: "9876543211" },
  "user3": { id: "user3", name: "Farmer Raj", email: "raj@farm.com", region: "nashik", phone: "9876543212" }
};

export function getUser(userId) {
  return users[userId] || null;
}

export function getUserByRegion(region) {
  return Object.values(users).filter(u => u.region.toLowerCase() === region.toLowerCase());
}

export function createUser(userData) {
  const userId = `user${Object.keys(users).length + 1}`;
  users[userId] = { id: userId, ...userData };
  return users[userId];
}

export function updateUser(userId, updates) {
  if (users[userId]) {
    Object.assign(users[userId], updates);
  }
  return users[userId];
}

export { users };
