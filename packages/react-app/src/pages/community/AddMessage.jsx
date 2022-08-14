import { Box, Flex, IconButton, Image, Input } from "@chakra-ui/react";
import React from "react";
import { GrSend, GrFormAttachment, GrAttachment } from "react-icons/gr";
import grad from "../../assets/gradiant.png";

function AddMessage() {
  return (
    <>
      <Box
        position={"fixed"}
        bottom={"0"}
        mx={"auto"}
        my={"1em"}
        p={"1em"}
        className={"glass-ui"}
        paddingInlineEnd={"1em"}
        paddingInlineStart={"1em"}
        w={"1168px"}
        borderRadius={"5px"}
      >
        <Box
          ml={"auto"}
          right={"0"}
          bottom={"4.5em"}
          position={"absolute"}
          h={"auto"}
          p={"0.5em"}
          w={"150px"}
          borderRadius={"10px"}
          className={"glass-ui"}
          border={"1px solid white"}
        >
          <Image src={grad} borderRadius={"5px"} />
        </Box>
        <Flex>
          <Input
            borderRadius={"5px"}
            placeholder="type your message.."
            size={"sm"}
            bg={"whiteAlpha.300"}
          />
          <IconButton
            size={"sm"}
            mx={"1em"}
            colorScheme={"whatsapp"}
            className="white"
            border={"1px solid white"}
            color={"white !important"}
            icon={<GrSend color={"red"} />}
          />
          <IconButton
            colorScheme={"blue"}
            color={"white"}
            style={{ color: "white" }}
            size={"sm"}
            border={"1px solid white"}
            className="white"
            icon={<GrAttachment color={"red"} />}
          />
        </Flex>
      </Box>
    </>
  );
}

export default AddMessage;
