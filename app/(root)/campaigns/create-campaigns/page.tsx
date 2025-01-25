"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { ImageUpload } from "@/components/image-upload";
import { supabase } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CreateCampaign: React.FC = () => {
  const [formData, setFormData] = useState({
    coverImg: "",
    imgLink: "",
    title: "",
    description: "",
    targetAmount: 0,
    upiID: "",
    deadline: "",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUploadComplete = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      const { data, error } = await supabase.storage
        .from("images")
        .upload(`campaigns/${file.name}`, file);

      if (error) {
        setModalContent({
          title: "Error",
          description: "Failed to upload the image.",
        });
        setIsModalOpen(true);
        return;
      }

      const fileUrl = data?.path
        ? `https://llkuxbyxxliwnjuzywjb.supabase.co/storage/v1/object/public/images/${data.path}`
        : "";
      setFormData((prev) => ({ ...prev, imgLink: fileUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.coverImg) {
      setModalContent({
        title: "Error",
        description: "Please upload a campaign image.",
      });
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from("campaigns").insert([
        {
          imageLink: formData.imgLink,
          title: formData.title,
          description: formData.description,
          targetAmount: formData.targetAmount,
          upiID: formData.upiID,
          deadline: formData.deadline,
          userId : '',
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setModalContent({
        title: "Error",
        description: "There was an error creating your campaign.",
      });
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative bg-cover bg-center min-h-screen pt-20">
      <div className="absolute inset-0"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Start a Campaign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="coverImg">Campaign Image *</Label>
                <ImageUpload onChange={handleUploadComplete} />
              </div>

              <div>
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Give your campaign a title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Story *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell your story..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="upiID">UPI ID *</Label>
                  <Input
                    id="upiID"
                    name="upiID"
                    type="text"
                    placeholder="Enter your UPI Id"
                    value={formData.upiID}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="targetAmount">Amount in Rs *</Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  placeholder="0.5 SOL"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Campaign"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalContent?.title || ""}
        description={modalContent?.description || ""}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CreateCampaign;
