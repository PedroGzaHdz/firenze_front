import React, { createContext, useContext, ReactNode } from 'react';

interface GlobalContextProps {
  flowStep: number;
  setFlowStep: (value: number) => void;
}

// Crear el contexto
const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

// Hook para usar el contexto
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};

// Proveedor del contexto global
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [flowStep, setFlowStep] = React.useState<number>(0);

  return (
    <GlobalContext.Provider
      value={{
        flowStep,
        setFlowStep,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
