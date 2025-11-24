"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Country,
  Organization,
  ResidentDistrict,
  ResidentSector,
  State,
  WorkingSector,
} from "@/types/user";
import { EmployedInfoState } from "@/types/company";
import { InputField } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";

const ImageUploadField = ({
  label,
  onChange,
}: {
  label: string;
  onChange: (file: File | null) => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onChange(file);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        <div
          className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50"
          style={{ minWidth: "6rem" }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Company Logo Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs text-center p-1">
              Upload Logo (PNG/JPG)
            </span>
          )}
        </div>
        <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary transition duration-150">
          Choose File
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(null);
              onChange(null);
            }}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

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

function AddEmployedInfo({
  organizations,
  countries,
  districts,
  onSuccess,
  onError,
  onSkip,
  newId,
}: {
  organizations: Organization[];
  districts: ResidentDistrict[];
  countries: Country[];
  onSuccess: () => void;
  onError: () => void;
  onSkip: () => void;
  newId: string;
}) {
  const [formData, setFormData] = useState<EmployedInfoState>(
    initialEmployedInfoState
  );
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [newOrg, setNewOrg] = useState<string | number>("");

  const [employedCountryId, setEmployedCountryId] = useState("");
  const [selectedDistrictEmployedName, setSelectedDistrictEmployedName] =
    useState("");

  const [employedStates, setEmployedStates] = useState<State[]>([]);
  const [sectorsEmployed, setSectorsEmployed] = useState<ResidentSector[]>([]);

  const [workingSectorsEmployed, setWorkingSectorsEmployed] = useState<
    WorkingSector[]
  >([]);

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
    const selectedCountry = countries.find((c) => c.id === countryId);

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
    const selectedDistrict = districts.find((d) => d.id === districtId);

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

  const handleNewOrgSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewOrg(value);

    if (value !== "new") {
      const existingOrg = organizations.find((org) => org.id === value);
      console.log("Existing organization selected:", existingOrg);
    }
  };

  const handleSectorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sectorId = e.target.value;
    const selectedSector = sectorsEmployed.find((s) => s.id === sectorId);

    setFormData((prev) => ({
      ...prev,
      companySectorId: selectedSector || null,
    }));
  };

  const handleLogoUpload = (file: File | null) => {
    setCompanyLogo(file);
  };

  const handleSubmit = async () => {
    console.log(
      "Submitting Employed Info:",
      formData,
      "Company Logo:",
      companyLogo
    );
  };

  const isRwanda = formData.companyCountry?.id === "RW";
  const isNewOrg = newOrg === "new";

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl space-y-8 border border-gray-100">
      <SelectField
        label="Choose your organization/initiative:"
        name="organizationSelect"
        value={newOrg}
        onChange={handleNewOrgSelect}
      >
        <option value="" disabled>
          Select an option
        </option>
        <option value="new">Add a new company/initiative</option>
        {organizations.map((item: Organization) => (
          <option key={item?.id} value={item.id}>
            {item?.name}
          </option>
        ))}
      </SelectField>

      {isNewOrg && (
        <div className="space-y-6 p-6 border-4 border-dashed border-blue-200 rounded-xl bg-blue-50 transition-all duration-300">
          <h3 className="text-xl font-bold text-primary border-b border-blue-200 pb-3">
            Enter Employment Info
          </h3>

          <ImageUploadField
            label="Company Logo/Picture"
            onChange={handleLogoUpload}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Name of company you work for"
            />

            <InputField
              label="Your Position"
              name="companyPosition"
              value={formData.companyPosition}
              onChange={handleChange}
              placeholder="e.g.: Consultant, Executive, etc."
            />

            <SelectField
              label="Working Sector"
              name="companySector"
              value={formData.companySector}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a sector
              </option>
              {workingSectorsEmployed.map((sector: WorkingSector) => (
                <option key={sector?.id} value={sector?.id}>
                  {sector?.name}
                </option>
              ))}
            </SelectField>

            <InputField
              label="Website"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="https://example.com"
            />

            <SelectField
              label="Company Location: Country"
              name="companyCountry"
              value={formData.companyCountry?.id || ""}
              onChange={handleCountryChange}
            >
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((country: Country) => (
                <option key={country?.id} value={country?.id}>
                  {country?.name}
                </option>
              ))}
            </SelectField>

            {formData.companyCountry && !isRwanda && (
              <SelectField
                label="State/Province"
                name="companyState"
                value={formData.companyState?.id || ""}
                onChange={handleStateChange}
              >
                <option value="" disabled>
                  Select a state/province
                </option>
                {employedStates.map((state: State) => (
                  <option key={state?.id} value={state?.id}>
                    {state?.name}
                  </option>
                ))}
              </SelectField>
            )}

            {formData.companyCountry && isRwanda && (
              <>
                <SelectField
                  label="District (Rwanda)"
                  name="companyDistrictName"
                  value={formData.companyDistrictName?.id || ""}
                  onChange={handleDistrictChange}
                >
                  <option value="" disabled>
                    Select a district
                  </option>
                  {districts.map((district: ResidentDistrict) => (
                    <option key={district?.id} value={district?.id}>
                      {district?.name}
                    </option>
                  ))}
                </SelectField>
                {formData.companyDistrictName && (
                  <SelectField
                    label="Sector (Rwanda)"
                    name="companySectorId"
                    value={formData.companySectorId?.id || ""}
                    onChange={handleSectorChange}
                  >
                    <option value="" disabled>
                      Select a sector
                    </option>
                    {sectorsEmployed.map((sector: ResidentSector) => (
                      <option key={sector?.id} value={sector?.id}>
                        {sector?.name}
                      </option>
                    ))}
                  </SelectField>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="pt-6 border-t mt-8">
        <button
          onClick={handleSubmit}
          disabled={!newOrg}
          className={`w-full md:w-auto px-8 py-3 font-bold rounded-lg shadow-lg transition duration-300 focus:outline-none focus:ring-4
            ${
              !newOrg
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/80 focus:ring-blue-300"
            }
          `}
        >
          {isNewOrg
            ? "Validate & Save Initiative Details"
            : "Use Selected Initiative"}
        </button>
      </div>
    </div>
  );
}

export default AddEmployedInfo;
