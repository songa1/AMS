import { Country, residentDistrict, residentSector, State } from "./user";

export interface EmployedInfoState {
  companyName: string;
  companySector: string;
  companyPosition: string;
  companyWebsite: string;
  companyCountry: Country | null;
  companyState: State | null;
  companyDistrictName: residentDistrict | null;
  companySectorId: residentSector | null;
}

export interface FoundedInfoState {
  initiativeName: string;
  mainSector: string; // ID of the working sector
  foundedPosition: string;
  foundedWebsite: string;
  foundedCountry: Country | null; // Store the full Country object
  foundedState: State | null; // Store the full State object
  foundedDistrictName: residentDistrict | null; // Store the full District object
  foundedSectorId: residentSector | null; // Store the full Sector object
}
