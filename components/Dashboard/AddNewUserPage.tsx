"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { User } from "@/types/user";
import { Dropdown } from "primereact/dropdown";
import {
  useCohortsQuery,
  useDistrictsQuery,
  useGenderQuery,
  useSectorsByDistrictQuery,
} from "@/lib/features/otherSlice";
import {useAddUserMutation  } from "@/lib/features/userSlice";
import Loading from "@/app/loading";

const Personal = ({
  formik,
  sectors,
  cohorts,
  districts,
  genders,
  setSelectedDistrict,
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
      <div className="field">
        <label>Track:</label>
        <InputText
          variant="filled"
          className="w-full p-3"
          type="text"
          placeholder="What's your track?"
          value={formik.values.track}
          onChange={(e) => formik.setFieldValue("track", e.target.value)}
          required
        />
      </div>
    </div>
  );
};

const Founded = ({ formik, setSelectedDistrict, districts, sectors }: any) => (
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
      <label>Main Sector:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="What's your initiative's sector?"
        value={formik.values.mainSector}
        onChange={(e) => formik.setFieldValue("mainSector", e.target.value)}
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
      <label>Company Sector:</label>
      <InputText
        variant="filled"
        className="w-full p-3"
        type="text"
        placeholder="What's your company's category?"
        value={formik.values.companySector}
        onChange={(e) => formik.setFieldValue("companySector", e.target.value)}
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
  const [activeTab, setActiveTab] = useState(0);
  const [genders, setGenders] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [addUser] = useAddUserMutation();
  const { data: GenderData } = useGenderQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CohortsData } = useCohortsQuery("");
  const { data: SectorsData } = useSectorsByDistrictQuery(selectedDistrict, {
    skip: !selectedDistrict,
  });

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
    if (DistrictData) {
      setDistricts(DistrictData?.data);
    }
  }, [DistrictData]);

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
      companyName: "",
      companySector: "",
      companyPosition: "",
      companyWebsite: "",
      companyDistrictName: "",
      companySectorId: "",
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
          track: values.track,
          residentDistrictId: values?.districtName.id,
          residentSectorId: values?.sectorId.id,
          positionInFounded: values?.foundedPosition,
          positionInEmployed: values?.companyPosition,
        },
        organizationFounded: {
          name: values?.initiativeName,
          workingSector: values?.mainSector,
          districtId: values.foundedDistrictName.name,
          sectorId: values?.foundedSectorId.id,
          website: values?.foundedWebsite,
        },
        organizationEmployed: {
          name: values?.companyName,
          workingSector: values?.companySector,
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
          setSelectedDistrict={setSelectedDistrict}
        />
      ),
    },
    {
      label: "Your Initiative",
      content: (
        <Founded
          formik={formik}
          setSelectedDistrict={setSelectedDistrict}
          districts={districts}
          sectors={sectors}
        />
      ),
    },
    {
      label: "Employment",
      content: (
        <Employment
          formik={formik}
          setSelectedDistrict={setSelectedDistrict}
          districts={districts}
          sectors={sectors}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="w-full">
        <img
          src="/kigali.jpg"
          className="w-full h-40 object-cover rounded-t-xl"
        />
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
          <div className="grid grid-cols-4 items-center justify-end p-2">
            <div className="col-span-3"></div>
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

function setUsers(arg0: (prevUsers: any) => User[]) {
  throw new Error("Function not implemented.");
}
