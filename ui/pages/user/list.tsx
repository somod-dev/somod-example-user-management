import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import fetch from "cross-fetch";
import { NextComponentType } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { UserWithId } from "../../../lib/types";

const deleteUser = async (userId: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_USER_API_URL + "/user/" + userId,
    { method: "DELETE" }
  );
  await response.text();
};

const fetchUsers = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_USER_API_URL + "/user/list"
  );

  const users = await response.json();
  return users as UserWithId[];
};

const Users: NextComponentType = () => {
  const [users, setUsers] = useState<UserWithId[]>([]);

  useEffect(() => {
    fetchUsers().then(result => {
      setUsers(result);
    });
  }, []);

  const onDeleteUser = (userId: string) => {
    deleteUser(userId).then(() => {
      const newUsers = users.filter(u => u.userId != userId);
      setUsers(newUsers);
    });
  };

  return (
    <Container maxWidth="sm">
      <Box my={3} p={1}>
        <Typography variant="h4">Users</Typography>
        <NextLink href="/user/create" passHref>
          <Button variant="text" sx={{ float: "right" }}>
            Create New User
          </Button>
        </NextLink>
      </Box>

      <Paper>
        <List>
          {users.map(user => (
            <ListItem
              key={user.userId}
              secondaryAction={
                <>
                  <NextLink href={"/user/" + user.userId + "/edit"} passHref>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </NextLink>
                  <IconButton
                    onClick={() => {
                      onDeleteUser(user.userId);
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={
                  <NextLink href={"/user/" + user.userId} passHref>
                    <Link>{user.name}</Link>
                  </NextLink>
                }
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Users;
