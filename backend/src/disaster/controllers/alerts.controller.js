import { getAlerts, getAlertById, createAlert, updateAlert, deleteAlert } from '../data/alerts.js';

export const getAlertsController = (req, res) => {
  const { region } = req.query;
  const alerts = getAlerts(region);
  res.json({ success: true, data: alerts, count: alerts.length });
};

export const getAlertByIdController = (req, res) => {
  const { id } = req.params;
  const alert = getAlertById(id);
  if (!alert) {
    return res.status(404).json({ success: false, message: 'Alert not found' });
  }
  res.json({ success: true, data: alert });
};

export const createAlertController = (req, res, io) => {
  try {
    const alertData = req.body;
    const newAlert = createAlert(alertData);
    
    // Emit to Socket.IO
    if (io) {
      io.to(`region:${newAlert.region}`).emit('alert:new', newAlert);
      io.emit('alert:broadcast', { type: 'new', alert: newAlert });
    }
    
    res.status(201).json({ success: true, data: newAlert, message: 'Alert created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAlertController = (req, res, io) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedAlert = updateAlert(id, updates);
    
    if (!updatedAlert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    
    // Emit to Socket.IO
    if (io) {
      io.to(`region:${updatedAlert.region}`).emit('alert:update', updatedAlert);
      io.emit('alert:broadcast', { type: 'update', alert: updatedAlert });
    }
    
    res.json({ success: true, data: updatedAlert, message: 'Alert updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAlertController = (req, res, io) => {
  try {
    const { id } = req.params;
    const alert = getAlertById(id);
    
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    
    const deleted = deleteAlert(id);
    
    if (deleted && io) {
      io.to(`region:${alert.region}`).emit('alert:delete', { id });
      io.emit('alert:broadcast', { type: 'delete', alertId: id });
    }
    
    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
