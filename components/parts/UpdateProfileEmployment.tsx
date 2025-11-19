import {
  TailwindInput,
  TailwindSelect,
} from "../DashboardPages/AddMember/AddPersonalInfo";

export const Employment = ({
  values,
  handleChange,
  handleSelectChange,
  errors,
  setSelectedDistrict,
  districts,
  sectors,
  workingSectors,
  countries,
  auth,
  states,
  setCountry,
}: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <TailwindInput
      label="Company Name"
      id="companyName"
      value={values.companyName}
      onChange={handleChange}
      placeholder="Who employs you?"
      disabled={auth}
      error={errors.companyName}
    />
    <TailwindSelect
      label="Working Sector"
      id="companySector"
      value={values.companySector}
      onChange={handleSelectChange}
      options={workingSectors}
      placeholder="Select a working sector"
      disabled={auth}
      error={errors.companySector}
    />
    <TailwindInput
      label="Your Position"
      id="companyPosition"
      value={values.companyPosition}
      onChange={handleChange}
      placeholder="What's your position?"
      disabled={auth}
      error={errors.companyPosition}
    />
    <TailwindInput
      label="Website"
      id="companyWebsite"
      value={values.companyWebsite}
      onChange={handleChange}
      placeholder="What's the company's website?"
      disabled={auth}
      error={errors.companyWebsite}
    />
    <TailwindSelect
      label="Country"
      id="companyCountry"
      value={values.companyCountry}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        handleSelectChange(e);
        const selectedCountry = JSON.parse(e.target.value);
        setCountry(selectedCountry?.id);
      }}
      options={countries}
      placeholder="Select a country"
      disabled={auth}
      error={errors.companyCountry}
    />
    {values.companyCountry && values.companyCountry.id !== "RW" && (
      <TailwindSelect
        label="State"
        id="companyState"
        value={values.companyState}
        onChange={handleSelectChange}
        options={states}
        placeholder="Select a state"
        disabled={auth}
        error={errors.companyState}
      />
    )}
    {values.companyCountry && values.companyCountry.id == "RW" && (
      <TailwindSelect
        label="District"
        id="companyDistrictName"
        value={values.companyDistrictName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleSelectChange(e);
          const selectedDistrict = JSON.parse(e.target.value);
          setSelectedDistrict(selectedDistrict.name);
        }}
        options={districts}
        placeholder="Select a district"
        disabled={auth}
        error={errors.companyDistrictName}
      />
    )}
    {values.companyCountry && values.companyCountry.id == "RW" && (
      <TailwindSelect
        label="Sector"
        id="companySectorId"
        value={values.companySectorId}
        onChange={handleSelectChange}
        options={sectors}
        placeholder="Select a sector"
        disabled={auth}
        error={errors.companySectorId}
      />
    )}
  </div>
);
