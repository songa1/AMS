import { Country, ResidentDistrict, ResidentSector, State } from "./user";

export interface EmployedInfoState {
  companyName: string;
  companySector: string;
  companyPosition: string;
  companyWebsite: string;
  companyCountry: Country | null;
  companyState: State | null;
  companyDistrictName: ResidentDistrict | null;
  companySectorId: ResidentSector | null;
}

export interface FoundedInfoState {
  initiativeName: string;
  mainSector: string; // ID of the working sector
  foundedPosition: string;
  foundedWebsite: string;
  foundedCountry: Country | null; // Store the full Country object
  foundedState: State | null; // Store the full State object
  foundedDistrictName: ResidentDistrict | null; // Store the full District object
  foundedSectorId: ResidentSector | null; // Store the full Sector object
}
