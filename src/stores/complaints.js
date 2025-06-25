import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import complaintsService from '@/services/complaints.service'

export const useComplaintsStore = defineStore('complaints', () => {
  // Datos de ejemplo (mock)
  const complaints = ref([
    {
      id: 'DEN001',
      title: 'Fuga de agua en la calle 10',
      description: 'Se reporta una fuga considerable en la tubería principal.',
      category: 'water-leak',
      priority: 'critical',
      status: 'pending',
      reporter: 'Carlos Ramírez',
      location: 'Calle 10, Col. Centro',
      createdAt: '2024-06-20T10:00:00',
      date: '2024-06-20T10:00:00',
      assignedTo: 'Brigada 1',
      lastUpdate: '2024-06-20T12:00:00',
      history: [
        { title: 'Creada', description: 'Denuncia registrada', user: 'Carlos Ramírez', date: '2024-06-20T10:00:00' },
        { title: 'Asignada', description: 'Asignada a Brigada 1', user: 'Operador', date: '2024-06-20T10:30:00' }
      ],
      attachments: [
        { id: 1, name: 'foto_fuga.jpg', size: 204800 }
      ],
      contact: { phone: '555-1234', email: 'carlos@email.com', schedule: '8:00-18:00' },
      comments: []
    },
    {
      id: 'DEN002',
      title: 'Contaminación en pozo',
      description: 'El agua sale con color y olor extraño.',
      category: 'contamination',
      priority: 'high',
      status: 'in-progress',
      reporter: 'María López',
      location: 'Pozo 3, Col. Norte',
      createdAt: '2024-06-19T09:00:00',
      date: '2024-06-19T09:00:00',
      assignedTo: 'Brigada 2',
      lastUpdate: '2024-06-19T11:00:00',
      history: [
        { title: 'Creada', description: 'Denuncia registrada', user: 'María López', date: '2024-06-19T09:00:00' },
        { title: 'Asignada', description: 'Asignada a Brigada 2', user: 'Operador', date: '2024-06-19T09:30:00' },
        { title: 'En proceso', description: 'Brigada en sitio', user: 'Brigada 2', date: '2024-06-19T10:00:00' }
      ],
      attachments: [],
      contact: { phone: '555-5678', email: 'maria@email.com', schedule: '9:00-17:00' },
      comments: []
    },
    {
      id: 'DEN003',
      title: 'Problema de medidor',
      description: 'El medidor no registra el consumo correctamente.',
      category: 'meter-issue',
      priority: 'medium',
      status: 'resolved',
      reporter: 'Juan Pérez',
      location: 'Calle 5, Col. Sur',
      createdAt: '2024-06-18T14:00:00',
      date: '2024-06-18T14:00:00',
      assignedTo: 'Brigada 3',
      lastUpdate: '2024-06-18T16:00:00',
      history: [
        { title: 'Creada', description: 'Denuncia registrada', user: 'Juan Pérez', date: '2024-06-18T14:00:00' },
        { title: 'Resuelta', description: 'Medidor reparado', user: 'Brigada 3', date: '2024-06-18T16:00:00' }
      ],
      attachments: [],
      contact: { phone: '555-9999', email: 'juan@email.com', schedule: '10:00-16:00' },
      comments: []
    }
  ])

  // Getters y acciones
  const filteredComplaints = computed(() => complaints.value)
  function getComplaintById(id) {
    return complaints.value.find(c => c.id === id)
  }
  function setSearchQuery(query) {
    // Aquí podrías implementar búsqueda real
  }

  return {
    complaints,
    filteredComplaints,
    getComplaintById,
    setSearchQuery
  }
})
