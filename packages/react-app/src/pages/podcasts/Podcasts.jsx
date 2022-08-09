import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { GrMoney } from "react-icons/gr";
import { HiOutlineCash } from "react-icons/hi";
import { MdGraphicEq } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import truncateMiddle from "truncate-middle";
import Navbar from "../../components/Navbar";
import PlayButton from "../../components/PlayButton";
import { useLoadingContext } from "../../context/loading";
import Blockies from "react-blockies";
import gradiant from "../../assets/gradiant.png";
import notFound from "../../assets/page-not-found.png";
import animationnn from "../../assets/music.json";
import Lottie from "react-lottie";

function Podcasts() {
  const { setLoading } = useLoadingContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [length, setLength] = useState(0);
  const [audioo, setAudioo] = useState();
  const [audioSeek, setAudioSeek] = useState();
  const [active, setActive] = useState("");
  const [hoverIndex, setHoverIndex] = useState(0);
  const [duration, setDuration] = useState();
  const loading = false;
  const fetchData = [
    {
      url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    },
    {
      url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba-online-audio-converter.com_-1.wav",
    },
    {
      url: "https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3",
    },
  ];

  async function changeButton(index) {
    if (active === "active") {
      setActive("");
      pause();
      setHoverIndex(index);
      return;
    }
    setHoverIndex(index);
    setActive("active");
    playOnSelect(fetchData, index);
  }

  function changeValue(e) {
    audioo.currentTime = e;
  }

  const pause = () => {
    document.querySelector("#audio-element").pause();
  };

  const playMusic = () => {
    document.querySelector("#audio-element").play();
  };

  const playOnSelect = (song, index) => {
    try {
      document.querySelector("#audio-element").src = song[index].url;
      document.querySelector("#audio-element").play();
    } catch (e) {
      console.log(e);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationnn,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  async function fund() {}

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const audio = document.querySelector("#audio-element");
    setAudioo(audio);
    audio.addEventListener("timeupdate", () => {
      setAudioSeek(Math.floor(audio.currentTime));
    });
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
  }, [hoverIndex]);

  return (
    <>
      <Navbar />

      <Container my={"4em"} maxW={"1200px"}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Heading fontSize={"2.1rem"} color={"white"} lineHeight={"2.5rem"}>
              Podcasts
            </Heading>
            <Heading
              w={"1.6rem"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={"1rem"}
              lineHeight={"1.6rem"}
              bg={"white"}
              color={"black"}
              textAlign={"center"}
              borderRadius={"50%"}
              ml={"0.75rem"}
              fontWeight={600}
            >
              {length}
            </Heading>
          </Flex>
          <Button
            borderWidth={"2px"}
            borderColor={"white"}
            borderRadius={"0.625rem"}
            bg={"white"}
            color={"black"}
            py={"0.375rem"}
            px={"1rem"}
            colorScheme={"white"}
            onClick={() => {
              setLoading(true);
              navigate("/dashboard/podcasts/new");
            }}
          >
            New Podcast
          </Button>
        </Flex>

        <Box>
          <audio id="audio-element" hidden playsInline />

          {loading ? (
            <>
              <Flex my="12rem" justifyContent="center" alignItems="center">
                <Spinner color="white" size="xl" />
              </Flex>
            </>
          ) : fetchData?.length ? (
            <>
              <Grid
                mt={"1.5rem"}
                templateColumns={"repeat(3, minmax(0px, 1fr))"}
                gap={"2rem"}
              >
                {fetchData?.map((list, index) => {
                  return (
                    <GridItem key={index}>
                      <Box
                        borderWidth={"2px"}
                        borderColor={"whitesmoke"}
                        borderRadius={"0.625rem"}
                        overflow={"hidden"}
                        cursor={"pointer"}
                        p={"0em !important"}
                        transform={"scale(1)"}
                        className={"glass-ui-2"}
                        backgroundColor={"white"}
                        transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                        _hover={{
                          transform: "scale(1.02)",
                          transition:
                            "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                        }}
                      >
                        <Box
                          h={"250px"}
                          overflow={"hidden"}
                          boxShadow="rgba(17, 12, 46, 0.15) 0px 48px 100px 0px"
                          position={"relative"}
                        >
                          <Image
                            alt={list.questName}
                            objectFit={"cover"}
                            src={gradiant}
                            h={"100%"}
                            w={"100%"}
                            className={"animation"}
                          />

                          <Box className={hoverIndex === index && active}>
                            <Box pt={"1.8em"} className="show play-hover">
                              <Lottie
                                options={defaultOptions}
                                height={130}
                                width={200}
                              />

                              <Box w={"250px"} mx={"auto"}>
                                <Slider
                                  aria-label="slider-ex-4"
                                  value={audioSeek}
                                  min={0}
                                  max={Math.floor(duration)}
                                  onChange={changeValue}
                                >
                                  <SliderMark
                                    value={0}
                                    mt="2"
                                    ml="-2.5"
                                    fontSize="sm"
                                  >
                                    {calculateTime(audioSeek)}
                                  </SliderMark>
                                  <SliderMark
                                    value={Math.floor(duration)}
                                    mt="2"
                                    ml="-2.5"
                                    fontSize="sm"
                                  >
                                    {calculateTime(
                                      Math.floor(audioo?.duration)
                                    )}
                                  </SliderMark>
                                  <SliderTrack bg="whiteAlpha.100">
                                    <SliderFilledTrack bg="white" />
                                  </SliderTrack>
                                  <SliderThumb boxSize={4}>
                                    <Box color="black" as={MdGraphicEq} />
                                  </SliderThumb>
                                </Slider>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Box py={"1.2rem"} px={"1.5rem"}>
                          <Tag
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderRadius={"9999px"}
                            textTransform={"uppercase"}
                            fontWeight={600}
                            fontSize={"0.75rem"}
                            lineHeight={"1rem"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            bg={"rgb(183 234 213)"}
                            position={"relative"}
                          >
                            Podcast
                          </Tag>
                          <PlayButton
                            active={active}
                            changeButton={changeButton}
                            index={index}
                            hoverIndex={hoverIndex}
                          />
                          <Heading
                            mt={"1rem"}
                            fontSize={"1.5rem"}
                            lineHeight={"2rem"}
                            color={"#1a202c"}
                          >
                            taking into web3
                            {/* {list.questName} */}
                          </Heading>
                          <Text
                            fontSize={"0.875rem"}
                            lineHeight={"1.25rem"}
                            color={"#888888"}
                            mt={"0.5rem"}
                            mb={"1em"}
                          >
                            dddd
                            {/* {list.questDescription} */}
                          </Text>

                          <Flex
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Flex
                              borderWidth={"2px"}
                              borderColor={"rgb(10 10 10/1)"}
                              alignItems={"center"}
                              borderRadius={"0.3125rem"}
                              bg={"rgb(198 201 246)"}
                              py={"0.25rem"}
                              px={"0.75rem"}
                              w={"max-content"}
                              //   mt={"1.2rem"}
                            >
                              <Box
                                borderRadius={"50%"}
                                borderWidth={"1.5px"}
                                borderColor={"rgb(10 10 10/1)"}
                                overflow={"hidden"}
                              >
                                <Blockies
                                  seed={list.uploader}
                                  color="#dfe"
                                  bgcolor="#aaa"
                                  default="-1"
                                  size={10}
                                  scale={2}
                                />
                              </Box>
                              <Text
                                ml={"10px"}
                                fontSize={"0.75rem"}
                                lineHeight={"1rem"}
                                fontWeight={600}
                                color={"black"}
                              >
                                {truncateMiddle(
                                  "0x7b1C1702A09521b4160f79f853b7F54ba6b35a59" ||
                                    "",
                                  5,
                                  4,
                                  "..."
                                )}
                                {/* {truncateMiddle(list.uploader || "", 5, 4, "...")} */}
                              </Text>
                            </Flex>

                            <Flex
                              bg={"#EDF2F6"}
                              fontSize={"14px"}
                              lineHeight={"17px"}
                              w={"max-content"}
                              borderRadius={"0.375rem"}
                              px={"0.5rem"}
                              py={"0.25rem"}
                              alignItems={"center"}
                              //   mb={"1em"}
                            >
                              <Flex
                                alignItems={"center"}
                                px={"0.5rem"}
                                py={"0.25rem"}
                                bg={"#E4E7EB"}
                                borderRadius={"0.375rem"}
                                mr={"10px"}
                                color={"black"}
                              >
                                <GrMoney fontSize={"12px"} />
                                <Text ml={"8px"} fontWeight={500}>
                                  Price
                                </Text>
                              </Flex>
                              <Text
                                fontWeight={600}
                                textTransform={"capitalize"}
                                color={"black"}
                              >
                                1{" "}
                                {/* {ethers.utils.formatEther(
                                list.questPrice.toString()
                              )}{" "} */}
                                Matic
                              </Text>
                            </Flex>
                          </Flex>
                        </Box>
                        <Box>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            borderTopWidth={"2px"}
                            py={"1rem"}
                            px={"2rem"}
                            bg={"rgba(250, 229, 195,1)"}
                            //   onClick={() =>
                            //     list.questAmountRaised.toString() ===
                            //     list.questGoal.toString()
                            //       ? toast({
                            //           title: "Funded",
                            //           status: "info",
                            //           duration: 4000,
                            //           isClosable: true,
                            //           position: "top",
                            //           variant: "subtle",
                            //         })
                            //       : fund(
                            //           list.questPrice.toString(),
                            //           list.questId,
                            //           list.id
                            //         )
                            //   }
                            //   cursor={
                            //     list.questAmountRaised.toString() ===
                            //     list.questGoal.toString()
                            //       ? "not-allowed"
                            //       : "pointer"
                            //   }
                          >
                            <Flex color={"black"} alignItems={"center"}>
                              {" "}
                              <HiOutlineCash />
                              <Text ml={"5px"} fontWeight={600}>
                                {/* {list.questAmountRaised.toString() ===
                                  list.questGoal.toString()
                                    ? "Funded"
                                    : "Fund"} */}
                                Mint
                              </Text>
                            </Flex>

                            <FiArrowUpRight color={"black"} fontSize={"20px"} />
                          </Flex>
                        </Box>
                      </Box>
                    </GridItem>
                  );
                })}
              </Grid>
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
                  No Podcasts Found
                </Heading>
              </Flex>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Podcasts;
