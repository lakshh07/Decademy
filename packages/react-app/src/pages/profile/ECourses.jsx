import React, { useEffect, useState } from "react";
import { useAccount, useContractRead, useProvider } from "wagmi";
import { courseFactoryAddress } from "../../utils/contractAddress";
import courseContractFactoryAbi from "../../contracts/ABI/CourseFactory.json";
import { getCourseContract } from "../../utils/courseContract";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import truncateMiddle from "truncate-middle";
import { FiArrowUpRight } from "react-icons/fi";
import { useLoadingContext } from "../../context/loading";
import Blockies from "react-blockies";
import { useNavigate } from "react-router-dom";
import gradiant from "../../assets/gradiant.png";
import notFound from "../../assets/page-not-found.png";

function ECourses() {
  const { setLoading } = useLoadingContext();
  const [courseData, setCourseData] = useState();
  const provider = useProvider();
  const { address } = useAccount();
  const navigate = useNavigate();

  const {
    data: fetchData,
    isLoading,
    isFetching,
  } = useContractRead({
    addressOrName: courseFactoryAddress,
    contractInterface: courseContractFactoryAbi,
    functionName: "getDeployedCourses",
    watch: true,
  });

  async function getEnrolledCourses() {
    let enrolled = [];

    for (const ca of fetchData) {
      let contract = getCourseContract(ca, provider);
      let userCourses = await contract.enrolled(address);
      if (userCourses) {
        enrolled.push(ca);
      }
    }
    return enrolled;
  }

  async function getCourseInfo(address) {
    const course = getCourseContract(address, provider);
    const courseInformation = await course.getSummaryInformation();
    const [name, description, imageURL, author] = courseInformation;
    return {
      name,
      description,
      imageURL,
      author,
      address,
    };
  }

  const getCourseSummaries = async () => {
    let courseInfo = [];
    const enrolledCourses = await getEnrolledCourses();
    for (const ca of enrolledCourses) {
      const info = await getCourseInfo(ca);
      courseInfo.push(info);
    }
    setCourseData(courseInfo);
  };

  useEffect(() => {
    getCourseSummaries();
  }, [isFetching]);

  return (
    <>
      <Box mt={"2em"} px={"0.5em"}>
        {isLoading ? (
          <>
            <Flex my="10rem" justifyContent="center" alignItems="center">
              <Spinner size="xl" color="white" />
            </Flex>
          </>
        ) : courseData?.length ? (
          <>
            {courseData ? (
              <>
                <Grid
                  mt={"1.5rem"}
                  templateColumns={"repeat(2, minmax(0px, 1fr))"}
                  gap={"1.5rem"}
                >
                  {courseData?.length &&
                    courseData
                      ?.slice(0)
                      .reverse()
                      .map((list, index) => {
                        return (
                          <GridItem key={index}>
                            <Box
                              borderWidth={"2px"}
                              borderColor={"white"}
                              borderRadius={"0.625rem"}
                              overflow={"hidden"}
                              cursor={"pointer"}
                              transform={"scale(1)"}
                              transition={
                                "transform 0.2s cubic-bezier(0.4, 0, 1, 1)"
                              }
                              _hover={{
                                transform: "scale(1.02)",
                                transition:
                                  "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                              }}
                            >
                              <Box
                                h={"160px"}
                                overflow={"hidden"}
                                borderBottomWidth={"2px"}
                              >
                                <Image
                                  alt={list.name}
                                  objectFit={"cover"}
                                  src={list.imageURL ? list.imageURL : gradiant}
                                  h={"100%"}
                                  w={"100%"}
                                />
                              </Box>

                              <Box py={"1rem"} px={"1rem"} bg={"white"}>
                                <Heading
                                  mt={"0rem"}
                                  fontSize={"1.2rem"}
                                  color={"#1a202c"}
                                >
                                  {list.name}
                                </Heading>
                                <Text
                                  fontSize={"0.775rem"}
                                  lineHeight={"1.25rem"}
                                  color={"#888888"}
                                  my={"0.5rem"}
                                >
                                  {`${list.description.substring(0, 85)}...`}
                                </Text>
                                <Flex
                                  borderWidth={"2px"}
                                  borderColor={"rgb(10 10 10/1)"}
                                  alignItems={"center"}
                                  borderRadius={"0.3125rem"}
                                  bg={"rgb(198 201 246)"}
                                  py={"0.25rem"}
                                  px={"0.75rem"}
                                  w={"max-content"}
                                >
                                  <Box
                                    borderRadius={"50%"}
                                    borderWidth={"1.5px"}
                                    borderColor={"rgb(10 10 10/1)"}
                                    overflow={"hidden"}
                                  >
                                    <Blockies
                                      seed={list.author}
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
                                  >
                                    {truncateMiddle(
                                      list.author || "",
                                      5,
                                      4,
                                      "..."
                                    )}
                                  </Text>
                                </Flex>
                              </Box>
                              <Box
                                onClick={() => {
                                  setLoading(true);
                                  navigate(
                                    `/dashboard/courses/${list.address}`
                                  );
                                }}
                              >
                                <Flex
                                  justifyContent={"space-between"}
                                  alignItems={"center"}
                                  borderTopWidth={"2px"}
                                  py={"1rem"}
                                  px={"2rem"}
                                  bg={"rgb(250 229 195)"}
                                  color={"black"}
                                >
                                  <Text fontWeight={600}>Go to course</Text>
                                  <FiArrowUpRight fontSize={"20px"} />
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
                <Flex my="10rem" justifyContent="center" alignItems="center">
                  <Spinner size="xl" color={"white"} />
                </Flex>
              </>
            )}
          </>
        ) : (
          <>
            <Flex
              mt="2rem"
              mb={"1em"}
              justifyContent="center"
              flexDir="column"
              alignItems="center"
            >
              <Image src={notFound} height={50} width={50} />
              <Heading fontSize="1em" fontWeight={500} pt="1em" color={"white"}>
                No Courses Enrolled
              </Heading>
            </Flex>
          </>
        )}
      </Box>
    </>
  );
}

export default ECourses;
