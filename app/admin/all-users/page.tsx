"use client";
import React, { useEffect, useState } from "react";
import { supabase, supabaseAdminRole } from "@/utils/supabase/client"; // Import both clients
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import shadcn table components
import { Button } from "@/components/ui/button"; // Import shadcn button component
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // Import shadcn card components

// Define the type for a user based on the CSV structure
type User = {
  userId: string;
  email: string;
  phoneNumber: string;
  userName: string;
};

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch only non-admin users using the regular client
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .neq("userType", "admin"); // Exclude admin users

        if (error) throw error;

        setUsers(data as User[]); // Cast the data to the User type
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to delete a user
  const handleDeleteUser = async (userId: string) => {
    try {
      // Step 1: Delete the user from the database using the admin client
      const { error: dbError } = await supabaseAdminRole
        .from("user")
        .delete()
        .eq("userId", userId); // Delete user by userId

      if (dbError) throw dbError;

      // Step 2: Delete the user from Supabase Auth using the admin client
      const { error: authError } = await supabaseAdminRole.auth.admin.deleteUser(userId);

      if (authError) throw authError;

      // Remove the deleted user from the state
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.userId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.userId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllUsers;