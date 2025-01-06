"use client";

import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Dropdown } from "primereact/dropdown";
import {
  useCohortsQuery,
  useCountriesQuery,
  useDistrictsQuery,
  useGenderQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useStatesQuery,
  useTracksQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import {
  useAddUserMutation,
  useUploadPictureMutation,
} from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";
import { Toast } from "primereact/toast";
import InputError from "../Other/InputError";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import TopTitle from "../Other/TopTitle";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import {
  cohort,
  Country,
  gender,
  residentDistrict,
  residentSector,
  State,
  Track,
} from "@/types/user";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Personal = ({
  formik,
  sectors,
  cohorts,
  districts,
  genders,
  setSelectedDistrict,
  tracks,
  countries,
  states,
  setCountry,
}: any) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="field">
        <label>First Name:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="First Name"
          value={formik.values.firstName}
          onChange={(e) => formik.setFieldValue("firstName", e.target.value)}
          required
        />
        {formik.errors.firstName && formik.touched.firstName && (
          <InputError error={formik.errors.firstName} />
        )}
      </div>
      <div className="field">
        <label>Middle Name:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Middle Name"
          value={formik.values.middleName}
          onChange={(e) => formik.setFieldValue("middleName", e.target.value)}
          required
        />
        {formik.errors.middleName && formik.touched.middleName && (
          <InputError error={formik.errors.middleName} />
        )}
      </div>
      <div className="field">
        <label>Last Name:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Last Name"
          value={formik.values.lastName}
          onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
          required
        />
        {formik.errors.lastName && formik.touched.lastName && (
          <InputError error={formik.errors.lastName} />
        )}
      </div>
      <div className="field">
        <label>Email:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Email"
          value={formik.values.email}
          onChange={(e) => formik.setFieldValue("email", e.target.value)}
          required
        />
        {formik.errors.email && formik.touched.email && (
          <InputError error={formik.errors.email} />
        )}
      </div>
      <div className="field">
        <label>Phone Number:</label>
        <PhoneInputWithCountrySelect
          international
          countryCallingCodeEditable={false}
          defaultCountry="RW"
          className="w-full p-3 rounded border border-main p-3 bg-gray-100"
          value={formik.values.phoneNumber}
          onChange={(e: any) => {
            formik.setFieldValue("phoneNumber", e);
          }}
          placeholder="Enter phone number"
        />
        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
          <InputError error={formik.errors.phoneNumber} />
        )}
      </div>
      <div className="field">
        <label>WhatsApp Number:</label>
        <PhoneInputWithCountrySelect
          international
          countryCallingCodeEditable={false}
          defaultCountry="RW"
          className="w-full p-3 rounded border border-main p-3 bg-gray-100"
          value={formik.values.whatsAppNumber}
          onChange={(e: any) => {
            formik.setFieldValue("whatsAppNumber", e);
          }}
          placeholder="Enter WhatsApp number"
        />
        {formik.errors.whatsAppNumber && formik.touched.whatsAppNumber && (
          <InputError error={formik.errors.whatsAppNumber} />
        )}
      </div>
      <div className="field">
        <label>Gender:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Select a gender"
          value={formik.values.gender}
          options={genders}
          onChange={(e) => formik.setFieldValue("gender", e.target.value)}
          optionLabel="name"
          required
        />
        {formik.errors.gender && formik.touched.gender && (
          <InputError error={formik.errors.gender} />
        )}
      </div>
      <div className="field">
        <label>Resident Country:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Select a country"
          value={formik.values.residentCountryId}
          options={countries}
          onChange={(e) => {
            formik.setFieldValue("residentCountryId", e.target.value);
            setCountry(e.target.value.id);
          }}
          optionLabel="name"
          required
        />
        {formik.errors.residentCountryId &&
          formik.touched.residentCountryId && (
            <InputError error={formik.errors.residentCountryId} />
          )}
      </div>
      {formik.values.residentCountryId.id !== "RW" && (
        <div className="field">
          <label>State:</label>
          <Dropdown
            variant="filled"
            className="w-full p-3"
            placeholder="Select a state"
            value={formik?.values?.state}
            options={states}
            onChange={(e) => {
              formik.setFieldValue("state", e.value);
            }}
            optionLabel="name"
            required
          />
          {formik.errors.state && formik.touched.state && (
            <InputError error={formik.errors.state} />
          )}
        </div>
      )}
      {formik.values.residentCountryId.id === "RW" && (
        <div className="field">
          <label>District:</label>
          <Dropdown
            variant="filled"
            className="w-full p-3"
            placeholder="Select a district"
            value={formik?.values?.districtName}
            options={districts}
            onChange={(e) => {
              setSelectedDistrict(e.value.name);
              formik.setFieldValue("districtName", e.value);
              formik.setFieldValue("sectorId", "");
            }}
            optionLabel="name"
            required
          />
          {formik.errors.districtName && formik.touched.districtName && (
            <InputError error={formik.errors.districtName} />
          )}
        </div>
      )}
      {formik.values.residentCountryId.id === "RW" && (
        <div className="field">
          <label>Sector:</label>
          <Dropdown
            variant="filled"
            className="w-full p-3"
            type="text"
            placeholder="Select a sector"
            value={formik.values.sectorId}
            options={sectors}
            onChange={(e) => {
              formik.setFieldValue("sectorId", e.target.value);
            }}
            optionLabel="name"
            required
          />
          {formik.errors.sectorId && formik.touched.sectorId && (
            <InputError error={formik.errors.sectorId} />
          )}
        </div>
      )}
      <div className="field">
        <label>Cohort:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Select a cohort"
          value={formik.values.cohortId}
          options={cohorts}
          onChange={(e) => formik.setFieldValue("cohortId", e.target.value)}
          optionLabel="name"
          required
        />
        {formik.errors.cohortId && formik.touched.cohortId && (
          <InputError error={formik.errors.cohortId} />
        )}
      </div>

      <div className="field">
        <label>Track:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Select a track"
          value={formik.values.track}
          options={tracks}
          onChange={(e) => formik.setFieldValue("track", e.target.value)}
          optionLabel="name"
          required
        />
        {formik.errors.track && formik.touched.track && (
          <InputError error={formik.errors.track} />
        )}
      </div>
      <div className="field">
        <label>Nearest Landmark:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="What's the popular place near you?"
          value={formik.values.nearlestLandmark}
          onChange={(e) =>
            formik.setFieldValue("nearlestLandmark", e.target.value)
          }
          required
        />
        {formik.errors.nearlestLandmark && formik.touched.nearlestLandmark && (
          <InputError error={formik.errors.nearestLandmark} />
        )}
      </div>
      <div className="field">
        <label>LinkedIn Account:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="https://linkedin.com/in/..."
          value={formik.values.linkedin}
          onChange={(e) => formik.setFieldValue("linkedin", e.target.value)}
        />
        {formik.errors.linkedin && formik.touched.linkedin && (
          <InputError error={formik.errors.linkedin} />
        )}
      </div>
      <div className="field">
        <label>X (Twitter) Account:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="https://x.com/..."
          value={formik.values.twitter}
          onChange={(e) => formik.setFieldValue("twitter", e.target.value)}
        />
        {formik.errors.twitter && formik.touched.twitter && (
          <InputError error={formik.errors.twitter} />
        )}
      </div>
      <div className="field">
        <label>Instagram Account:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="https://instagram.com/..."
          value={formik.values.instagram}
          onChange={(e) => formik.setFieldValue("instagram", e.target.value)}
        />
        {formik.errors.instgram && formik.touched.instagram && (
          <InputError error={formik.errors.instagram} />
        )}
      </div>
      <div className="field">
        <label>Facebook Account:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="https://facebook.com/..."
          value={formik.values.facebook}
          onChange={(e) => formik.setFieldValue("facebook", e.target.value)}
        />
        {formik.errors.facebook && formik.touched.facebook && (
          <InputError error={formik.errors.facebook} />
        )}
      </div>
    </div>
  );
};

