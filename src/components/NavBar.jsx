import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
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

const MainNavbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    {
      label: 'Feed',
      href: '/feed',
      isActive: currentPath === '/feed',
    },
    {
      label: 'Connections',
      href: '/connections',
      isActive: currentPath === '/connections',
    },
    {
      label: 'Requests',
      href: '/requests',
      isActive: currentPath === '/requests',
    },
    {
      label: 'Profile',
      href: '/profile',
      isActive: currentPath === '/profile',
    },
  ];

  // Debug user data
  React.useEffect(() => {
    if (user) {
      console.log('User object:', user);
      
    }
  }, [user]);

  return (
    <Navbar 
      className="bg-black/95 backdrop-blur-sm" 
      maxWidth="full"
      height="4rem"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile Menu Toggle - Only visible on small screens */}
      {isSignedIn && (
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        </NavbarContent>
      )}

      {/* Mobile Logo - Centered on mobile */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <RouterLink to={isSignedIn ? "/feed" : "/"} className="flex items-center gap-2">
            <AcmeLogo />
            <p className="font-bold text-xl text-white">CodeMates</p>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Layout - Hidden on mobile, flex on sm and up */}
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand className="flex-grow-0">
          <RouterLink to={isSignedIn ? "/feed" : "/"} className="flex items-center gap-2">
            <AcmeLogo />
            <p className="font-bold text-xl text-white">CodeMates</p>
          </RouterLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation - Center */}
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

      {/* Right Side - User Profile/Auth */}
      <NavbarContent as="div" className="items-center" justify="end">
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
            <button className="px-3 py-2 lg:px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              Sign In
            </button>
          </SignInButton>
        )}
      </NavbarContent>

      {/* Mobile Menu - Only shows when toggled on mobile */}
      {isSignedIn && (
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                as={RouterLink}
                to={item.href}
                className="w-full"
                color={item.isActive ? "secondary" : "foreground"}
                size="lg"
                onClick={() => setIsMenuOpen(false)} // Close menu when item is clicked
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem key="logout">
            <SignOutButton signoutcallback={() => navigate("/")} />
          </NavbarMenuItem>
        </NavbarMenu>
      )}
    </Navbar>
  );
};

export default MainNavbar;
