import React, { useEffect, useState } from "react";
import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLoadingContext } from "../context/loading";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";

function Hero() {
  const { setLoading } = useLoadingContext();
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  function parallax(e) {
    document.querySelectorAll(".px-move").forEach(function (move) {
      let moving_value = move.getAttribute("data-value");
      let x = (e.clientX * moving_value) / 100;
      let y = (e.clientY * moving_value) / 100;
      move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
    });
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  useEffect(() => {
    document.addEventListener("mousemove", parallax);
  }, []);

  return (
    <>
      <Box h={"100vh"} w={"100%"} position={"absolute"} zIndex={"1"}>
        <iframe
          src="https://my.spline.design/primitivescopy-ef6b406b573568c29d4d7c60b39c351f/"
          frameBorder="0"
          width="100%"
          height="100%"
          allowtransparency="true"
          title="hero"
        ></iframe>
      </Box>

      <Box className="hero-bg" h={"100vh"} w={"100%"} align={"center"}>
        <Navbar />
        <Container
          pt={"1.5em"}
          maxW={"1400px"}
          mx={"auto"}
          h={"79vh"}
          px={"2rem"}
          position={"relative"}
          top={"0"}
          w={"100%"}
          zIndex={"99999"}
          justifyContent={"center"}
          align={"center"}
        >
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            h={"100%"}
            w={"100%"}
            py={"4rem"}
            data-value="1"
            className="px-move"
          >
            <Flex justifyContent={"center"} alignItems={"center"}>
              <Heading
                className={"h-shadow-white hero-center-text"}
                fontWeight={"700"}
                fontFamily={"Press Start 2P"}
                color={"white"}
                textTransform={"capitalize"}
                lineHeight={"5vw"}
                fontSize={"2.87vw"}
              >
                a <span className="hero-span h-shadow-purple">creative</span>{" "}
                platform allowing incentives for the creation of high-quality
                learning materials
              </Heading>
            </Flex>

            <Box mt={"2em"} align={"center"}>
              <Button
                borderWidth={"2px"}
                borderColor={"white"}
                borderRadius={"0.625rem"}
                bg={"white"}
                color={"black"}
                py={"0.375rem"}
                px={"1rem"}
                isDisabled={!isConnected}
                colorScheme={"white"}
                display={visible ? "block" : "none"}
                onClick={() => {
                  setLoading(true);
                  navigate("/membership");
                }}
              >
                Gets Started
              </Button>
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

export default Hero;
