// import api from './api';

class MapService {
  // Obtener todos los dispositivos para el mapa
  async getDevices(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.zone) params.append('zone', filters.zone);
      if (filters.lat) params.append('lat', filters.lat);
      if (filters.lng) params.append('lng', filters.lng);
      if (filters.radius) params.append('radius', filters.radius);

      const response = await api.get(`/map/devices?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching devices for map:', error);
      throw error;
    }
  }

  // Obtener estadísticas del mapa
  async getMapStats() {
    try {
      const response = await api.get('/map/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching map stats:', error);
      throw error;
    }
  }

  // Obtener dispositivos cercanos a una ubicación
  async getNearbyDevices(lat, lng, radius = 5) {
    try {
      const response = await api.get(`/map/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby devices:', error);
      throw error;
    }
  }

  // Obtener detalles de un dispositivo específico
  async getDeviceDetails(deviceId) {
    try {
      const response = await api.get(`/map/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching device details:', error);
      throw error;
    }
  }

  // Actualizar ubicación de un dispositivo
  async updateDeviceLocation(deviceId, location) {
    try {
      const response = await api.put(`/map/devices/${deviceId}/location`, {
        latitude: location.lat,
        longitude: location.lng,
        address: location.address
      });
      return response.data;
    } catch (error) {
      console.error('Error updating device location:', error);
      throw error;
    }
  }

  // Obtener alertas geográficas
  async getGeographicAlerts(bounds) {
    try {
      const response = await api.post('/map/alerts', {
        north: bounds.north,
        south: bounds.south,
        east: bounds.east,
        west: bounds.west
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic alerts:', error);
      throw error;
    }
  }

  // Exportar mapa como imagen
  async exportMapAsImage(bounds, format = 'png') {
    try {
      const response = await api.post('/map/export', {
        bounds,
        format,
        quality: 'high'
      }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting map:', error);
      throw error;
    }
  }

  // Obtener capas del mapa
  async getMapLayers() {
    try {
      const response = await api.get('/map/layers');
      return response.data;
    } catch (error) {
      console.error('Error fetching map layers:', error);
      throw error;
    }
  }

  // Actualizar configuración de capas
  async updateMapLayers(layers) {
    try {
      const response = await api.put('/map/layers', { layers });
      return response.data;
    } catch (error) {
      console.error('Error updating map layers:', error);
      throw error;
    }
  }

  // Obtener zonas geográficas
  async getZones() {
    try {
      const response = await api.get('/map/zones');
      return response.data;
    } catch (error) {
      console.error('Error fetching zones:', error);
      throw error;
    }
  }

  // Obtener dispositivos por zona
  async getDevicesByZone(zoneId) {
    try {
      const response = await api.get(`/map/zones/${zoneId}/devices`);
      return response.data;
    } catch (error) {
      console.error('Error fetching devices by zone:', error);
      throw error;
    }
  }

  // Obtener métricas de rendimiento del mapa
  async getMapPerformance() {
    try {
      const response = await api.get('/map/performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching map performance:', error);
      throw error;
    }
  }

  // Simular datos para desarrollo (cuando no hay API)
  getMockDevices() {
    return [
      {
        id: 'SEN001',
        name: 'Sensor de Presión Norte',
        type: 'sensor',
        status: 'online',
        location: {
          lat: 19.4326,
          lng: -99.1332,
          address: 'Calle Norte #123, Centro'
        },
        lastReading: '2024-01-15T14:30:25',
        battery: 85,
        signal: 92,
        metrics: {
          pressure: 2.5,
          temperature: 22,
          humidity: 65
        }
      },
      {
        id: 'VAL002',
        name: 'Válvula Principal Este',
        type: 'valve',
        status: 'online',
        location: {
          lat: 19.4300,
          lng: -99.1300,
          address: 'Avenida Este #456'
        },
        lastReading: '2024-01-15T14:25:10',
        battery: 78,
        signal: 88,
        metrics: {
          flow: 150,
          pressure: 3.2,
          status: 'open'
        }
      },
      {
        id: 'MET003',
        name: 'Medidor Residencial',
        type: 'meter',
        status: 'alert',
        location: {
          lat: 19.4350,
          lng: -99.1350,
          address: 'Residencial Norte, Bloque 5'
        },
        lastReading: '2024-01-15T14:20:45',
        battery: 45,
        signal: 75,
        metrics: {
          consumption: 1250,
          flow: 0.8,
          alert: 'High consumption detected'
        }
      },
      {
        id: 'BOM004',
        name: 'Bomba de Refuerzo',
        type: 'pump',
        status: 'offline',
        location: {
          lat: 19.4280,
          lng: -99.1380,
          address: 'Estación de Bombeo Sur'
        },
        lastReading: '2024-01-15T13:45:30',
        battery: 12,
        signal: 25,
        metrics: {
          pressure: 0,
          flow: 0,
          status: 'stopped'
        }
      }
    ];
  }

  getMockStats() {
    return {
      online: 156,
      offline: 12,
      alerts: 8,
      maintenance: 3,
      total: 179,
      zones: {
        north: 45,
        south: 38,
        east: 42,
        west: 35,
        center: 19
      }
    };
  }

  getMockZones() {
    return [
      {
        id: 'north',
        name: 'Zona Norte',
        center: { lat: 19.4400, lng: -99.1300 },
        deviceCount: 45,
        status: 'operational'
      },
      {
        id: 'south',
        name: 'Zona Sur',
        center: { lat: 19.4200, lng: -99.1300 },
        deviceCount: 38,
        status: 'operational'
      },
      {
        id: 'east',
        name: 'Zona Este',
        center: { lat: 19.4300, lng: -99.1200 },
        deviceCount: 42,
        status: 'maintenance'
      },
      {
        id: 'west',
        name: 'Zona Oeste',
        center: { lat: 19.4300, lng: -99.1400 },
        deviceCount: 35,
        status: 'operational'
      },
      {
        id: 'center',
        name: 'Zona Centro',
        center: { lat: 19.4326, lng: -99.1332 },
        deviceCount: 19,
        status: 'operational'
      }
    ];
  }

  // Utilidades para el mapa
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Obtener icono del dispositivo
  getDeviceIcon(type) {
    const icons = {
      sensor: '📡',
      valve: '🔧',
      meter: '📊',
      pump: '⚡'
    };
    return icons[type] || '📱';
  }

  // Obtener color del dispositivo
  getDeviceColor(type, status) {
    const colors = {
      sensor: {
        online: '#0891b2',
        offline: '#6b7280',
        alert: '#d97706'
      },
      valve: {
        online: '#2563eb',
        offline: '#6b7280',
        alert: '#d97706'
      },
      meter: {
        online: '#059669',
        offline: '#6b7280',
        alert: '#d97706'
      },
      pump: {
        online: '#d97706',
        offline: '#6b7280',
        alert: '#dc2626'
      }
    };
    return colors[type]?.[status] || '#6b7280';
  }

  // Formatear métricas del dispositivo
  formatDeviceMetrics(device) {
    const metrics = [];
    
    if (device.metrics) {
      Object.entries(device.metrics).forEach(([key, value]) => {
        let formattedValue = value;
        let unit = '';
        
        switch (key) {
          case 'pressure':
            unit = ' bar';
            break;
          case 'temperature':
            unit = '°C';
            break;
          case 'humidity':
            unit = '%';
            break;
          case 'flow':
            unit = ' L/min';
            break;
          case 'consumption':
            unit = ' L';
            break;
        }
        
        metrics.push({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value: formattedValue + unit
        });
      });
    }
    
    return metrics;
  }

  // Validar coordenadas
  isValidCoordinates(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Obtener dirección desde coordenadas (simulado)
  async getAddressFromCoordinates(lat, lng) {
    try {
      // En producción, usaría un servicio como Google Geocoding API
      const response = await api.get(`/geocoding/reverse?lat=${lat}&lng=${lng}`);
      return response.data.address;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return 'Dirección no disponible';
    }
  }

  // Obtener coordenadas desde dirección (simulado)
  async getCoordinatesFromAddress(address) {
    try {
      // En producción, usaría un servicio como Google Geocoding API
      const response = await api.get(`/geocoding/forward?address=${encodeURIComponent(address)}`);
      return response.data.coordinates;
    } catch (error) {
      console.error('Error getting coordinates from address:', error);
      return null;
    }
  }
}

export default new MapService();
