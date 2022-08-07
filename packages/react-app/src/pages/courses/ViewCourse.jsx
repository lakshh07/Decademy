import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../../context/loading";
import Backward from "../../components/Backward";

import { getCourseContract } from "../../utils/courseContract";
import { useProvider } from "wagmi";
import { getTextFromIPFS } from "../../utils/ipfs";
import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";

function ViewCourse() {
  const { setLoading, loading } = useLoadingContext();
  const provider = useProvider();
  const { id, version } = useParams();
  const [content, setContent] = useState();
  const [selectedContent, setSelectedContent] = useState(0);

  const getModules = async () => {
    const contract = getCourseContract(id, provider);
    const modulesToReturn = [];
    const returnedModules = await contract.returnModules(version);
    setLoading(false);
    const [names, descriptions, materials, questions] = returnedModules;
    for (let i = 0; i < names.length; i++) {
      const materialsText = await getTextFromIPFS(materials[i]);
      const questionsText = await getTextFromIPFS(questions[i]);
      const moduleeeee = {
        id: 1,
        name: names[i],
        description: descriptions[i],
        materials: materialsText,
        questions: questionsText,
      };
      modulesToReturn.push(moduleeeee);
    }

    // console.log(modulesToReturn);
    setContent(modulesToReturn);
  };

  useEffect(() => {
    getModules();
  }, []);

  const htmlFrom = (htmlString) => {
    const cleanHtmlString = DOMPurify.sanitize(htmlString, {
      USE_PROFILES: { html: true },
    });
    const html = parse(cleanHtmlString);
    return html;
  };

  return (
    <>
      <Navbar />

      <Container maxW={"1200px"} my={"4rem"}>
        <Backward />

        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Button
            borderWidth={"2px"}
            borderColor={"white"}
            borderRadius={"0.625rem"}
            bg={"white"}
            color={"black"}
            py={"0.375rem"}
            px={"1rem"}
            colorScheme={"white"}
            isDisabled={selectedContent === 0}
            onClick={() => setSelectedContent(selectedContent - 1)}
          >
            Previous
          </Button>
          <Button
            borderWidth={"2px"}
            borderColor={"white"}
            borderRadius={"0.625rem"}
            bg={"white"}
            color={"black"}
            py={"0.375rem"}
            px={"1rem"}
            colorScheme={"black"}
            isDisabled={selectedContent === content?.length - 1}
            onClick={() => setSelectedContent(selectedContent + 1)}
          >
            Next
          </Button>
        </Flex>

        {!content ? (
          <>
            <Flex my="12rem" justifyContent="center" alignItems="center">
              <Spinner color="white" size="xl" />
            </Flex>
          </>
        ) : (
          <Box
            borderWidth={"2px"}
            borderColor={"white"}
            borderRadius={"0.625rem"}
            p={"1em 1.5em 1.4em"}
            mt={"1.5em"}
            className={"glass-ui"}
          >
            <Text fontWeight={500} fontSize={"26px"}>
              {content && content[selectedContent]?.name}
            </Text>
            <Text mt={"0.5em"} lineHeight={"28px"}>
              {content && content[selectedContent]?.description}
            </Text>

            <Heading mt={"1em"} fontWeight={600} fontSize={"24px"}>
              Learning Materials
            </Heading>
            <Box pl={"1.5em"} mt={"0.5em"}>
              {content && htmlFrom(content[selectedContent]?.materials)}
            </Box>

            <Heading fontWeight={600} mt={"1em"} fontSize={"24px"}>
              Questions
            </Heading>
            <Box pl={"1.5em"} mt={"0.5em"}>
              {content && htmlFrom(content[selectedContent]?.questions)}
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}

export default ViewCourse;
