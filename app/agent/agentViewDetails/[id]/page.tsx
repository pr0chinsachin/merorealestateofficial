"use client";
import { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import Image from "next/image";
import BASE_URL from "../../../urlConfig/urlConfig";
import SERVER_URL from "../../../urlConfig/serverUrl";
import noavatar from "../../../../public/logo.svg";

interface AgentData {
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

interface UpdateAgentProps {
  params: {
    id: string;
  };
}

const AgentViewDetails: React.FC<UpdateAgentProps> = ({ params }) => {
  const { id } = params;
  const [agentData, setAgentData] = useState<AgentData>({
    id: "",
    agentCode: "",
    agentName: "",
    designation: "",
    address: "",
    experience: "",
    skill: "",
    email: "",
    contact: "",
    description: "",
    fbLink: "",
    websiteLink: "",
    linkedInLink: "",
    status: false,
    deleted: false,
    agentImgPath: null,
  });
  const [imgError, setImgError] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Agent/UpdateAgents?id=${id}`);
       
        if (response.ok) {
          const data: AgentData = await response.json();
          console.log(data)
          setAgentData({
            ...data,
            agentImgPath: data.agentImgPath
              ? data.agentImgPath.replace(/~/g, "")
              : null,
          });
          setFetchError(false);
        } else {
          console.error("Failed to fetch data");
          setFetchError(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setFetchError(true);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto my-9 justify-center">
      <div className="max-auto rounded overflow-hidden ">
        <div className="flex justify-between mr-4 ml-4 mb-4 mt-4">
          <Card className="max-auto container ">
            <h1 className="text-2xl font-bold">Agent Details</h1>
            <hr />
            {fetchError ? (
              <p className="text-red-500">
                Failed to load agent details. Please try again later.
              </p>
            ) : (
              <>
                {/* <h1 className="text-2xl text-cyan-600">
                  <b>Profile image</b>
                </h1> */}
                <div className="h-72 w-full bg-slate-700 flex justify-center items-center overflow-hidden">
                  <span className="font-extrabold text-white text-4xl md:text-9xl  ">
                    {agentData.agentName}
                  </span>
                </div>
                <div className="items-center mx-auto overflow-hidden rounded-full h-40 md:h-48 w-40 md:w-48 z-20 bg-slate-900 -mt-24 border-8 border-white">
                  <Image
                    src={
                      imgError || !agentData.agentImgPath
                        ? noavatar
                        : `${SERVER_URL}${agentData.agentImgPath}`
                    }
                    alt="Profile image"
                    width={192} // Update the width and height to match your container
                    height={192}
                    onError={() => setImgError(true)}
                    className="object-cover rounded-full h-full w-full" // Use h-full and w-full for complete fit
                  />
                </div>

                <div className="px-96 hidden">
                  <div className="px-4 sm:px-0 grid place-items-center">
                    <h3 className="text-base font-semibold leading-7 text-cyan-600">
                      Agent Information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-cyan-600">
                      Personal details and application.
                    </p>
                  </div>
                  <div className="mt-6 border-t border-gray-100  text-center">
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Full name
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.agentName}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.address}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Email address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.email}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.contact}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                        Designation
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.designation}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Experience
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.experience}
                        </dd>
                      </div>
                      {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Skills
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.skill}
                        </dd>
                      </div> */}
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Website Link
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-cyan-700 sm:col-span-2 sm:mt-0">
                          <a
                            href={agentData.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {agentData.websiteLink}
                          </a>
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Facebook Link
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-cyan-700 sm:col-span-2 sm:mt-0">
                          <a
                            href={agentData.fbLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {agentData.fbLink}
                          </a>
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          LinkedIn
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-cyan-700 sm:col-span-2 sm:mt-0">
                          <a
                            href={agentData.linkedInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {agentData.linkedInLink}
                          </a>
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          About Yourself
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.description}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="md:flex w-full md:px-10 gap-10 mt-10 overflow-hidden">
                  <Card className="md:w-1/2 h-max">
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Full name
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.agentName}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.address}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Email address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.email}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.contact}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                        Designation
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.designation}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Experience
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.experience}
                        </dd>
                      </div>
                      {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Skills
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {agentData.skill}
                        </dd>
                      </div> */}
                    </dl>
                  </Card>

                  {/* second card */}
                  <Card className="md:w-1/2 mt-10 md:mt-0 h-max">
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Website Link
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-cyan-700 sm:col-span-2 sm:mt-0">
                          <a
                            href={agentData.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {agentData.websiteLink}
                          </a>
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Facebook Link
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-cyan-700 sm:col-span-2 sm:mt-0">
                          <a
                            href={agentData.fbLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {agentData.fbLink}
                          </a>
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          LinkedIn
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-cyan-700 sm:col-span-2 sm:mt-0">
                          <a
                            href={agentData.linkedInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {agentData.linkedInLink}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </Card>
                </div>
                <Card className="mt-10 md:mx-10 h-max">
                  <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        About Yourself
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {agentData.description}
                      </dd>
                    </div>
                  </dl>
                </Card>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentViewDetails;
