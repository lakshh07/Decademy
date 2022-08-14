import { Box, Container, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import AddMessage from "./AddMessage";
import { useLoadingContext } from "../../context/loading";
import man from "../../assets/man.png";
import { BsDot } from "react-icons/bs";
import truncateMiddle from "truncate-middle";
import moment from "moment";

function Community() {
  const { setLoading } = useLoadingContext();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const data = [{}, {}, {}, {}];
  return (
    <>
      <Navbar />

      <Container maxW={"1200px"} my={"3em"}>
        <Box h={"74vh"} overflowY={"scroll"} borderRadius={"5px"}>
          {data?.map((list, index) => {
            return (
              <Box
                key={index}
                className="glass-ui"
                mb={"1em"}
                borderRadius={"5px"}
                p={"1em"}
              >
                <Flex>
                  <Image
                    src={man}
                    height={45}
                    width={45}
                    style={{ borderRadius: "50%" }}
                    border={"1px solid white"}
                  />
                  <Box ml={"20px"}>
                    <Flex alignItems={"center"}>
                      <Text
                        fontWeight={600}
                        textTransform={"capitalize"}
                        fontSize={"16px"}
                      >
                        Anonymous
                      </Text>

                      <BsDot color={"whiteAlpha.600"} />
                      <Text fontSize={"14px"} color={"whiteAlpha.700"}>
                        {moment(new Date(1660464986)).format("MMMM DD YYYY")}
                      </Text>
                    </Flex>
                    <Text
                      fontSize={"14px"}
                      color={"whiteAlpha.800"}
                      className={"brand"}
                    >
                      {truncateMiddle(
                        "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B" || "",
                        5,
                        4,
                        "..."
                      )}
                    </Text>
                  </Box>
                </Flex>

                <Box mt={"1em"} pl={"4.5em"}>
                  <Text fontSize={"16px"} lineHeight={"22px"}>
                    heyy, this is my first message
                  </Text>
                  <Image
                    borderRadius={"5px"}
                    mt={"0.5em"}
                    src={man}
                    boxSize={"200px"}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
        <AddMessage />
      </Container>
    </>
  );
}

export default Community;
