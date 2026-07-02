export const environment = {
  production: true,
  apiUrl: 'https://api.talentbridge.com.br', // Ajustar para URL do Render
  apiTimeout: 30000,
  jwtRefreshInterval: 30,
  enableSSR: true,
  enableGoogleJobs: true,
  appName: 'TalentBridge',
  appVersion: '1.0.0',
  features: {
    enableWhatsApp: true,
    enableBigFive: true,
    enableExportPDF: true,
    enableExportExcel: true,
    enableMaps: true,
  }
};