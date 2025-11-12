import { User } from "@/types/user";
import DisplayField from "../Other/DisplayField";

export const Employment = ({ user }: { user: User | null }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Company Name:
      </label>
      <DisplayField text={user?.organizationEmployed?.name} />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Company Sector:
      </label>
      <DisplayField text={user?.organizationEmployed?.workingSector?.name} />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Your Position:
      </label>
      <DisplayField text={user?.positionInEmployed || "--"} />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Website:
      </label>
      <DisplayField text={user?.organizationEmployed?.website} />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Country:
      </label>
      <DisplayField text={user?.organizationEmployed?.country?.name} />
    </div>
    {user?.organizationEmployed &&
      user?.organizationEmployed?.country?.id === "rwanda" && (
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">
            District:
          </label>
          <DisplayField text={user?.organizationEmployed?.district?.name} />
        </div>
      )}
    {user?.organizationEmployed &&
      user?.organizationEmployed?.country?.name === "rwanda" && (
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">
            Sector:
          </label>
          {/* Note: Original code had district name here, assuming sector is correct */}
          <DisplayField text={user?.organizationEmployed?.sector?.name} />
        </div>
      )}
  </div>
);
