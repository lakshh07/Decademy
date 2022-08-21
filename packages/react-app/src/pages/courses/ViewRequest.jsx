import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../../context/loading";
import Backward from "../../components/Backward";
import ReactMarkdown from "react-markdown";

import courseContractAbi from "../../contracts/ABI/CourseContract.json";
import { getCourseContract } from "../../utils/courseContract";
import {
  useAccount,
  useProvider,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
import { getTextFromIPFS } from "../../utils/ipfs";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import remarkGfm from "remark-gfm";
import { ethers } from "ethers";

function VoteRequest() {
  const { setLoading } = useLoadingContext();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { id, reqId } = useParams();

  const [requestSummary, setRequestSummary] = useState();
  const [request, setRequest] = useState();
  const [hash, setHash] = useState("");
  const [owner, setOwner] = useState();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const getRequestSummary = async () => {
    const contract = getCourseContract(id, provider);
    const [
      [name, description],
      author,
      approved,
      [bigTokens, bigApprovers, baseVersion],
    ] = await contract.returnRequestSummary(reqId);
    const req = {
      name,
      description,
      author,
      approved,
      index: Number(reqId),
      tokens: bigTokens.toNumber(),
      approvers: bigApprovers.toNumber(),
      baseVersion: baseVersion.toNumber(),
    };

    // console.log(req);
    setRequestSummary(req);
  };

  const getRequest = async () => {
    const contract = getCourseContract(id, provider);
    const modulesToReturn = [];
    const [moduleNames, moduleDescs, moduleMaterials, moduleQuestions] =
      await contract.returnRequestModules(reqId);
    for (let i = 0; i < moduleNames.length; i++) {
      const mats = await getTextFromIPFS(moduleMaterials[i]);
      const qs = await getTextFromIPFS(moduleQuestions[i]);
      const moduleeee = {
        id: 1,
        name: moduleNames[i],
        description: moduleDescs[i],
        materials: mats,
        questions: qs,
      };
      modulesToReturn.push(moduleeee);
    }

    // console.log(modulesToReturn);
    setRequest(modulesToReturn);
  };

  const contract = new ethers.Contract(id, courseContractAbi, signer);

  async function voteToReq() {
    const result = await contract.voteRequest(reqId);
    setHash(result.hash);
  }
  async function approveReq() {
    const result = await contract.approveRequest(reqId);
    setHash(result.hash);
  }

  async function getOwner() {
    const contract = new ethers.Contract(id, courseContractAbi, provider);

    const result = await contract.manager();
    setOwner(result);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: hash,
  });

  useEffect(() => {
    getRequestSummary();
  }, [isSuccess]);

  useEffect(() => {
    getRequestSummary();
    getRequest();
    getOwner();
  }, []);

  return (
    <>
      <Navbar />

      <Container my={"4em"} maxW={"1200px"} pb={"5em"}>
        <Backward />

        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Heading fontSize={"32px"} color={"white"} fontWeight={600}>
            Course Pull Request
          </Heading>
          <Flex alignItems={"center"}>
            {owner === address && (
              <Button
                borderWidth={"2px"}
                borderColor={"white"}
                borderRadius={"0.625rem"}
                color={"black"}
                py={"0.375rem"}
                px={"1rem"}
                mr={"10px"}
                isDisabled={requestSummary?.approved ? true : false}
                colorScheme={"whatsapp"}
                isLoading={isLoading}
                onClick={() => approveReq()}
              >
                Approve
              </Button>
            )}
            <Button
              borderWidth={"2px"}
              borderColor={"white"}
              borderRadius={"0.625rem"}
              color={"black"}
              bg={"white"}
              py={"0.375rem"}
              px={"1rem"}
              colorScheme={"white"}
              isLoading={isLoading}
              onClick={() => voteToReq()}
            >
              Vote to Request
            </Button>
          </Flex>
        </Flex>

        <Text
          borderWidth={"2px"}
          borderColor={"white"}
          alignItems={"center"}
          borderRadius={"9999px"}
          py={"0.25rem"}
          px={"0.75rem"}
          textTransform={"uppercase"}
          fontSize={"0.75rem"}
          lineHeight={"1rem"}
          fontWeight={600}
          w={"max-content"}
          mt={"2.2em"}
          bg={
            requestSummary?.approved ? "rgb(183 234 213)" : "rgb(250 229 195)"
          }
        >
          {requestSummary?.approved ? "approved" : "open"}
        </Text>

        <Box my={"3em"}>
          <Heading fontSize={"34px"} color={"white"} fontWeight={700}>
            {requestSummary?.name}
          </Heading>
          <Text
            fontSize={"18px"}
            lineHeight={"28px"}
            mt={"8px"}
            color={"white"}
          >
            {requestSummary?.description}
          </Text>

          <Flex mt={"1em"} alignItems={"center"}>
            <Text
              borderWidth={"2px"}
              borderColor={"white"}
              alignItems={"center"}
              borderRadius={"0.3125rem"}
              bg={"rgb(198 201 246)"}
              py={"0.25rem"}
              px={"0.75rem"}
              mr={"0.5em"}
              fontWeight={500}
            >
              {requestSummary?.approvers} votes
            </Text>
            <Text
              borderWidth={"2px"}
              borderColor={"white"}
              alignItems={"center"}
              borderRadius={"0.3125rem"}
              bg={"rgb(198 201 246)"}
              py={"0.25rem"}
              px={"0.75rem"}
              ml={"0.5em"}
              fontWeight={500}
            >
              {requestSummary?.tokens} / 1000 requested share
            </Text>
          </Flex>
        </Box>

        <Box>
          <Heading fontSize={"32px"} color={"white"} fontWeight={600}>
            Modules
          </Heading>
          <Divider />

          {request?.length ? (
            request?.slice(-1).map((list, index) => {
              return (
                <Box
                  borderWidth={"2px"}
                  borderColor={"white"}
                  className={"glass-ui"}
                  borderRadius={"0.625rem"}
                  p={"1em 1.5em 1.4em"}
                  mt={"1.5em"}
                  mb={"2.5em"}
                  key={index}
                >
                  <Text fontWeight={500} fontSize={"26px"}>
                    {list.name}
                  </Text>
                  <Text mt={"0.5em"} lineHeight={"28px"}>
                    {list.description}
                  </Text>

                  <Heading
                    color={"white"}
                    mt={"2em"}
                    fontWeight={600}
                    fontSize={"24px"}
                  >
                    Learning Materials
                  </Heading>
                  <Divider />
                  <Text
                    lineHeight={"28px"}
                    px={"1.5em"}
                    mt={"0.5em"}
                    className={"courseContent"}
                  >
                    <ReactMarkdown
                      children={list.materials}
                      remarkPlugins={[remarkGfm]}
                    />
                  </Text>

                  <Heading
                    color={"white"}
                    fontWeight={600}
                    mt={"1em"}
                    fontSize={"24px"}
                  >
                    Questions
                  </Heading>
                  <Divider />
                  <Box px={"1.5em"} mt={"0.5em"} className={"courseContent"}>
                    <ReactMarkdown
                      children={list.questions}
                      remarkPlugins={[remarkGfm]}
                    />
                  </Box>
                </Box>
              );
            })
          ) : (
            <>
              <Flex my="10rem" justifyContent="center" alignItems="center">
                <Spinner size="xl" color={"white"} />
              </Flex>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export default VoteRequest;
