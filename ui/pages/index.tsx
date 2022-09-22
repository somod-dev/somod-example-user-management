import { Box, Button, Link, Typography } from "@mui/material";
import { NextComponentType } from "next";
import NextLink from "next/link";

const GettingStartedHome: NextComponentType = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h1">User Management</Typography>
      <Typography variant="h4">
        A Getting Started Project from{" "}
        <Link href="https://somod.sodaru.com" target="_blank">
          SOMOD
        </Link>
      </Typography>
      <NextLink href="/user/list" passHref>
        <Button variant="contained" sx={{ m: 2 }}>
          Manage Users
        </Button>
      </NextLink>
    </Box>
  );
};

export default GettingStartedHome;
