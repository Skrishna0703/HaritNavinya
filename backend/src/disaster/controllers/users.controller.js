import { getNotifications, updateNotifications } from '../data/notifications.js';
import { getChecklist, updateChecklistItem, addChecklistItem } from '../data/checklist.js';
import { getUser, updateUser } from '../data/users.js';

export const getUserController = (req, res) => {
  const { id } = req.params;
  const user = getUser(id);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({ success: true, data: user });
};

export const getNotificationsController = (req, res) => {
  const { id } = req.params;
  const notifications = getNotifications(id);
  res.json({ success: true, data: notifications, userId: id });
};

export const updateNotificationsController = (req, res) => {
  try {
    const { id } = req.params;
    const settings = req.body;
    const updated = updateNotifications(id, settings);
    res.json({ success: true, data: updated, message: 'Notifications updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getChecklistController = (req, res) => {
  const { id } = req.params;
  const checklist = getChecklist(id);
  res.json({ success: true, data: checklist, userId: id, count: checklist.length });
};

export const updateChecklistItemController = (req, res) => {
  try {
    const { id, itemId } = req.params;
    const updates = req.body;
    const updated = updateChecklistItem(id, parseInt(itemId), updates);
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Checklist item not found' });
    }
    
    res.json({ success: true, data: updated, message: 'Checklist item updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addChecklistItemController = (req, res) => {
  try {
    const { id } = req.params;
    const { task, priority = 'Medium' } = req.body;
    
    if (!task) {
      return res.status(400).json({ success: false, message: 'Task is required' });
    }
    
    const newItem = addChecklistItem(id, task, priority);
    res.status(201).json({ success: true, data: newItem, message: 'Checklist item added' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
