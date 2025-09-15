import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of a Program
interface Program {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the context shape
interface ProgramContextType {
  selectedProgramId: string | undefined;
  setSelectedProgramId: (id: string | undefined) => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<
    string | undefined
  >(undefined);

  return (
    <ProgramContext.Provider
      value={{ selectedProgramId, setSelectedProgramId }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

// Custom hook to use the ProgramContext
export const useProgram = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error("useProgram must be used within a ProgramProvider");
  }
  return context;
};
