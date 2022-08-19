import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../../context/loading";
import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "antd/dist/antd.css";
import Lottie from "react-lottie";
import search from "../../assets/search.json";
import badge from "../../assets/badge.png";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import {
  useAccount,
  useContractRead,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
import membershipAbi from "../../contracts/ABI/LearnifyMembership.json";
import { learnifyMembershipAddress } from "../../utils/contractAddress";

import { Steps } from "antd";
import Navbar from "../../components/Navbar";
import { ethers } from "ethers";

function Membership() {
  const { setLoading } = useLoadingContext();
  const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const toast = useToast();
  const [current, setCurrent] = useState(0);
  const [hash, setHash] = useState("");
  const { address } = useAccount();
  const { data: signer } = useSigner();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const { data, isFetched } = useContractRead({
    addressOrName: learnifyMembershipAddress,
    contractInterface: membershipAbi,
    functionName: "balanceOf",
    args: [address, 1],
  });

  async function mintNft() {
    const contract = new ethers.Contract(
      learnifyMembershipAddress,
      membershipAbi,
      signer
    );

    const result = await contract.mint(address, 1, 1);
    setHash(result.hash);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: hash,
  });

  useEffect(() => {
    isLoading &&
      toast({
        title: "Transaction Sent",
        description: hash,
        status: "info",
        duration: 3000,
        isClosable: true,
        variant: "subtle",
        position: "bottom-right",
      });

    isSuccess &&
      toast({
        title: "Transaction Successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
        variant: "subtle",
      });

    isSuccess &&
      setTimeout(() => {
        setCurrent(2);
      }, 4000);
  }, [isSuccess, isLoading, toast]);

  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: search,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    data?.toNumber() === 0 &&
      setTimeout(() => {
        setCurrent(1);
      }, 4000);
  }, [setCurrent, isFetched]);

  useEffect(() => {
    data?.toNumber() >= 1 &&
      setTimeout(() => {
        setCurrent(2);
      }, 4000);
  }, [setCurrent, isFetched]);

  const firstContent = () => {
    return (
      <Box mt={"4rem"} align={"center"}>
        <Heading
          fontSize={"2.25rem"}
          fontWeight={700}
          color={"white"}
          lineHeight={"2.5rem"}
        >
          Checking membership NFT in your wallet
        </Heading>

        <Box pointerEvents={"none"} h={"min-content"}>
          <Lottie options={defaultOptions} height={300} width={400} />
        </Box>
      </Box>
    );
  };

  const secondContent = () => {
    return (
      <Box my={"4rem"} align={"center"}>
        <Text
          fontSize={"0.875rem"}
          lineHeight={"1.25rem"}
          color={"whiteAlpha.800"}
        >
          Looks like you dont have membership badge
        </Text>
        <Heading
          textTransform={"capitalize"}
          fontWeight={700}
          color={"white"}
          fontSize={"2.25rem"}
          lineHeight={"2.5rem"}
          mt={"0.5em"}
        >
          Mint your free Learnify Membership NFT
        </Heading>
        <Button
          borderWidth={"2px"}
          borderColor={"white"}
          borderRadius={"0.625rem"}
          py={"0.375rem"}
          px={"1rem"}
          colorScheme="whatsapp"
          mt={"3em"}
          isLoading={isLoading}
          onClick={() => mintNft()}
        >
          {" "}
          Mint
        </Button>
      </Box>
    );
  };
  const thirdContent = () => {
    return (
      <>
        <Box my={"4rem"} align={"center"}>
          <Heading
            fontSize={"2.25rem"}
            fontWeight={700}
            color={"white"}
            mb={"1em"}
            lineHeight={"2.5rem"}
          >
            You have got your membership badge!!
          </Heading>

          <Link
            href="https://testnets.opensea.io/assets/mumbai/0x9ea3185c2f9ebe422d8c305a40fd7a00369c3f8d/1"
            isExternal
            w={"min-content"}
          >
            <Image
              position={"relative"}
              top={"0px"}
              _hover={{ top: "-2px" }}
              className="h-shadow-black-high"
              src={badge}
              boxSize={"150px"}
            />
          </Link>

          <Button
            borderWidth={"2px"}
            borderColor={"white"}
            borderRadius={"0.625rem"}
            bg={"white"}
            color={"black"}
            py={"0.375rem"}
            px={"1rem"}
            colorScheme={"white"}
            mt={"3em"}
            onClick={() => {
              setLoading(true);
              navigate("/dashboard");
            }}
          >
            Let&apos;s Go..
          </Button>
        </Box>
      </>
    );
  };

  const { Step } = Steps;
  const steps = [
    {
      // title: "First",
      content: firstContent(),
    },
    {
      // title: "Second",
      content: secondContent(),
    },
    {
      // title: "Last",
      content: thirdContent(),
    },
  ];

  return (
    <>
      <Navbar />
      {current === 2 && <Confetti width={width} height={height} />}
      <Container maxW={"1200px"} mt={"6rem"}>
        <Box>
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
          <Box
            className="steps-content glass-ui-2"
            p={0}
            mt={"4em"}
            boxShadow={"none"}
          >
            {steps[current].content}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Membership;
