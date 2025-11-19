import React from "react";
import {
  TailwindInput,
  TailwindSelect,
} from "../DashboardPages/AddMember/AddPersonalInfo";

export const Founded = ({
  values,
  handleChange,
  handleSelectChange,
  errors,
  setSelectedDistrict,
  districts,
  sectors,
  workingSectors,
  countries,
  usr,
  auth,
  states,
  setCountry,
}: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TailwindInput
      label="Your Initiative Name"
      id="initiativeName"
      value={values.initiativeName}
      onChange={handleChange}
      placeholder="What's your initiative?"
      disabled={auth}
      error={errors.initiativeName}
    />
    <TailwindSelect
      label="Working Sector"
      id="mainSector"
      value={values.mainSector}
      onChange={handleSelectChange}
      options={workingSectors}
      placeholder="Select a working sector"
      disabled={auth}
      error={errors.mainSector}
    />
    <TailwindInput
      label="Your Position"
      id="foundedPosition"
      value={values.foundedPosition}
      onChange={handleChange}
      placeholder="What's your position?"
      disabled={auth}
      error={errors.foundedPosition}
    />
    <TailwindInput
      label="Website"
      id="foundedWebsite"
      value={values.foundedWebsite}
      onChange={handleChange}
      placeholder="What's your initiative's website?"
      disabled={auth}
      error={errors.foundedWebsite}
    />
    <TailwindSelect
      label="Country"
      id="foundedCountry"
      value={values.foundedCountry}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        handleSelectChange(e);
        const selectedCountry = JSON.parse(e.target.value);
        setCountry(selectedCountry?.id);
      }}
      options={countries}
      placeholder="Select a country"
      disabled={auth}
      error={errors.foundedCountry}
    />
    {values.foundedCountry && values.foundedCountry.id !== "RW" && (
      <TailwindSelect
        label="State"
        id="foundedState"
        value={values.foundedState}
        onChange={handleSelectChange}
        options={states}
        placeholder="Select a state"
        disabled={auth}
        error={errors.foundedState}
      />
    )}
    {values.foundedCountry && values.foundedCountry.id == "RW" && (
      <TailwindSelect
        label="District"
        id="foundedDistrictName"
        value={values.foundedDistrictName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleSelectChange(e);
          const selectedDistrict = JSON.parse(e.target.value);
          setSelectedDistrict(selectedDistrict.name);
        }}
        options={districts}
        placeholder="Select a district"
        disabled={auth}
        error={errors.foundedDistrictName}
      />
    )}
    {values.foundedCountry && values.foundedCountry.id == "RW" && (
      <TailwindSelect
        label="Sector"
        id="foundedSectorId"
        value={values.foundedSectorId}
        onChange={handleSelectChange}
        options={sectors}
        placeholder="Select a sector"
        disabled={auth}
        error={errors.foundedSectorId}
      />
    )}
  </div>
);