const Founded = ({
  formik,
  setSelectedDistrict,
  districts,
  sectors,
  workingSectors,
  countries,
  states,
  setCountry,
}: any) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="field">
      <label>Your Initiative Name:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="What's your initiative?"
        value={formik.values.initiativeName}
        onChange={(e) => formik.setFieldValue("initiativeName", e.target.value)}
        required
      />
    </div>
    <div className="field">
      <label>Working Sector:</label>
      <Dropdown
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="Select a working sector"
        value={formik.values.mainSector}
        options={workingSectors}
        onChange={(e) => formik.setFieldValue("mainSector", e.target.value)}
        optionLabel="name"
        required
      />
    </div>
    <div className="field">
      <label>Your Position:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="What's your position?"
        value={formik.values.foundedPosition}
        onChange={(e) =>
          formik.setFieldValue("foundedPosition", e.target.value)
        }
        required
      />
    </div>
    <div className="field">
      <label>Website:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="What's your initiative's website?"
        value={formik.values.foundedWebsite}
        onChange={(e) => formik.setFieldValue("foundedWebsite", e.target.value)}
        required
      />
    </div>
    <div className="field">
      <label>Country:</label>
      <Dropdown
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="Select a country"
        value={formik.values.foundedCountry}
        options={countries}
        onChange={(e) => {
          formik.setFieldValue("foundedCountry", e.target.value);
          setCountry(e.target.value?.id);
        }}
        optionLabel="name"
        required
      />
    </div>
    {formik.values.foundedCountry &&
      formik.values.foundedCountry.id !== "RW" && (
        <div className="field">
          <label>State:</label>
          <Dropdown
            variant="filled"
            className="w-full p-3"
            placeholder="Select a state"
            value={formik?.values?.foundedState}
            options={states}
            onChange={(e) => {
              formik.setFieldValue("foundedState", e.value);
            }}
            optionLabel="name"
            required
          />
          {formik.errors.foundedState && formik.touched.foundedState && (
            <InputError error={formik.errors.foundedState} />
          )}
        </div>
      )}
    {formik.values.foundedCountry.id == "RW" && (
      <div className="field">
        <label>District:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          placeholder="Select a district"
          value={formik?.values?.foundedDistrictName}
          options={districts}
          onChange={(e) => {
            setSelectedDistrict(e.value.name);
            formik.setFieldValue("foundedDistrictName", e.value);
            formik.setFieldValue("foundedSectorId", "");
          }}
          optionLabel="name"
          required
        />
      </div>
    )}
    {formik.values.foundedCountry.id == "RW" && (
      <div className="field">
        <label>Sector:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Select a sector"
          value={formik.values.foundedSectorId}
          options={sectors}
          onChange={(e) => {
            formik.setFieldValue("foundedSectorId", e.target.value);
          }}
          optionLabel="name"
          required
        />
      </div>
    )}
  </div>
);

