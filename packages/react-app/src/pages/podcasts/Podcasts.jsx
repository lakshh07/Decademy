import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Progress,
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
import { useNavigate } from "react-router-dom";
import truncateMiddle from "truncate-middle";
import Navbar from "../../components/Navbar";
import { useLoadingContext } from "../../context/loading";
import Blockies from "react-blockies";
import gradiant from "../../assets/gradiant.png";
import matic from "../../assets/matic.svg";
import notFound from "../../assets/page-not-found.png";
import ReactPlayer from "react-player";
import animationData from "../../assets/play-pause.json";
import Lottie from "react-lottie";
import lottieWeb from "lottie-web";

function Podcasts() {
  const { setLoading } = useLoadingContext();
  const navigate = useNavigate();
  const toast = useToast();

  const [length, setLength] = useState(0);
  const [audioo, setAudioo] = useState();
  const [k, setK] = useState();
  const loading = false;
  const fetchData = [{}];

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const animation = lottieWeb.loadAnimation({
    container: k,
    path: "https://assets5.lottiefiles.com/packages/lf20_qHRlf9/play_pouse.json",
    renderer: "svg",
    loop: false,
    autoplay: false,
    name: "Demo Animation",
  });
  animation.goToAndStop(14, true);
  const lottieRef = useRef();
  async function fund() {}
  //   animation.playSegments([14, 27], true);
  //   animation.playSegments([0, 14], true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);

    const audio = document.querySelector("audio");
    const player = document.querySelector("lottie-player");
    console.log(audio?.currentTime);
    // player.getLottie().playSegments([0, 200], true);
    // audio.addEventListener("timeupdate", () => {
    //   setAudioo(Math.floor(audio.currentTime));
    // });
    // const playIconContainer = document.getElementById("adni");
    // setK(playIconContainer);
  }, []);
  //   lottieRef?.current?.play();
  console.log(audioo, "a");
  //   lottieRef?.current?.playSegments([0, 5], true);
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
                        transform={"scale(1)"}
                        className={"glass-ui"}
                        backgroundColor={"white"}
                        transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                        _hover={{
                          transform: "scale(1.02)",
                          transition:
                            "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                        }}
                      ></Box>
                    </GridItem>
                  );
                })}
              </Grid>
              <ReactPlayer
                url={
                  "https://hanzluo.s3-us-west-1.amazonaws.com/music/wuyuwuqing.mp3"
                }
                playing={false}
                controls={true}
                onSeek={(e) => console.log("onSeek", e)}
                onProgress={(e) => console.log("onProgress", e)}
                onDuration={(e) => console.log("onDuration", e)}
              ></ReactPlayer>
              <Lottie
                options={defaultOptions}
                ref={lottieRef}
                height={400}
                width={400}
                // className={"lottie-player"}
                // goToAndStop={14}
                // playSegments={(0, 14)}
                // isStopped={true}
                // isPaused={true}
              />
              <div id="ani"></div>(
              <Button
                onClick={() => lottieRef.current.playSegments([10, 20], false)}
              >
                play
              </Button>
              )<Button onClick={() => lottieRef.current.play()}>pause</Button>
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
