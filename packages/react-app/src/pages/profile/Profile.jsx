import {
  Box,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import ECourses from "./ECourses";
import EditProfile from "./EditProfile";
import { useLoadingContext } from "../../context/loading";
import { MdOutlineSettings } from "react-icons/md";
import sq from "../../assets/bright-squares.png";
import man from "../../assets/man.png";
import badge from "../../assets/beg-badge.png";

function Profile() {
  const { setLoading } = useLoadingContext();
  const { onOpen, onClose, isOpen } = useDisclosure();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <>
      <Navbar />

      <Container maxW={"1100px"} my={"4em"}>
        <Box
          className="glass-ui-2"
          borderColor={"transparent"}
          borderRadius={"5px"}
          p={"1em"}
          boxShadow={"none"}
        >
          <Box
            w={"100%"}
            h={"250px"}
            borderRadius={"10px"}
            border={"1px solid white"}
            backgroundImage={sq}
            backgroundPosition={"center"}
            backgroundColor="#662EA7"
            //   backgroundRepeat={profile?.coverPicture ? "no-repeat" : "repeat"}
            backgroundSize={"20%"}
            align={"right"}
          >
            <IconButton
              colorScheme={"blackAlpha"}
              border={"1px solid white"}
              m={"1em"}
              size={"sm"}
              icon={<MdOutlineSettings />}
              onClick={onOpen}
            />
            <EditProfile isOpen={isOpen} onClose={onClose} />
          </Box>

          <Grid templateColumns={"2fr 4fr"}>
            <GridItem>
              <Box
                mt={"-6rem"}
                ml={"4em"}
                border={"2px solid white"}
                w={"max-content"}
                borderRadius={"99999"}
              >
                <Image
                  src={man}
                  objectFit="cover"
                  boxSize={"150px"}
                  style={{ borderRadius: "50%" }}
                />
              </Box>

              <Box pl={"1em"} mt={"1em"} color={"white"}>
                <Heading
                  textTransform={"capitalize"}
                  fontSize={"26px"}
                  fontWeight={700}
                  pt={"0.5em"}
                  color={"white"}
                >
                  Lakshay Maini
                </Heading>
                <Text pt={"0.5em"} fontSize={"16px"}>
                  Full-Stack Blockchain Developer
                </Text>
              </Box>
            </GridItem>
            <GridItem>
              <Heading
                fontSize={"24px"}
                fontWeight={500}
                pt={"1em"}
                color={"white"}
              >
                Badges
              </Heading>
              <Divider />
              <Box>
                <Image
                  mx={"1em"}
                  my={"1em"}
                  boxSize={"80px"}
                  src={badge}
                  borderRadius={"9999"}
                  boxShadow={"rgba(255, 255, 255, 0.2) 0px 7px 29px 0px"}
                />
              </Box>
              <Heading
                fontSize={"24px"}
                fontWeight={500}
                pt={"1.5em"}
                color={"white"}
              >
                Courses Enrolled
              </Heading>
              <Divider />
              <Box>
                <ECourses />
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Profile;
