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
import { podcastContractAddress } from "../../utils/contractAddress";
import podcastContractAbi from "../../contracts/ABI/LearnifyPodcast.json";
import { v4 as uuidv4 } from "uuid";
import { uploadToIpfss, client } from "../../utils/ipfs";
import Navbar from "../../components/Navbar";
import { ethers } from "ethers";

function NewQuest() {
  const { setLoading } = useLoadingContext();
  const toast = useToast();
  const { data: signer } = useSigner();
  const navigate = useNavigate();
  const [postHash, setPostHash] = useState("");
  const [podcastData, setPodcastData] = useState({
    name: "",
    description: "",
    image: "0",
    price: "0",
    music: "0",
  });
  const fileRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [music, setMusic] = useState(null);
  const [checker, setChecker] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  function onChange(e) {
    setPodcastData(() => ({ ...podcastData, [e.target.name]: e.target.value }));
  }

  const createPodcast = async () => {
    setChecker(true);
    const musicIpfs = await uploadToIpfss(music);
    const imageIpfs = await uploadToIpfss(avatar);

    setPodcastData({
      price: ethers.utils.parseEther(podcastData.price).toString(),
    });

    const newJson = {
      name: podcastData.name,
      description: podcastData.description,
      price: ethers.utils.parseEther(podcastData.price).toString(),
      // image: imageIpfs,
      // music: musicIpfs,
      attributes: [{ trait_type: "Location", value: "Metaverse" }],
    };
    const name = podcastData.name;
    const description = podcastData.description;
    const contentURI = await client.store({
      name: name,
      description: description,
      price: podcastData.price,
      image: avatar,
      music: musicIpfs,
      attributes: [{ trait_type: "Location", value: "Metaverse" }],
    });

    console.log(contentURI);
    const contract = new ethers.Contract(
      podcastContractAddress,
      podcastContractAbi,
      signer
    );

    const result = await contract.createPodcast(
      uuidv4(),
      contentURI.url,
      ethers.utils.parseEther(podcastData.price).toString(),
      podcastData.name,
      podcastData.description,
      imageIpfs,
      musicIpfs
    );
    setPostHash(result.hash);
    console.log(contentURI);
  };

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: postHash,
  });

  useEffect(() => {
    postHash &&
      setPodcastData({
        name: "",
        description: "",
        price: "0",
        image: "",
        music: "",
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

    isSuccess && setChecker(false);
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
  }, [isSuccess, isLoading, setPodcastData, toast]);

  const avatarRef = useRef(null);

  function triggerOnChangeAvatar() {
    avatarRef.current.click();
  }

  function handleFile(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setMusic(uploadedFile);
    console.log(music);
  }

  async function handleAvatarChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setAvatar(uploadedFile);
    console.log(uploadedFile);
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
            <FormLabel>Name</FormLabel>
            <Input name="name" value={podcastData.name} onChange={onChange} />
          </FormControl>
          <FormControl mt={"1em"} isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={podcastData.description}
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
                  value={podcastData.price}
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
            <Input
              pt={"3.5px"}
              id="selectImage"
              type="file"
              accept="audio/*"
              onChange={handleFile}
              ref={fileRef}
            />
          </FormControl>

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
                  colorScheme={"blue"}
                  color={"black"}
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
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={avatarRef}
                />
              </VisuallyHidden>
            </Box>
          </FormControl>

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
            isLoading={checker}
            onClick={createPodcast}
          >
            Create
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default NewQuest;
