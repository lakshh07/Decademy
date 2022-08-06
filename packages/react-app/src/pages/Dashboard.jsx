import {
  Box,
  Container,
  Heading,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLoadingContext } from "../context/loading";
import learning from "../assets/learning.png";
import influencer from "../assets/influencer.png";
import { Link } from "react-router-dom";

function Dashboard() {
  const { setLoading } = useLoadingContext();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <>
      <Navbar />

      <Container maxW={"1200px"} pt={"1.5em"}>
        <Box my={"4rem"}>
          <Heading fontSize={"2.1rem"} color={"white"} lineHeight={"2.5rem"}>
            Dashboard
          </Heading>

          <Grid
            align={"center"}
            mt={"2em"}
            templateColumns={"repeat(3, minmax(0px, 1fr))"}
            gap={"2rem"}
          >
            <Link to="/dashboard/courses">
              <GridItem>
                <Box
                  className="glass-ui-2 glass-gradient-box"
                  p={"1.5em"}
                  transform={"scale(1)"}
                  transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                  _hover={{
                    transform: "scale(1.02)",
                    transition: "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                  }}
                >
                  <Image boxSize={"200px"} src={learning} />
                  <Heading
                    fontSize={"1.5rem"}
                    lineHeight={"2.5rem"}
                    fontWeight={"500"}
                    mt={"2em"}
                    className={"hero-quotes text-transparent"}
                    backgroundImage={"none"}
                    color={"white !important"}
                  >
                    Courses
                  </Heading>
                </Box>
              </GridItem>
            </Link>
            <Link to="/dashboard/podcasts">
              <GridItem>
                <Box
                  className="glass-ui-2 glass-gradient-box"
                  p={"1.5em"}
                  transform={"scale(1)"}
                  transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                  _hover={{
                    transform: "scale(1.02)",
                    transition: "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                  }}
                >
                  <Image boxSize={"200px"} src={influencer} />
                  <Heading
                    fontSize={"1.5rem"}
                    lineHeight={"2.5rem"}
                    fontWeight={"500"}
                    mt={"2em"}
                    className={"hero-quotes text-transparent"}
                  >
                    Podcasts
                  </Heading>
                </Box>
              </GridItem>
            </Link>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
