export interface ClassSchedule {
    id: string;
    language: string;
    classType: 'ongoing' | 'upcoming';
    timing: string;
    days: string;
    contactNumber: string;
    timezone: string;
    color: string;
    startDate?: string;
  }
  
  export interface ClassRegistration {
    id?: number;
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    country: string;
    language: string;
    classType: string;
    timing: string;
    days: string;
    contactNumber: string;
    additionalNotes?: string;
    status?: string;
    createdAt?: Date;
  }
  