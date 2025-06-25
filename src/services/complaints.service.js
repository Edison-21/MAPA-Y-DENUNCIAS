// Servicio profesional de denuncias para gestión de agua
// Puedes conectar a una API real reemplazando los métodos mock

const mockComplaints = [
  {
    id: 'DEN001',
    title: 'Fuga de agua en tubería principal',
    description: 'Se detectó una fuga significativa en la tubería principal de la calle Norte. El agua está afectando la circulación vehicular.',
    category: 'water-leak',
    priority: 'critical',
    status: 'urgent',
    location: 'Calle Norte #123, Centro',
    reporter: 'Juan Pérez',
    createdAt: '2024-01-15T10:30:00',
    deviceId: 'SEN001'
  },
  {
    id: 'DEN002',
    title: 'Contaminación en fuente de agua',
    description: 'Usuarios reportan olor y sabor extraño en el agua potable del sector residencial.',
    category: 'contamination',
    priority: 'high',
    status: 'in-progress',
    location: 'Residencial Norte, Bloque 3',
    reporter: 'Ana López',
    createdAt: '2024-01-14T15:45:00',
    deviceId: 'VAL002'
  },
  {
    id: 'DEN003',
    title: 'Medidor con lectura incorrecta',
    description: 'El medidor del cliente muestra lecturas inconsistentes con el consumo real.',
    category: 'meter-issue',
    priority: 'medium',
    status: 'pending',
    location: 'Avenida Este #456',
    reporter: 'Roberto Silva',
    createdAt: '2024-01-13T09:15:00',
    deviceId: 'MET003'
  },
  {
    id: 'DEN004',
    title: 'Baja presión de agua',
    description: 'Múltiples usuarios reportan presión insuficiente de agua durante las horas pico.',
    category: 'pressure',
    priority: 'high',
    status: 'resolved',
    location: 'Zona Sur, Sector 2',
    reporter: 'Laura Martínez',
    createdAt: '2024-01-12T14:20:00',
    deviceId: 'SEN001'
  }
]

export default {
  // Obtener todas las denuncias (mock)
  async getMockComplaints() {
    // Simula una llamada a API
    return new Promise(resolve => {
      setTimeout(() => resolve([...mockComplaints]), 300)
    })
  },

  // Obtener denuncia por ID (mock)
  async getMockComplaintById(id) {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockComplaints.find(c => c.id === id)), 200)
    })
  },

  // Crear denuncia (mock)
  async createMockComplaint(complaint) {
    complaint.id = `DEN${String(mockComplaints.length + 1).padStart(3, '0')}`
    complaint.createdAt = new Date().toISOString()
    mockComplaints.unshift(complaint)
    return new Promise(resolve => {
      setTimeout(() => resolve(complaint), 200)
    })
  },

  // Aquí puedes agregar métodos reales para API REST:
  // async getAll() { ... },
  // async getById(id) { ... },
  // async create(complaint) { ... },
  // async update(id, data) { ... },
  // async delete(id) { ... }
}
