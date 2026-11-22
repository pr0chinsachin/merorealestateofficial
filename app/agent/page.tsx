"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BASE_URL from "../urlConfig/urlConfig";
import SERVER_URL from "../urlConfig/serverUrl";
import Link from "next/link";
import { Spinner } from "flowbite-react";
import logo from "../../public/logo.png";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import styles from "./team.module.css";

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
    <div className={styles.team}>
      <h2>Meet Our Team</h2>
      <p className={styles.subtitle}>Our real estate professionals</p>
      {error ? (
        <p role="status">{error}</p>
      ) : isLoading ? (
        <Spinner size="lg" aria-label="Loading agents" />
      ) : (
        <div className={styles.grid}>
          {agentDetails.map((agent) => (
            <article key={agent.id} className={styles.agent}>
              <Image
                src={agent.agentImgPath ? `${SERVER_URL}${agent.agentImgPath}` : logo}
                className={styles.portrait}
                alt=""
                width={180}
                height={180}
                unoptimized={Boolean(agent.agentImgPath)}
              />
              <h3>{agent.agentName}</h3>
              <p>{agent.designation}</p>
              <Link href={`/agent/agentViewDetails/${agent.id}`} className={styles.details}>
                View details <ArrowRightIcon aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agent;
