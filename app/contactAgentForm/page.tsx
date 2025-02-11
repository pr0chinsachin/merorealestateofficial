"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Textarea,
  Label,
  TextInput,
  Select,
  Modal,
} from "flowbite-react";
import BASE_URL from "../urlConfig/urlConfig";

interface CustomerLead {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  phonenumber: string;
  email: string;
  property: string;
  category: string;
  agent: string;
  queryMessgae: string; // Match the Swagger sample's field name
  status: boolean;
  deleted: boolean;
}

interface AgentDetails {
  id: string;
  agentCode: string;
  agentName: string;
}

interface ServiceData {
  id: number;
  categoryCode: string;
  categoryTitle: string;
}

const ContactAgentForm: React.FC = () => {
  const [agentDetails, setAgentDetails] = useState<AgentDetails[]>([]);
  const [serviceLists, setServiceLists] = useState<ServiceData[]>([]);
  const [formData, setFormData] = useState<CustomerLead>({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phonenumber: "",
    address: "",
    email: "",
    property: "",
    category: "",
    agent: "",
    queryMessgae: "", // Match the Swagger sample's field name
    status: true, // Default status value
    deleted: false, // Default deleted value
  });

  // for modal
  const [openModal, setOpenModal] = useState(false);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const handleResponeClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetchAgentData();
    fetchServiceData();
  }, []);

  const fetchAgentData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Agent/AgentsList`);
      if (response.ok) {
        const data: AgentDetails[] = await response.json();
        setAgentDetails(data);
      } else {
        console.error("Failed to fetch agent data");
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  const fetchServiceData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/MenuCategory/CategoryList`);
      if (response.ok) {
        const data: ServiceData[] = await response.json();
        setServiceLists(data);
      } else {
        console.error("Failed to fetch service data");
      }
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debug log
    try {
      const response = await fetch(`${BASE_URL}/Lead/CreateLead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setOpenModal(true); // Show modal on success
      } else {
        console.error("Failed to create customer lead");
      }
    } catch (error) {
      console.error("Error creating customer lead:", error);
    }
  };

  return (
    <div className="m-5 ">
      <h1 className={`text-2xl font-bold mb-5 `}>Contact Agent</h1>
      <hr />
      <form className="flex flex-col gap-6 mt-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          <div>
            <Label htmlFor="firstName" value="First Name" />
            <TextInput
              id="firstName"
              type="text"
              sizing="md"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="lastName" value="Last Name" />
            <TextInput
              id="lastName"
              type="text"
              sizing="md"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="phonenumber" value="Phone Number" />
            <TextInput
              id="phonenumber"
              type="text"
              sizing="md"
              value={formData.phonenumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="address" value="Address" />
            <TextInput
              id="address"
              type="text"
              sizing="md"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="email" value="Your Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="name@domain.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="property" value="Property" />
            <Select
              id="property"
              required
              value={formData.property}
              onChange={handleInputChange}
            >
              <option value="">Select Property</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="category" value="Category" />
            <Select
              id="category"
              required
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {serviceLists.map((service) => (
                <option key={service.id} value={service.categoryTitle}>
                  {service.categoryTitle}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="agent" value="Select Agent" />
            <Select
              id="agent"
              required
              value={formData.agent}
              onChange={handleInputChange}
            >
              <option value="">Select Agent</option>
              {agentDetails.map((agent) => (
                <option key={agent.id} value={agent.agentName}>
                  {agent.agentName}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <Label htmlFor="queryMessgae" value="Your Message" />{" "}
          {/* Match the Swagger sample's field name */}
          <Textarea
            id="queryMessgae" // Match the Swagger sample's field name
            placeholder="Leave a comment..."
            required
            rows={4}
            value={formData.queryMessgae} // Match the Swagger sample's field name
            onChange={handleInputChange}
          />
        </div>

        <Button
          style={{ backgroundColor: "#F27423" }}
          type="submit"
          className="mt-6 self-center w-full"
        >
          Submit
        </Button>
      </form>
      {/* popup modal */}
      <>
        <Modal
          dismissible
          show={openModal}
          size="7xl"
          onClose={onCloseModal}
          popup
          style={{ zIndex: 100000 }}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="relative">
              <h1 className="text-3xl font-bold mb-5">
                Thank you for your submission!
              </h1>
              <hr />
              <div className="text-lg">
                Thank you for contacting us! Your message has been received, and
                we will get back to you as soon as possible. In the meantime,
                feel free to browse our listings or check out our resources for
                more information.
              </div>
              <Button
                className="mt-10 float-end"
                color="failure"
                onClick={handleResponeClose}
              >
                Close
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
      {/* popup modal */}
    </div>
  );
};

export default ContactAgentForm;
