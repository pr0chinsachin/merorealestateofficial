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

const DarkFormSale: React.FC = () => {
  const [agentDetails, setAgentDetails] = useState<AgentDetails[]>([]);
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const handleResponeClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetchAgentData();
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(false);

    const submissionPayload: CustomerLead = {
      ...formData,
      queryMessgae: `${formData.queryMessgae}\n\n-Sales form`,
    };

    try {
      const response = await fetch(`${BASE_URL}/Lead/CreateLead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionPayload),
      });
      if (response.ok) {
        setOpenModal(true); // Show modal on success
      } else {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Request an appraisal</h2>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          <div>
            <Label
              htmlFor="firstName"
              value="First Name"
              className="mb-1 block text-[#083a47]"
            />
            <TextInput
              id="firstName"
              type="text"
              sizing="md"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="lastName"
              value="Last Name"
              className="mb-1 block text-[#083a47]"
            />
            <TextInput
              id="lastName"
              type="text"
              sizing="md"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="phonenumber"
              value="Phone Number"
              className="mb-1 block text-[#083a47]"
            />
            <TextInput
              id="phonenumber"
              type="tel"
              sizing="md"
              value={formData.phonenumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label
              htmlFor="address"
              value="Property Address"
              className="mb-1 block text-[#083a47]"
            />
            <TextInput
              id="address"
              type="text"
              sizing="md"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="email" value="Your Email" className="mb-1 block text-[#083a47]" />
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
            <Label htmlFor="property" value="Property" className="mb-1 block text-[#083a47]" />
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
              <option value="house">Unit</option>
              <option value="apartment">Duplex</option>
              <option value="land">Villa</option>
              <option value="land">Mansion</option>
              <option value="land">Penthouse</option>
              <option value="land">Others</option>
            </Select>
          </div>

          <div className="flex flex-col">
            <Label
              htmlFor="agent"
              value="Select Agent"
              className="mb-1 block text-[#083a47]"
            />
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

        <div className="flex flex-col">
          <Label
            htmlFor="queryMessgae"
            value="Your Message"
            className="mb-1 block text-[#083a47]"
          />{" "}
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

        {submitError && <p role="alert" className="text-sm text-red-700">Couldn’t send your request. Please try again.</p>}
        <Button type="submit" disabled={submitting} className="brand-button w-full">
          {submitting ? "Sending…" : "Send appraisal request"}
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
              <h2 className="text-2xl font-bold mb-5">
                Thank you for your submission!
              </h2>
              <hr />
              <div className="text-lg">
                Thank you for contacting us! Your message has been received, and
                we will get back to you as soon as possible. In the meantime,
                feel free to browse our listings or check out our resources for
                more information.
              </div>
              <Button
                className="brand-button mt-10 float-end"
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

export default DarkFormSale;
