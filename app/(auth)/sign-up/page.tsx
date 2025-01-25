"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const SignUp = (props: React.ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setError("Unable to fetch location. Please enable location services.");
      }
    );
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number length
    if (phoneNumber.length !== 10 || !/^[\d]+$/.test(phoneNumber)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!location) {
      setError("Location is required. Please enable location services.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            phone: phoneNumber,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      const user = data?.user;

      const { error: insertError } = await supabase.from("user").insert([
        {
          userId: user?.id,
          userName: username,
          email: user?.email,
          phoneNumber: phoneNumber,
          location: location ? `${location.lat},${location.lng}` : null,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage("Sign up successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500); // Redirect after 1.5 seconds
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-green-500">Sign Up</CardTitle>
            <CardDescription>Enter your details to Sign Up</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="User_Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  className="w-full bg-green-500 hover:bg-green-700"
                  onClick={fetchLocation}
                  disabled={loading || location !== null}
                >
                  {location ? "Location Captured" : "Get Location"}
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
              {successMessage && (
                <p className="mt-4 text-green-500 text-sm">{successMessage}</p>
              )}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Sign In
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
