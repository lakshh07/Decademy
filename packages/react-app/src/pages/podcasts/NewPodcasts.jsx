import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast,
  VisuallyHidden,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useLoadingContext } from "../../context/loading";
import Backward from "../../components/Backward";
import { useNavigate } from "react-router-dom";
import matic from "../../assets/matic.svg";
import gradiant from "../../assets/gradiant.png";

import { useWaitForTransaction, useAccount, useSigner } from "wagmi";
import { questsAddress } from "../../utils/contractAddress";
import questContractAbi from "../../contracts/ABI/Quests.json";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../../components/Navbar";
import { ethers } from "ethers";

function NewQuest() {
  const { setLoading } = useLoadingContext();
  const { address } = useAccount();
  const toast = useToast();
  const { data: signer } = useSigner();
  const navigate = useNavigate();
  const [postHash, setPostHash] = useState("");
  const [questData, setQuestData] = useState({
    title: "",
    description: "",
    price: "0",
    goal: "0",
    fee: "0",
  });

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  function onChange(e) {
    setQuestData(() => ({ ...questData, [e.target.name]: e.target.value }));
  }

  async function createQ() {
    const contract = new ethers.Contract(
      questsAddress,
      questContractAbi,
      signer
    );

    const result = await contract.createQuest(
      uuidv4(),
      questData.title,
      questData.description,
      (questData.price * Math.pow(10, 18)).toString(),
      (questData.goal * Math.pow(10, 18)).toString(),
      questData.fee
    );
    console.log(result.hash);
    setPostHash(result.hash);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: postHash,
  });

  useEffect(() => {
    postHash &&
      setQuestData({
        title: "",
        description: "",
        price: "0",
        goal: "0",
        fee: "0",
      });

    isLoading &&
      toast({
        title: "Transaction Sent",
        description: postHash,
        status: "info",
        duration: 4000,
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
        setLoading(true);
        navigate("/dashboard/podcasts");
      }, 4000);
  }, [isSuccess, isLoading, setQuestData, toast]);

  const avatarRef = useRef(null);

  function triggerOnChangeAvatar() {
    avatarRef.current.click();
  }

  async function handleAvatarChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setAvatar(uploadedFile);
  }

  return (
    <>
      <Navbar />
      <Container maxW={"1200px"} my={"3.5rem"} pb={"6em"}>
        <Backward />

        <Heading fontSize={"2.1rem"} color={"white"} lineHeight={"2.5rem"}>
          Create New Podcast
        </Heading>
        <Divider />

        <Box color={"white"} className={"glass-ui-2"} mt={"2em"}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input name="title" value={questData.title} onChange={onChange} />
          </FormControl>
          <FormControl mt={"1em"} isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={questData.description}
              onChange={onChange}
            />
          </FormControl>
          <FormControl mt={"1em"}>
            <FormLabel>Select Currency</FormLabel>
            <Input placeholder="MATIC" color={"white"} isDisabled />
          </FormControl>
          <FormControl mt={"1em"} isRequired>
            <FormLabel>Price</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
              >
                <Image ml={"20px"} w="105px" src={matic} />
              </InputLeftElement>
              <NumberInput w={"100%"}>
                <NumberInputField
                  pl={"4em"}
                  name="price"
                  value={questData.price}
                  onChange={onChange}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputGroup>
          </FormControl>

          <FormControl mt={"1em"} align={"flex-start"} alignItems={"center"}>
            <FormLabel>Podcast</FormLabel>

            {/* <VisuallyHidden> */}
            <Input
              pt={"3.5px"}
              id="selectImage"
              type="file"
              accept="audio/*"
              // onChange={handleAvatarChange}
              // ref={avatarRef}
            />
            {/* </VisuallyHidden> */}
          </FormControl>

          {/*  */}

          <FormControl mt={"1em"} align={"flex-start"} mb={"1em"}>
            <FormLabel
              // mb={"1em"}
              fontFamily={"Montserrat"}
              htmlFor="first-name"
            >
              Picture
            </FormLabel>

            <Image
              src={avatar ? URL.createObjectURL(avatar) : gradiant}
              height={"240px"}
              width={"240px"}
              style={{
                borderRadius: "10px",
                border: "1px solid white",
                marginBottom: "1.5em",
              }}
            />

            <Box>
              <Flex alignItems={"baseline"}>
                <Button
                  fontSize={"14px"}
                  border={"1px solid white"}
                  // bg={"transparent"}
                  colorScheme={"blue"}
                  color={"black"}
                  // leftIcon={<AiOutlinePicture />}
                  onClick={triggerOnChangeAvatar}
                  rounded="20px"
                  mb={"1em"}
                >
                  {avatar ? `Change Picture` : `Set Picture`}
                </Button>
              </Flex>

              <VisuallyHidden>
                <Input
                  id="selectImage"
                  type="file"
                  onChange={handleAvatarChange}
                  ref={avatarRef}
                />
              </VisuallyHidden>
            </Box>
          </FormControl>
          {/*  */}

          <Button
            borderWidth={"2px"}
            borderColor={"white"}
            borderRadius={"0.625rem"}
            bg={"white"}
            color={"black"}
            py={"0.375rem"}
            px={"1rem"}
            colorScheme={"black"}
            mt={"1.5em"}
            isLoading={isLoading}
            onClick={() => createQ()}
          >
            Create
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default NewQuest;
