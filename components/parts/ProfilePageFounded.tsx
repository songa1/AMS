import { User } from "@/types/user";
import DisplayField from "../Other/DisplayField";

export const Founded = ({ user }: { user: User | null }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Your Initiative Name:
      </label>
      <DisplayField text={user?.organizationFounded?.name} />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Main Sector:
      </label>
      <DisplayField text={user?.organizationFounded?.workingSector?.name} />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Your Position:
      </label>
      <DisplayField
        text={user?.positionInFounded ? user?.positionInFounded : "--"}
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Website:
      </label>
      <DisplayField text={user?.organizationFounded?.website} />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-500 mb-1">
        Country:
      </label>
      <DisplayField text={user?.organizationFounded?.country?.name} />
    </div>
    {user?.organizationFounded &&
      user?.organizationFounded?.country?.name === "rwanda" && (
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">
            District:
          </label>
          <DisplayField text={user?.organizationFounded?.district?.name} />
        </div>
      )}
    {user?.organizationFounded &&
      user?.organizationFounded?.country?.name === "rwanda" && (
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">
            Sector:
          </label>
          <DisplayField text={user?.organizationFounded?.sector?.name} />
        </div>
      )}
  </div>
);
