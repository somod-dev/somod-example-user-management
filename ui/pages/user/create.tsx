import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import fetch from "cross-fetch";
import { NextComponentType } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { CreateUserInput, UserWithId } from "../../../lib/types";

const createUser = async (user: CreateUserInput) => {
  const response = await fetch(process.env.NEXT_PUBLIC_USER_API_URL + "/user", {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" }
  });

  const createdUser = await response.json();
  return createdUser as UserWithId;
};

const UserCreate: NextComponentType = () => {
  const [user, setUser] = useState<CreateUserInput>({
    name: "",
    email: "",
    active: true,
    dob: ""
  });

  const router = useRouter();

  const updateName = (name: string) => {
    setUser({ ...user, name });
  };

  const updateEmail = (email: string) => {
    setUser({ ...user, email });
  };

  const updateDob = (dob: string) => {
    setUser({ ...user, dob });
  };

  const updateActive = (active: boolean) => {
    setUser({ ...user, active });
  };

  const submit = () => {
    createUser({
      name: user.name,
      email: user.email,
      dob: user.dob,
      active: user.active
    }).then(result => {
      router.push("/user/" + result.userId);
    });
  };

  return (
    <Container maxWidth="sm">
      <Box my={3} p={1}>
        <Typography variant="h4">Create New User</Typography>

        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box>
              <TextField
                value={user.name}
                label="Name"
                fullWidth
                required
                onChange={event => {
                  updateName(event.target.value);
                }}
              />
            </Box>
            <Box>
              <TextField
                value={user.email}
                label="Email"
                fullWidth
                required
                onChange={event => {
                  updateEmail(event.target.value);
                }}
              />
            </Box>
            <Box>
              <TextField
                value={user.dob}
                label="Date of Birth"
                fullWidth
                placeholder="dd/mm/yyyy"
                InputLabelProps={{ shrink: true }}
                onChange={event => {
                  updateDob(event.target.value);
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2">Active</Typography>
              <Switch
                checked={user.active}
                size="small"
                onChange={event => {
                  updateActive(event.target.checked);
                }}
              />
            </Box>

            <Button variant="contained" onClick={submit}>
              Create
            </Button>
            <NextLink href={"/user/list"} passHref>
              <Button variant="text" color="info">
                Back to User List
              </Button>
            </NextLink>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserCreate;
