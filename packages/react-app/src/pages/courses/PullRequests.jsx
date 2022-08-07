import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Blockies from "react-blockies";
import truncateMiddle from "truncate-middle";
import { useNavigate } from "react-router-dom";
import notFound from "../../assets/page-not-found.png";

function PullRequests({ setLoading, id, requests }) {
  const navigate = useNavigate();

  return (
    <>
      <Flex
        mt={"3.5em"}
        mb={"0.5em"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex alignItems={"center"}>
          <Heading color={"white"} fontSize={"32px"} fontWeight={600}>
            Pull Requests
          </Heading>
          <Text
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
            {requests?.length}
          </Text>
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
            navigate(`/dashboard/courses/${id}/requests/new`);
          }}
        >
          New Request
        </Button>
      </Flex>
      <Divider />

      {requests?.length ? (
        requests?.map((list, index) => {
          return (
            <Box
              borderWidth={"2px"}
              borderColor={"white"}
              borderRadius={"0.625rem"}
              p={"1em"}
              mt={"1rem"}
              key={index}
              className={"glass-ui"}
            >
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Text
                  borderWidth={"2px"}
                  borderColor={"white"}
                  alignItems={"center"}
                  borderRadius={"9999px"}
                  py={"0.25rem"}
                  px={"0.75rem"}
                  color={"black"}
                  textTransform={"uppercase"}
                  fontSize={"0.75rem"}
                  lineHeight={"1rem"}
                  fontWeight={600}
                  bg={list.approved ? "rgb(183 234 213)" : "rgb(250 229 195)"}
                >
                  {list.approved ? "approved" : "open"}
                </Text>
                <Flex
                  borderWidth={"2px"}
                  borderColor={"white"}
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
                    color={"black"}
                  >
                    {truncateMiddle(list.author || "", 5, 4, "...")}
                  </Text>
                </Flex>
              </Flex>

              <Heading
                mt={"1em"}
                color={"white"}
                fontWeight={500}
                fontSize={"24px"}
              >
                {list.name}
              </Heading>
              <Text
                fontSize={"16px"}
                mt={"10px"}
                mb={"1.2em"}
                color={"#ededed"}
              >
                {list.description}
              </Text>

              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Box
                  borderWidth={"2px"}
                  borderColor={"white"}
                  alignItems={"center"}
                  borderRadius={"0.3125rem"}
                  py={"0.25rem"}
                  px={"0.75rem"}
                  bg={"#FFBDAA"}
                  color={"black"}
                >
                  <Text fontWeight={500}>{list.approvers} vote</Text>
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
                  onClick={() => {
                    setLoading(true);
                    navigate(`/dashboard/courses/${id}/requests/${index}`);
                  }}
                >
                  View
                </Button>
              </Flex>
            </Box>
          );
        })
      ) : (
        <>
          <Flex
            my="5rem"
            justifyContent="center"
            flexDir="column"
            alignItems="center"
          >
            <Image src={notFound} height={90} width={90} />
            <Heading fontSize="1.3em" color={"white"} fontWeight={500} pt="1em">
              No Pull Requests Found
            </Heading>
          </Flex>
        </>
      )}
    </>
  );
}

export default PullRequests;
