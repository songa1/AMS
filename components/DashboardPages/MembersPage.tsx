// MembersPage.tsx
"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MdSearch,
  MdNavigateBefore,
  MdNavigateNext,
  MdAdd,
} from "react-icons/md";
import { PageHeader } from "../parts/PageHeader";
import { Link2 } from "lucide-react";
import { EmptyState } from "../parts/EmptyState";
import Loading from "@/app/loading";
import { useUsersQuery } from "@/lib/features/userSlice";
import {
  useCohortsQuery,
  useCountriesQuery,
  useTracksQuery,
} from "@/lib/features/otherSlice";
import { FilterDropdown } from "../ui/filter-dropdown";
import { Member } from "@/types/user";
import InviteUserModal from "../parts/models/InviteUser";

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    cohort: "",
    track: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const MEMBERS_PER_PAGE = 10;

  const {
    data: members = [],
    isLoading: usersLoading,
    isSuccess: usersSuccess,
  } = useUsersQuery("");

  const {
    data: countries = [],
    isLoading: countriesLoading,
    isSuccess: countriesSuccess,
  } = useCountriesQuery("");

  const {
    data: cohorts = [],
    isLoading: cohortsLoading,
    isSuccess: cohortsSuccess,
  } = useCohortsQuery("");

  const {
    data: tracks = [],
    isLoading: tracksLoading,
    isSuccess: tracksSuccess,
  } = useTracksQuery("");

  const isAnyLoading =
    usersLoading || countriesLoading || cohortsLoading || tracksLoading;
  const isReady =
    usersSuccess && countriesSuccess && cohortsSuccess && tracksSuccess;

  const filteredMembers = useMemo(() => {
    return (members?.data ?? []).filter((member: Member) => {
      const matchesSearch =
        member?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.country ||
          member?.residentCountry?.name === filters.country) &&
        (!filters.cohort || member?.cohort?.name === filters.cohort) &&
        (!filters.track || member?.track?.name === filters.track);

      return matchesSearch && matchesFilters;
    });
  }, [searchTerm, filters, usersSuccess]);

  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);
  const currentMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
    const endIndex = startIndex + MEMBERS_PER_PAGE;
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, currentPage]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isAnyLoading || !isReady) return <Loading />;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <PageHeader
        title="Member Directory"
        actionTitle="Invite New Member"
        Icon={MdAdd}
        onAction={() => setIsModalOpen(true)}
        loading={false}
      />

      <div className="bg-white p-5 rounded-xl shadow-lg mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-600 mb-1 flex items-center">
              <MdSearch className="w-5 h-5 mr-1" />
              Search (Name or Email)
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary shadow-sm w-full"
            />
          </div>

          <FilterDropdown
            title="Country"
            options={countries?.data || []}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            value={filters.country}
          />
          <FilterDropdown
            title="Cohort"
            options={cohorts?.data || []}
            onChange={(e) => handleFilterChange("cohort", e.target.value)}
            value={filters.cohort}
          />
          <FilterDropdown
            title="Track"
            options={tracks?.data || []}
            onChange={(e) => handleFilterChange("track", e.target.value)}
            value={filters.track}
          />

          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ country: "", cohort: "", track: "" });
              setCurrentPage(1);
            }}
            className="p-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Found <b>{filteredMembers.length}</b> members matching your criteria.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country/Province
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cohort/Track
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentMembers.map((member: Member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member?.firstName + " " + member?.middleName ||
                    "" + " " + member?.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member?.residentCountry?.name ?? "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member?.cohort?.name ?? "N/A"} /{" "}
                  {member?.track?.name ?? "N/A"}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member === "Active"
                        ? "bg-green-100 text-green-800"
                        : member.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {member.status}
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/dashboard/users/${member.id}`} passHref>
                    <Link2 className="text-primary hover:text-primary/80">
                      View
                    </Link2>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMembers.length <= 0 && <EmptyState isFiltered={true} />}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-lg">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * MEMBERS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * MEMBERS_PER_PAGE, filteredMembers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredMembers.length}</span>{" "}
            results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MdNavigateBefore className="w-5 h-5" />
            </button>

            <span className="p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MdNavigateNext className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
