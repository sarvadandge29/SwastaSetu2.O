"use client"; // Ensures the component runs on the client side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Modal from '@/components/ui/Modal';
import {ImageUpload} from '@/components/image-upload';

const CreateCampaign: React.FC = () => {
  const [formData, setFormData] = useState({
    coverImg: "",
    title: "",
    description: "",
    targetAmount: 0,
    publicAddress: "",
    deadline: "",
    currentAmount: 0,
    status: "pending"
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string, description: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUploadComplete = (url: string) => {
    setFormData(prev => ({ ...prev, coverImg: url }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.publicAddress.length !== 44) {
      setModalContent({ title: "Error", description: "Public address must be exactly 44 characters." });
      setIsModalOpen(true);
      setIsLoading(false);
      return;
    }

    const adjustedFormData = {
      ...formData,
      targetAmount: Number(formData.targetAmount)
    };

    try {
      const res = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adjustedFormData)
      });

      if (res.ok) {
        const campaign = await res.json();
        router.push(`/campaigns/${campaign.campaign._id}/show`);
      } else {
        throw new Error("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error:", error);
      setModalContent({ title: "Error", description: "There was an error creating your campaign." });
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative bg-cover bg-center min-h-screen pt-20" >
      <div className="absolute inset-0"></div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Start a Campaign</CardTitle>
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
                  <Label htmlFor="publicAddress">UPI ID *</Label>
                  <Input
                    id="publicAddress"
                    name="publicAddress"
                    type="text"
                    placeholder="Enter your UPI Id"
                    value={formData.publicAddress}
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
                <Button type="submit" className="bg-green-500 text-white px-6 py-3" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Campaign'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalContent?.title || ''}
        description={modalContent?.description || ''}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CreateCampaign;
