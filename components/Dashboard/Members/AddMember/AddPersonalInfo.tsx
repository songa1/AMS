"use strict";

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  cohort,
  Country,
  gender,
  residentDistrict,
  residentSector,
  State,
  Track,
} from "@/types/user";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import {
  useCohortsQuery,
  useCountriesQuery,
  useDistrictsQuery,
  useGenderQuery,
  useSectorsByDistrictQuery,
  useStatesByCountryQuery,
  useTracksQuery,
} from "@/lib/features/otherSlice";
import {
  useCreateUserProfileMutation,
  useUploadPictureMutation,
} from "@/lib/features/userSlice";
import { getUser } from "@/helpers/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MuiTelInput } from "mui-tel-input";

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

function AddPersonalInfo({ canMove }: { canMove: any }) {
  const user = getUser();

  const [country, setCountry] = useState("");
  const [districts, setDistricts] = useState<residentDistrict[]>([]);
  const [states, setStates] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [tracks, setTracks] = useState([]);
  const [genders, setGenders] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  const { data: GenderData } = useGenderQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: StatesData } = useStatesByCountryQuery(country, {
    skip: !country,
  });
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CohortsData } = useCohortsQuery("");
  const { data: SectorsData } = useSectorsByDistrictQuery(
    districts.find((d: residentDistrict) => d.id === selectedDistrict)?.name,
    {
      skip: !selectedDistrict,
    }
  );

  const { data: TracksData } = useTracksQuery("");

  const [createUserProfile] = useCreateUserProfileMutation();

  const [uploadPicture] = useUploadPictureMutation();

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
    if (StatesData) {
      setStates(StatesData?.data);
    }
  }, [StatesData]);

  useEffect(() => {
    if (DistrictData) {
      setDistricts(DistrictData?.data);
    }
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData) {
      setCountries(CountryData?.data);
    }
  }, [CountryData]);

  useEffect(() => {
    if (success || error) {
      setInterval(() => {
        setSuccess("");
        setError("");
      }, 10000);
    }
  }, [success, error]);

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
          setSuccess("Image uploaded successfully!");
          formik.setFieldValue("profileImageId", data?.image?.id);
          setUploadSuccess(true);
        }
      } catch (error: any) {
        setError(error?.error);
      }
    }
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
      foundedPosition: "",
      foundedDistrictName: "",
      profileImageId: "",
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
      profileImageId: Yup.string(),
    }),
    onSubmit: async (values) => {},
  });

  const handleSubmit = async () => {
    const values: any = formik.values;
    try {
      const res = await createUserProfile({
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
          residentDistrictId: values?.districtName,
          residentSectorId: values?.sectorId.id,
          state: values?.state?.id,
          residentCountryId: values?.residentCountryId,
          profileImageId: values?.profileImageId,
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
        canMove(true);
      }
    } catch (error: any) {
      if (error?.status === 409) {
        setError(error?.data?.error);
      } else {
        setError(
          "Adding user Failed! Try again, or contact the administrator!"
        );
      }
    }
  };

  return (
    <div>
      {success && (
        <Alert variant="filled" severity="success">
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
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
            label="First Name:"
            variant="filled"
            value={formik.values.firstName}
            onChange={(e) => formik.setFieldValue("firstName", e.target.value)}
            placeholder="First Name"
            error={
              formik.errors.firstName && formik.touched.firstName ? true : false
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
            onChange={(e) => formik.setFieldValue("middleName", e.target.value)}
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
          <MuiTelInput
            value={formik.values.phoneNumber}
            label="Phone Number:"
            variant="filled"
            defaultCountry="RW"
            onChange={(e: any) => {
              console.log(e);
              formik.setFieldValue("phoneNumber", e);
            }}
          />
          <MuiTelInput
            value={formik.values.whatsAppNumber}
            label="WhatsApp Number:"
            variant="filled"
            defaultCountry="RW"
            onChange={(e: any) => {
              formik.setFieldValue("whatsAppNumber", e);
            }}
            placeholder="Enter WhatsApp number"
          />
          <FormControl
            variant="filled"
            error={formik.errors.gender && formik.touched.gender ? true : false}
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
                <MenuItem key={gen?.id} value={gen.id}>
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
                setCountry(e.target.value);
                console.log(country);
              }}
            >
              {countries.map((item: Country) => (
                <MenuItem key={item?.id} value={item.id}>
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
          {formik.values.residentCountryId !== "RW" && (
            <FormControl
              variant="filled"
              error={formik.errors.state && formik.touched.state ? true : false}
              sx={{ minWidth: 120, width: "100%" }}
            >
              <InputLabel>State</InputLabel>
              <Select
                labelId="state-label"
                value={formik.values.state}
                onChange={(e) => {
                  console.log(e);
                  formik.setFieldValue("state", e.target.value);
                }}
              >
                {states.map((item: State) => (
                  <MenuItem key={item?.id} value={item.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.state && formik.touched.state && (
                <FormHelperText>{formik.errors.state}</FormHelperText>
              )}
            </FormControl>
          )}
          {formik.values.residentCountryId === "RW" && (
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
                  setSelectedDistrict(e.target.value);
                  formik.setFieldValue("districtName", e.target.value);
                  formik.setFieldValue("sectorId", "");
                }}
              >
                {districts.map((item: residentDistrict) => (
                  <MenuItem key={item?.id} value={item.id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.districtName && formik.touched.districtName && (
                <FormHelperText>{formik.errors.districtName}</FormHelperText>
              )}
            </FormControl>
          )}
          {formik.values.residentCountryId === "RW" && (
            <FormControl
              variant="filled"
              error={
                formik.errors.sectorId && formik.touched.sectorId ? true : false
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
                  <MenuItem key={item?.id} value={item.id}>
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
              onChange={(e) => formik.setFieldValue("cohortId", e.target.value)}
            >
              {cohorts.map((item: cohort) => (
                <MenuItem key={item?.id} value={item.id}>
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
                <MenuItem key={item?.id} value={item.id}>
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
              formik.setFieldValue("nearlestLandmark", e.target.value)
            }
            placeholder="What's the popular place near you?"
            error={
              formik.errors.nearlestLandmark && formik.touched.nearlestLandmark
                ? true
                : false
            }
            helperText={
              formik.errors.nearlestLandmark && formik.touched.nearlestLandmark
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
            onChange={(e) => formik.setFieldValue("instagram", e.target.value)}
            placeholder="https://instagram.com/..."
            error={
              formik.errors.instagram && formik.touched.instagram ? true : false
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
        </Box>
      </div>
    </div>
  );
}

export default AddPersonalInfo;
