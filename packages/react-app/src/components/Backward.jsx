import React from "react";
import { IoPlayBack } from "react-icons/io5";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Backward() {
  const navigate = useNavigate();
  return (
    <>
      <Box>
        <Flex
          cursor="pointer"
          onClick={() => navigate(-1)}
          textDecoration="underline"
          fontFamily="Montserrat"
          alignItems="center"
          mb={"2em"}
          color={"white"}
        >
          <IoPlayBack fontSize="11px" />
          <Text ml="10px" fontSize="15px">
            Back
          </Text>
        </Flex>
      </Box>
    </>
  );
}

export default Backward;
