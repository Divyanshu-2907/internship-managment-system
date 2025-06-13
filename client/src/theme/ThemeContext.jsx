import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors - Modern blue gradient
                primary: {
                  main: '#2563eb',
                  light: '#3b82f6',
                  dark: '#1d4ed8',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#7c3aed',
                  light: '#8b5cf6',
                  dark: '#6d28d9',
                  contrastText: '#ffffff',
                },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#1e293b',
                  secondary: '#64748b',
                },
                success: {
                  main: '#10b981',
                  light: '#34d399',
                  dark: '#059669',
                },
                warning: {
                  main: '#f59e0b',
                  light: '#fbbf24',
                  dark: '#d97706',
                },
                error: {
                  main: '#ef4444',
                  light: '#f87171',
                  dark: '#dc2626',
                },
                info: {
                  main: '#3b82f6',
                  light: '#60a5fa',
                  dark: '#2563eb',
                },
              }
            : {
                // Dark mode colors - Modern dark theme
                primary: {
                  main: '#60a5fa',
                  light: '#93c5fd',
                  dark: '#3b82f6',
                  contrastText: '#000000',
                },
                secondary: {
                  main: '#a78bfa',
                  light: '#c4b5fd',
                  dark: '#8b5cf6',
                  contrastText: '#000000',
                },
                background: {
                  default: '#0f172a',
                  paper: '#1e293b',
                },
                text: {
                  primary: '#f1f5f9',
                  secondary: '#94a3b8',
                },
                success: {
                  main: '#34d399',
                  light: '#6ee7b7',
                  dark: '#10b981',
                },
                warning: {
                  main: '#fbbf24',
                  light: '#fcd34d',
                  dark: '#f59e0b',
                },
                error: {
                  main: '#f87171',
                  light: '#fca5a5',
                  dark: '#ef4444',
                },
                info: {
                  main: '#60a5fa',
                  light: '#93c5fd',
                  dark: '#3b82f6',
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3,
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.3,
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
          },
          h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: 1.4,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          button: {
            fontWeight: 600,
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
                color: mode === 'light' ? '#1e293b' : '#f1f5f9',
                boxShadow: mode === 'light' 
                  ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
                border: mode === 'light' 
                  ? '1px solid #e2e8f0'
                  : '1px solid #334155',
                boxShadow: mode === 'light'
                  ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 600,
                textTransform: 'none',
                padding: '8px 16px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: mode === 'light'
                    ? '0 4px 12px rgba(37, 99, 235, 0.15)'
                    : '0 4px 12px rgba(96, 165, 250, 0.15)',
                },
              },
              contained: {
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                  : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                '&:hover': {
                  background: mode === 'light'
                    ? 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                },
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
                borderRight: mode === 'light' 
                  ? '1px solid #e2e8f0'
                  : '1px solid #334155',
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                margin: '2px 8px',
                '&.Mui-selected': {
                  backgroundColor: mode === 'light' 
                    ? 'rgba(37, 99, 235, 0.08)'
                    : 'rgba(96, 165, 250, 0.08)',
                  '&:hover': {
                    backgroundColor: mode === 'light' 
                      ? 'rgba(37, 99, 235, 0.12)'
                      : 'rgba(96, 165, 250, 0.12)',
                  },
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 6,
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 