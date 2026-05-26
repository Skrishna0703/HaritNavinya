import {
  getAllTestingCenters,
  getTestingCentersByState,
  getTestingCentersByLocation,
  searchTestingCenters,
  getUniqueStates,
  getDistrictsByState,
  getTestingCenterById,
  createTestingCenter,
  bulkCreateTestingCenters,
  updateTestingCenter,
  deleteTestingCenter,
  getTestingCentersCount,
  getTestingCentersWithPagination
} from '../services/testingCenterService.js';

/**
 * Get all testing centers
 * GET /api/testing-centers
 */
export async function getAllCenters(req, res) {
  try {
    console.log('📍 getAllCenters called - attempting to fetch centers');
    const centers = await getAllTestingCenters();
    
    console.log(`✅ Successfully retrieved ${centers.length} centers`);
    
    if (centers.length === 0) {
      console.warn('⚠️  WARNING: Zero centers returned - this may indicate a data loading issue');
    }
    
    res.status(200).json({
      success: true,
      data: centers,
      count: centers.length,
      timestamp: new Date().toISOString(),
      source: centers.length > 0 ? 'MongoDB or JSON fallback' : 'empty'
    });
  } catch (error) {
    console.error('❌ Error in getAllCenters:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get centers by state
 * GET /api/testing-centers/state?state=StateName
 */
export async function getCentersByState(req, res) {
  try {
    const { state } = req.query;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const centers = await getTestingCentersByState(state);
    
    res.status(200).json({
      success: true,
      data: centers,
      count: centers.length,
      state,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getCentersByState:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get centers by location (state + district)
 * GET /api/testing-centers/location?state=StateName&district=DistrictName
 */
export async function getCentersByLocation(req, res) {
  try {
    const { state, district } = req.query;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const centers = await getTestingCentersByLocation(state, district);
    
    res.status(200).json({
      success: true,
      data: centers,
      count: centers.length,
      location: { state, district: district || 'All' },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getCentersByLocation:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Search testing centers
 * GET /api/testing-centers/search?q=SearchQuery
 */
export async function searchCenters(req, res) {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query (q) parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const centers = await searchTestingCenters(q);
    
    res.status(200).json({
      success: true,
      data: centers,
      count: centers.length,
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in searchCenters:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get all states
 * GET /api/testing-centers/states
 */
export async function getStates(req, res) {
  try {
    const states = await getUniqueStates();
    
    res.status(200).json({
      success: true,
      data: states,
      count: states.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getStates:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get districts by state
 * GET /api/testing-centers/districts?state=StateName
 */
export async function getDistricts(req, res) {
  try {
    const { state } = req.query;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required',
        timestamp: new Date().toISOString()
      });
    }
    
    const districts = await getDistrictsByState(state);
    
    res.status(200).json({
      success: true,
      data: districts,
      count: districts.length,
      state,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getDistricts:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get testing center by ID
 * GET /api/testing-centers/:id
 */
export async function getCenterById(req, res) {
  try {
    const { id } = req.params;
    
    const center = await getTestingCenterById(id);
    
    if (!center) {
      return res.status(404).json({
        success: false,
        error: 'Testing center not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      data: center,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getCenterById:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Create testing center
 * POST /api/testing-centers
 */
export async function createCenter(req, res) {
  try {
    const { name, district, state, phone, email, address, pincode, latitude, longitude } = req.body;
    
    if (!name || !district || !state) {
      return res.status(400).json({
        success: false,
        error: 'Name, district, and state are required',
        timestamp: new Date().toISOString()
      });
    }
    
    const center = await createTestingCenter({
      name,
      district,
      state,
      phone,
      email,
      address,
      pincode,
      latitude,
      longitude
    });
    
    res.status(201).json({
      success: true,
      data: center,
      message: 'Testing center created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in createCenter:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Bulk create testing centers (for seeding)
 * POST /api/testing-centers/bulk
 */
export async function bulkCreateCenters(req, res) {
  try {
    const { centers } = req.body;
    
    if (!Array.isArray(centers) || centers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Centers array is required and must not be empty',
        timestamp: new Date().toISOString()
      });
    }
    
    const result = await bulkCreateTestingCenters(centers);
    
    res.status(201).json({
      success: true,
      data: result,
      count: result.length,
      message: `${result.length} testing centers created successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in bulkCreateCenters:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Update testing center
 * PUT /api/testing-centers/:id
 */
export async function updateCenter(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const center = await updateTestingCenter(id, updateData);
    
    if (!center) {
      return res.status(404).json({
        success: false,
        error: 'Testing center not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      data: center,
      message: 'Testing center updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in updateCenter:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Delete testing center
 * DELETE /api/testing-centers/:id
 */
export async function deleteCenter(req, res) {
  try {
    const { id } = req.params;
    
    const center = await deleteTestingCenter(id);
    
    if (!center) {
      return res.status(404).json({
        success: false,
        error: 'Testing center not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      data: center,
      message: 'Testing center deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in deleteCenter:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get testing centers count
 * GET /api/testing-centers/count
 */
export async function getCentersCount(req, res) {
  try {
    const count = await getTestingCentersCount();
    
    res.status(200).json({
      success: true,
      count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getCentersCount:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Get paginated testing centers
 * GET /api/testing-centers/paginated?page=1&limit=20&state=&district=&search=
 */
export async function getPaginatedCenters(req, res) {
  try {
    const { page = 1, limit = 20, state, district, search } = req.query;
    
    const filter = {};
    if (state) filter.state = state;
    if (district) filter.district = district;
    if (search) filter.search = search;
    
    const result = await getTestingCentersWithPagination(parseInt(page), parseInt(limit), filter);
    
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filter,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getPaginatedCenters:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Health check for testing centers
 * GET /api/testing-centers/health
 */
export async function healthCheck(req, res) {
  try {
    const count = await getTestingCentersCount();
    
    res.status(200).json({
      success: true,
      message: 'Testing Centers API healthy',
      centersInDB: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in health check:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
