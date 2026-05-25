import SoilTestingCenter from '../models/SoilTestingCenter.js';

/**
 * Get all soil testing centers
 */
export async function getAllTestingCenters() {
  try {
    const centers = await SoilTestingCenter.find().sort({ state: 1, district: 1 });
    return centers;
  } catch (error) {
    console.error('Error fetching all testing centers:', error.message);
    throw error;
  }
}

/**
 * Get testing centers by state
 */
export async function getTestingCentersByState(state) {
  try {
    if (!state) {
      throw new Error('State parameter is required');
    }
    
    const centers = await SoilTestingCenter.find({
      state: new RegExp(`^${state}$`, 'i')
    }).sort({ district: 1 });
    
    return centers;
  } catch (error) {
    console.error('Error fetching centers by state:', error.message);
    throw error;
  }
}

/**
 * Get testing centers by state and district
 */
export async function getTestingCentersByLocation(state, district) {
  try {
    if (!state) {
      throw new Error('State parameter is required');
    }
    
    const query = {
      state: new RegExp(`^${state}$`, 'i')
    };
    
    if (district && district !== 'All') {
      query.district = new RegExp(`^${district}$`, 'i');
    }
    
    const centers = await SoilTestingCenter.find(query).sort({ name: 1 });
    
    return centers;
  } catch (error) {
    console.error('Error fetching centers by location:', error.message);
    throw error;
  }
}

/**
 * Search testing centers by name
 */
export async function searchTestingCenters(searchQuery) {
  try {
    if (!searchQuery) {
      throw new Error('Search query is required');
    }
    
    const centers = await SoilTestingCenter.find({
      $or: [
        { name: new RegExp(searchQuery, 'i') },
        { address: new RegExp(searchQuery, 'i') },
        { district: new RegExp(searchQuery, 'i') },
        { state: new RegExp(searchQuery, 'i') }
      ]
    }).sort({ state: 1, district: 1 });
    
    return centers;
  } catch (error) {
    console.error('Error searching centers:', error.message);
    throw error;
  }
}

/**
 * Get unique states
 */
export async function getUniqueStates() {
  try {
    const states = await SoilTestingCenter.distinct('state');
    return states.sort();
  } catch (error) {
    console.error('Error fetching unique states:', error.message);
    throw error;
  }
}

/**
 * Get unique districts by state
 */
export async function getDistrictsByState(state) {
  try {
    if (!state) {
      throw new Error('State parameter is required');
    }
    
    const districts = await SoilTestingCenter.distinct('district', {
      state: new RegExp(`^${state}$`, 'i')
    });
    
    return districts.sort();
  } catch (error) {
    console.error('Error fetching districts:', error.message);
    throw error;
  }
}

/**
 * Get testing center by ID
 */
export async function getTestingCenterById(id) {
  try {
    const center = await SoilTestingCenter.findById(id);
    return center;
  } catch (error) {
    console.error('Error fetching center by ID:', error.message);
    throw error;
  }
}

/**
 * Create a new testing center
 */
export async function createTestingCenter(centerData) {
  try {
    const center = new SoilTestingCenter(centerData);
    await center.save();
    return center;
  } catch (error) {
    console.error('Error creating testing center:', error.message);
    throw error;
  }
}

/**
 * Bulk create testing centers (for seeding)
 */
export async function bulkCreateTestingCenters(centersData) {
  try {
    const centers = await SoilTestingCenter.insertMany(centersData, { ordered: false });
    return centers;
  } catch (error) {
    console.error('Error bulk creating centers:', error.message);
    // Continue on error for insertMany - some may have succeeded
    throw error;
  }
}

/**
 * Update a testing center
 */
export async function updateTestingCenter(id, updateData) {
  try {
    const center = await SoilTestingCenter.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return center;
  } catch (error) {
    console.error('Error updating center:', error.message);
    throw error;
  }
}

/**
 * Delete a testing center
 */
export async function deleteTestingCenter(id) {
  try {
    const center = await SoilTestingCenter.findByIdAndDelete(id);
    return center;
  } catch (error) {
    console.error('Error deleting center:', error.message);
    throw error;
  }
}

/**
 * Get testing centers count
 */
export async function getTestingCentersCount() {
  try {
    const count = await SoilTestingCenter.countDocuments();
    return count;
  } catch (error) {
    console.error('Error getting count:', error.message);
    throw error;
  }
}

/**
 * Get testing centers with pagination
 */
export async function getTestingCentersWithPagination(page = 1, limit = 20, filter = {}) {
  try {
    const skip = (page - 1) * limit;
    
    // Build filter query
    const query = {};
    if (filter.state) {
      query.state = new RegExp(`^${filter.state}$`, 'i');
    }
    if (filter.district) {
      query.district = new RegExp(`^${filter.district}$`, 'i');
    }
    if (filter.search) {
      query.$or = [
        { name: new RegExp(filter.search, 'i') },
        { address: new RegExp(filter.search, 'i') }
      ];
    }
    
    const centers = await SoilTestingCenter.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ state: 1, district: 1 });
    
    const total = await SoilTestingCenter.countDocuments(query);
    
    return {
      data: centers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching paginated centers:', error.message);
    throw error;
  }
}
