import {
  Box,
  Flex,
  IconButton,
  Image,
  Input,
  useToast,
  VisuallyHidden,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { GrSend, GrAttachment } from "react-icons/gr";
import { IoIosCloseCircle } from "react-icons/io";

import { uploadToIpfss } from "../../utils/ipfs";
import {
  useAccount,
  useProvider,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
import {
  learnifyCommunityAddress,
  learnifyProfileAddress,
} from "../../utils/contractAddress";
import communityContractAbi from "../../contracts/ABI/LearnifyCommunity.json";
import profileContractAbi from "../../contracts/ABI/LearnifyProfile.json";
import { ethers } from "ethers";
import truncateMiddle from "truncate-middle";
import axios from "axios";
import { Blob } from "nft.storage";

function AddMessage() {
  const attachRef = useRef(null);
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address } = useAccount();
  const toast = useToast();
  const [hash, setHash] = useState("");
  const [msg, setMsg] = useState();
  const [attach, setAttach] = useState();
  const [checker, setChecker] = useState(false);

  function triggerOnChangeAttach() {
    attachRef.current.click();
  }

  async function profileDetails() {
    const contract = new ethers.Contract(
      learnifyProfileAddress,
      profileContractAbi,
      provider
    );

    const result = await contract.fetchUserData(address);
    return result;
  }

  async function sendMsg() {
    setChecker(true);

    const profileData = await profileDetails();

    const pDetails = profileData
      ? await axios.get(profileData).then((response) => {
          return response.data;
        })
      : { name: "Anonymous", bio: "😈", avatar: "", cover: "" };

    const contract = new ethers.Contract(
      learnifyCommunityAddress,
      communityContractAbi,
      signer
    );

    const json = {
      ...pDetails,
      message: msg,
      timestamp: Date.now(),
    };

    const someData = new Blob([JSON.stringify(json)]);

    const jsonUrl = await uploadToIpfss(someData);

    const file =
      attach == undefined ? "not found" : await uploadToIpfss(attach);

    const result = await contract.sendMessage(jsonUrl, file);
    setHash(result.hash);
  }

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: hash,
  });

  useEffect(() => {
    isLoading &&
      toast({
        title: "Transaction Sent",
        description: truncateMiddle(hash || "", 5, 4, "..."),
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
        variant: "subtle",
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

    isSuccess && setMsg("");
    isSuccess && setAttach();
    isSuccess && setChecker(false);
  }, [isSuccess, isLoading]);

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
        {attach && (
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
            <Image src={URL.createObjectURL(attach)} borderRadius={"5px"} />
            <IconButton
              position={"absolute"}
              colorScheme={"whiteAlpha"}
              top={"50%"}
              left={"50%"}
              transform={"translate(-50%, -50%)"}
              icon={<IoIosCloseCircle fontSize={"22px"} />}
              isDisabled={checker}
              onClick={() => setAttach()}
            />
          </Box>
        )}

        <Flex>
          <Input
            borderRadius={"5px"}
            placeholder="type your message.."
            size={"sm"}
            bg={"whiteAlpha.300"}
            value={msg}
            isDisabled={checker}
            onChange={(e) => setMsg(e.target.value)}
          />
          <IconButton
            size={"sm"}
            mx={"1em"}
            colorScheme={"whatsapp"}
            className="white"
            border={"1px solid white"}
            color={"white !important"}
            onClick={sendMsg}
            isLoading={checker}
            icon={<GrSend />}
          />
          <IconButton
            colorScheme={"blue"}
            color={"white"}
            style={{ color: "white" }}
            size={"sm"}
            border={"1px solid white"}
            className="white"
            onClick={triggerOnChangeAttach}
            isDisabled={checker}
            icon={<GrAttachment color={"red"} />}
          />
          <VisuallyHidden>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setAttach(e.target.files[0])}
              ref={attachRef}
            />
          </VisuallyHidden>
        </Flex>
      </Box>
    </>
  );
}

export default AddMessage;
