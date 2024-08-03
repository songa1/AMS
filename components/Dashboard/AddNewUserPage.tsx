"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
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
  useTracksQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import {
  useAddUserMutation,
  useUploadPictureMutation,
} from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import Button from "../Other/Button";
import { FileUpload } from "primereact/fileupload";
import { getUser } from "@/helpers/auth";
import { Toast } from "primereact/toast";

const Personal = ({
  formik,
  sectors,
  cohorts,
  districts,
  genders,
  setSelectedDistrict,
  tracks,
  countries,
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
      </div>
      <div className="field">
        <label>Phone Number:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="Phone Number"
          value={formik.values.phoneNumber}
          onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label>WhatsApp Number:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="WhatsApp Number"
          value={formik.values.whatsAppNumber}
          onChange={(e) =>
            formik.setFieldValue("whatsAppNumber", e.target.value)
          }
          required
        />
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
          onChange={(e) =>
            formik.setFieldValue("residentCountryId", e.target.value)
          }
          optionLabel="name"
          required
        />
      </div>
      {formik.values.residentCountryId.id === "rwanda" && (
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
              console.log(formik.values.districtName);
            }}
            optionLabel="name"
            required
          />
        </div>
      )}
      {formik.values.residentCountryId.id === "rwanda" && (
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
        onChange={(e) => formik.setFieldValue("foundedCountry", e.target.value)}
        optionLabel="name"
        required
      />
    </div>
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
          console.log(formik.values.foundedDistrictName);
        }}
        optionLabel="name"
        required
      />
    </div>
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
  </div>
);

const Employment = ({
  formik,
  setSelectedDistrict,
  districts,
  sectors,
  workingSectors,
  countries,
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
        onChange={(e) => formik.setFieldValue("companyCountry", e.target.value)}
        optionLabel="name"
        required
      />
    </div>
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
          console.log(formik.values.foundedDistrictName);
        }}
        optionLabel="name"
        required
      />
    </div>
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
  </div>
);

function NewProfile() {
  const router = useRouter();
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

  const [addUser] = useAddUserMutation();
  const { data: GenderData } = useGenderQuery("");
  const { data: CountryData } = useCountriesQuery("");
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
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      gender: "",
      phoneNumber: "",
      districtName: "",
      sectorId: "",
      residentCountryId: "",
      whatsAppNumber: "",
      nearlestLandmark: "",
      track: "",
      cohortId: null,
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
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name  is required"),
      email: Yup.string().email().required("Email is required"),
      phone: Yup.string().required("Phone Number is required"),
      gender: Yup.string().required("Gender is required"),
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
          phoneNumber: values.phoneNumber,
          whatsappNumber: values.whatsAppNumber,
          genderName: values.gender.name,
          nearestLandmark: values.nearlestLandmark,
          cohortId: values?.cohortId?.id,
          trackId: values?.track?.id,
          residentDistrictId: values?.districtName.id,
          residentSectorId: values?.sectorId.id,
          residentCountryId: values?.residentCountryId.id,
          positionInFounded: values?.foundedPosition,
          positionInEmployed: values?.companyPosition,
          profileImageId: values?.profileImageId,
        },
        organizationFounded: {
          name: values?.initiativeName,
          workingSector: values?.mainSector?.id,
          countryId: values?.foundedCountry?.id,
          districtId: values.foundedDistrictName.name,
          sectorId: values?.foundedSectorId.id,
          website: values?.foundedWebsite,
        },
        organizationEmployed: {
          name: values?.companyName,
          workingSector: values?.companySector?.id,
          countryId: values?.companyCountry?.id,
          districtId: values?.companyDistrictName.name,
          sectorId: values?.companySectorId.id,
          website: values?.companyWebsite,
        },
      }).unwrap();
      if (res.message) {
        formik.resetForm();
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
              <div>
                <label>Profile Picture:</label>
                <input type="file" onChange={handlePreview} />
              </div>
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
                    <Button onClick={handleFileUpload} title="Upload" />
                  )}
                  <Button
                    onClick={() => {
                      setImagePreview(null);
                      setImageData(null);
                      setUploadSuccess(false);
                      if (formik.values.profileImageId)
                        formik.setFieldValue("profileImageId", "");
                    }}
                    title="Clear"
                  />
                </div>
              )}
            </div>
            <button
              className="right-1 top-1 z-10 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
              type="submit"
              onClick={() => handleSubmit()}
            >
              Save
            </button>
          </div>
        </div>
        <div className="p-5 text-justify">
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
        </div>
      </div>
    </div>
  );
}

export default NewProfile;
