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

type Campaign = {
  id: number;
  imageLink: string;
  title: string;
  description: string;
  targetAmount: number;
  upiID: string;
  deadline: string;
  currentAmount: number;
  status: string;
  userName: string;
};

const CampaignsManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select("*");

        if (error) throw error;

        // Sort campaigns: pending first, then approved, then others
        const sortedCampaigns = data.sort((a, b) => {
          if (a.status === "pending") return -1;
          if (b.status === "pending") return 1;
          if (a.status === "approved") return -1;
          if (b.status === "approved") return 1;
          return 0;
        });

        setCampaigns(sortedCampaigns as Campaign[]);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDeleteCampaign = async (id: number) => {
    try {
      const { error } = await supabaseAdminRole
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.id !== id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    try {
      let newStatus = "";
      if (currentStatus === "pending") {
        newStatus = "approved";
      } else if (currentStatus === "approved") {
        newStatus = "takedown";
      }

      if (newStatus === "takedown") {
        // If the new status is "takedown", delete the campaign
        await handleDeleteCampaign(id);
      } else {
        // Otherwise, update the status
        const { error } = await supabaseAdminRole
          .from("campaigns")
          .update({ status: newStatus })
          .eq("id", id);

        if (error) throw error;

        // Update the local state to reflect the new status
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, status: newStatus } : campaign
          )
        );
      }
    } catch (error) {
      console.error("Error updating campaign status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>A list of all campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Target Amount</TableHead>
                <TableHead>UPI ID</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Current<br />Amount</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => (
                <TableRow key={campaign.id}>
                  <TableCell>{index + 1}</TableCell> {/* Custom ID based on table order */}
                  <TableCell>
                    <img src={campaign.imageLink} alt={campaign.title} className="w-16 h-16 object-cover" />
                  </TableCell>
                  <TableCell>{campaign.title}</TableCell>
                  <TableCell>{campaign.description}</TableCell>
                  <TableCell>{campaign.targetAmount}</TableCell>
                  <TableCell>{campaign.upiID}</TableCell>
                  <TableCell>{campaign.deadline}</TableCell>
                  <TableCell>{campaign.currentAmount}</TableCell>
                  <TableCell>{campaign.userName}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {campaign.status === "pending" && (
                        <Button
                          className="bg-green-500 hover:bg-green-600"
                          variant="default"
                          onClick={() => handleUpdateStatus(campaign.id, campaign.status)}
                        >
                          Approve
                        </Button>
                      )}
                      {campaign.status === "approved" && (
                        <Button
                          variant="destructive"
                          onClick={() => handleUpdateStatus(campaign.id, campaign.status)}
                        >
                          Take Down
                        </Button>
                      )}
                    </div>
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

export default CampaignsManagement;