import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import AddMessage from "./AddMessage";
import { useLoadingContext } from "../../context/loading";
import man from "../../assets/man.png";
import { BsDot } from "react-icons/bs";
import truncateMiddle from "truncate-middle";
import moment from "moment";
import notFound from "../../assets/page-not-found.png";
import axios from "axios";
import { useContractRead } from "wagmi";
import { learnifyCommunityAddress } from "../../utils/contractAddress";
import communityContractAbi from "../../contracts/ABI/LearnifyCommunity.json";

function Community() {
  const { setLoading } = useLoadingContext();
  const [arrData, setArrData] = useState([]);
  const messageEl = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const {
    data: fetchData,
    isFetching,
    isLoading: loading,
  } = useContractRead({
    addressOrName: learnifyCommunityAddress,
    contractInterface: communityContractAbi,
    functionName: "fetchMsg",
    watch: true,
  });

  async function getData() {
    if (arrData?.length === fetchData?.length) {
      //   return;
    } else {
      setArrData([]);
      let messages = [];
      for (const m of fetchData) {
        const j = await axios.get(m?.message).then((response) => {
          return response.data;
        });
        let newJson = {
          ...j,
          sender: m?.sender,
          attachment: m?.attachment,
        };
        messages.push(newJson);
      }
      setArrData(messages);
    }
  }

  useEffect(() => {
    getData();
  }, [isFetching]);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  return (
    <>
      <Navbar />

      <Container maxW={"1200px"} my={"3em"}>
        <Box
          h={"74vh"}
          overflowY={"scroll"}
          borderRadius={"5px"}
          ref={messageEl}
          className={"hide-scrollbar"}
        >
          {loading || !arrData ? (
            <>
              <Flex my="12rem" justifyContent="center" alignItems="center">
                <Spinner color="white" size="xl" />
              </Flex>
            </>
          ) : fetchData?.length ? (
            <>
              {arrData?.map((list, index) => {
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
                        src={list.avatar?.length ? list.avatar : man}
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
                            {list.name}
                          </Text>

                          <BsDot color={"whiteAlpha.600"} />
                          <Text fontSize={"14px"} color={"whiteAlpha.700"}>
                            {moment(list.time).calendar()}
                          </Text>
                        </Flex>
                        <Text
                          fontSize={"14px"}
                          color={"whiteAlpha.800"}
                          className={"brand"}
                        >
                          {truncateMiddle(list.sender || "", 5, 4, "...")}
                        </Text>
                      </Box>
                    </Flex>

                    <Box mt={"1em"} pl={"4.5em"}>
                      <Text fontSize={"16px"} lineHeight={"22px"}>
                        {list.message}
                      </Text>
                      {list.attachment !== "not found" && (
                        <Image
                          borderRadius={"5px"}
                          mt={"0.8em"}
                          h={"200px"}
                          w={"auto"}
                          src={list.attachment}
                        />
                      )}
                    </Box>
                  </Box>
                );
              })}
            </>
          ) : (
            <>
              <Flex
                my="10rem"
                justifyContent="center"
                flexDir="column"
                alignItems="center"
              >
                <Image src={notFound} height={90} width={90} />
                <Heading
                  fontSize="1.3em"
                  fontWeight={500}
                  color={"white"}
                  pt="1em"
                >
                  Start Exploring!!
                </Heading>
              </Flex>
            </>
          )}
        </Box>
        <AddMessage />
      </Container>
    </>
  );
}

export default Community;
