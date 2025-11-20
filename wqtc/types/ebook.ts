export interface EBook {
    id: number;
    title: string;
    filename: string;
    coverImage?: string | null;
    description?: string | null;
    pages?: number | null;
    createddate: Date;
    createdby: string;
  }