import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Typography
} from "@mui/material";
import { NextComponentType } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserWithId } from "../../../lib/types";

const fetchUser = async (userId: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_USER_API_URL + "/user/" + userId
  );

  const users = await response.json();
  return users as UserWithId;
};

const UserView: NextComponentType = () => {
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

  return (
    <Container maxWidth="sm">
      <Box my={3} p={1}>
        <Typography variant="h4">User</Typography>

        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            {user ? (
              <>
                <Box>
                  <Typography variant="caption">{user.userId}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography variant="body2">{user.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Date of Birth</Typography>
                  <Typography variant="body2">{user.dob}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Active</Typography>
                  <Switch readOnly checked={user.active} size="small" />
                </Box>

                <Box>
                  <Typography variant="subtitle2">Last Updated At</Typography>
                  <Typography variant="body2">
                    {new Date(user.lastUpdatedAt).toDateString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Created At</Typography>
                  <Typography variant="body2">
                    {new Date(user.createdAt).toDateString()}
                  </Typography>
                </Box>
                <NextLink href={"/user/" + user.userId + "/edit"} passHref>
                  <Button variant="outlined">Edit</Button>
                </NextLink>
                <NextLink href={"/user/list"} passHref>
                  <Button variant="text" color="info">
                    Back to User List
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

export default UserView;
