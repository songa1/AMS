"use client";

import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  useCohortsQuery,
  useCountriesQuery,
  useDistrictsQuery,
  useGenderQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useTracksQuery,
  useWorkingSectorQuery,
} from "@/lib/features/otherSlice";
import {
  useGetOneUserQuery,
  useUpdatedUserMutation,
} from "@/lib/features/userSlice";
import Loading from "@/app/loading";
import { getUser } from "@/helpers/auth";
import { User } from "@/types/user";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Alert, Box, Button, TextField } from "@mui/material";

function UpdateProfilepage() {
  const { id } = useParams();
  const user = getUser();
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
  const [states, setStates] = useState("");
  const [employedCountry, setEmployedCountry] = useState("");
  const [employedStates, setEmployedStates] = useState("");
  const [foundedCountry, setFoundedCountry] = useState("");
  const [foundedStates, setFoundedStates] = useState("");
  const [changeEmail, setChangeEmail] = useState(true);

  const [updatedUser] = useUpdatedUserMutation();
  const { data: UserData, refetch } = useGetOneUserQuery<{ data: User }>(
    id || user?.id
  );
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

  const authorized = false;

  const { data: WorkingSectorsData } = useWorkingSectorQuery("");

  const { data: TracksData } = useTracksQuery("");

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

  const usr = UserData;

  const formik = useFormik({
    initialValues: {
      firstName: usr?.firstName,
      middleName: usr?.middleName,
      lastName: usr?.lastName,
      email: usr?.email,
      linkedin: usr?.linkedin,
      instagram: usr?.instagram,
      twitter: usr?.twitter,
      facebook: usr?.facebook,
      bio: usr?.bio,
      gender: usr?.gender,
      phoneNumber: usr?.phoneNumber,
      districtName: usr?.residentDistrict,
      sectorId: usr?.residentSector,
      residentCountryId: usr?.residentCountry,
      state: usr?.state,
      whatsAppNumber: usr?.whatsappNumber,
      nearlestLandmark: usr?.nearestLandmark,
      track: usr?.track,
      cohortId: usr?.cohort,
      initiativeName: usr?.organizationFounded?.name,
      mainSector: usr?.organizationFounded?.workingSector,
      foundedPosition: usr?.positionInFounded,
      foundedDistrictName: usr?.organizationFounded?.district,
      foundedSectorId: usr?.organizationFounded?.sector,
      foundedWebsite: usr?.organizationFounded?.website,
      foundedCountry: usr?.organizationFounded?.country,
      companyName: usr?.organizationEmployed?.name,
      companySector: usr?.organizationEmployed?.workingSector,
      companyPosition: usr?.positionInEmployed,
      companyWebsite: usr?.organizationEmployed?.website,
      companyDistrictName: usr?.organizationEmployed?.district,
      companySectorId: usr?.organizationEmployed?.sector,
      companyState: usr?.organizationEmployed?.state,
      foundedState: usr?.organizationFounded?.state,
      companyCountry: usr?.organizationEmployed?.country,
      profileImageId: usr?.profileImage,
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
      residentCountryId: Yup.string().required("Resident country is required"),
      whatsAppNumber: Yup.string().matches(
        /^[0-9]+$/,
        "WhatsApp number must be digits only"
      ),
      nearlestLandmark: Yup.string().max(
        255,
        "Landmark cannot exceed 255 characters"
      ),
      track: Yup.string(),
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
      const res = await updatedUser({
        userId: usr?.id,
        user: {
          firstName: values?.firstName,
          middleName: values?.middleName,
          lastName: values?.lastName,
          email: values?.email,
          linkedin: values?.linkedin,
          instagram: values?.instagram,
          twitter: values?.twitter,
          facebook: values?.facebook,
          bio: values?.bio,
          phoneNumber: values?.phoneNumber,
          whatsappNumber: values?.whatsAppNumber,
          genderName: values?.gender?.name,
          nearestLandmark: values?.nearlestLandmark,
          cohortId: values?.cohortId?.id,
          trackId: values?.track?.id,
          residentDistrictId: values?.districtName?.id,
          residentSectorId: values?.sectorId?.id,
          residentCountryId: values?.residentCountryId?.id,
          state: values?.state?.id,
          positionInFounded: values?.foundedPosition,
          positionInEmployed: values?.companyPosition,
          profileImageId: values?.profileImageId?.id,
        },
      }).unwrap();
      if (res.message) {
        if (id) {
          globalThis.location.href = "/dashboard/users/" + id;
        } else {
          globalThis.location.href = "/dashboard/profile";
        }
        formik.resetForm();
        setImagePreview(null);
        setImageData(null);
        setUploadSuccess(false);

        if (formik.values.profileImageId)
          formik.setFieldValue("profileImageId", "");
        setSuccess("User updated successfully!");
        refetch();
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="w-full">
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="filled" severity="success">
            {success}
          </Alert>
        )}
        <div className="flex items-start justify-between py-4">
          <div></div>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Update
          </Button>
        </div>
        <TextField
          label="Biography"
          multiline
          rows={5}
          defaultValue={usr?.bio}
          value={formik.values.bio}
          disabled={authorized}
          onChange={(e) => formik.setFieldValue("bio", e.target.value)}
          className="w-full"
          placeholder="Enter the user's BIO..."
        />
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            paddingTop: "30px",
          }}
        >
          <TextField
            label="Email"
            defaultValue={user?.email}
            value={formik.values.email}
          />
          <TextField
            defaultValue={user?.phoneNumber}
            value={formik.values.phoneNumber}
            label="Phone Number"
          />
          <TextField
            label="WhatsApp Number"
            value={formik.values.whatsAppNumber}
            defaultValue={user?.whatsappNumber}
          />
          <TextField value={user?.genderName} label="Gender" />

          <TextField
            label="Resident Country"
            value={
              user?.residentCountry?.name ? user?.residentCountry?.name : "--"
            }
          />
          {user?.residentCountry && user?.residentCountry?.id === "RW" && (
            <TextField
              label="Resident District"
              value={
                user?.residentDistrict?.name
                  ? user?.residentDistrict?.name
                  : "--"
              }
            />
          )}
          {user?.residentCountry && user?.residentCountry?.id === "RW" && (
            <TextField
              label="Resident Sector"
              value={
                user?.residentSector?.name ? user?.residentSector?.name : "--"
              }
            />
          )}
          <TextField
            label="Cohort"
            value={user?.cohort?.name ? user?.cohort?.name : "--"}
          />

          <TextField
            label="Nearest Landmark"
            value={formik.values.nearlestLandmark}
            defaultValue={user?.nearestLandmark}
          />
          <TextField
            label="Track"
            value={user?.track ? user?.track?.name : "--"}
          />
          <TextField
            label="Facebook Account"
            defaultValue={user?.facebook}
            value={formik.values.facebook}
          />
          <TextField
            label="Instagram Account"
            defaultValue={user?.instagram}
            value={formik.values.instagram}
          />
          <TextField
            label="LinkedIn Account"
            defaultValue={user?.linkedin}
            value={formik.values.linkedin}
          />
          <TextField
            label="Twitter Account"
            defaultValue={user?.twitter}
            value={formik.values.twitter}
          />
        </Box>
      </div>
    </div>
  );
}

export default UpdateProfilepage;
