export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001',
  apiTimeout: 30000, // 30 segundos
  jwtRefreshInterval: 30, // minutos (renovar 30min antes de expirar)
  enableSSR: false,
  enableGoogleJobs: false,
  appName: 'TalentBridge',
  appVersion: '1.0.0',
  features: {
    enableWhatsApp: false,
    enableBigFive: true,
    enableExportPDF: true,
    enableExportExcel: true,
    enableMaps: false, // Leaflet/Google Maps
  }
};