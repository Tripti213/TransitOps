export type LicenseCategory = "LMV" | "HMV" | "HTV";
export type DriverStatus = "Available" | "On Trip" | "Off Duty" | "Suspended";

export interface Driver {
  _id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
  user?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverPayload {
  name: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore?: number;
  email: string;
  password: string;
}

export interface UpdateDriverPayload {
  name?: string;
  licenseNumber?: string;
  licenseCategory?: LicenseCategory;
  licenseExpiryDate?: string;
  contactNumber?: string;
  safetyScore?: number;
}
