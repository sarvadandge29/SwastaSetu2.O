"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/context/UserContext"; // Assuming you have a UserContext

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    location: "",
    imageLink: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const router = useRouter();
  const { userDetails } = useAuth(); // Fetch user details from the context

  useEffect(() => {
    if (userDetails) {
      setUserName(userDetails.userName || ""); // Set userName from the session
      setUserId(userDetails.userId || ""); // Set userId from the session
    }
  }, [userDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate inputs
      if (!formData.title || !formData.content || !formData.location) {
        throw new Error("Title, content, and location are required.");
      }

      let imageLink = "";

      // Step 1: Upload image to Supabase Storage inside the `post` folder
      if (imageFile) {
        const fileName = `${userName}_${imageFile.name}`.replace(/[^a-zA-Z0-9]/g, "_");
        const filePath = `post/${fileName}`; // Specify the folder path
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images") // Bucket name
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded file
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        imageLink = urlData.publicUrl;
      }

      // Step 2: Insert post details into the database
      const { data, error: insertError } = await supabase
        .from("posts") // Replace with your table name
        .insert([
          {
            userId,
            userName,
            title: formData.title,
            content: formData.content,
            location: formData.location,
            imageLink,
          },
        ]);

      if (insertError) throw insertError;

      setSuccessMessage("Your post has been created successfully!");
      router.push("/"); // Redirect to home page after success
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-cover bg-center min-h-96 pt-20">
      <div className="absolute inset-0"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Create a Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter a title for your post"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your post content..."
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter your location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageLink">Image (Optional)</Label>
                <Input
                  id="imageLink"
                  name="imageLink"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-3"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Create Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;