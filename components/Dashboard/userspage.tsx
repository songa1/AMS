// pages/users.tsx
"use client";

import React from "react";
import { Avatar } from "primereact/avatar";

import { useRouter } from "next/navigation";


const users = [
    {
        id: 1,
        name: "Mukamugema Sophie",
        email: "sophiemukamugema@gmail.com",
        phone: "+250789635342",
        gender: "Female",

    },
    {
    id: 2,
    name: "Songa Achille",
    email: "achillesonga12@gmail.com",
    phone: "+25078963234",
    gender: "male",
},

{ id: 1,
    name: "Valens Ntirenganya",
    email: "vava12@gmail.com",
    phone: "+250789635342",
    gender: "male",}
   
    // Add more user objects here
];

const UsersPage = () => {
    const router = useRouter();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <div className="flex justify-between ">

                <div w-full="border-none bg-transparent px-4 text gray-900 outline none"><input className="border border-gray" type="search" placeholder="search" />
                <button className="m-2 rounded bg-green-800 px-4 py-2 text-white">search</button>
                </div>
                <div><button className=" bg-mainBlue text-xs p-1 flex gap-1 rounded">Add a New User</button></div>
            </div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Picture</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Phone</th>
                        <th className="py-2 px-4 border-b">Gender</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b">
                                <Avatar image="/profile.jpg" shape="circle" />
                            </td>
                            <td className="py-2 px-4 border-b">{user.name}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">{user.phone}</td>
                            <td className="py-2 px-4 border-b">{user.gender}</td>

                            <td className="py-2 px-4 flex gap-1 mt-1">
                                <button className=" bg-mainBlue text-xs p-1  rounded">View</button>
                                <button className=" bg-green-400 text-xs p-1 rounded">Edit</button>
                                <button className=" bg-red-600 text-xs p-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;
