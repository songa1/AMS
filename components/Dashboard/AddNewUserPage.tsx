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

function NewProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [genders, setGenders] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

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
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name  is required"),
      email: Yup.string().email().required("Email is required"),
      phone: Yup.string().required("Phone Number is required"),
      gender: Yup.string().required("Gender is required"),
      districtName: Yup.string().required("District Name is required"),
    }),
    onSubmit: (values) => {
      try {
        formik.resetForm();
        router.push("/dashboard/users");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const Personal = ({ formik }: any) => {
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
            onChange={(e) =>
              formik.setFieldValue("phoneNumber", e.target.value)
            }
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
  const Education = () => (
    <div className="grid grid-cols-2 gap-3">
      {/* Additional education fields can be added here */}
    </div>
  );

  const Work = () => (
    <div className="grid grid-cols-2 gap-3">
      {/* Additional work fields can be added here */}
    </div>
  );

  const tabs = [
    { label: "Personal", content: <Personal formik={formik} /> },
    { label: "Education", content: <Education /> },
    { label: "Work", content: <Work /> },
  ];

  return (
    <div className="">
      <div className="w-full">
        <img
          src="/kigali.jpg"
          className="w-full h-40 object-cover rounded-t-xl"
        />
        <div className="relative">
          <div className="grid grid-cols-4 items-center justify-end p-2">
            <div className="col-span-3"></div>
            <button
              className="right-1 top-1 z-10 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
              type="submit"
              onClick={() => formik.handleSubmit()}
            >
              Save
            </button>
          </div>
        </div>
        <div className="p-5 text-justify">
          {/* <p>
            <InputTextarea
              value={newUser.description}
              onChange={(e) => handleInputChange(e, "description")}
              variant="filled"
              className="w-full p-3"
              rows={5}
              autoResize
            />
          </p> */}
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
