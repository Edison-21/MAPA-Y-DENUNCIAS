import { defineStore } from 'pinia'
import mapService from '@/services/map.service'

export const useMapStore = defineStore('map', {
  state: () => ({
    devices: [],
    stats: {},
    filters: {
      type: '',
      status: '',
      zone: ''
    },
    selectedDevice: null,
    loading: false,
    error: null
  }),
  getters: {
    filteredDevices(state) {
      let filtered = state.devices
      if (state.filters.type) {
        filtered = filtered.filter(d => d.type === state.filters.type)
      }
      if (state.filters.status) {
        filtered = filtered.filter(d => d.status === state.filters.status)
      }
      if (state.filters.zone) {
        filtered = filtered.filter(d => d.location.zone === state.filters.zone)
      }
      return filtered
    },
    getDeviceById: (state) => (id) => {
      return state.devices.find(d => d.id === id)
    }
  },
  actions: {
    async fetchDevices() {
      this.loading = true
      this.error = null
      try {
        // Aquí puedes cambiar por mapService.getDevices() si tienes API real
        const data = await mapService.getMockDevices()
        this.devices = data
      } catch (e) {
        this.error = 'Error al cargar dispositivos'
      } finally {
        this.loading = false
      }
    },
    async fetchStats() {
      try {
        // Aquí puedes cambiar por mapService.getMapStats() si tienes API real
        this.stats = await mapService.getMockStats()
      } catch (e) {
        this.stats = {}
      }
    },
    setFilter(key, value) {
      this.filters[key] = value
    },
    selectDevice(device) {
      this.selectedDevice = device
    }
  }
})
