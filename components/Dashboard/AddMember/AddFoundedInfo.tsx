"use client";

import {
  useCountriesQuery,
  useDistrictsQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Country,
  organization,
  residentDistrict,
  residentSector,
  State,
  WorkingSector,
} from "@/types/user";
import { useOrganizationsQuery } from "@/lib/features/orgSlice";
import { FoundedInfoState } from "@/types/company";
import { SelectField } from "@/components/ui/select";
import { InputField } from "@/components/ui/input";

const initialFoundedInfoState: FoundedInfoState = {
  initiativeName: "",
  mainSector: "",
  foundedPosition: "",
  foundedWebsite: "",
  foundedCountry: null,
  foundedState: null,
  foundedDistrictName: null,
  foundedSectorId: null,
};




function AddFoundedInfo({ canMove }: { canMove: (value: boolean) => void }) {
  // 1. Local state for form values
  const [formData, setFormData] = useState<FoundedInfoState>(
    initialFoundedInfoState
  );
  // State for the initial organization selection (new or existing ID)
  const [newOrg, setNewOrg] = useState<string | number>("");

  // 2. Local state for API dependencies/results
  const [foundedCountryId, setFoundedCountryId] = useState("");
  const [selectedDistrictFoundedName, setSelectedDistrictFoundedName] =
    useState("");

  // API Data States
  const [foundedStates, setFoundedStates] = useState<State[]>([]);
  const [countriesFounded, setCountriesFounded] = useState<Country[]>([]);
  const [sectorsFounded, setSectorsFounded] = useState<residentSector[]>([]);
  const [districtsFounded, setDistrictsFounded] = useState<residentDistrict[]>(
    []
  );
  const [organizations, setOrganizations] = useState<organization[]>([]);
  const [workingSectors, setWorkingSectors] = useState<WorkingSector[]>([]);

  // 3. RTK Query Hooks
  const { data: CountryData } = useCountriesQuery("");
  const { data: FoundedStatesData } = useStatesByCountryQuery(
    foundedCountryId,
    {
      skip: !foundedCountryId,
    }
  );
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: OrganizationsData } = useOrganizationsQuery("");

  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFoundedName,
    {
      skip: !selectedDistrictFoundedName,
    }
  );
  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  // 4. useEffects to process API data
  useEffect(() => {
    if (WorkingSectorsData?.data) setWorkingSectors(WorkingSectorsData.data);
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (OrganizationsData?.data) setOrganizations(OrganizationsData.data);
  }, [OrganizationsData]);

  useEffect(() => {
    if (FoundedStatesData?.data) setFoundedStates(FoundedStatesData.data);
  }, [FoundedStatesData]);

  useEffect(() => {
    if (SectorsDataFounded?.data) setSectorsFounded(SectorsDataFounded.data);
  }, [SectorsDataFounded]);

  useEffect(() => {
    if (DistrictData?.data) setDistrictsFounded(DistrictData.data);
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData?.data) setCountriesFounded(CountryData.data);
  }, [CountryData]);

  // 5. useEffect to control 'canMove' based on newOrg selection
  useEffect(() => {
    // If a new organization is selected (either 'new' or an existing ID), enable movement.
    canMove(!!newOrg);
  }, [newOrg, canMove]);

  // 6. General Form Change Handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle string/basic value changes
    setFormData((prev) => ({
      ...prev,
      [name as keyof FoundedInfoState]: value,
    }));
  };

  // 7. Specific Handlers for Complex/Dependent fields (Country, District, Sector)
  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    const selectedCountry = countriesFounded.find((c) => c.id === countryId);

    // Update form data and reset dependent fields
    setFormData((prev) => ({
      ...prev,
      foundedCountry: selectedCountry || null,
      foundedState: null,
      foundedDistrictName: null,
      foundedSectorId: null,
    }));

    // Update the state for the API dependency
    setFoundedCountryId(countryId);
    setSelectedDistrictFoundedName("");
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const selectedDistrict = districtsFounded.find((d) => d.id === districtId);

    // Update form data and reset dependent fields
    setFormData((prev) => ({
      ...prev,
      foundedDistrictName: selectedDistrict || null,
      foundedSectorId: null,
    }));

    // Update the state for the API dependency
    setSelectedDistrictFoundedName(selectedDistrict?.name || "");
  };

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    const selectedState = foundedStates.find((s) => s.id === stateId);

    setFormData((prev) => ({
      ...prev,
      foundedState: selectedState || null,
    }));
  };

  const handleSectorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sectorId = e.target.value;
    const selectedSector = sectorsFounded.find((s) => s.id === sectorId);

    setFormData((prev) => ({
      ...prev,
      foundedSectorId: selectedSector || null,
    }));
  };

  // 8. Handle initial organization select
  const handleNewOrgSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewOrg(value);

    // If a pre-existing org is selected, you might want to load its details into formData here
    if (value !== "new") {
      const existingOrg = organizations.find((org) => org.id === value);
      console.log("Existing organization selected:", existingOrg);
      // Logic to populate formData from existingOrg (if needed)
    }
  };

  // 9. Placeholder Submit Handler
  const handleSubmit = async () => {
    console.log(
      "Submitting Founded Info. Selected Organization Option:",
      newOrg
    );
    if (newOrg === "new") {
      console.log("New Organization Details:", formData);
    } else {
      console.log("Existing Organization ID:", newOrg);
    }
    // ... logic to call your API function using 'formData' or 'newOrg' ID ...
  };

  // Extract variables for cleaner JSX
  const isRwanda = formData.foundedCountry?.id === "RW";
  const isNewOrg = newOrg === "new";

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
        🚀 Founded Initiative Details
      </h2>

      {/* Organization Selection Dropdown */}
      <SelectField
        label="Choose your organization:"
        name="organizationSelect"
        value={newOrg}
        onChange={handleNewOrgSelect}
      >
        <option value="new">Add a new company/initiative</option>
        {organizations.map((item: organization) => (
          <option key={item?.id} value={item.id}>
            {item?.name}
          </option>
        ))}
      </SelectField>

      {/* Conditional Form Fields for New Organization */}
      {isNewOrg && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <p className="md:col-span-2 text-md font-semibold text-purple-700">
            Enter New Initiative Details
          </p>

          {/* Initiative Name */}
          <InputField
            label="Your Initiative Name"
            name="initiativeName"
            value={formData.initiativeName}
            onChange={handleChange}
            placeholder="Name of your initiative"
          />

          {/* Working Sector */}
          <SelectField
            label="Working Sector"
            name="mainSector"
            value={formData.mainSector}
            onChange={handleChange}
          >
            {workingSectors.map((sector: WorkingSector) => (
              <option key={sector?.id} value={sector?.id}>
                {sector?.name}
              </option>
            ))}
          </SelectField>

          {/* Your Position */}
          <InputField
            label="Your Position"
            name="foundedPosition"
            value={formData.foundedPosition}
            onChange={handleChange}
            placeholder="e.g.: The Founder, Managing Director, etc"
          />

          {/* Website */}
          <InputField
            label="Website"
            name="foundedWebsite"
            value={formData.foundedWebsite}
            onChange={handleChange}
            placeholder="https://example.com"
          />

          {/* Country */}
          <SelectField
            label="Country"
            name="foundedCountry"
            value={formData.foundedCountry?.id || null}
            onChange={handleCountryChange}
          >
            {countriesFounded.map((country: Country) => (
              <option key={country?.id} value={country?.id}>
                {country?.name}
              </option>
            ))}
          </SelectField>

          {/* State (Conditional for non-Rwanda) */}
          {formData.foundedCountry && !isRwanda && (
            <SelectField
              label="State/Province"
              name="foundedState"
              value={formData.foundedState?.id || null}
              onChange={handleStateChange}
            >
              {foundedStates.map((state: State) => (
                <option key={state?.id} value={state?.id}>
                  {state?.name}
                </option>
              ))}
            </SelectField>
          )}

          {/* District (Conditional for Rwanda) */}
          {formData.foundedCountry && isRwanda && (
            <SelectField
              label="District (Rwanda)"
              name="foundedDistrictName"
              value={formData.foundedDistrictName?.id || null}
              onChange={handleDistrictChange}
            >
              {districtsFounded.map((district: residentDistrict) => (
                <option key={district?.id} value={district?.id}>
                  {district?.name}
                </option>
              ))}
            </SelectField>
          )}

          {/* Sector (Conditional for Rwanda) - Only visible if a District is selected */}
          {formData.foundedCountry &&
            isRwanda &&
            formData.foundedDistrictName && (
              <SelectField
                label="Sector (Rwanda)"
                name="foundedSectorId"
                value={formData.foundedSectorId?.id || null}
                onChange={handleSectorChange}
              >
                {sectorsFounded.map((sector: residentSector) => (
                  <option key={sector?.id} value={sector?.id}>
                    {sector?.name}
                  </option>
                ))}
              </SelectField>
            )}
        </div>
      )}

      {/* Action Button (Optional - based on where you trigger saving this data) */}
      <div className="pt-4 border-t mt-6">
        <button
          onClick={handleSubmit}
          disabled={!newOrg} // Disable if no selection has been made
          className={`w-full md:w-auto px-6 py-3 font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${!newOrg ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"}
          `}
        >
          {isNewOrg ? "Validate & Save Initiative" : "Use Selected Initiative"}
        </button>
      </div>
    </div>
  );
}

export default AddFoundedInfo;
