// UpdateProfilepage.tsx - Modernized Version
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
import Loading from "@/app/loading";
import { useParams } from "next/navigation";
import { getUser } from "@/helpers/auth";
import { MdCloudUpload, MdClose, MdEdit } from "react-icons/md";
import { Member } from "@/types/user";
import { PageHeader } from "../parts/PageHeader";
import { Loader2, Save } from "lucide-react";
import { TextAreaField } from "../ui/textarea";

const getInitialValues = (usr: Member | undefined) => ({
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
  const [genders, setGenders] = useState<any>([]);
  const [cohorts, setCohorts] = useState<any>([]);
  const [districts, setDistricts] = useState<any>([]);
  const [districtsFounded, setDistrictsFounded] = useState<any>([]);
  const [districtsEmployed, setDistrictsEmployed] = useState<any>([]);
  const [countries, setCountries] = useState<any>([]);
  const [countriesFounded, setCountriesFounded] = useState<any>([]);
  const [countriesEmployed, setCountriesEmployed] = useState<any>([]);
  const [sectors, setSectors] = useState<any>([]);
  const [sectorsEmployed, setSectorsEmployed] = useState<any>([]);
  const [sectorsFounded, setSectorsFounded] = useState<any>([]);
  const [tracks, setTracks] = useState<any>([]);
  const [workingSectors, setWorkingSectors] = useState<any>([]);
  const [workingSectorsEmployed, setWorkingSectorsEmployed] = useState<any>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedDistrictFounded, setSelectedDistrictFounded] =
    useState<any>(null);
  const [selectedDistrictEmployed, setSelectedDistrictEmployed] =
    useState<any>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [country, setCountry] = useState<string>("");
  const [states, setStates] = useState<any>([]);
  const [employedCountry, setEmployedCountry] = useState("");
  const [employedStates, setEmployedStates] = useState<any>([]);
  const [foundedCountry, setFoundedCountry] = useState("");
  const [foundedStates, setFoundedStates] = useState<any>([]);
  const [changeEmail, setChangeEmail] = useState(true);

  const [updatedUser] = useUpdatedUserMutation();
  const { data: UserData, refetch } = useGetOneUserQuery<{ data: Member }>(
    id || user?.id
  );
  const usr: Member | undefined = UserData;
  const authorized = false;

  const [values, setValues] = useState<any>(getInitialValues(usr));
  const [formErrors, setFormErrors] = useState<any>({});

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
    if (usr) {
      setValues(getInitialValues(usr));
      if (usr?.residentCountry?.id) setCountry(usr.residentCountry.id);
      if (usr?.organizationEmployed?.country?.id)
        setEmployedCountry(usr.organizationEmployed.country.id);
      if (usr?.organizationFounded?.country?.id)
        setFoundedCountry(usr.organizationFounded.country.id);

      if (usr.profileImage?.link && !imagePreview) {
        setImagePreview(usr.profileImage.link);
        setValues((prev: any) => ({
          ...prev,
          profileImageId: usr.profileImage,
        }));
      }
    }
  }, [usr]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setValues((prev: any) => ({ ...prev, [id]: value }));
    setFormErrors((prev: any) => ({ ...prev, [id]: undefined }));
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
    setFormErrors((prev: any) => ({ ...prev, [id]: undefined }));

    if (id === "residentCountryId") {
      setValues((prev: any) => ({
        ...prev,
        state: "",
        districtName: "",
        sectorId: "",
      }));
      setCountry(selectedValue.id === "RW" ? "RW" : selectedValue.id);
    } else if (id === "districtName") {
      setValues((prev: any) => ({ ...prev, sectorId: "" }));
    } else if (id === "foundedCountry") {
      setValues((prev: any) => ({
        ...prev,
        foundedState: "",
        foundedDistrictName: "",
        foundedSectorId: "",
      }));
      setFoundedCountry(selectedValue.id === "RW" ? "RW" : selectedValue.id);
    } else if (id === "foundedDistrictName") {
      setValues((prev: any) => ({ ...prev, foundedSectorId: "" }));
    } else if (id === "companyCountry") {
      setValues((prev: any) => ({
        ...prev,
        companyState: "",
        companyDistrictName: "",
        companySectorId: "",
      }));
      setEmployedCountry(selectedValue.id === "RW" ? "RW" : selectedValue.id);
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

    // --- URL Validation ---
    if (values.linkedin && !urlRegex.test(values.linkedin))
      errors.linkedin = "Invalid LinkedIn URL";
    if (values.twitter && !urlRegex.test(values.twitter))
      errors.twitter = "Invalid X (Twitter) URL";
    if (values.instagram && !urlRegex.test(values.instagram))
      errors.instagram = "Invalid Instagram URL";
    if (values.facebook && !urlRegex.test(values.facebook))
      errors.facebook = "Invalid Facebook URL";
    if (values.foundedWebsite && !urlRegex.test(values.foundedWebsite))
      errors.foundedWebsite = "Invalid website URL";
    if (values.companyWebsite && !urlRegex.test(values.companyWebsite))
      errors.companyWebsite = "Invalid website URL";

    // --- Phone Validation ---
    if (values.phoneNumber && !phoneRegex.test(values.phoneNumber))
      errors.phoneNumber = "Phone number must be digits and '+' only";
    if (values.whatsAppNumber && !phoneRegex.test(values.whatsAppNumber))
      errors.whatsAppNumber = "WhatsApp number must be digits and '+' only";

    // --- Length Validation ---
    if (values.bio && values.bio.length > 500)
      errors.bio = "Bio cannot exceed 500 characters";
    if (values.nearlestLandmark && values.nearlestLandmark.length > 255)
      errors.nearlestLandmark = "Landmark cannot exceed 255 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
          genderName: formValues.gender?.name,
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
          districtId: formValues.foundedDistrictName?.id,
          sectorId: formValues.foundedSectorId?.id,
          website: formValues.foundedWebsite,
        },
        organizationEmployed: {
          id: usr?.organizationEmployed?.id,
          name: formValues.companyName,
          workingSector: formValues.companySector?.id,
          countryId: formValues.companyCountry?.id,
          state: formValues.companyState?.id,
          districtId: formValues.companyDistrictName?.id,
          sectorId: formValues.companySectorId?.id,
          website: formValues.companyWebsite,
        },
      }).unwrap();

      if (res.message) {
        setValues(getInitialValues(usr));
        setImagePreview(null);
        setImageData(null);
        setUploadSuccess(false);

        if (formValues.profileImageId) {
          setValues((prev: any) => ({ ...prev, profileImageId: "" }));
        }
        setSuccess("User updated successfully!");
        refetch();

        // Redirect logic
        // globalThis.location.href = id ? `/dashboard/users/${id}` : "/dashboard/profile";
        // NOTE: Commenting out direct navigation to keep the component renderable and testable.
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
      setUploadSuccess(false); // Reset upload status
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (imageData && usr?.id) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("profileImage", imageData);
        formData.append("userId", usr.id);

        const data = await uploadPicture(formData).unwrap();

        if (data?.image) {
          setSuccess("Image uploaded successfully!");
          setValues((prev: any) => ({ ...prev, profileImageId: data.image }));
          setUploadSuccess(true);
          refetch();
        }
      } catch (apiError: any) {
        setError(apiError?.error || "Image upload failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageData(null);
    setUploadSuccess(false);
    setValues((prev: any) => ({ ...prev, profileImageId: "" }));
  };

  const tabs = [
    {
      label: "Personal & Social",
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
          usr={usr as Member}
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
      label: "Your Initiative (Founded)",
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
          usr={usr as Member}
          auth={authorized}
          states={foundedStates}
          setCountry={setFoundedCountry}
        />
      ),
    },
    {
      label: "Employment History",
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
          usr={usr as Member}
          auth={authorized}
          states={employedStates}
          setCountry={setEmployedCountry}
        />
      ),
    },
  ];

  if (usr === undefined) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Update Profile"
        actionTitle="Save Changes"
        Icon={Save}
        onAction={handleSubmit}
        loading={isLoading}
      />
      {(error || success) && (
        <div
          className={`px-4 py-3 rounded-xl relative mb-6 shadow-md transition-all duration-300 ${
            error
              ? "bg-red-50 border border-red-400 text-red-700"
              : "bg-green-50 border border-green-400 text-green-700"
          }`}
          role="alert"
        >
          <strong className="font-bold">{error ? "Error!" : "Success!"}</strong>
          <span className="block sm:inline ml-2">{error || success}</span>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8">
        <div className="border-b border-gray-200 pb-6 mb-8 flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center lg:items-start shrink-0 w-full lg:w-1/4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Profile Picture
            </h3>
            <div className="relative w-40 h-40">
              <img
                src={
                  imagePreview ||
                  usr?.profileImage?.link ||
                  "/placeholder-avatar.png"
                }
                alt="Profile Preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-lg"
              />
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white cursor-pointer hover:bg-primary transition-colors shadow-lg"
                title="Change Profile Picture"
              >
                <MdEdit className="w-5 h-5" />
                <input
                  id="profile-image-upload"
                  type="file"
                  className="hidden"
                  onChange={handlePreview}
                  disabled={authorized}
                />
              </label>
            </div>

            {imageData && !uploadSuccess && (
              <div className="flex gap-2 items-center mt-4">
                <button
                  onClick={handleFileUpload}
                  className="flex items-center bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-lg transition disabled:opacity-50"
                  disabled={authorized || isLoading}
                >
                  <MdCloudUpload className="w-4 h-4 mr-2" />
                  {isLoading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            )}
            {(imagePreview || usr?.profileImage?.link) && (
              <button
                onClick={handleClearImage}
                className="flex items-center mt-3 text-red-600 hover:text-red-700 text-sm font-medium transition"
              >
                <MdClose className="w-4 h-4 mr-1" />
                Clear Image
              </button>
            )}
          </div>

          <div className="flex-1 lg:w-3/4">
            <TextAreaField
              label="Biography (Max 500 characters)"
              placeholder="Enter a brief biography (e.g., your mission, experience, interests)..."
              value={values.bio}
              onChange={handleChange}
              name="bio"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-base font-medium text-center text-gray-500">
              {tabs.map((tab, index) => (
                <li key={index + 1} className="mr-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(index);
                    }}
                    className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-150 ease-in-out 
                      ${
                        index === activeTab
                          ? "text-primary border-primary font-semibold"
                          : "border-transparent hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            {/* The content rendering relies on the external components (Personal, Founded, Employment) */}
            {tabs[activeTab].content}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfilepage;
