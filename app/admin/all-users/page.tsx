"use client";
import React, { useEffect, useState } from "react";
import { supabase, supabaseAdminRole } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type User = {
  userId: string;
  email: string;
  phoneNumber: string;
  userName: string;
  location: string | null; // Add location field to the User type
};

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminLocation, setAdminLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminLocation = async () => {
      try {
        // Fetch the admin's location
        const { data: adminData, error: adminError } = await supabase
          .from("user")
          .select("location")
          .eq("userType", "admin")
          .single();

        if (adminError) throw adminError;

        setAdminLocation(adminData?.location || null);
      } catch (error) {
        console.error("Error fetching admin location:", error);
      }
    };

    fetchAdminLocation();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!adminLocation) return; // Do not fetch users if admin location is not available

      try {
        // Fetch users who have the same location as the admin
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("location", adminLocation) // Filter users with the same location as the admin
          .neq("userType", "admin"); // Exclude admin users

        if (error) throw error;

        setUsers(data as User[]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [adminLocation]);

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error: dbError } = await supabaseAdminRole
        .from("user")
        .delete()
        .eq("userId", userId);

      if (dbError) throw dbError;

      const { error: authError } = await supabaseAdminRole.auth.admin.deleteUser(userId);

      if (authError) throw authError;

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
          <CardTitle>Users in {adminLocation || "Your Location"}</CardTitle>
          <CardDescription>
            A list of all registered users in the same location as you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Location</TableHead>
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
                  <TableCell>{user.location}</TableCell>
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