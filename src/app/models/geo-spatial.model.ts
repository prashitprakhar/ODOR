export interface IGeoSpatialDetails {
  userId?: string;
  userType?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address?: string;
}
