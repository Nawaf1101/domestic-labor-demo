import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User, Reservation, Worker } from "../types";
import { allUsers } from "../data/users";
import { workers as initialWorkers } from "../data/workers";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, "id">) => void;
  workers: Worker[];
  addWorker: (worker: Omit<Worker, "id">) => void;
  updateWorker: (id: string, worker: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  importWorkers: (newWorkers: Omit<Worker, "id">[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);

  const login = (email: string, password: string): boolean => {
    const user = allUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addReservation = (reservation: Omit<Reservation, "id">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `reservation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setReservations([...reservations, newReservation]);
  };

  const addWorker = (worker: Omit<Worker, "id">) => {
    const newWorker: Worker = {
      ...worker,
      id: `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setWorkers([...workers, newWorker]);
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setWorkers(
      workers.map((worker) => (worker.id === id ? { ...worker, ...updates } : worker))
    );
  };

  const deleteWorker = (id: string) => {
    setWorkers(workers.filter((worker) => worker.id !== id));
  };

  const importWorkers = (newWorkers: Omit<Worker, "id">[]) => {
    const workersWithIds: Worker[] = newWorkers.map((worker) => ({
      ...worker,
      id: `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    setWorkers([...workers, ...workersWithIds]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        reservations,
        addReservation,
        workers,
        addWorker,
        updateWorker,
        deleteWorker,
        importWorkers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

