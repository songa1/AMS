"use client";

import React, { useEffect, useState } from "react";
import {
  Country,
  Gender,
  ResidentDistrict,
  ResidentSector,
  State,
} from "@/types/user";
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
import { Track } from "@/types/track";
import { Cohort } from "@/types/cohort";


export const TailwindButton = ({
  onClick,
  children,
  className = "",
  disabled = false,
  icon: IconComponent = null,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-4 py-2 font-semibold text-white rounded-md transition duration-150 ease-in-out 
      ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"} 
      ${className}`}
  >
    {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
    {children}
  </button>
);

export const TailwindInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  multiline = false,
  rows = 1,
}: any) => (
  <div className="flex flex-col w-full">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {multiline ? (
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-blue-500 focus:border-blue-500`}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-2 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-blue-500 focus:border-blue-500`}
      />
    )}
    {helperText && (
      <p className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}>
        {helperText}
      </p>
    )}
  </div>
);

export const TailwindSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
}: any) => (
  <div className="flex flex-col w-full">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full p-2 border ${error ? "border-red-500" : "border-gray-300"} bg-white rounded-md focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
    >
      <option value="" disabled>
        {placeholder || `Select ${label}`}
      </option>
      {options.map((option: any) => (
        <option key={option.id || option.name} value={option.id || option.name}>
          {option.name}
        </option>
      ))}
    </select>
    {helperText && (
      <p className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}>
        {helperText}
      </p>
    )}
  </div>
);

export const TailwindAlert = ({
  severity,
  children,
}: {
  severity: "success" | "error";
  children: React.ReactNode;
}) => {
  const baseClasses = "p-4 rounded-md text-sm mb-4";
  const colorClasses =
    severity === "success"
      ? "bg-green-100 text-green-700 border border-green-400"
      : "bg-red-100 text-red-700 border border-red-400";
  return <div className={`${baseClasses} ${colorClasses}`}>{children}</div>;
};

const CloudUploadIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M10.5 3.75a6 6 0 0 0-5.61 8.845 3.75 3.75 0 0 0-4.162-4.162 6 6 0 0 0 8.845-5.61Z"
      clipRule="evenodd"
    />
    <path d="M11.875 14.125a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM12 18H5.625a3.375 3.375 0 1 1-3.375-3.375V11.25A4.5 4.5 0 0 1 6.375 6.75h11.25A4.5 4.5 0 0 1 22.125 11.25v3.375a3.375 3.375 0 0 1-3.375 3.375H12Z" />
  </svg>
);

export const PhoneInputTailwind = ({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder,
  required = false,
}: any) => (
  <div className="flex flex-col w-full">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-gray-500">+</span>
      </div>
      <input
        id={id}
        type="tel"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-2 pl-6 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-blue-500 focus:border-blue-500`}
      />
    </div>
    {helperText && (
      <p className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}>
        {helperText}
      </p>
    )}
  </div>
);


interface FormValues {
  bio: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  gender: string; // Will store the ID/Name
  phoneNumber: string;
  districtName: string; // Will store the Name/ID
  sectorId: string; // Will store the ID
  residentCountryId: string; // Will store the ID (e.g., "RW")
  whatsAppNumber: string;
  nearlestLandmark: string;
  track: string; // Will store the ID
  cohortId: string; // Will store the ID
  state: string; // Will store the ID
  foundedPosition: string;
  foundedDistrictName: string;
  profileImageId: string;
}

interface FormErrors {
  [key: string]: string;
}

// Initial form state
const initialValues: FormValues = {
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
  cohortId: "",
  state: "",
  foundedPosition: "",
  foundedDistrictName: "",
  profileImageId: "",
};

