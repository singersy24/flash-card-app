import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  primary: '#ffffff',
  secondary: '#6366f1',
  background: '#f8fafc',
  text: '#1e293b',
  accent: '#4f46e5',
  surface: '#ffffff',
  error: '#ef4444',
  success: '#22c55e',
  border: '#e2e8f0',
  shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  swipeRight: '#22c55e',
  swipeLeft: '#ef4444',
};

export const darkTheme = {
  primary: '#1e293b',
  secondary: '#818cf8',
  background: '#0f172a',
  text: '#f8fafc',
  accent: '#6366f1',
  surface: '#1e293b',
  error: '#ef4444',
  success: '#22c55e',
  border: '#334155',
  shadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
  hoverShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
  swipeRight: '#4ade80',
  swipeLeft: '#f87171',
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
    min-height: 100vh;
  }

  button {
    font-family: 'Inter', -apple-system, sans-serif;
  }
`;