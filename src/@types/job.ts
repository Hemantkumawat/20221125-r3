// ----------------------------------------------------------------------

export type PaymentType = 'paypal' | 'credit_card' | 'cash';

export type JobStatus = 'sale' | 'new' | '';

export type JobInventoryType = 'in_stock' | 'out_of_stock' | 'low_stock';

export type JobCategory = 'Accessories' | 'Apparel' | 'Shoes' | string;

export type JobGender = 'Men' | 'Women' | 'Kids' | string;


export type Job = {
  createdAt: Date;
  name: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  type_of_loss: string;
  living_space: string;
  no_of_furnace: number;
  schedule_date: Date;
  arrival_time: string;
  status: string;
  How_to_enter_property: string;
  is_emergency: boolean;
  is_dryer_vent_cleaning: boolean;
  is_PO_number: boolean;
  PO_number: string;
  is_rechout_to_owner: boolean;
  comments: string;
  air_duct_cleaning_quote: number;
  id: number | string;
};

export type JobState = {
  isLoading: boolean;
  error: Error | string | null;
  jobs: Job[];
  job: Job | null;
  sortBy: string | null;
  filters: {
    gender: string[];
    category: string;
    colors: string[];
    priceRange: string;
    rating: string;
  };
};

export type JobFilter = {
  gender: string[];
  category: string;
  colors: string[];
  priceRange: string;
  rating: string;
};
