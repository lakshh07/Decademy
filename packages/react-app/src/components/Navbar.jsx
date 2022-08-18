import React from "react";
import { Container, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useLoadingContext } from "../context/loading";

function Navbar() {
  const location = useLocation();
  const { isDisconnected, address } = useAccount();
  const navigate = useNavigate();
  const { setLoading } = useLoadingContext();

  // useEffect(() => {
  //   if (isDisconnected) {
  //     setLoading(true);
  //     navigate("/");
  //   }
  // }, [isDisconnected]);

  function handleUrl(url) {
    setLoading(true);
    navigate(`/${url}`);
  }

  return (
    <>
      <Container
        maxW={"1400px"}
        px={"2em"}
        pt={"1.5em"}
        position={"sticky"}
        top={"0"}
        zIndex={"99999"}
      >
        <Flex
          px={"4em"}
          py={"0.5em"}
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
                fontSize={"2em"}
                color={"white"}
              >
                🦄 decademy
              </Heading>
            </Flex>
          </Link>

          {location.pathname === "/" ||
          location.pathname === "/membership" ? null : (
            <Flex alignItems={"center"}>
              <Text
                fontSize={"1rem"}
                lineHeight={"1.625rem"}
                mr={"1em"}
                transition="color 0.2s ease"
                className="glass-gradient"
                fontWeight={
                  location.pathname === "/dashboard" ||
                  location.pathname === "/dashboard/*"
                    ? 700
                    : 400
                }
                cursor={"pointer"}
                onClick={() => {
                  handleUrl("dashboard");
                }}
              >
                Dashboard
              </Text>

              <Text
                fontSize={"1rem"}
                lineHeight={"1.625rem"}
                mx={"1em"}
                transition="color 0.2s ease"
                className="glass-gradient"
                fontWeight={location.pathname === "/community" ? 700 : 400}
                cursor={"pointer"}
                onClick={() => {
                  handleUrl("community");
                }}
              >
                Community
              </Text>

              <Text
                fontSize={"1rem"}
                lineHeight={"1.625rem"}
                ml={"1em"}
                transition="color 0.2s ease"
                className="glass-gradient"
                fontWeight={
                  location.pathname === `/profile/${address}` ? 700 : 400
                }
                cursor={"pointer"}
                onClick={() => {
                  handleUrl(`profile/${address}`);
                }}
              >
                Profile
              </Text>
            </Flex>
          )}

          <ConnectButton />
        </Flex>
      </Container>
    </>
  );
}

export default Navbar;
