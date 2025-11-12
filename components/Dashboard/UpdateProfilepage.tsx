"use client";

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
  useUploadPictureMutation,
} from "@/lib/features/userSlice";
import { useEffect, useState } from "react";
import { Founded } from "../parts/UpdateProfileFounded";
import { Personal } from "../parts/UpdateProfilePersonal";
import { Employment } from "../parts/UpdateProfileEmployment";
import { User } from "@/types/user";
import Loading from "@/app/loading";
import { TailwindInput } from "./AddMember/AddPersonalInfo";
import { useParams } from "next/navigation";
import { getUser } from "@/helpers/auth";

const getInitialValues = (usr: User | undefined) => ({
  firstName: usr?.firstName || "",
  middleName: usr?.middleName || "",
  lastName: usr?.lastName || "",
  email: usr?.email || "",
  linkedin: usr?.linkedin || "",
  instagram: usr?.instagram || "",
  twitter: usr?.twitter || "",
  facebook: usr?.facebook || "",
  bio: usr?.bio || "",
  gender: usr?.gender || "",
  phoneNumber: usr?.phoneNumber || "",
  districtName: usr?.residentDistrict || "",
  sectorId: usr?.residentSector || "",
  residentCountryId: usr?.residentCountry || "",
  state: usr?.state || "",
  whatsAppNumber: usr?.whatsappNumber || "",
  nearlestLandmark: usr?.nearestLandmark || "",
  track: usr?.track || "",
  cohortId: usr?.cohort || "",
  initiativeName: usr?.organizationFounded?.name || "",
  mainSector: usr?.organizationFounded?.workingSector || "",
  foundedPosition: usr?.positionInFounded || "",
  foundedDistrictName: usr?.organizationFounded?.district || "",
  foundedSectorId: usr?.organizationFounded?.sector || "",
  foundedWebsite: usr?.organizationFounded?.website || "",
  foundedCountry: usr?.organizationFounded?.country || "",
  foundedState: usr?.organizationFounded?.state || "",
  companyName: usr?.organizationEmployed?.name || "",
  companySector: usr?.organizationEmployed?.workingSector || "",
  companyPosition: usr?.positionInEmployed || "",
  companyWebsite: usr?.organizationEmployed?.website || "",
  companyDistrictName: usr?.organizationEmployed?.district || "",
  companySectorId: usr?.organizationEmployed?.sector || "",
  companyState: usr?.organizationEmployed?.state || "",
  companyCountry: usr?.organizationEmployed?.country || "",
  profileImageId: usr?.profileImage || "",
});

