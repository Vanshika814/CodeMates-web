import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import React from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import { useUser, SignOutButton, SignInButton } from "@clerk/clerk-react";

// Logo
export const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

// Search icon
export const SearchIcon = ({ size = 24, strokeWidth = 1.5 }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size}
    width={size}
    viewBox="0 0 24 24"
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

const MainNavbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  // Debug user data
  React.useEffect(() => {
    if (user) {
      console.log('User object:', user);
      console.log('User imageUrl:', user.imageUrl);
      console.log('User profileImageUrl:', user.profileImageUrl);
      console.log('User hasImage:', user.hasImage);
      console.log('User fullName:', user.fullName);
      console.log('User username:', user.username);
      console.log('User email:', user.emailAddresses[0]?.emailAddress);
      console.log('User externalAccounts:', user.externalAccounts);
    }
  }, [user]);

  return (
    <Navbar 
      className="bg-black/95 backdrop-blur-sm border-b border-gray-800" 
      maxWidth="full"
      height="4rem"
    >
      <NavbarContent className="flex-1" justify="start">
        {/* Logo */}
        <NavbarBrand className="flex-grow-0">
          <RouterLink to={isSignedIn ? "/feed" : "/"} className="flex items-center gap-2">
            <AcmeLogo />
            <p className="font-bold text-xl text-white">DevTinder</p>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Center Navigation */}
      {isSignedIn && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive={currentPath === '/feed'}>
            <Link
              as={RouterLink}
              to="/feed"
              color={currentPath === '/feed' ? 'secondary' : 'foreground'}
              className="font-medium"
            >
              Feed
            </Link>
          </NavbarItem>
          <NavbarItem isActive={currentPath === '/connections'}>
            <Link
              as={RouterLink}
              to="/connections"
              color={currentPath === '/connections' ? 'secondary' : 'foreground'}
              className="font-medium"
            >
              Connections
            </Link>
          </NavbarItem>
          <NavbarItem isActive={currentPath === '/requests'}>
            <Link
              as={RouterLink}
              to="/requests"
              color={currentPath === '/requests' ? 'secondary' : 'foreground'}
              className="font-medium"
            >
              Requests
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}

      {/* Right Side */}
      <NavbarContent as="div" className="items-center" justify="end">
        {isSignedIn && (
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[16rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Type to search"
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        )}

        {!isLoaded ? (
          <div className="animate-pulse">
            <div className="h-8 w-8 bg-gray-600 rounded-full"></div>
          </div>
        ) : isSignedIn && user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-105"
                color="secondary"
                name={user.fullName || user.username || user.emailAddresses[0]?.emailAddress}
                size="sm"
                src={
                  user.imageUrl || 
                  user.profileImageUrl || 
                  (user.hasImage ? user.imageUrl : null) ||
                  (user.externalAccounts?.[0]?.imageUrl) ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username || user.emailAddresses[0]?.emailAddress || 'User')}&background=8b5cf6&color=fff&size=128`
                }
                showFallback
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" textValue="profile info">
                <div className="flex flex-col">
                  <p className="font-semibold">Signed in as</p>
                  <p className="text-xs text-gray-500">
                    {user.fullName || user.username || user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </DropdownItem>
              <DropdownItem key="profile_link" textValue="profile">
                <Link as={RouterLink} to="/profile" className="block w-full">
                  Profile
                </Link>
              </DropdownItem>
              <DropdownItem key="connections_link" textValue="connections">
                <Link as={RouterLink} to="/connections" className="block w-full">
                  Connections
                </Link>
              </DropdownItem>
              <DropdownItem key="requests_link" textValue="requests">
                <Link as={RouterLink} to="/requests" className="block w-full">
                  Requests
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" textValue="logout">
                <SignOutButton signoutcallback={() => navigate("/")} /> 
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <SignInButton 
            mode="modal"
            fallbackRedirectUrl="/feed"
            signInFallbackRedirectUrl="/feed"
          >
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              Sign In
            </button>
          </SignInButton>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default MainNavbar;