const Employment = ({
  formik,
  setSelectedDistrict,
  districts,
  sectors,
  workingSectors,
  countries,
  states,
  setCountry,
}: any) => (
  <div className="grid grid-cols-2 gap-3">
    <div className="field">
      <label>Company Name:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="Who employs you?"
        value={formik.values.companyName}
        onChange={(e) => formik.setFieldValue("companyName", e.target.value)}
        required
      />
    </div>
    <div className="field">
      <label>Working Sector:</label>
      <Dropdown
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="Select a working sector"
        value={formik.values.companySector}
        options={workingSectors}
        onChange={(e) => formik.setFieldValue("companySector", e.target.value)}
        optionLabel="name"
        required
      />
    </div>
    <div className="field">
      <label>Your Position:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="What's your position?"
        value={formik.values.companyPosition}
        onChange={(e) =>
          formik.setFieldValue("companyPosition", e.target.value)
        }
        required
      />
    </div>
    <div className="field">
      <label>Website:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="What's the company's website?"
        value={formik.values.companyWebsite}
        onChange={(e) => formik.setFieldValue("companyWebsite", e.target.value)}
        required
      />
    </div>
    <div className="field">
      <label>Country:</label>
      <Dropdown
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="Select a country"
        value={formik.values.companyCountry}
        options={countries}
        onChange={(e) => {
          formik.setFieldValue("companyCountry", e.target.value);
          setCountry(e.target.value?.id);
        }}
        optionLabel="name"
        required
      />
    </div>
    {formik.values.companyCountry &&
      formik.values.companyCountry.id !== "RW" && (
        <div className="field">
          <label>State:</label>
          <Dropdown
            variant="filled"
            className="w-full p-3"
            placeholder="Select a state"
            value={formik?.values?.companyState}
            options={states}
            onChange={(e) => {
              formik.setFieldValue("companyState", e.value);
            }}
            optionLabel="name"
            required
          />
          {formik.errors.companyState && formik.touched.companyState && (
            <InputError error={formik.errors.companyState} />
          )}
        </div>
      )}
    {formik.values.companyCountry.id == "RW" && (
      <div className="field">
        <label>District:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          placeholder="Select a district"
          value={formik?.values?.companyDistrictName}
          options={districts}
          onChange={(e) => {
            setSelectedDistrict(e.value.name);
            formik.setFieldValue("companyDistrictName", e.value);
            formik.setFieldValue("companySectorId", "");
          }}
          optionLabel="name"
          required
        />
      </div>
    )}
    {formik.values.companyCountry.id == "RW" && (
      <div className="field">
        <label>Sector:</label>
        <Dropdown
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Select a sector"
          value={formik.values.companySectorId}
          options={sectors}
          onChange={(e) => {
            formik.setFieldValue("companySectorId", e.target.value);
          }}
          optionLabel="name"
          required
        />
      </div>
    )}
  </div>
);

