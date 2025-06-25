import { createRouter, createWebHistory } from 'vue-router';
// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
// Auth views
import LoginPage from '@/views/Auth/LoginPage.vue';
import RegisterPage from '@/views/Auth/RegisterPage.vue';
import ForgotPasswordPage from '@/views/Auth/ForgotPasswordPage.vue';
// Dashboard
import DashboardOverview from '@/views/Dashboard/DashboardOverview.vue';
// Devices
import DeviceListPage from '@/views/Devices/DeviceListPage.vue';
import DeviceDetailPage from '@/views/Devices/DeviceDetailPage.vue';
import DeviceMaintenancePage from '@/views/Devices/DeviceMaintenancePage.vue';
// Incidents
import IncidentListPage from '@/views/Incidents/IncidentListPage.vue';
import IncidentDetailPage from '@/views/Incidents/IncidentDetailPage.vue';
// CRM
import ClientListPage from '@/views/CRM/ClientListPage.vue';
import ClientDetailPage from '@/views/CRM/ClientDetailPage.vue';
import ConversationListPage from '@/views/CRM/ConversationListPage.vue';
import ConversationDetailPage from '@/views/CRM/ConversationDetailPage.vue';
// Complaints
import ComplaintListPage from '@/views/Complaints/ComplaintListPage.vue';
import ComplaintDetailPage from '@/views/Complaints/ComplaintDetailPage.vue';
// Map
import MapPage from '@/views/Map/MapPage.vue';
// Personnel
import PersonnelListPage from '@/views/Personnel/PersonnelListPage.vue';
import PersonnelDetailPage from '@/views/Personnel/PersonnelDetailPage.vue';
// Not Found
import NotFoundPage from '@/views/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
      { path: 'forgot-password', component: ForgotPasswordPage },
    ],
  },
  {
    path: '/app',
    component: DefaultLayout,
    children: [
      { path: '', redirect: '/app/dashboard' },
      { path: 'dashboard', component: DashboardOverview },
      // Devices
      { path: 'devices', component: DeviceListPage },
      { path: 'devices/:id', component: DeviceDetailPage },
      { path: 'devices/:id/maintenance', component: DeviceMaintenancePage },
      // Incidents
      { path: 'incidents', component: IncidentListPage },
      { path: 'incidents/:id', component: IncidentDetailPage },
      // CRM
      { path: 'crm/clients', component: ClientListPage },
      { path: 'crm/clients/:id', component: ClientDetailPage },
      { path: 'crm/conversations', component: ConversationListPage },
      { path: 'crm/conversations/:id', component: ConversationDetailPage },
      // Complaints
      { path: 'complaints', component: ComplaintListPage },
      { path: 'complaints/:id', component: ComplaintDetailPage },
      // Map
      { path: 'map', component: MapPage },
      // Personnel
      { path: 'personnel', component: PersonnelListPage },
      { path: 'personnel/:id', component: PersonnelDetailPage },
    ],
  },
  {
    path: '/complaints/:id',
    redirect: to => `/app/complaints/${to.params.id}`
  },
  {
    path: '/complaints',
    redirect: '/app/complaints'
  },
  // Not Found
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
