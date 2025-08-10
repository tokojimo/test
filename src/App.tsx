import React from 'react';
import MycoExplorerApp from './MycoExplorerApp';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <MycoExplorerApp />
    </AppProvider>
  );
}

