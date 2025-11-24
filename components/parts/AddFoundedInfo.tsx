"use client";

import {
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Country,
  Organization,
  ResidentDistrict,
  ResidentSector,
  State,
  WorkingSector,
} from "@/types/user";
import { useOrganizationsQuery } from "@/lib/features/orgSlice";
import { FoundedInfoState } from "@/types/company";
import { SelectField } from "@/components/ui/select";
import { InputField } from "@/components/ui/input";

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
        <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition duration-150">
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

function AddFoundedInfo({
  districts,
  countries,
  organizations,
  onSuccess,
  onError,
  onSkip,
  newId
}: {
  districts: ResidentDistrict[];
  countries: Country[];
  organizations: Organization[];
  onSuccess: () => void;
  onError: () => void;
  onSkip: () => void;
  newId: string;
}) {
  const [formData, setFormData] = useState<FoundedInfoState>(
    initialFoundedInfoState
  );
  const [newOrg, setNewOrg] = useState<string | number>("");
  const [organizationLogo, setOrganizationLogo] = useState<File | null>(null);

  const [foundedCountryId, setFoundedCountryId] = useState("");
  const [selectedDistrictFoundedName, setSelectedDistrictFoundedName] =
    useState("");

  const [foundedStates, setFoundedStates] = useState<State[]>([]);
  const [sectorsFounded, setSectorsFounded] = useState<ResidentSector[]>([]);

  const [workingSectors, setWorkingSectors] = useState<WorkingSector[]>([]);

  const { data: FoundedStatesData } = useStatesByCountryQuery(
    foundedCountryId,
    {
      skip: !foundedCountryId,
    }
  );

  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFoundedName,
    {
      skip: !selectedDistrictFoundedName,
    }
  );
  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  useEffect(() => {
    if (WorkingSectorsData?.data) setWorkingSectors(WorkingSectorsData.data);
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (FoundedStatesData?.data) setFoundedStates(FoundedStatesData.data);
  }, [FoundedStatesData]);

  useEffect(() => {
    if (SectorsDataFounded?.data) setSectorsFounded(SectorsDataFounded.data);
  }, [SectorsDataFounded]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name as keyof FoundedInfoState]: value,
    }));
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    const selectedCountry = countries.find((c) => c.id === countryId);

    setFormData((prev) => ({
      ...prev,
      foundedCountry: selectedCountry || null,
      foundedState: null,
      foundedDistrictName: null,
      foundedSectorId: null,
    }));

    setFoundedCountryId(countryId);
    setSelectedDistrictFoundedName("");
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const selectedDistrict = districts.find((d) => d.id === districtId);

    setFormData((prev) => ({
      ...prev,
      foundedDistrictName: selectedDistrict || null,
      foundedSectorId: null,
    }));

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

  const handleNewOrgSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewOrg(value);

    if (value !== "new") {
      const existingOrg = organizations.find((org) => org.id === value);
      console.log("Existing organization selected:", existingOrg);
    }
  };

  const handleLogoUpload = (file: File | null) => {
    setOrganizationLogo(file);
  };

  const handleSubmit = async () => {
    console.log(
      "Submitting Founded Info. Selected Organization Option:",
      newOrg,
      "Organization Logo:",
      organizationLogo
    );
    if (newOrg === "new") {
      console.log("New Organization Details:", formData);
    } else {
      console.log("Existing Organization ID:", newOrg);
    }
  };

  const isRwanda = formData.foundedCountry?.id === "RW";
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
        <option value="new">Add a new employment company</option>
        {organizations.map((item: Organization) => (
          <option key={item?.id} value={item.id}>
            {item?.name}
          </option>
        ))}
      </SelectField>

      {isNewOrg && (
        <div className="space-y-6 p-6 border-4 border-dashed border-blue-200 rounded-xl bg-blue-50 transition-all duration-300">
          <h3 className="text-xl font-bold text-primary border-b border-blue-200 pb-3">
            Enter New Initiative Details
          </h3>

          <ImageUploadField
            label="Initiative Logo/Picture"
            onChange={handleLogoUpload}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Your Initiative Name"
              name="initiativeName"
              value={formData.initiativeName}
              onChange={handleChange}
              placeholder="Name of your initiative"
            />

            <InputField
              label="Your Position"
              name="foundedPosition"
              value={formData.foundedPosition}
              onChange={handleChange}
              placeholder="e.g.: The Founder, Managing Director, etc"
            />

            <SelectField
              label="Main Sector"
              name="mainSector"
              value={formData.mainSector}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a sector
              </option>
              {workingSectors.map((sector: WorkingSector) => (
                <option key={sector?.id} value={sector?.id}>
                  {sector?.name}
                </option>
              ))}
            </SelectField>

            <InputField
              label="Website"
              name="foundedWebsite"
              value={formData.foundedWebsite}
              onChange={handleChange}
              placeholder="https://example.com"
            />

            <SelectField
              label="Initiative Location: Country"
              name="foundedCountry"
              value={formData.foundedCountry?.id || ""}
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

            {formData.foundedCountry && !isRwanda && (
              <SelectField
                label="State/Province"
                name="foundedState"
                value={formData.foundedState?.id || ""}
                onChange={handleStateChange}
              >
                <option value="" disabled>
                  Select a state/province
                </option>
                {foundedStates.map((state: State) => (
                  <option key={state?.id} value={state?.id}>
                    {state?.name}
                  </option>
                ))}
              </SelectField>
            )}

            {formData.foundedCountry && isRwanda && (
              <>
                <SelectField
                  label="District (Rwanda)"
                  name="foundedDistrictName"
                  value={formData.foundedDistrictName?.id || ""}
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

                {formData.foundedDistrictName && (
                  <SelectField
                    label="Sector (Rwanda)"
                    name="foundedSectorId"
                    value={formData.foundedSectorId?.id || ""}
                    onChange={handleSectorChange}
                  >
                    <option value="" disabled>
                      Select a sector
                    </option>
                    {sectorsFounded.map((sector: ResidentSector) => (
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

export default AddFoundedInfo;
