import Link from 'next/link';
import React from 'react'

type DropdownMenuProps = {
  dropdownOpen: boolean;
  setDropdownOpen: (value: boolean) => void;
  openAccountModal?: () => void;
openChainModal?: () => void;
userType: string;
};

function DropdownMenu({
    setDropdownOpen,
    openAccountModal,
    userType,
}: DropdownMenuProps) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 top-10">
    <button
      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
      onClick={async () => {
        setDropdownOpen(false);
        await openAccountModal?.();
      }}
    >
      Account
    </button>
    <Link
        href={`/dashboards/${userType}-dashboard`}
        onClick={() => setDropdownOpen(false)}
        >
    <button
      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
    >
      Dashboard
    </button>
    </Link>

  </div>
  )
}

export default DropdownMenu