// Simple manual validation function
const validate = (values: FormValues) => {
  const errors: FormErrors = {};

  if (!values.firstName) {
    errors.firstName = "First name is required";
  }
  if (!values.lastName) {
    errors.lastName = "Last name is required";
  }
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (values.bio.length > 500) {
    errors.bio = "Bio cannot exceed 500 characters";
  }
  if (
    values.linkedin &&
    !/^https?:\/\/(www\.)?linkedin\.com\//i.test(values.linkedin)
  ) {
    errors.linkedin = "Invalid LinkedIn URL";
  }
  if (
    values.instagram &&
    !/^https?:\/\/(www\.)?instagram\.com\//i.test(values.instagram)
  ) {
    errors.instagram = "Invalid Instagram URL";
  }
  if (
    values.twitter &&
    !/^https?:\/\/(www\.)?twitter\.com\//i.test(values.twitter) &&
    !/^https?:\/\/(www\.)?x\.com\//i.test(values.twitter)
  ) {
    errors.twitter = "Invalid Twitter/X URL";
  }
  if (
    values.facebook &&
    !/^https?:\/\/(www\.)?facebook\.com\//i.test(values.facebook)
  ) {
    errors.facebook = "Invalid Facebook URL";
  }
  if (values.phoneNumber && !/^\+?[0-9]+$/i.test(values.phoneNumber)) {
    errors.phoneNumber = "Phone number must be digits only";
  }
  if (values.whatsAppNumber && !/^\+?[0-9]+$/i.test(values.whatsAppNumber)) {
    errors.whatsAppNumber = "WhatsApp number must be digits only";
  }
  if (!values.gender) {
    errors.gender = "Gender is required";
  }
  if (!values.track) {
    errors.track = "Track is required";
  }
  if (!values.residentCountryId) {
    errors.residentCountryId = "Resident Country is required";
  }

  // Rwanda specific fields conditional validation
  if (values.residentCountryId === "RW") {
    if (!values.districtName) errors.districtName = "District is required";
    if (!values.sectorId) errors.sectorId = "Sector is required";
  } else if (values.residentCountryId && !values.state) {
    // Other countries need a state/province
    errors.state = "State/Province is required";
  }

  return errors;
};

// --- Main Component ---

