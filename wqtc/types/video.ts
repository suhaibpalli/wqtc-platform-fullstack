export interface Video {
    id: number;
    title: string;
    youTube_link: string;
    surah_no: number;
    surah_name: string | null;
    starting_ayah: number;
    ending_ayah: number | null;
    time_start_ayah: string | null;
    created_date: Date;
    created_by: string;
    keywords: string | null;
  }
  
  export interface Surah {
    id: number;
    name: string;
    verses: number;
  }
  
  export interface LibraryFilters {
    surah?: number;
    versus?: number;
    search?: string;
    sort?: 'ASC' | 'DESC';
    limit?: number;
  }
  