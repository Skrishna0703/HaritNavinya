import {
  getUserController,
  getNotificationsController,
  updateNotificationsController,
  getChecklistController,
  updateChecklistItemController,
  addChecklistItemController,
} from '../controllers/users.controller.js';

export const setupUsersRoutes = (app) => {
  // User routes
  app.get('/api/disaster/users/:id', getUserController);

  // Notification routes
  app.get('/api/disaster/users/:id/notifications', getNotificationsController);
  app.put('/api/disaster/users/:id/notifications', updateNotificationsController);

  // Checklist routes
  app.get('/api/disaster/users/:id/checklist', getChecklistController);
  app.put('/api/disaster/users/:id/checklist/:itemId', updateChecklistItemController);
  app.post('/api/disaster/users/:id/checklist', addChecklistItemController);
};
