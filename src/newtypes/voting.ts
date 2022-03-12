export interface EventTime {
  start: Date;
  end: Date;
  available: Person[];
  bestLocations: Location[];
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
