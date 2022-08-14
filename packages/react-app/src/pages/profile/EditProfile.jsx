import React, { useState, useRef } from "react";
import {
  Flex,
  Text,
  chakra,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  useColorModeValue,
  Textarea,
  Spinner,
  Progress,
  VisuallyHidden,
  Image,
} from "@chakra-ui/react";
import sq from "../../assets/bright-squares.png";
import man from "../../assets/man.png";

function EditProfile({ isOpen, onClose }) {
  const coverRef = useRef(null);
  const avatarRef = useRef(null);

  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [checker, setChecker] = useState(false);

  const [cover, setCover] = useState(null);
  const [avatar, setAvatar] = useState(null);

  function triggerOnChangeCover() {
    coverRef.current.click();
  }
  function triggerOnChangeAvatar() {
    avatarRef.current.click();
  }

  async function handleCoverChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setCover(uploadedFile);
  }
  async function handleAvatarChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setAvatar(uploadedFile);
  }

  async function updateProfile(bio, name, setChecker) {}

  return (
    <>
      <Modal
        blockScrollOnMount={true}
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
        size={"full"}
        zIndex={"999"}
      >
        <ModalOverlay />
        <ModalContent
          m={"20em 30em 15em !important"}
          className={"glass-ui"}
          borderRadius={"10px"}
          bg={"blackAlpha.500 !important"}
          boxShadow={"rgba(255, 255, 255, 0.1) 0px 7px 29px 0px"}
          border={"1px solid white"}
        >
          <ModalHeader color={"white"} fontFamily="Raleway">
            Edit Profile
          </ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
            <Box>
              <chakra.form
                shadow="base"
                rounded={[null, "md"]}
                overflow={{ sm: "hidden" }}
              >
                <Box className={"glass-ui-2"}>
                  <FormControl>
                    <FormLabel fontSize="md" fontWeight="md">
                      Name
                    </FormLabel>
                    <InputGroup size="sm">
                      <Input
                        type="text"
                        focusBorderColor="whiteAlpha.700"
                        rounded="md"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md" mt={"1em"} fontWeight="md">
                      Bio
                    </FormLabel>
                    <InputGroup size="sm">
                      <Textarea
                        type="text"
                        focusBorderColor="whiteAlpha.700"
                        rounded="md"
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                      />
                    </InputGroup>
                  </FormControl>

                  <Flex w={"100%"} mt={"1em"}>
                    <Box mr={"2em"}>
                      <FormControl align={"center"}>
                        <FormLabel mb={"0.5em"} fontSize="md" fontWeight="md">
                          Avatar
                        </FormLabel>

                        <Box position={"relative"}>
                          <Image
                            src={avatar ? URL.createObjectURL(avatar) : man}
                            boxSize={"120px"}
                            border={"1px solid #E2E8F0"}
                            style={{
                              borderRadius: "5  px",
                            }}
                          />
                          <Flex
                            position={"absolute"}
                            top={"50%"}
                            left={"50%"}
                            transform={"translate(-50%, -50%)"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Button
                              border={"1px solid white"}
                              colorScheme={"blackAlpha"}
                              onClick={triggerOnChangeAvatar}
                              rounded="20px"
                              size={"sm"}
                              fontSize={"12px"}
                            >
                              {avatar ? `Change` : `Set`}
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
                    </Box>
                    <Box flex={1}>
                      <FormControl>
                        <FormLabel mb={"0.5em"} fontSize="md" fontWeight="md">
                          Cover
                        </FormLabel>

                        <Flex
                          w={"100%"}
                          h={"120px"}
                          backgroundImage={
                            cover ? URL.createObjectURL(cover) : sq
                          }
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
                  </Flex>
                </Box>
              </chakra.form>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn"
              //   onClick={async () => {
              //     setChecker(true);
              //     await update(name, bio);
              //     setChecker(false);
              //     setTimeout(() => {
              //       onClose();
              //     }, 500);
              //   }}
            >
              {checker && <Spinner mr={4} />}
              {checker ? "Saving.." : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditProfile;
