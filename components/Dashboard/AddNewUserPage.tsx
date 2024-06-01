import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Panel } from "primereact/panel";
import React, { useState } from "react";
import * as Yup from "yup";
import { users } from "./userspage";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    birthDate: string;
    language: string;
    location: string;
    description: string;
}

const addUser = (users: User[], newUser: User): User[] => {
    return [...users, newUser];
};

function NewProfile() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    // const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<User>({
        id: users.length + 1,
        name: '',
        email: '',
        phone: '',
        gender: '',
        birthDate: '',
        language: '',
        location: '',
        description: ''
    });

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof User) => {
        setNewUser({ ...newUser, [field]: e.target.value });
    };

    const handleSaveProfile = () => {
        setUsers(prevUsers => addUser(prevUsers, newUser));
        router.push("/dashboard/users");
    };

    const formik = useFormik({
        initialValues: {
            id: Date.now(),
            name: "",
            email: "",
            phone: "",
            gender: "",
        },

        validationSchema: Yup.object({
                name: Yup.string().required("name  is required"),
                email: Yup.string().email().required("Email is required"),
                phone: Yup.string().required("Phone Number is required"),
                gender: Yup.string().required("Gender is required"),
               

        }),
        
        onSubmit: (values) => {
            try {
                // Users(prevUsers => addUser(prevUsers, newUser));
                users.push(values)
                formik.resetForm();
                router.push("/dashboard/users");
            } catch (error) {
                console.log(error);
            }
        },
    });

    const Personal = ({formik}) => {
        const [email, setEmail] = useState("");
        const [phoneNumber, setPhoneNumber] = useState("");
        const [gender, setGender] = useState("");
        const [birthDate, setBirthDate] = useState("");
        const [language, setLanguage] = useState("");
        const [location, setLocation] = useState("");

        return (

            <div className="grid grid-cols-2 gap-3">
                <div>
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
                <div>
                    <label>Phone Number:</label>
                    <InputText
                        variant="filled"
                        className="w-full p-3"
                        type="text"
                        placeholder="Phone Number"
                        value={formik.values.phone}
                        onChange={(e) => formik.setFieldValue("phone", e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Gender:</label>
                    <InputText
                        variant="filled"
                        className="w-full p-3"
                        type="text"
                        placeholder="Gender"
                        value={formik.values.gender}
                        onChange={(e) => formik.setFieldValue("gender", e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Birth Date:</label>
                    <InputText
                        variant="filled"
                        className="w-full p-3"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Language:</label>
                    <InputText
                        variant="filled"
                        className="w-full p-3"
                        type="text"
                        placeholder="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <InputText
                        variant="filled"
                        className="w-full p-3"
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                    <div className="grid grid-cols-2 items-center justify-end p-2">
                        <Panel header="Names: ">
                            <InputText
                                variant="filled"
                                className="w-full p-3"
                                type="text"
                                placeholder="FullName"
                                value={formik.values.name}
                        onChange={(e) => formik.setFieldValue("name", e.target.value)}
                            />
                        </Panel>
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
                    <p>
                        <InputTextarea
                            value={newUser.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                            variant="filled"
                            className="w-full p-3"
                            rows={5}
                            autoResize
                        />
                    </p>
                    <div className="my-5">
                        <ul className="-mb-px flex items-center gap-4 text-sm font-medium">
                            {tabs.map((tab, index) => (
                                <li
                                    key={index}
                                    className={`flex-1 ${index === activeTab
                                        ? "border-b border-blue-700 cursor-pointer"
                                        : "cursor-pointer"
                                        }`}
                                    onClick={() => handleTabClick(index)}
                                >
                                    <a
                                        className={`relative flex items-center justify-center gap-2 px-1 py-3 text-gray-500 hover:text-blue-700 font-bold ${index === activeTab ? "text-blue-700" : ""
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

