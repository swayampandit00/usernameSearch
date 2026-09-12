const isWeb = typeof window !== 'undefined';

export const API_BASE = isWeb ? '' : 'http://127.0.0.1:3001';
export const APP_NAME = 'userdorking';
export const DEVELOPER = 'swayampandit';
