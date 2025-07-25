import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HeroUIProvider } from '@heroui/react';
import { ClerkProvider } from '@clerk/clerk-react';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorInputBackground: '#f8fafc',
          colorInputText: '#1e293b',
          colorText: '#1e293b',
          colorTextSecondary: '#64748b',
          colorNeutral: '#e2e8f0',
        },
        elements: {
          card: 'shadow-xl border border-gray-200 bg-white',
          headerTitle: 'text-2xl font-bold text-gray-900',
          headerSubtitle: 'text-gray-600',
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          formFieldInput: 'bg-white border-2 border-gray-500 text-gray-900 focus:border-blue-500 rounded-lg px-4 py-3',
          formFieldLabel: 'text-gray-700 font-medium',
          footerActionLink: 'text-blue-600 hover:text-blue-700',
          dividerLine: 'bg-gray-200',
          dividerText: 'text-gray-500',
          socialButtonsIconButton: 'border-gray-500 hover:bg-gray-50',
          formFieldErrorText: 'text-red-600',
          identityPreviewText: 'text-gray-600',
          identityPreviewEditButton: 'text-blue-600 hover:text-blue-700',
        }
      }}
      signInFallbackRedirectUrl="/feed"
      signUpFallbackRedirectUrl="/feed"
    >
      <HeroUIProvider
        theme="dark"
      >
        <App />
      </HeroUIProvider>
    </ClerkProvider>
  </React.StrictMode>
);