function AddPersonalInfo({ canMove }: { canMove: any }) {
  const user = getUser();

  // API Data States (existing)
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<ResidentDistrict[]>([]);
  const [sectors, setSectors] = useState<ResidentSector[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  // UI/Form Flow States (existing)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state for submit

  // Form States (replacing Formik)
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Memoize state variables for RTK Query skipping logic
  const residentCountryId = formValues.residentCountryId;
  const districtName = formValues.districtName;

  // RTK Query Hooks (existing logic preserved)
  const { data: GenderData } = useGenderQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: StatesData } = useStatesByCountryQuery(residentCountryId, {
    skip: !residentCountryId,
  });
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CohortsData } = useCohortsQuery("");
  const { data: SectorsData } = useSectorsByDistrictQuery(districtName, {
    skip: !districtName || residentCountryId !== "RW",
  });
  const { data: TracksData } = useTracksQuery("");

  const [createUserProfile] = useCreateUserProfileMutation();
  const [uploadPicture] = useUploadPictureMutation();

  // Data fetching effects (existing logic preserved)
  useEffect(() => {
    if (TracksData) setTracks(TracksData?.data || []);
  }, [TracksData]);

  useEffect(() => {
    if (GenderData) setGenders(GenderData?.data || []);
  }, [GenderData]);

  useEffect(() => {
    if (CohortsData) setCohorts(CohortsData?.data || []);
  }, [CohortsData]);

  useEffect(() => {
    // When district changes, reset sector and states if country is changing
    if (SectorsData) setSectors(SectorsData?.data || []);
  }, [SectorsData]);

  useEffect(() => {
    if (StatesData) setStates(StatesData?.data || []);
  }, [StatesData]);

  useEffect(() => {
    if (DistrictData) setDistricts(DistrictData?.data || []);
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData) setCountries(CountryData?.data || []);
  }, [CountryData]);

  // Error/Success clearing effect (existing logic preserved)
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // --- New Manual Form Handlers ---

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));

    // Real-time validation after touch/initial change
    if (touched[id]) {
      const newValues = { ...formValues, [id]: value };
      const newErrors = validate(newValues);
      setFormErrors((prev) => ({ ...prev, [id]: newErrors[id] || "" }));
    }

    // Special logic for cascading selects
    if (id === "residentCountryId") {
      setFormValues((prev) => ({
        ...prev,
        districtName: "",
        sectorId: "",
        state: "",
      })); // Clear dependent fields
      setFormErrors((prev) => ({
        ...prev,
        districtName: "",
        sectorId: "",
        state: "",
      }));
    }
    if (id === "districtName") {
      setFormValues((prev) => ({ ...prev, sectorId: "" })); // Clear dependent field
      setFormErrors((prev) => ({ ...prev, sectorId: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));

    // Validate on blur
    const newErrors = validate(formValues);
    setFormErrors((prev) => ({ ...prev, [id]: newErrors[id] || "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageData(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUploadSuccess(false);
    }
  };

  const handleFileUpload = async () => {
    if (imageData) {
      setLoading(true);
      setError("");
      setSuccess("");
      try {
        const formData = new FormData();
        formData.append("profileImage", imageData);
        formData.append("userId", user?.id);

        const data = await uploadPicture(formData).unwrap();

        if (data?.image) {
          setSuccess("Image uploaded successfully!");
          // Manually update the form value for profileImageId
          setFormValues((prev) => ({ ...prev, profileImageId: data.image.id }));
          setUploadSuccess(true);
        }
      } catch (error: any) {
        setError(error?.error || "Image upload failed!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Main Submit Handler (replaces formik.handleSubmit and your original handleSubmit logic)
  const handleSubmit = async () => {
    // 1. Run full validation
    const errors = validate(formValues);
    setFormErrors(errors);

    // Set all fields as touched for visibility
    const newTouched: { [key: string]: boolean } = {};
    Object.keys(formValues).forEach((key) => {
      newTouched[key] = true;
    });
    setTouched(newTouched);

    // 2. Check for errors
    if (Object.keys(errors).length > 0) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const values = formValues;

    try {
      // Find the gender name to pass to the API (since gender state stores ID)
      const selectedGender = genders.find((g) => g.id === values.gender);

      const res = await createUserProfile({
        user: {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          email: values.email,
          linkedin: values.linkedin,
          instagram: values.instagram,
          twitter: values.twitter,
          facebook: values.facebook,
          bio: values.bio,
          // Removed react-phone-number-input dependency
          phoneNumber: values.phoneNumber,
          whatsappNumber: values.whatsAppNumber,
          genderName: selectedGender?.name, // Use the actual name
          nearestLandmark: values.nearlestLandmark,
          cohortId: values.cohortId,
          trackId: values.track,
          // Conditional fields based on residentCountryId
          residentDistrictId:
            values.residentCountryId === "RW" ? values.districtName : undefined,
          residentSectorId:
            values.residentCountryId === "RW" ? values.sectorId : undefined,
          state: values.residentCountryId !== "RW" ? values.state : undefined,
          residentCountryId: values.residentCountryId,
          profileImageId: values.profileImageId,
        },
      }).unwrap();

      if (res.message) {
        // Reset form state on success
        setFormValues(initialValues);
        setFormErrors({});
        setTouched({});
        setImagePreview(null);
        setImageData(null);
        setUploadSuccess(false);
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
    } finally {
      setLoading(false);
    }
  };

  // Use a generic handler for select components, since they use ID/Name as value
  const handleSelectChange =
    (id: keyof FormValues) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      // Update state
      setFormValues((prev) => ({ ...prev, [id]: value }));
      setTouched((prev) => ({ ...prev, [id]: true }));

      // Logic for dependent fields
      if (id === "residentCountryId") {
        setFormValues((prev) => ({
          ...prev,
          districtName: "",
          sectorId: "",
          state: "",
        })); // Clear dependent fields
      }
      if (id === "districtName") {
        setFormValues((prev) => ({ ...prev, sectorId: "" })); // Clear dependent field
      }

      // Validate
      const newValues = { ...formValues, [id]: value };
      const newErrors = validate(newValues);
      setFormErrors((prev) => ({ ...prev, [id]: newErrors[id] || "" }));
    };

  return (
    <div className="p-4">
      {/* Alert Replacements */}
      {success && <TailwindAlert severity="success">{success}</TailwindAlert>}
      {error && <TailwindAlert severity="error">{error}</TailwindAlert>}

      <div className="relative border-b pb-4 mb-4">
        <div className="flex items-start justify-between p-2">
          {/* File Upload Button Replacement */}
          <div className="flex flex-col items-start">
            <label
              htmlFor="profileImage"
              className="flex items-center px-4 py-2 font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md cursor-pointer transition duration-150 ease-in-out"
            >
              <CloudUploadIcon className="w-5 h-5 mr-2" />
              Upload Profile Picture
              <input
                id="profileImage"
                type="file"
                className="sr-only" // Visually hidden input using Tailwind
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>

            {imagePreview && (
              <>
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mt-4 h-40 rounded-md w-40 object-cover border border-gray-300 shadow-md"
                />
                <div className="flex gap-2 items-center my-2">
                  {!uploadSuccess && (
                    <TailwindButton
                      onClick={handleFileUpload}
                      className="bg-green-500 hover:bg-green-600 px-3 py-1 text-sm"
                      disabled={loading}
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </TailwindButton>
                  )}
                  <TailwindButton
                    onClick={() => {
                      setImagePreview(null);
                      setImageData(null);
                      setUploadSuccess(false);
                      setFormValues((prev) => ({
                        ...prev,
                        profileImageId: "",
                      }));
                    }}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm"
                  >
                    Clear
                  </TailwindButton>
                </div>
              </>
            )}
          </div>

          <TailwindButton
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </TailwindButton>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <TailwindInput
          id="bio"
          label="Biography"
          multiline
          rows={5}
          value={formValues.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter the user's BIO..."
          error={!!formErrors.bio}
          helperText={formErrors.bio}
        />

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <TailwindInput
            id="firstName"
            label="First Name:"
            value={formValues.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="First Name"
            required
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
          />
          <TailwindInput
            id="middleName"
            label="Middle Name:"
            value={formValues.middleName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Middle Name"
            error={!!formErrors.middleName}
            helperText={formErrors.middleName}
          />
          <TailwindInput
            id="lastName"
            label="Last Name:"
            value={formValues.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Last Name"
            required
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
          />
          <TailwindInput
            id="email"
            label="Email:"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Email"
            required
            error={!!formErrors.email}
            helperText={formErrors.email}
          />

          {/* Phone Input Replacement */}
          <PhoneInputTailwind
            id="phoneNumber"
            label="Phone Number:"
            value={formValues.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. +1 555 123 4567"
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
          />
          {/* WhatsApp Input Replacement */}
          <PhoneInputTailwind
            id="whatsAppNumber"
            label="WhatsApp Number:"
            value={formValues.whatsAppNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. +1 555 123 4567"
            error={!!formErrors.whatsAppNumber}
            helperText={formErrors.whatsAppNumber}
          />

          <TailwindSelect
            id="gender"
            label="Gender"
            value={formValues.gender}
            onChange={handleSelectChange("gender")}
            onBlur={handleBlur}
            options={genders}
            required
            placeholder="Select Gender"
            error={!!formErrors.gender}
            helperText={formErrors.gender}
          />

          <TailwindSelect
            id="residentCountryId"
            label="Resident Country"
            value={formValues.residentCountryId}
            onChange={handleSelectChange("residentCountryId")}
            onBlur={handleBlur}
            options={countries}
            required
            placeholder="Select Country"
            error={!!formErrors.residentCountryId}
            helperText={formErrors.residentCountryId}
          />

          {formValues.residentCountryId &&
            formValues.residentCountryId !== "RW" && (
              <TailwindSelect
                id="state"
                label="State / Province"
                value={formValues.state}
                onChange={handleSelectChange("state")}
                onBlur={handleBlur}
                options={states}
                required
                placeholder="Select State/Province"
                error={!!formErrors.state}
                helperText={formErrors.state}
                disabled={states.length === 0}
              />
            )}

          {formValues.residentCountryId === "RW" && (
            <TailwindSelect
              id="districtName"
              label="District"
              value={formValues.districtName}
              onChange={handleSelectChange("districtName")}
              onBlur={handleBlur}
              options={districts}
              required
              placeholder="Select District"
              error={!!formErrors.districtName}
              helperText={formErrors.districtName}
              disabled={districts.length === 0}
            />
          )}

          {formValues.residentCountryId === "RW" && (
            <TailwindSelect
              id="sectorId"
              label="Sector"
              value={formValues.sectorId}
              onChange={handleSelectChange("sectorId")}
              onBlur={handleBlur}
              options={sectors}
              required
              placeholder="Select Sector"
              error={!!formErrors.sectorId}
              helperText={formErrors.sectorId}
              disabled={sectors.length === 0}
            />
          )}

          <TailwindSelect
            id="cohortId"
            label="Cohort"
            value={formValues.cohortId}
            onChange={handleSelectChange("cohortId")}
            onBlur={handleBlur}
            options={cohorts}
            placeholder="Select Cohort (Optional)"
            error={!!formErrors.cohortId}
            helperText={formErrors.cohortId}
          />

          <TailwindSelect
            id="track"
            label="Track"
            value={formValues.track}
            onChange={handleSelectChange("track")}
            onBlur={handleBlur}
            options={tracks}
            required
            placeholder="Select Track"
            error={!!formErrors.track}
            helperText={formErrors.track}
          />

          <TailwindInput
            id="nearlestLandmark"
            label="Nearest Landmark:"
            value={formValues.nearlestLandmark}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="What's the popular place near you?"
            error={!!formErrors.nearlestLandmark}
            helperText={formErrors.nearlestLandmark}
          />

          {/* Social Media Links */}
          <TailwindInput
            id="linkedin"
            label="LinkedIn Account (URL):"
            value={formValues.linkedin}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://linkedin.com/in/..."
            error={!!formErrors.linkedin}
            helperText={formErrors.linkedin}
          />
          <TailwindInput
            id="twitter"
            label="X (Twitter) Account (URL):"
            value={formValues.twitter}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://x.com/..."
            error={!!formErrors.twitter}
            helperText={formErrors.twitter}
          />
          <TailwindInput
            id="instagram"
            label="Instagram Account (URL):"
            value={formValues.instagram}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://instagram.com/..."
            error={!!formErrors.instagram}
            helperText={formErrors.instagram}
          />
          <TailwindInput
            id="facebook"
            label="Facebook Account (URL):"
            value={formValues.facebook}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="https://facebook.com/..."
            error={!!formErrors.facebook}
            helperText={formErrors.facebook}
          />
        </div>
      </form>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <TailwindButton
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit All Data"}
        </TailwindButton>
      </div>
    </div>
  );
}

export default AddPersonalInfo;
