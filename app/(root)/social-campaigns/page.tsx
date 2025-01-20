"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dummy campaign data
const dummyCampaigns = [
  {
    _id: "1",
    title: "Clean Water Initiative",
    description: "Help provide clean water to communities in need.",
    coverImg: "/images/campaign1.jpg",
    currentAmount: 5000,
    targetAmount: 10000,
  },
  {
    _id: "2",
    title: "School Supplies for Kids",
    description:
      "Support education by donating school supplies to underprivileged children.",
    coverImg: "/images/campaign2.jpg",
    currentAmount: 2000,
    targetAmount: 8000,
  },
  {
    _id: "3",
    title: "Tree Planting Drive",
    description: "Join us in planting trees to combat deforestation.",
    coverImg: "/images/campaign3.jpg",
    currentAmount: 7500,
    targetAmount: 10000,
  },
  {
    _id: "4",
    title: "Medical Aid for Refugees",
    description:
      "Provide essential medical aid to refugees in conflict zones.",
    coverImg: "/images/campaign4.jpg",
    currentAmount: 3000,
    targetAmount: 7000,
  },{
    _id: "5",
    title: "Clean Water Initiative",
    description: "Help provide clean water to communities in need.",
    coverImg: "/images/campaign1.jpg",
    currentAmount: 5000,
    targetAmount: 10000,
  },
  {
    _id: "6",
    title: "School Supplies for Kids",
    description:
      "Support education by donating school supplies to underprivileged children.",
    coverImg: "/images/campaign2.jpg",
    currentAmount: 2000,
    targetAmount: 8000,
  },
  {
    _id: "7",
    title: "Tree Planting Drive",
    description: "Join us in planting trees to combat deforestation.",
    coverImg: "/images/campaign3.jpg",
    currentAmount: 7500,
    targetAmount: 10000,
  },
  {
    _id: "8",
    title: "Medical Aid for Refugees",
    description:
      "Provide essential medical aid to refugees in conflict zones.",
    coverImg: "/images/campaign4.jpg",
    currentAmount: 3000,
    targetAmount: 7000,
  },
];

const AllCampaigns: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredCampaigns = dummyCampaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      {/* Search Bar */}
      <div className="relative mb-8 lg:pl-48 lg:mr-48">
        <Input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-full pr-10"
        />
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredCampaigns.map((campaign) => (
          <Card
            key={campaign._id}
            className="rounded-lg border border-gray-500 shadow-lg hover:scale-105 transition-transform"
          >
            {/* Campaign Image */}
            <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
              <Image
                src={campaign.coverImg}
                alt={campaign.title}
                width={400}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Campaign Details */}
            <CardContent className="p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg font-bold text-green-500">
                  {campaign.title}
                </CardTitle>
              </CardHeader>
              <p className="text-gray-700 text-sm line-clamp-2">
                {campaign.description}
              </p>
              <div className="flex justify-between items-center mt-4">
                {/* Raised Amount */}
                <div className="text-sm font-semibold">
                  Raised: {campaign.currentAmount}{" "}
                  <span className="text-gray-600">
                    of {campaign.targetAmount}
                  </span>
                </div>

                {/* Donate Button */}
                <Link href={`/campaigns/${campaign._id}/show`} passHref>
                  <Button size="sm" className="bg-green-500 hover:bg-green-700">
                    Donate
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllCampaigns;