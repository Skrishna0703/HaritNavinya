import { getRegions, getRegionByName } from '../data/regions.js';
import { getAlerts } from '../data/alerts.js';

export const getRegionsController = (req, res) => {
  const regions = getRegions();
  res.json({ success: true, data: regions, count: regions.length });
};

export const getRegionByNameController = (req, res) => {
  const { name } = req.params;
  const region = getRegionByName(name);
  
  if (!region) {
    return res.status(404).json({ success: false, message: 'Region not found' });
  }
  
  const alerts = getAlerts(name);
  res.json({ success: true, data: { ...region, alerts } });
};

export const getRegionAlertsController = (req, res) => {
  const { name } = req.params;
  const region = getRegionByName(name);
  
  if (!region) {
    return res.status(404).json({ success: false, message: 'Region not found' });
  }
  
  const alerts = getAlerts(name);
  res.json({ success: true, data: alerts, region: name, count: alerts.length });
};
