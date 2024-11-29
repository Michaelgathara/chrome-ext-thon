import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type OptionsContext = {
  collectData: boolean;
  newsSiteIntegration: boolean;
  domainList: string[];
};

type OptionsProvider = {
  state: OptionsContext;
  setState: React.Dispatch<React.SetStateAction<OptionsContext>>;
};

export const OptionsContext = createContext<OptionsProvider>(
  {} as OptionsProvider
);

export const OptionsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OptionsContext>({
    collectData: false,
    newsSiteIntegration: false,
    domainList: [],
  });

  return (
    <OptionsContext.Provider value={{ state, setState }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptionsContext = () => {
  return useContext(OptionsContext);
};