function UpdateProfilepage() {
  const { id } = useParams();
  const user = getUser();

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

  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedDistrictFounded, setSelectedDistrictFounded] = useState(null);
  const [selectedDistrictEmployed, setSelectedDistrictEmployed] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [country, setCountry] = useState<string>("");
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
  const usr: User | undefined = UserData;
  const authorized = false; // auth check

  const [values, setValues] = useState<any>(getInitialValues(usr));
  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    if (usr) {
      setValues(getInitialValues(usr));
      if (usr?.residentCountry?.id) setCountry(usr.residentCountry.id);
      if (usr?.organizationEmployed?.country?.id)
        setEmployedCountry(usr.organizationEmployed.country.id);
      if (usr?.organizationFounded?.country?.id)
        setFoundedCountry(usr.organizationFounded.country.id);
    }
  }, [usr]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setValues((prev: any) => ({ ...prev, [id]: value }));
    setFormErrors((prev: any) => ({ ...prev, [id]: undefined })); // Clear error on change
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    let selectedValue;
    try {
      selectedValue = JSON.parse(value);
    } catch (error) {
      selectedValue = value;
    }

    setValues((prev: any) => ({ ...prev, [id]: selectedValue }));
    setFormErrors((prev: any) => ({ ...prev, [id]: undefined })); // Clear error on change

    if (id === "residentCountryId") {
      setValues((prev: any) => ({
        ...prev,
        state: "",
        districtName: "",
        sectorId: "",
      }));
      if (selectedValue.id === "RW") setCountry("RW");
      else setCountry(selectedValue.id);
    } else if (id === "districtName") {
      setValues((prev: any) => ({ ...prev, sectorId: "" }));
    } else if (id === "foundedCountry") {
      setValues((prev: any) => ({
        ...prev,
        foundedState: "",
        foundedDistrictName: "",
        foundedSectorId: "",
      }));
      if (selectedValue.id === "RW") setFoundedCountry("RW");
      else setFoundedCountry(selectedValue.id);
    } else if (id === "foundedDistrictName") {
      setValues((prev: any) => ({ ...prev, foundedSectorId: "" }));
    } else if (id === "companyCountry") {
      setValues((prev: any) => ({
        ...prev,
        companyState: "",
        companyDistrictName: "",
        companySectorId: "",
      }));
      if (selectedValue.id === "RW") setEmployedCountry("RW");
      else setEmployedCountry(selectedValue.id);
    } else if (id === "companyDistrictName") {
      setValues((prev: any) => ({ ...prev, companySectorId: "" }));
    }
  };

  const validateForm = () => {
    const errors: any = {};
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    const phoneRegex = /^[0-9+]+$/;

    if (!values.firstName) errors.firstName = "First name is required";
    if (!values.lastName) errors.lastName = "Last name is required";
    if (!values.email) errors.email = "Email is required";
    if (values.email && !values.email.includes("@"))
      errors.email = "Invalid email address";
    if (!values.residentCountryId)
      errors.residentCountryId = "Resident country is required";

    if (values.linkedin && !urlRegex.test(values.linkedin))
      errors.linkedin = "Invalid LinkedIn URL";
    if (values.twitter && !urlRegex.test(values.twitter))
      errors.twitter = "Invalid X (Twitter) URL";
    if (values.instagram && !urlRegex.test(values.instagram))
      errors.instagram = "Invalid Instagram URL";
    if (values.facebook && !urlRegex.test(values.facebook))
      errors.facebook = "Invalid Facebook URL";

    if (values.phoneNumber && !phoneRegex.test(values.phoneNumber))
      errors.phoneNumber = "Phone number must be digits and '+' only";
    if (values.whatsAppNumber && !phoneRegex.test(values.whatsAppNumber))
      errors.whatsAppNumber = "WhatsApp number must be digits and '+' only";

    if (values.bio && values.bio.length > 500)
      errors.bio = "Bio cannot exceed 500 characters";
    if (values.nearlestLandmark && values.nearlestLandmark.length > 255)
      errors.nearlestLandmark = "Landmark cannot exceed 255 characters";

    if (values.foundedWebsite && !urlRegex.test(values.foundedWebsite))
      errors.foundedWebsite = "Invalid website URL";
    if (values.companyWebsite && !urlRegex.test(values.companyWebsite))
      errors.companyWebsite = "Invalid website URL";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { data: GenderData } = useGenderQuery("");
  const { data: CountryData } = useCountriesQuery("");
  const { data: DistrictData } = useDistrictsQuery("");
  const { data: CohortsData } = useCohortsQuery("");
  const { data: WorkingSectorsData } = useWorkingSectorQuery("");
  const { data: TracksData } = useTracksQuery("");

  const { data: SectorsData } = useSectorsByDistrictQuery(selectedDistrict, {
    skip: !selectedDistrict,
  });
  const { data: SectorsDataFounded } = useSectorsByDistrictQuery(
    selectedDistrictFounded,
    { skip: !selectedDistrictFounded }
  );
  const { data: SectorsDataEmployed } = useSectorsByDistrictQuery(
    selectedDistrictEmployed,
    { skip: !selectedDistrictEmployed }
  );
  const { data: StatesData } = useStatesByCountryQuery(country, {
    skip: !country,
  });
  const { data: EmployedStatesData } = useStatesByCountryQuery(
    employedCountry,
    { skip: !employedCountry }
  );
  const { data: FoundedStatesData } = useStatesByCountryQuery(foundedCountry, {
    skip: !foundedCountry,
  });

  const [uploadPicture] = useUploadPictureMutation();

  useEffect(() => {
    if (WorkingSectorsData) {
      setWorkingSectors(WorkingSectorsData?.data || []);
      setWorkingSectorsEmployed(WorkingSectorsData?.data || []);
    }
  }, [WorkingSectorsData]);

  useEffect(() => {
    if (TracksData) {
      setTracks(TracksData?.data || []);
    }
  }, [TracksData]);

  useEffect(() => {
    if (GenderData) {
      setGenders(GenderData?.data || []);
    }
  }, [GenderData]);

  useEffect(() => {
    if (CohortsData) {
      setCohorts(CohortsData?.data || []);
    }
  }, [CohortsData]);

  useEffect(() => {
    if (SectorsData) {
      setSectors(SectorsData?.data || []);
    }
  }, [SectorsData]);

  useEffect(() => {
    if (SectorsDataEmployed) {
      setSectorsEmployed(SectorsDataEmployed?.data || []);
    }
  }, [SectorsDataEmployed]);

  useEffect(() => {
    if (SectorsDataFounded) {
      setSectorsFounded(SectorsDataFounded?.data || []);
    }
  }, [SectorsDataFounded]);

  useEffect(() => {
    if (DistrictData) {
      setDistricts(DistrictData?.data || []);
      setDistrictsEmployed(DistrictData?.data || []);
      setDistrictsFounded(DistrictData?.data || []);
    }
  }, [DistrictData]);

  useEffect(() => {
    if (CountryData) {
      setCountries(CountryData?.data || []);
      setCountriesEmployed(CountryData?.data || []);
      setCountriesFounded(CountryData?.data || []);
    }
  }, [CountryData]);

  useEffect(() => {
    if (StatesData) {
      setStates(StatesData?.data || []);
    }
  }, [StatesData]);

  useEffect(() => {
    if (EmployedStatesData) {
      setEmployedStates(EmployedStatesData?.data || []);
    }
  }, [EmployedStatesData]);

  useEffect(() => {
    if (FoundedStatesData) {
      setFoundedStates(FoundedStatesData?.data || []);
    }
  }, [FoundedStatesData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 10000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError("Please fix the validation errors before saving.");
      return;
    }

    setIsLoading(true);
    const formValues: any = values;

    try {
      const res = await updatedUser({
        userId: usr?.id,
        user: {
          firstName: formValues.firstName,
          middleName: formValues.middleName,
          lastName: formValues.lastName,
          email: formValues.email,
          linkedin: formValues.linkedin,
          instagram: formValues.instagram,
          twitter: formValues.twitter,
          facebook: formValues.facebook,
          bio: formValues.bio,
          phoneNumber: formValues.phoneNumber,
          whatsappNumber: formValues.whatsAppNumber,
          genderName: formValues.gender?.name, // Assumes gender is an object from dropdown
          nearestLandmark: formValues.nearlestLandmark,
          cohortId: formValues.cohortId?.id,
          trackId: formValues.track?.id,
          residentDistrictId: formValues.districtName?.id,
          residentSectorId: formValues.sectorId?.id,
          residentCountryId: formValues.residentCountryId?.id,
          state: formValues.state?.id,
          positionInFounded: formValues.foundedPosition,
          positionInEmployed: formValues.companyPosition,
          profileImageId: formValues.profileImageId?.id,
        },
        organizationFounded: {
          id: usr?.organizationFounded?.id,
          name: formValues.initiativeName,
          workingSector: formValues.mainSector?.id,
          countryId: formValues.foundedCountry?.id,
          state: formValues.foundedState?.id,
          districtId: formValues.foundedDistrictName?.name, // Use name as per original logic
          sectorId: formValues.foundedSectorId?.id,
          website: formValues.foundedWebsite,
        },
        organizationEmployed: {
          id: usr?.organizationEmployed?.id,
          name: formValues.companyName,
          workingSector: formValues.companySector?.id,
          countryId: formValues.companyCountry?.id,
          state: formValues.companyState?.id,
          districtId: formValues.companyDistrictName?.name, // Use name as per original logic
          sectorId: formValues.companySectorId?.id,
          website: formValues.companyWebsite,
        },
      }).unwrap();

      if (res.message) {
        // Custom reset logic (replaces formik.resetForm)
        setValues(getInitialValues(usr)); // Re-initialize with current user data (or empty)
        setImagePreview(null);
        setImageData(null);
        setUploadSuccess(false);

        if (formValues.profileImageId) {
          setValues((prev: any) => ({ ...prev, profileImageId: "" }));
        }
        setSuccess("User updated successfully!");
        refetch(); // Refresh user data

        // Navigation logic
        if (id) {
          globalThis.location.href = "/dashboard/users/" + id;
        } else {
          globalThis.location.href = "/dashboard/profile";
        }
      }
    } catch (apiError: any) {
      console.error(apiError);
      let errorMessage =
        "Updating user Failed! Try again, or contact the administrator!";
      if (apiError?.status === 409) {
        errorMessage = apiError?.data?.error;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageData(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (imageData) {
      try {
        const formData = new FormData();
        formData.append("profileImage", imageData);
        formData.append("userId", user?.id || "");

        const data = await uploadPicture(formData).unwrap();

        if (data?.image) {
          // Replaced Toast with local state update
          setSuccess("Image uploaded successfully!");
          setValues((prev: any) => ({ ...prev, profileImageId: data.image }));
          setUploadSuccess(true);
        }
      } catch (apiError: any) {
        // Replaced Toast with local state update
        setError(apiError?.error || "Image upload failed.");
      }
    }
  };

  const tabs = [
    {
      label: "Personal",
      content: (
        <Personal
          values={values}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          errors={formErrors}
          sectors={sectors}
          cohorts={cohorts}
          districts={districts}
          genders={genders}
          countries={countries}
          usr={usr as User}
          setSelectedDistrict={setSelectedDistrict}
          tracks={tracks}
          auth={authorized}
          states={states}
          setCountry={setCountry}
          changeEmail={changeEmail}
          setChangeEmail={setChangeEmail}
        />
      ),
    },
    {
      label: "Your Initiative",
      content: (
        <Founded
          values={values}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          errors={formErrors}
          setSelectedDistrict={setSelectedDistrictFounded}
          districts={districtsFounded}
          sectors={sectorsFounded}
          countries={countriesFounded}
          workingSectors={workingSectors}
          usr={usr as User}
          auth={authorized}
          states={foundedStates}
          setCountry={setFoundedCountry}
        />
      ),
    },
    {
      label: "Employment",
      content: (
        <Employment
          values={values}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          errors={formErrors}
          setSelectedDistrict={setSelectedDistrictEmployed}
          districts={districtsEmployed}
          sectors={sectorsEmployed}
          countries={countriesEmployed}
          workingSectors={workingSectorsEmployed}
          usr={usr as User}
          auth={authorized}
          states={employedStates}
          setCountry={setEmployedCountry}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 md:p-8 bg-white shadow-lg rounded-xl">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline ml-2">{success}</span>
        </div>
      )}

      <div className="w-full">
        <div className="relative border-b pb-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <label className="text-gray-700 font-medium mb-1 block">
                Profile Picture:
              </label>
              <input
                disabled={authorized}
                type="file"
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handlePreview}
              />
              {imagePreview && (
                <>
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="mt-4 h-40 w-40 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="flex gap-2 items-center mt-3">
                    {!uploadSuccess && (
                      <button
                        onClick={handleFileUpload}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
                      >
                        Upload
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setImageData(null);
                        setUploadSuccess(false);
                        setValues((prev: any) => ({
                          ...prev,
                          profileImageId: "",
                        }));
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* Save Button */}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 mt-4 sm:mt-0"
              type="button" // Change to button type to prevent default form submission on enter
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="mt-6">
          <TailwindInput
            label="Biography"
            id="bio"
            type="textarea"
            rows={5}
            placeholder="Enter the user's BIO..."
            value={values.bio}
            onChange={handleChange}
            disabled={authorized}
            error={formErrors.bio}
          />
        </div>

        <div className="mt-8">
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              {tabs.map((tab, index) => (
                <li key={index} className="mr-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(index);
                    }}
                    className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-150 ${
                      index === activeTab
                        ? "text-blue-600 border-blue-600 font-bold"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">{tabs[activeTab].content}</div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfilepage;
