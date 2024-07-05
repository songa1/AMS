"use client";

import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
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
import {
  useGetOneUserQuery,
  useUpdatedUserMutation,
  useUsersQuery,
} from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";

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

const UpdateProfile: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [genders, setGenders] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [userData, setUser] = useState<User>(getUser());
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(
    userData?.residentDistrict?.id
  );
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [updateUser] = useUpdatedUserMutation();

  const { data: userProfile, refetch } = useGetOneUserQuery(userData?.id);
  const user = userProfile;
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
      firstName: user?.firstName ? user?.firstName : "",
      middleName: user?.middleName ? user?.middleName : "",
      lastName: user?.lastName ? user?.lastName : "",
      email: user?.email ? user?.email : "",
      gender: user?.gender ? user?.gender : { name: "" },
      phoneNumber: user?.phoneNumber ? user?.phoneNumber : "",
      districtName: user?.residentDistrict
        ? user?.residentDistrict
        : { id: "" },
      sectorId: user?.residentSector ? user?.residentSector : { id: "" },
      whatsAppNumber: user?.whatsappNumber ? user?.whatsappNumber : "",
      nearlestLandmark: user?.nearestLandmark ? user?.nearestLandmark : "",
      track: user?.track ? user?.track : "",
      cohortId: user?.cohort ? user?.cohort : { id: "" },
      initiativeName: user?.organizationFounded?.name
        ? user?.organizationFounded?.name
        : "",
      mainSector: user?.organizationFounded?.workingSector
        ? user?.organizationFounded?.workingSector
        : "",
      foundedPosition: user?.positionInFounded ? user?.positionInFounded : "",
      foundedDistrictName: user?.organizationFounded?.district
        ? user?.organizationFounded?.district
        : { name: "" },
      foundedSectorId: user?.organizationFounded?.sector
        ? user?.organizationFounded?.sector
        : { id: "" },
      foundedWebsite: user?.organizationFounded?.website
        ? user?.organizationFounded?.website
        : "",
      companyName: user?.organizationEmployed?.name
        ? user?.organizationEmployed?.name
        : "",
      companySector: user?.organizationEmployed?.workingSector
        ? user?.organizationEmployed?.workingSector
        : "",
      companyPosition: user?.positionInEmployed ? user?.positionInEmployed : "",
      companyWebsite: user?.organizationEmployed?.website
        ? user?.organizationEmployed?.website
        : "",
      companyDistrictName: user?.organizationEmployed?.district
        ? user?.organizationEmployed?.district
        : { name: "" },
      companySectorId: user?.organizationEmployed?.sector
        ? user?.organizationEmployed?.sector
        : { id: "" },
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
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
      const res = await updateUser({
        userId: user?.id,
        user: {
          firstName: values?.firstName,
          middleName: values?.middleName,
          lastName: values?.lastName,
          email: values?.email,
          phoneNumber: values?.phoneNumber,
          whatsappNumber: values?.whatsAppNumber,
          genderName: values?.gender?.name,
          nearestLandmark: values?.nearlestLandmark,
          cohortId: values?.cohortId?.id,
          track: values?.track,
          residentDistrictId: values?.districtName?.id,
          residentSectorId: values?.sectorId?.id,
          positionInFounded: values?.foundedPosition,
          positionInEmployed: values?.companyPosition,
        },
        organizationFounded: {
          id: user?.organizationFounded?.id || "",
          name: values?.initiativeName,
          workingSector: values?.mainSector,
          districtId: values?.foundedDistrictName?.name,
          sectorId: values?.foundedSectorId?.id,
          website: values?.foundedWebsite,
        },
        organizationEmployed: {
          id: user?.organizationEmployed?.id || "",
          name: values?.companyName,
          workingSector: values?.companySector,
          districtId: values?.companyDistrictName?.name,
          sectorId: values?.companySectorId?.id,
          website: values?.companyWebsite,
        },
      }).unwrap();
      if (res.message) {
        formik.resetForm();
        refetch();
        setSuccess("User updated successfully!");
      }
    } catch (error: any) {
      console.log(error);
      if (error?.status === 409) {
        setError(error?.data?.error);
      } else {
        setError(
          "Updating user Failed! Try again, or contact the administrator!"
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
};

export default UpdateProfile;
