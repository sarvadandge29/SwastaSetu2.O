"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext"; // Import the useAuth hook
import { supabase } from "@/utils/supabase/client";

const Profile = () => {
  const { user, userDetails, session } = useAuth(); // Access user, userDetails, and session from context
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
        if (!session) {
            router.push("/sign-in"); // Redirect to sign-in if session doesn't exist
          } 
    }, 2000);

  }, [session, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-4xl font-bebas-neue">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <Card className="px-48">
        <CardHeader>
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src="/path-to-user-avatar.jpg" alt="User Avatar" />
            <AvatarFallback className="text-4xl">
              {user.user_metadata?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-center mt-4 text-green-500">
            {user.user_metadata?.username || "User"}
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            {userDetails?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Phone Number:</h3>
            <p className="text-gray-700">{userDetails?.phoneNumber}</p>
          </div>
          <div>
            <Button onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
