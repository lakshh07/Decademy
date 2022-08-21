import React, { useEffect, useRef, useState } from "react";
import { useLoadingContext } from "../../context/loading";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VisuallyHidden,
} from "@chakra-ui/react";
import Backward from "../../components/Backward";
import Module from "../../components/Module";

import { uploadToIpfss } from "../../utils/ipfs";
import { useSigner } from "wagmi";
import { courseFactoryAddress } from "../../utils/contractAddress";
import { getCourseFactoryContract } from "../../utils/courseContract";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Blob } from "nft.storage";
import sq from "../../assets/bright-squares.png";

function NewCourse() {
  const { setLoading } = useLoadingContext();
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    image: "",
  });
  const coverRef = useRef(null);
  const [courseModuleList, setCourseModuleList] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [moduleSave, setModuleSave] = useState(true);
  const [cover, setCover] = useState(null);
  const { data: signer } = useSigner();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  function onChange(e) {
    setCourseDetails(() => ({
      ...courseDetails,
      [e.target.name]: e.target.value,
    }));
  }

  function triggerOnChangeCover() {
    coverRef.current.click();
  }

  async function handleCoverChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setCover(uploadedFile);
  }

  // ////////////////////

  const processModuleData = async () => {
    let names = [];
    let descriptions = [];
    let materials = [];
    let questions = [];

    for (const modulii of courseModuleList) {
      names.push(modulii.moduleName);
      descriptions.push(modulii.moduleDes);
      const mData = new Blob([modulii.moduleMaterial]);
      const qData = new Blob([modulii.moduleQues]);
      const materialsURL = await uploadToIpfss(mData);
      const questionsURL = await uploadToIpfss(qData);
      materials.push(materialsURL);
      questions.push(questionsURL);
    }
    return { names, descriptions, materials, questions };
  };

  async function letsCreateCourse() {
    setCourseLoading(true);
    const { names, descriptions, materials, questions } =
      await processModuleData();

    const imageUrl = await uploadToIpfss(cover);
    const contract = await getCourseFactoryContract(
      courseFactoryAddress,
      signer
    );

    const tx = await contract.createCourse(
      courseDetails.title,
      courseDetails.description,
      imageUrl,
      0,
      names,
      descriptions,
      materials,
      questions
    );
    await tx.wait();
    setTimeout(() => {
      toast({
        title: "Transaction Success",
        description: "wait for indexing..",
        status: "success",
        variant: "subtle",
        position: "bottom-right",
        duration: 2000,
      });
      setCourseLoading(false);
    }, 500);
    setTimeout(() => {
      setLoading(true);
      navigate("/dashboard/courses");
    }, 3000);
  }

  return (
    <>
      <Navbar />

      <Container my={"4em"} maxW={"1200px"}>
        <Backward />

        <Heading fontSize={"2.1rem"} color={"white"} lineHeight={"2.5rem"}>
          Create New Course
        </Heading>
        <Divider />

        <Box mt={"2em"} className={"glass-ui-2"}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="title"
              value={courseDetails.title}
              onChange={onChange}
            />
          </FormControl>
          <FormControl mt={"1em"} isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={courseDetails.description}
              onChange={onChange}
            />
          </FormControl>

          <FormControl mt={"1em"} isRequired>
            <FormLabel mb={"0.5em"} fontSize="md" fontWeight="md">
              Cover Picture
            </FormLabel>

            <Flex
              w={"410px"}
              h={"210px"}
              backgroundImage={cover ? URL.createObjectURL(cover) : sq}
              border={"1px solid #E2E8F0"}
              backgroundPosition={"center"}
              backgroundColor="#662EA7"
              borderRadius={"5px"}
              backgroundRepeat={cover ? "no-repeat" : "repeat"}
              backgroundSize={cover ? "cover" : "20%"}
              align={"center"}
              justifyContent={"center"}
            >
              <Button
                border={"1px solid white"}
                colorScheme={"blackAlpha"}
                onClick={triggerOnChangeCover}
                rounded="20px"
                size={"sm"}
                fontSize={"12px"}
              >
                {cover ? `Change` : `Set`}
              </Button>
            </Flex>

            <VisuallyHidden>
              <Input
                id="selectImage"
                type="file"
                onChange={handleCoverChange}
                ref={coverRef}
              />
            </VisuallyHidden>
          </FormControl>
        </Box>

        <Box>
          <Module
            setModuleSave={setModuleSave}
            setCourseModuleList={setCourseModuleList}
          />{" "}
        </Box>

        <Button
          borderWidth={"2px"}
          borderColor={"white"}
          borderRadius={"0.625rem"}
          bg={"white"}
          color={"black"}
          py={"0.375rem"}
          px={"1rem"}
          colorScheme={"white"}
          mt={"1.5em"}
          mb={"4rem"}
          onClick={letsCreateCourse}
          isLoading={courseLoading}
          isDisabled={moduleSave}
        >
          Create
        </Button>
      </Container>
    </>
  );
}

export default NewCourse;
