export const API_ROOT = "http://localhost:5000";

export type LocationCategory = "General";

export interface CreateEventBody {
  user_id: string;
  title: string;
  description: string;
  earliest_date: string; // ISO 8601 date
  latest_date: string; // ISO 8601 date
  start_time_hour: number;
  start_time_minute: number;
  end_time_hour: number;
  end_time_minute: number;
  location_category: LocationCategory;
}

export interface GetVoteOptionsBody {
  times: {
    start: string;
    end: string;
    available: Person[];
  }[];
  locations: Location[];
}

export interface PopulateEventBody {
  user_id: string;
  location_votes: number[];
  time_votes: number[];
}

export interface EventTime {
  start: Date;
  end: Date;
  available: Person[];
}

export interface Person {
  profileColor: string;
  name: string;
}

export interface Location {
  name: string;
  yelpUrl: string;
  stars: number;
  distanceFromCurrentUser: number;
  previewImageUrl: string;
  address: string;
}

export interface GetAvailabilityResponseBody {
  earliest_date: string; // ISO 8601 date
  latest_date: string; // ISO 8601 date
  start_time_hour: number;
  start_time_minute: number;
  end_time_hour: number;
  end_time_minute: number;
  days: DayAvailability[] | null;
}

export interface DayAvailability {
  date: string;
  available_blocks: AvailabilityBlock[];
}

export interface AvailabilityBlock {
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
}

export interface PutAvailabilityRequestBody {
  days: DayAvailability[];
  location: {
    latitude: number;
    longitude: number;
  };
}
