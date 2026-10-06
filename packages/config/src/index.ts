/**
 * PANACEA CONSULTANCY — System Configuration & Constants
 */

export const APP_CONFIG = {
  name: 'Panacea Consultancy Private Limited',
  shortName: 'Panacea',
  legalEntity: 'Panacea Consultancy Private Limited',
  tagline: 'Institutional Enforcement & Investigation Services',
  contact: {
    email: 'panaceaconsultancypvtltd@gmail.com',
    phones: ['+91-9304897257', '+91-9431432983'],
    operatingRegions: ['Bihar', 'Jharkhand', 'Chhattisgarh'],
  },
  security: {
    sessionTimeoutMinutes: 30,
    adminSessionTimeoutMinutes: 15,
    absoluteSessionTimeoutHours: 8,
    adminAbsoluteSessionTimeoutHours: 4,
    maxFailedLoginsBeforeLockout: 5,
    lockoutDurationMinutes: 15,
    maxUploadSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ],
  },
  ports: {
    web: 3000,
    portal: 3001,
    api: 4000,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
