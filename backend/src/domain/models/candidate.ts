export type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedInUrl: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};
