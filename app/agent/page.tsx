"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BASE_URL from "../urlConfig/urlConfig";
import SERVER_URL from "../urlConfig/serverUrl";
import Link from "next/link";
import { Card, Button, Spinner } from "flowbite-react";
import logo from "../../public/logo.png";
import "./agent.css";

interface AgentDetails {
  id: string;
  agentCode: string;
  agentName: string;
  designation: string;
  address: string;
  experience: string;
  skill: string;
  email: string;
  contact: string;
  description: string;
  fbLink: string;
  websiteLink: string;
  linkedInLink: string;
  status: boolean;
  deleted: boolean;
  agentImgPath: string | null;
}

const Agent = () => {
  const [agentDetails, setAgentDetails] = useState<AgentDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Agent/AgentsList`);
      if (response.ok) {
        const data: AgentDetails[] = await response.json();
        const processedData = data.map((agent) => ({
          ...agent,
          agentImgPath: agent.agentImgPath
            ? agent.agentImgPath.replace(/~/g, "")
            : null,
        }));
        setAgentDetails(processedData);
        setIsLoading(false);
        setError(null);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error: Unable to fetch Agent data from server");
    }
  };

  return (
    <div className=" py-16" style={{ backgroundColor: "#14222d" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center  mb-12 text-white">
          Meet Our Team
        </h2>

        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : isLoading ? (
          <div className="relative w-full h-64 flex justify-center items-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex justify-around lg:mx-20">
            {agentDetails.map((agent) => (
              <div
                key={agent.id}
                className="relative bg-white shadow-md rounded-lg overflow-hidden border hover:scale-105 transition duration-500 group lg:w-1/3"
              >
                <div className="rounded-lg shadow-none border-none  ">
                  <div className="relative w-full   rounded-t-lg overflow-hidden py-5">
                    <Image
                      src={
                        agent.agentImgPath
                          ? `${SERVER_URL}${agent.agentImgPath}`
                          : logo
                      }
                      className="rounded-full w-3/4 mx-auto h-auto group-hover:scale-110 duration-700 "
                      alt={agent.agentName}
                      width={500}
                      height={300}
                      priority
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate text-center">
                      {agent.agentName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      {agent.designation}
                    </p>
                    <Link href={`agent/agentViewDetails/${agent.id}`}>
                      <Button
                        id="agentButton"
                        className="w-full  text-white duration-300"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agent;
