// User types
export type UserRole = "office" | "customer";

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  officeId?: string; // Only for office users
}

// Office model
export interface Office {
  id: string;
  name: string;
  rating: number; // 0-5, decimal
  numberOfReviews: number;
  loginEmail: string;
  loginPassword: string;
  logoUrl?: string; // Office logo/image
}

// Domestic-labor worker model
export type WorkerSex = "male" | "female";
export type WorkerType = "driver" | "housekeeper" | "nanny" | "cook" | "gardener" | "elderly-care" | "babysitter";

export interface Worker {
  id: string;
  officeId: string;
  name: string;
  imageUrl: string;
  videoUrl: string; // intro video link
  cvUrl: string; // PDF link
  salaryPerMonth: number;
  sex: WorkerSex;
  age: number;
  originCountry: string;
  religion: string;
  type: WorkerType;
  experienceYears: number;
  hasWorkedInGulf: boolean;
  previousGulfCountries?: string; // used only if hasWorkedInGulf = true
  fullPackagePrice: number; // includes visa and all fees
  depositAmount: number; // عربون
}

// Reservation Request model
export type ReservationRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface ReservationRequest {
  id: string;
  customerId: string;
  workerId: string;
  officeId: string;
  requestedAt: string; // ISO date string
  status: ReservationRequestStatus;
  statusUpdatedAt?: string; // ISO date string (when approved/rejected/cancelled)
}

