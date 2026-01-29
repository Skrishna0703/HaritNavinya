import {
  getAlertsController,
  getAlertByIdController,
  createAlertController,
  updateAlertController,
  deleteAlertController,
} from '../controllers/alerts.controller.js';

export const setupAlertsRoutes = (app, io) => {
  // Wrapper middleware to pass io to controllers
  const withIO = (controllerFn) => {
    return (req, res) => controllerFn(req, res, io);
  };

  app.get('/api/disaster/alerts', getAlertsController);
  app.post('/api/disaster/alerts', withIO(createAlertController));
  app.get('/api/disaster/alerts/:id', getAlertByIdController);
  app.put('/api/disaster/alerts/:id', withIO(updateAlertController));
  app.delete('/api/disaster/alerts/:id', withIO(deleteAlertController));
};
