// In-memory checklist data
const checklists = {
  "user1": [
    { id: 1, task: "Stock emergency supplies (food, water, medicines)", completed: false, priority: "High" },
    { id: 2, task: "Secure livestock and poultry", completed: true, priority: "High" },
    { id: 3, task: "Check drainage systems around farm", completed: false, priority: "Medium" },
    { id: 4, task: "Harvest ready crops if possible", completed: false, priority: "High" },
    { id: 5, task: "Fuel up vehicles and generators", completed: true, priority: "Medium" },
    { id: 6, task: "Keep important documents safe", completed: true, priority: "Medium" },
    { id: 7, task: "Share contact info with neighbors", completed: false, priority: "Low" },
    { id: 8, task: "Check insurance coverage", completed: false, priority: "Low" }
  ]
};

export function getChecklist(userId) {
  return checklists[userId] || [];
}

export function updateChecklistItem(userId, itemId, updates) {
  if (!checklists[userId]) {
    checklists[userId] = [];
  }
  const item = checklists[userId].find(i => i.id === itemId);
  if (item) {
    Object.assign(item, updates);
  }
  return item;
}

export function addChecklistItem(userId, task, priority = "Medium") {
  if (!checklists[userId]) {
    checklists[userId] = [];
  }
  const newId = Math.max(0, ...checklists[userId].map(i => i.id)) + 1;
  const newItem = { id: newId, task, completed: false, priority };
  checklists[userId].push(newItem);
  return newItem;
}

export { checklists };
