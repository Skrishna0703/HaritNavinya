import {
  getRegionsController,
  getRegionByNameController,
  getRegionAlertsController,
} from '../controllers/regions.controller.js';

export const setupRegionsRoutes = (app) => {
  app.get('/api/disaster/regions', getRegionsController);
  app.get('/api/disaster/regions/:name', getRegionByNameController);
  app.get('/api/disaster/regions/:name/alerts', getRegionAlertsController);
};
