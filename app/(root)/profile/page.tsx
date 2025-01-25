"use client";

import { useEffect, useState } from "react";
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

// Define the type for location
type Location = {
  lat: number | null;
  lng: number | null;
};

const Profile = () => {
  const { user, userDetails, session } = useAuth(); // Access user, userDetails, and session from context
  const router = useRouter();
  const [location, setLocation] = useState<Location>({ lat: null, lng: null }); // Use the Location type
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);

  // Check session only on initial mount
  useEffect(() => {
    if (!session) {
      router.push("/sign-in"); // Redirect to sign-in if session doesn't exist
    }
  }, [session, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Convert latitude and longitude to a single string
          const locationString = `${latitude},${longitude}`;

          const { error } = await supabase
            .from("user")
            .update({ location: locationString }) // Store as a string
            .eq("userId", user?.id);

          if (error) {
            throw error;
          }

          setLocation({ lat: latitude, lng: longitude });
          alert("Location updated successfully.");
        } catch (err) {
          console.error("Error updating location:", err);
          alert("Failed to update location. Please try again.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to fetch location. Please try again.");
        setLoadingLocation(false);
      }
    );
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
            <h3 className="text-lg font-semibold">Location:</h3>
            <p className="text-gray-700">
              {location.lat !== null && location.lng !== null
                ? `Lat: ${location.lat}, Lng: ${location.lng}`
                : "Location not set"}
            </p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={updateLocation}
              className="w-full bg-green-500 hover:bg-green-600"
              disabled={loadingLocation}
            >
              {loadingLocation ? "Updating Location..." : "Update Current Location"}
            </Button>
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
