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
  residentDistrict,
  residentSector,
  State,
  WorkingSector,
} from "@/types/user";
import { EmployedInfoState } from "@/types/company";
import { InputField } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";

const initialEmployedInfoState: EmployedInfoState = {
  companyName: "",
  companySector: "",
  companyPosition: "",
  companyWebsite: "",
  companyCountry: null,
  companyState: null,
  companyDistrictName: null,
  companySectorId: null,
};


function AddEmployedInfo({ canMove }: { canMove: any }) {
  const [formData, setFormData] = useState<EmployedInfoState>(
    initialEmployedInfoState
  );

  const [employedCountryId, setEmployedCountryId] = useState("");
  const [selectedDistrictEmployedName, setSelectedDistrictEmployedName] =
    useState("");

  const [employedStates, setEmployedStates] = useState<State[]>([]);
  const [countriesEmployed, setCountriesEmployed] = useState<Country[]>([]);
  const [sectorsEmployed, setSectorsEmployed] = useState<residentSector[]>([]);
  const [districtsEmployed, setDistrictsEmployed] = useState<
    residentDistrict[]
  >([]);
  const [workingSectorsEmployed, setWorkingSectorsEmployed] = useState<
    WorkingSector[]
  >([]);

  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: EmployedStatesData } = useStatesByCountryQuery(
    employedCountryId,
    {
      skip: !employedCountryId,
    }
  );
  const { data: SectorsDataEmployed } = useSectorsByDistrictQuery(
    selectedDistrictEmployedName,
    {
      skip: !selectedDistrictEmployedName,
    }
  );
  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  useEffect(() => {
    if (WorkingSectorsData?.data) {
      setWorkingSectorsEmployed(WorkingSectorsData.data);
    }
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (SectorsDataEmployed?.data) {
      setSectorsEmployed(SectorsDataEmployed.data);
    }
  }, [SectorsDataEmployed]);

  useEffect(() => {
    if (EmployedStatesData?.data) {
      setEmployedStates(EmployedStatesData.data);
    }
  }, [EmployedStatesData]);

  useEffect(() => {
    if (DistrictData?.data) {
      setDistrictsEmployed(DistrictData.data);
    }
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData?.data) {
      setCountriesEmployed(CountryData.data);
    }
  }, [CountryData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    const selectedCountry = countriesEmployed.find((c) => c.id === countryId);

    setFormData((prev) => ({
      ...prev,
      companyCountry: selectedCountry || null,
      companyState: null, 
      companyDistrictName: null,
      companySectorId: null,
    }));

    setEmployedCountryId(countryId);
    setSelectedDistrictEmployedName("");
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const selectedDistrict = districtsEmployed.find((d) => d.id === districtId);

    setFormData((prev) => ({
      ...prev,
      companyDistrictName: selectedDistrict || null,
      companySectorId: null,
    }));

    setSelectedDistrictEmployedName(selectedDistrict?.name || "");
  };

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    const selectedState = employedStates.find((s) => s.id === stateId);

    setFormData((prev) => ({
      ...prev,
      companyState: selectedState || null,
    }));
  };

  const handleSectorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sectorId = e.target.value;
    const selectedSector = sectorsEmployed.find((s) => s.id === sectorId);

    setFormData((prev) => ({
      ...prev,
      companySectorId: selectedSector || null,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting Employed Info:", formData);
  };

  const isRwanda = formData.companyCountry?.id === "RW";

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
        🏢 Employed Organization Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <InputField
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Name of company you work for"
        />

        {/* Working Sector */}
        <SelectField
          label="Working Sector"
          name="companySector"
          value={formData.companySector}
          onChange={handleChange}
        >
          {workingSectorsEmployed.map((sector: WorkingSector) => (
            <option key={sector?.id} value={sector?.id}>
              {sector?.name}
            </option>
          ))}
        </SelectField>

        {/* Your Position */}
        <InputField
          label="Your Position"
          name="companyPosition"
          value={formData.companyPosition}
          onChange={handleChange}
          placeholder="e.g.: Consultant, Executive, etc."
        />

        {/* Website */}
        <InputField
          label="Website"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          placeholder="https://example.com"
        />

        {/* Country */}
        <SelectField
          label="Country"
          name="companyCountry"
          value={formData.companyCountry?.id || null}
          onChange={handleCountryChange}
        >
          {countriesEmployed.map((country: Country) => (
            <option key={country?.id} value={country?.id}>
              {country?.name}
            </option>
          ))}
        </SelectField>

        {/* State (Conditional for non-Rwanda) */}
        {formData.companyCountry && !isRwanda && (
          <SelectField
            label="State/Province"
            name="companyState"
            value={formData.companyState?.id || null}
            onChange={handleStateChange}
          >
            {employedStates.map((state: State) => (
              <option key={state?.id} value={state?.id}>
                {state?.name}
              </option>
            ))}
          </SelectField>
        )}

        {/* District (Conditional for Rwanda) */}
        {formData.companyCountry && isRwanda && (
          <SelectField
            label="District (Rwanda)"
            name="companyDistrictName"
            value={formData.companyDistrictName?.id || null}
            onChange={handleDistrictChange}
          >
            {districtsEmployed.map((district: residentDistrict) => (
              <option key={district?.id} value={district?.id}>
                {district?.name}
              </option>
            ))}
          </SelectField>
        )}

        {formData.companyCountry &&
          isRwanda &&
          formData.companyDistrictName && (
            <SelectField
              label="Sector (Rwanda)"
              name="companySectorId"
              value={formData.companySectorId?.id || null}
              onChange={handleSectorChange}
            >
              {sectorsEmployed.map((sector: residentSector) => (
                <option key={sector?.id} value={sector?.id}>
                  {sector?.name}
                </option>
              ))}
            </SelectField>
          )}
      </div>

      <div className="pt-4 border-t mt-6">
        <button
          onClick={handleSubmit}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {canMove ? "Save & Continue" : "Save Details"}
        </button>
      </div>
    </div>
  );
}

export default AddEmployedInfo;
