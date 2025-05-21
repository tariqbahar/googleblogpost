"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

import Menu from "@/components/Menu";
import Newsletter from "@/app/components/essential/Newsletter";
import Search from "@/app/components/essential/Search";
import config from "@/config/site.config";
import { slugify } from "@/libs/utils/slugify";

const Header = ({ hasCategory, categories }) => {
  const logoWhite = config.logoWhite;
  const logoText = config.logoText;

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const [searchOpen, setSearchOpen] = useState(false);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const toggleNewsletter = () => setNewsletterOpen(!newsletterOpen);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();
  const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = () => {
    signOut();
    setProfileMenuOpen(false);
    setShowSignOutModal(false);
  };

  const { data: session } = useSession();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`bg-secondary ${
          !hasCategory ? "border-b border-[#495c52]" : ""
        }`}
      >
        <div className="container px-5 sm:px-3">
          <div className="row items-center flex-wrap">
            {/* Left: Menu and Newsletter */}
            <div className="col-2 md:col-4">
              <div className="flex items-center gap-x-8">
                {/* Hamburger */}
                <button
                  className="w-8 cursor-pointer [&>span]:has-transition [&>span]:h-[2.5px] [&>span]:block [&>span]:bg-white [&>span]:rounded focus:outline-none"
                  role="button"
                  onClick={toggleMenu}
                  aria-label="Toggle Navigation Menu"
                >
                  <span
                    className={`w-1/2 mb-2 ${
                      menuOpen
                        ? "-rotate-45 translate-x-[3px] translate-y-[15.5px]"
                        : ""
                    }`}
                  ></span>
                  <span
                    className={`w-full mb-2 ${
                      menuOpen ? "rotate-45 scale-x-[0.95]" : ""
                    }`}
                  ></span>
                  <span
                    className={`w-1/2 ml-auto ${
                      menuOpen
                        ? "-rotate-45 translate-x-[-3px] translate-y-[-15.5px]"
                        : ""
                    }`}
                  ></span>
                </button>

                {/* Newsletter Button */}
                <button
                  className="uppercase bg-[#F7EFC2] rounded-full py-2 px-4 text-sm hidden lg:flex items-center gap-2 group focus:outline-none"
                  onClick={toggleNewsletter}
                >
                  <svg
                    className="text-primary transition-none group-hover:rotate-180"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 1C9 5.41828 12.5817 9 17 9C12.5817 9 9 12.5817 9 17C9 12.5817 5.41828 9 1 9C5.41828 9 9 5.41828 9 1Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="relative overflow-hidden transition-none [&>span]:block">
                    <span className="group-hover:-translate-y-[200%] group-hover:scale-y-[2] group-hover:rotate-12">
                      Newsletter
                    </span>
                    <span className="absolute left-0 top-0 scale-y-[2] rotate-12 translate-y-[200%] group-hover:translate-y-0 group-hover:scale-y-100 group-hover:rotate-0">
                      Newsletter
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Center: Logo */}
            <div className="col-8 md:col-4 text-center">
              <Link
                href="/"
                className="py-4 sm:py-5 inline-block focus:outline-none"
              >
                {logoWhite ? (
                  <Image
                    src={logoWhite}
                    alt={logoText}
                    width={143}
                    height={30}
                    priority={true}
                    className="w-[120px] sm:w-[143px] h-auto"
                  />
                ) : (
                  <span className="text-3xl text-black">{logoText}</span>
                )}
              </Link>
            </div>

            {/* Right: Search and Auth */}
            <div className="col-2 md:col-4">
              <div className="flex items-center justify-end gap-x-6">
                {/* Search */}
                <button
                  role="button"
                  className="flex items-center uppercase text-sm text-white py-2 focus:outline-none"
                  aria-label="Toggle Search"
                  onClick={toggleSearch}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.3241 18.7231L14.5858 12.9807C15.7171 11.624 16.3975 9.89022 16.3975 7.99659C16.3975 3.67647 12.852 0.163818 8.49092 0.163818C4.12981 0.163818 0.576172 3.68057 0.576172 8.00069C0.576172 12.3208 4.12162 15.8335 8.48272 15.8335C10.3354 15.8335 12.0405 15.1981 13.3931 14.1366L19.1518 19.8953C19.4879 20.2314 19.988 20.2314 20.3241 19.8953C20.6602 19.5592 20.6602 19.0592 20.3241 18.7231ZM2.25667 8.00069C2.25667 4.6069 5.05204 1.84842 8.48272 1.84842C11.9134 1.84842 14.7088 4.6069 14.7088 8.00069C14.7088 11.3945 11.9134 14.153 8.48272 14.153C5.05204 14.153 2.25667 11.3904 2.25667 8.00069Z"
                      fill="#fff"
                    />
                  </svg>
                  <span className="ml-2 hidden sm:inline">Search</span>
                </button>

                {/* Auth buttons */}
                {!session?.user ? (
                  <button
                    onClick={() => signIn()}
                    className="uppercase bg-[#F7EFC2] rounded-full py-2 px-4 text-sm hidden lg:flex items-center gap-2 group focus:outline-none"
                  >
                    <span className="relative overflow-hidden transition-none [&>span]:block">
                      <span className="group-hover:-translate-y-[200%] group-hover:scale-y-[2] group-hover:rotate-12">
                        Sign In
                      </span>
                      <span className="absolute left-0 top-0 scale-y-[2] rotate-12 translate-y-[200%] group-hover:translate-y-0 group-hover:scale-y-100 group-hover:rotate-0">
                        Sign In
                      </span>
                    </span>
                  </button>
                ) : (
                  <div className="relative hidden lg:block" ref={profileRef}>
                    <button
                      onClick={toggleProfileMenu}
                      className="rounded-full border border-white p-[2px] focus:outline-none"
                    >
                      <Image
                        src={session.user.image || "/images/avatar.avif"}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="rounded-full w-9 h-9 object-cover"
                      />
                    </button>

                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-50 py-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => setShowSignOutModal(true)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu component */}
        <Menu
          menuOpen={menuOpen}
          className="top-[64px] sm:top-[71px]"
          menuDark={true}
        />
        {showSignOutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Are you sure you want to sign out?
              </h2>
              <div className="flex justify-center z-50 gap-4">
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Categories */}
      {hasCategory && (
        <div className="bg-secondary overflow-x-auto scrollbar-vertical">
          <ul className="text-center [&>li]:inline-block whitespace-nowrap bg-[#54675b] [&>li]:bg-[#54675b]">
            {categories.slice(0, 9).map((category, key) => (
              <li key={key}>
                <Link
                  className="text-[#BBC5BE] hover:text-white hover:underline py-2 sm:py-4 px-4 sm:px-6 block transition-all capitalize"
                  href={`/category/${slugify(category.name)}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search + Newsletter */}
      <Search toggleSearch={toggleSearch} searchOpen={searchOpen} />
      <Newsletter
        toggleNewsletter={toggleNewsletter}
        newsletterOpen={newsletterOpen}
      />
    </>
  );
};

export default Header;
