import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import fetch from "cross-fetch";
import { NextComponentType } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UpdateUserInput, UserWithId } from "../../../../lib/types";

const fetchUser = async (userId: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_USER_API_URL + "/user/" + userId
  );

  const user = await response.json();
  return user as UserWithId;
};

const updateUser = async (userId: string, user: UpdateUserInput) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_USER_API_URL + "/user/" + userId,
    {
      method: "PUT",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" }
    }
  );

  const updatedUser = await response.json();
  return updatedUser as UserWithId;
};

const UserEdit: NextComponentType = () => {
  const [user, setUser] = useState<UserWithId>();

  const router = useRouter();

  const { userId } = router.query;

  useEffect(() => {
    if (userId) {
      fetchUser(userId as string).then(result => {
        setUser(result);
      });
    }
  }, [userId]);

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
    updateUser(user.userId, {
      name: user.name,
      email: user.email,
      dob: user.dob,
      active: user.active
    }).then(() => {
      router.push("/user/" + user.userId);
    });
  };

  return (
    <Container maxWidth="sm">
      <Box my={3} p={1}>
        <Typography variant="h4">Edit User</Typography>

        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            {user ? (
              <>
                <Box>
                  <Typography variant="caption">{user.userId}</Typography>
                </Box>
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
                  Submit
                </Button>
                <NextLink href={"/user/" + user.userId} passHref>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </NextLink>
              </>
            ) : (
              <>
                <Skeleton variant="rounded" height={20} />
                <Skeleton variant="rounded" height={60} />
                <Skeleton variant="rounded" height={60} />
              </>
            )}
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserEdit;
