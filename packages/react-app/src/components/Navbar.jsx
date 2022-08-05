import React, { useEffect } from "react";
import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useLoadingContext } from "../context/loading";

function Navbar() {
  const location = useLocation();
  const { isDisconnected, address } = useAccount();
  const navigate = useNavigate();
  const { setLoading } = useLoadingContext;

  // useEffect(() => {
  //   if (isDisconnected) {
  //     setLoading(true);
  //     navigate("/");
  //   }
  // }, [isDisconnected]);

  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "600" : "400",
    };
  };

  return (
    <>
      <Flex
        px={"4em"}
        py={"0.7em"}
        alignItems={"center"}
        justifyContent={"space-between"}
        className={"glass-ui"}
        borderRadius={"50px"}
        overflow={"hidden"}
      >
        <Link href="/" _hover={{ textDecoration: "none" }}>
          <Flex alignItems={"center"}>
            <Heading
              ml={"15px"}
              fontWeight={700}
              className={"h-shadow-black"}
              fontFamily={"Philosopher !important"}
            >
              🦄 decademy
            </Heading>
          </Flex>
        </Link>

        {location.pathname === "/" ||
        location.pathname === "/membership" ? null : (
          <Flex alignItems={"center"}>
            <NavLink _hover={{ textDecoration: "none" }} to="/courses">
              <Text
                fontSize={"1.125rem"}
                lineHeight={"1.625rem"}
                mr={"1em"}
                transition="color 0.2s ease"
                _hover={{ color: "gray", transition: "color 0.2s ease" }}
                fontWeight={
                  location.pathname === "/courses" ||
                  location.pathname == "/courses/[id]"
                    ? 600
                    : 400
                }
              >
                Courses
              </Text>
            </NavLink>
            <NavLink
              to="/quests"
              _hover={{ textDecoration: "none" }}
              style={navLinkStyles}
            >
              <Text
                fontSize={"1.125rem"}
                lineHeight={"1.625rem"}
                mx={"1em"}
                color={"black"}
                transition="color 0.2s ease"
                _hover={{ color: "gray", transition: "color 0.2s ease" }}
              >
                Quests
              </Text>
            </NavLink>
            <NavLink
              to={`/profile/${address}`}
              _hover={{ textDecoration: "none" }}
              style={navLinkStyles}
            >
              <Text
                fontSize={"1.125rem"}
                lineHeight={"1.625rem"}
                ml={"1em"}
                transition="color 0.2s ease"
                _hover={{ color: "gray", transition: "color 0.2s ease" }}
              >
                Profile
              </Text>
            </NavLink>
          </Flex>
        )}

        <ConnectButton />
      </Flex>
    </>
  );
}

export default Navbar;