function NewProfile() {
  const user = getUser();
  const toast: any = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [genders, setGenders] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsFounded, setDistrictsFounded] = useState([]);
  const [districtsEmployed, setDistrictsEmployed] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countriesFounded, setCountriesFounded] = useState([]);
  const [countriesEmployed, setCountriesEmployed] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [sectorsEmployed, setSectorsEmployed] = useState([]);
  const [sectorsFounded, setSectorsFounded] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [workingSectors, setWorkingSectors] = useState([]);
  const [workingSectorsEmployed, setWorkingSectorsEmployed] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDistrictFounded, setSelectedDistrictFounded] = useState(null);
  const [selectedDistrictEmployed, setSelectedDistrictEmployed] =
    useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [country, setCountry] = useState("");
  const [states, setStates] = useState([]);
  const [employedCountry, setEmployedCountry] = useState("");
  const [employedStates, setEmployedStates] = useState("");
  const [foundedCountry, setFoundedCountry] = useState("");
  const [foundedStates, setFoundedStates] = useState("");

  const [addUser] = useAddUserMutation();
  const { data: GenderData } = useGenderQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: StatesData } = useStatesByCountryQuery(country, {
    skip: !country,
  });
  const { data: EmployedStatesData } = useStatesByCountryQuery(
    employedCountry,
    {
      skip: !employedCountry,
    }
  );
  const { data: FoundedStatesData } = useStatesByCountryQuery(foundedCountry, {
    skip: !foundedCountry,
  });
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CohortsData } = useCohortsQuery("");
  const { data: SectorsData } = useSectorsByDistrictQuery(selectedDistrict, {
    skip: !selectedDistrict,
  });
  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFounded,
    {
      skip: !selectedDistrictFounded,
    }
  );
  const { data: SectorsDataEmployed } = useSectorsByDistrictQuery(
    selectedDistrictEmployed,
    {
      skip: !selectedDistrictEmployed,
    }
  );

  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  const { data: TracksData } = useTracksQuery("");

  const [uploadPicture] = useUploadPictureMutation();

  useEffect(() => {
    if (WorkingSectorsData) {
      setWorkingSectors(WorkingSectorsData?.data);
      setWorkingSectorsEmployed(WorkingSectorsData?.data);
    }
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (TracksData) {
      setTracks(TracksData?.data);
    }
  }, [TracksData]);

  useEffect(() => {
    if (GenderData) {
      setGenders(GenderData?.data);
    }
  }, [GenderData]);

  useEffect(() => {
    if (CohortsData) {
      setCohorts(CohortsData?.data);
    }
  }, [CohortsData]);

  useEffect(() => {
    if (SectorsData) {
      setSectors(SectorsData?.data);
    }
  }, [SectorsData]);

  useEffect(() => {
    if (SectorsDataEmployed) {
      setSectorsEmployed(SectorsDataEmployed?.data);
    }
  }, [SectorsDataEmployed]);

  useEffect(() => {
    if (StatesData) {
      setStates(StatesData?.data);
    }
  }, [StatesData]);

  useEffect(() => {
    if (EmployedStatesData) {
      setEmployedStates(EmployedStatesData?.data);
    }
  }, [EmployedStatesData]);

  useEffect(() => {
    if (FoundedStatesData) {
      setFoundedStates(FoundedStatesData?.data);
    }
  }, [FoundedStatesData]);

  useEffect(() => {
    if (SectorsDataFounded) {
      setSectorsFounded(SectorsDataFounded?.data);
    }
  }, [SectorsDataFounded]);

  useEffect(() => {
    if (DistrictData) {
      setDistricts(DistrictData?.data);
      setDistrictsEmployed(DistrictData?.data);
      setDistrictsFounded(DistrictData?.data);
    }
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData) {
      setCountries(CountryData?.data);
      setCountriesEmployed(CountryData?.data);
      setCountriesFounded(CountryData?.data);
    }
  }, [CountryData]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const formik = useFormik({
    initialValues: {
      bio: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      linkedin: "",
      instagram: "",
      twitter: "",
      facebook: "",
      gender: "",
      phoneNumber: "",
      districtName: "",
      sectorId: "",
      residentCountryId: "",
      whatsAppNumber: "",
      nearlestLandmark: "",
      track: "",
      cohortId: null,
      state: null,
      initiativeName: "",
      mainSector: "",
      foundedPosition: "",
      foundedDistrictName: "",
      foundedSectorId: "",
      foundedWebsite: "",
      foundedCountry: "",
      companyName: "",
      companySector: "",
      companyPosition: "",
      companyWebsite: "",
      companyDistrictName: "",
      companySectorId: "",
      companyCountry: "",
      profileImageId: "",
      companyState: null,
      foundedState: null,
    },
    validationSchema: Yup.object({
      bio: Yup.string().max(500, "Bio cannot exceed 500 characters"),
      firstName: Yup.string().required("First name is required"),
      middleName: Yup.string(),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      linkedin: Yup.string().url("Invalid LinkedIn URL"),
      instagram: Yup.string().url("Invalid Instagram URL"),
      twitter: Yup.string().url("Invalid Twitter URL"),
      facebook: Yup.string().url("Invalid Facebook URL"),
      gender: Yup.string().oneOf(
        ["Male", "Female", "Other"],
        "Select a valid gender"
      ),
      phoneNumber: Yup.string().matches(
        /^[0-9]+$/,
        "Phone number must be digits only"
      ),
      districtName: Yup.string(),
      sectorId: Yup.string(),
      whatsAppNumber: Yup.string().matches(
        /^[0-9]+$/,
        "WhatsApp number must be digits only"
      ),
      nearlestLandmark: Yup.string().max(
        255,
        "Landmark cannot exceed 255 characters"
      ),
      track: Yup.string().required("Track is required"),
      cohortId: Yup.number().nullable(),
      initiativeName: Yup.string(),
      mainSector: Yup.string(),
      foundedPosition: Yup.string(),
      foundedDistrictName: Yup.string(),
      foundedSectorId: Yup.string(),
      foundedWebsite: Yup.string().url("Invalid website URL"),
      foundedCountry: Yup.string(),
      companyName: Yup.string(),
      companySector: Yup.string(),
      companyPosition: Yup.string(),
      companyWebsite: Yup.string().url("Invalid website URL"),
      companyDistrictName: Yup.string(),
      companySectorId: Yup.string(),
      companyCountry: Yup.string(),
      profileImageId: Yup.string(),
    }),
    onSubmit: async (values) => {
      // Being done in another function
    },
  });

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 10000);
    }
    if (success) {
      setTimeout(() => {
        setSuccess("");
      }, 10000);
    }
  }, [error, success]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const values: any = formik.values;
    try {
      const res = await addUser({
        user: {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          email: values.email,
          linkedin: values?.linkedin,
          instagram: values?.instagram,
          twitter: values?.twitter,
          facebook: values?.facebook,
          bio: values?.bio,
          phoneNumber: values.phoneNumber,
          whatsappNumber: values.whatsAppNumber,
          genderName: values.gender.name,
          nearestLandmark: values.nearlestLandmark,
          cohortId: values?.cohortId?.id,
          trackId: values?.track?.id,
          residentDistrictId: values?.districtName.id,
          residentSectorId: values?.sectorId.id,
          state: values?.state?.id,
          residentCountryId: values?.residentCountryId.id,
          positionInFounded: values?.foundedPosition,
          positionInEmployed: values?.companyPosition,
          profileImageId: values?.profileImageId,
        },
        organizationFounded: {
          name: values?.initiativeName,
          workingSector: values?.mainSector?.id,
          countryId: values?.foundedCountry?.id,
          state: values?.foundedState?.id,
          districtId: values.foundedDistrictName.name,
          sectorId: values?.foundedSectorId.id,
          website: values?.foundedWebsite,
        },
        organizationEmployed: {
          name: values?.companyName,
          workingSector: values?.companySector?.id,
          countryId: values?.companyCountry?.id,
          state: values?.companyState?.id,
          districtId: values?.companyDistrictName.name,
          sectorId: values?.companySectorId.id,
          website: values?.companyWebsite,
        },
      }).unwrap();
      if (res.message) {
        formik.resetForm();
        setImagePreview(null);
        setImageData(null);
        setUploadSuccess(false);
        if (formik.values.profileImageId)
          formik.setFieldValue("profileImageId", "");
        setSuccess("User added successfully!");
      }
    } catch (error: any) {
      console.log(error);
      if (error?.status === 409) {
        setError(error?.data?.error);
      } else {
        setError(
          "Adding user Failed! Try again, or contact the administrator!"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      label: "Personal",
      content: (
        <Personal
          formik={formik}
          sectors={sectors}
          cohorts={cohorts}
          districts={districts}
          genders={genders}
          countries={countries}
          setSelectedDistrict={setSelectedDistrict}
          tracks={tracks}
          states={states}
          setCountry={setCountry}
        />
      ),
    },
    {
      label: "Your Initiative",
      content: (
        <Founded
          formik={formik}
          setSelectedDistrict={setSelectedDistrictFounded}
          districts={districtsFounded}
          sectors={sectorsFounded}
          countries={countriesFounded}
          workingSectors={workingSectors}
          states={foundedStates}
          setCountry={setFoundedCountry}
        />
      ),
    },
    {
      label: "Employment",
      content: (
        <Employment
          formik={formik}
          setSelectedDistrict={setSelectedDistrictEmployed}
          districts={districtsEmployed}
          sectors={sectorsEmployed}
          countries={countriesEmployed}
          workingSectors={workingSectorsEmployed}
          states={employedStates}
          setCountry={setEmployedCountry}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  const handlePreview = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageData(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (e: any) => {
    if (imageData) {
      try {
        const formData = new FormData();
        formData.append("profileImage", imageData);
        formData.append("userId", user?.id);

        const data = await uploadPicture(formData).unwrap();

        if (data?.image) {
          toast.current.show({
            severity: "info",
            summary: "Success",
            detail: "Image uploaded successfully!",
          });
          formik.setFieldValue("profileImageId", data?.image?.id);
          setUploadSuccess(true);
        }
      } catch (error: any) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error?.error,
        });
      }
    }
  };

  return (
    <div className="">
      <Toast ref={toast}></Toast>

      <div className="w-full">
        <TopTitle title="Add New Member" />
        {error && (
          <p className="bg-red-500 text-white rounded-md text-center p-2 w-full my-3">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-500 text-white rounded-md text-center p-2 w-full my-3">
            {success}
          </p>
        )}
        <div className="relative">
          <div className="flex items-start justify-between p-2">
            <div>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload Profile Picture
                <VisuallyHiddenInput type="file" onChange={handlePreview} />
              </Button>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mt-4 h-40 rounded-md w-40 object-cover"
                />
              )}
              {imagePreview && (
                <div className="flex gap-1 items-center my-1">
                  {!uploadSuccess && (
                    <Button
                      onClick={handleFileUpload}
                      variant="contained"
                      color="success"
                      size="small"
                    >
                      Upload
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setImagePreview(null);
                      setImageData(null);
                      setUploadSuccess(false);
                      if (formik.values.profileImageId)
                        formik.setFieldValue("profileImageId", "");
                    }}
                    variant="contained"
                    color="error"
                    size="small"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            <Button
              type="submit"
              onClick={() => handleSubmit()}
              variant="contained"
              size="medium"
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="p-3">
          <TextField
            label="Biography"
            multiline
            rows={5}
            value={formik.values.bio}
            onChange={(e) => formik.setFieldValue("bio", e.target.value)}
            className="w-full"
            placeholder="Enter the user's BIO..."
          />
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 py-4">
            <TextField
              label="First Name:"
              variant="filled"
              value={formik.values.firstName}
              onChange={(e) =>
                formik.setFieldValue("firstName", e.target.value)
              }
              placeholder="First Name"
              error={
                formik.errors.firstName && formik.touched.firstName
                  ? true
                  : false
              }
              helperText={
                formik.errors.firstName && formik.touched.firstName
                  ? formik.errors.firstName
                  : ""
              }
            />
            <TextField
              label="Middle Name:"
              variant="filled"
              value={formik.values.middleName}
              onChange={(e) =>
                formik.setFieldValue("middleName", e.target.value)
              }
              placeholder="Middle Name"
              error={
                formik.errors.middleName && formik.touched.middleName
                  ? true
                  : false
              }
              helperText={
                formik.errors.middleName && formik.touched.middleName
                  ? formik.errors.middleName
                  : ""
              }
            />
            <TextField
              label="Last Name:"
              variant="filled"
              value={formik.values.lastName}
              onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
              placeholder="Last Name"
              error={
                formik.errors.lastName && formik.touched.lastName ? true : false
              }
              helperText={
                formik.errors.lastName && formik.touched.lastName
                  ? formik.errors.lastName
                  : ""
              }
            />
            <TextField
              label="Email:"
              variant="filled"
              value={formik.values.email}
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
              placeholder="Email"
              required
              error={formik.errors.email && formik.touched.email ? true : false}
              helperText={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : ""
              }
            />
            <PhoneInputWithCountrySelect
              international
              countryCallingCodeEditable={false}
              defaultCountry="RW"
              className="w-full"
              value={formik.values.phoneNumber}
              onChange={(e: any) => {
                formik.setFieldValue("phoneNumber", e);
              }}
              inputComponent={TextField}
              variant="filled"
              label="Phone Number:"
              error={
                formik.errors.phoneNumber && formik.touched.phoneNumber
                  ? true
                  : false
              }
              helperText={
                formik.errors.phoneNumber && formik.touched.phoneNumber
                  ? formik.errors.phoneNumber
                  : ""
              }
              placeholder="Enter phone number"
            />
            <PhoneInputWithCountrySelect
              international
              countryCallingCodeEditable={false}
              defaultCountry="RW"
              className="w-full"
              value={formik.values.whatsAppNumber}
              onChange={(e: any) => {
                formik.setFieldValue("whatsAppNumber", e);
              }}
              inputComponent={TextField}
              variant="filled"
              label="WhatsApp Number:"
              error={
                formik.errors.whatsAppNumber && formik.touched.whatsAppNumber
                  ? true
                  : false
              }
              helperText={
                formik.errors.whatsAppNumber && formik.touched.whatsAppNumber
                  ? formik.errors.whatsAppNumber
                  : ""
              }
              placeholder="Enter WhatsApp number"
            />
            <FormControl
              variant="filled"
              error={
                formik.errors.gender && formik.touched.gender ? true : false
              }
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="gender">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                value={formik.values.gender}
                onChange={(e) => formik.setFieldValue("gender", e.target.value)}
              >
                {genders.map((gen: gender) => (
                  <MenuItem key={gen?.id} value={gen}>
                    {gen?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.gender && formik.touched.gender && (
                <FormHelperText>{formik.errors.gender}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              variant="filled"
              error={
                formik.errors.residentCountryId &&
                formik.touched.residentCountryId
                  ? true
                  : false
              }
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel id="gender">Resident Country</InputLabel>
              <Select
                labelId="country-label"
                id="country"
                value={formik.values.residentCountryId}
                onChange={(e) => {
                  formik.setFieldValue("residentCountryId", e.target.value);
                  setCountry(e.target.value.id);
                }}
              >
                {countries.map((item: Country) => (
                  <MenuItem key={item?.id} value={item}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.residentCountryId &&
                formik.touched.residentCountryId && (
                  <FormHelperText>
                    {formik.errors.residentCountryId}
                  </FormHelperText>
                )}
            </FormControl>
            {formik.values.residentCountryId.id !== "RW" && (
              <FormControl
                variant="filled"
                error={
                  formik.errors.state && formik.touched.state ? true : false
                }
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>State</InputLabel>
                <Select
                  labelId="state-label"
                  value={formik.values.state}
                  onChange={(e) => {
                    formik.setFieldValue("state", e.value);
                  }}
                >
                  {states.map((item: State) => (
                    <MenuItem key={item?.id} value={item}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.state && formik.touched.state && (
                  <FormHelperText>{formik.errors.state}</FormHelperText>
                )}
              </FormControl>
            )}
            {formik.values.residentCountryId.id === "RW" && (
              <FormControl
                variant="filled"
                error={
                  formik.errors.districtName && formik.touched.districtName
                    ? true
                    : false
                }
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>District</InputLabel>
                <Select
                  labelId="district-label"
                  value={formik.values.districtName}
                  onChange={(e) => {
                    setSelectedDistrict(e.value.name);
                    formik.setFieldValue("districtName", e.value);
                    formik.setFieldValue("sectorId", "");
                  }}
                >
                  {districts.map((item: residentDistrict) => (
                    <MenuItem key={item?.id} value={item}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.districtName && formik.touched.districtName && (
                  <FormHelperText>{formik.errors.districtName}</FormHelperText>
                )}
              </FormControl>
            )}
            {formik.values.residentCountryId.id === "RW" && (
              <FormControl
                variant="filled"
                error={
                  formik.errors.sectorId && formik.touched.sectorId
                    ? true
                    : false
                }
                sx={{ minWidth: 120, width: "100%" }}
              >
                <InputLabel>Sector</InputLabel>
                <Select
                  labelId="sector-label"
                  value={formik.values.sectorId}
                  onChange={(e) =>
                    formik.setFieldValue("sectorId", e.target.value)
                  }
                >
                  {sectors.map((item: residentSector) => (
                    <MenuItem key={item?.id} value={item}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.sectorId && formik.touched.sectorId && (
                  <FormHelperText>{formik.errors.sectorId}</FormHelperText>
                )}
              </FormControl>
            )}

            <FormControl
              variant="filled"
              error={
                formik.errors.cohortId && formik.touched.cohortId ? true : false
              }
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>Cohort</InputLabel>
              <Select
                labelId="cohort-label"
                value={formik.values.cohortId}
                onChange={(e) =>
                  formik.setFieldValue("cohortId", e.target.value)
                }
              >
                {cohorts.map((item: cohort) => (
                  <MenuItem key={item?.id} value={item}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.cohortId && formik.touched.cohortId && (
                <FormHelperText>{formik.errors.cohortId}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              variant="filled"
              error={formik.errors.track && formik.touched.track ? true : false}
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>Track</InputLabel>
              <Select
                labelId="track-label"
                value={formik.values.track}
                onChange={(e) => formik.setFieldValue("track", e.target.value)}
              >
                {tracks.map((item: Track) => (
                  <MenuItem key={item?.id} value={item}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.track && formik.touched.track && (
                <FormHelperText>{formik.errors.track}</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Nearest Landmark:"
              variant="filled"
              value={formik.values.nearlestLandmark}
              onChange={(e) =>
                formik.setFieldValue("nearestLandmark", e.target.value)
              }
              placeholder="What's the popular place near you?"
              error={
                formik.errors.nearlestLandmark &&
                formik.touched.nearlestLandmark
                  ? true
                  : false
              }
              helperText={
                formik.errors.nearlestLandmark &&
                formik.touched.nearlestLandmark
                  ? formik.errors.nearlestLandmark
                  : ""
              }
            />
            <TextField
              label="LinkedIn Account:"
              variant="filled"
              value={formik.values.linkedin}
              onChange={(e) => formik.setFieldValue("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/..."
              error={
                formik.errors.linkedin && formik.touched.linkedin ? true : false
              }
              helperText={
                formik.errors.linkedin && formik.touched.linkedin
                  ? formik.errors.linkedin
                  : ""
              }
            />
            <TextField
              label="X (Twitter) Account:"
              variant="filled"
              value={formik.values.twitter}
              onChange={(e) => formik.setFieldValue("twitter", e.target.value)}
              placeholder="https://x.com/..."
              error={
                formik.errors.twitter && formik.touched.twitter ? true : false
              }
              helperText={
                formik.errors.twitter && formik.touched.twitter
                  ? formik.errors.twitter
                  : ""
              }
            />
            <TextField
              label="Instagram Account:"
              variant="filled"
              value={formik.values.instagram}
              onChange={(e) =>
                formik.setFieldValue("instagram", e.target.value)
              }
              placeholder="https://instagram.com/..."
              error={
                formik.errors.instagram && formik.touched.instagram
                  ? true
                  : false
              }
              helperText={
                formik.errors.instagram && formik.touched.instagram
                  ? formik.errors.instagram
                  : ""
              }
            />
            <TextField
              label="Facebook Account:"
              variant="filled"
              value={formik.values.facebook}
              onChange={(e) => formik.setFieldValue("facebook", e.target.value)}
              placeholder="https://facebook.com/..."
              error={
                formik.errors.facebook && formik.touched.facebook ? true : false
              }
              helperText={
                formik.errors.facebook && formik.touched.facebook
                  ? formik.errors.facebook
                  : ""
              }
            />
          </div>
        </div>

        {/* <div className="p-5 text-justify">
          <div className="my-5">
            <ul className="-mb-px flex items-center gap-4 text-sm font-medium">
              {tabs.map((tab, index) => (
                <li
                  key={index}
                  className={`flex-1 ${
                    index === activeTab
                      ? "border-b border-blue-700 cursor-pointer"
                      : "cursor-pointer"
                  }`}
                  onClick={() => handleTabClick(index)}
                >
                  <a
                    className={`relative flex items-center justify-center gap-2 px-1 py-3 text-gray-500 hover:text-blue-700 font-bold ${
                      index === activeTab ? "text-blue-700" : ""
                    }`}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4">{tabs[activeTab].content}</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default NewProfile;
