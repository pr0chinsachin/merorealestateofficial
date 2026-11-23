"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

interface ProductAddressData {
  address?: string;
}

const PRODUCT_ID_REGEX =
  /hotlistProductView\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;

const extractProductId = (path: string | null | undefined): string | null => {
  if (!path) return null;
  const match = path.match(PRODUCT_ID_REGEX);
  return match ? match[1] : null;
};

const ContactAgentFormDark: React.FC<{ listingAddress?: string }> = ({ listingAddress }) => {
  const pathname = usePathname();

  const [agentDetails, setAgentDetails] = useState<AgentDetails[]>([]);
  const [serviceLists, setServiceLists] = useState<ServiceData[]>([]);

  const [productAddress, setProductAddress] = useState<string | null>(null);

  const initialFormData: CustomerLead = {
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
    queryMessgae: "",
    status: true,
    deleted: false,
  };

  const [formData, setFormData] = useState<CustomerLead>(initialFormData);

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
    fetchServiceData();
  }, []);

  useEffect(() => {
    if (listingAddress !== undefined) return;
    const currentPath =
      pathname ||
      (typeof window !== "undefined" ? window.location.pathname : "");
    const productId = extractProductId(currentPath);

    if (!productId) {
      setProductAddress(null);
      return;
    }

    const fetchProductAddress = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/Product/UpdateProduct?id=${productId}`,
        );
        if (response.ok) {
          const data: ProductAddressData = await response.json();
          if (data?.address) {
            setProductAddress(data.address);
          } else {
            setProductAddress(null);
          }
        } else {
          console.error("Failed to fetch product address");
          setProductAddress(null);
        }
      } catch (error) {
        console.error("Error fetching product address:", error);
        setProductAddress(null);
      }
    };

    fetchProductAddress();
  }, [pathname, listingAddress]);

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

    const enquiryAddress = listingAddress ?? productAddress;
    const finalAddress = enquiryAddress
      ? [formData.address.trim(), `[${enquiryAddress}]`].filter(Boolean).join(" - ")
      : formData.address;

    const payload: CustomerLead = {
      ...formData,
      address: finalAddress,
    };

    try {
      const response = await fetch(`${BASE_URL}/Lead/CreateLead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setFormData(initialFormData); // Clear the form
        setOpenModal(true);
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
    <div className={listingAddress === undefined ? "mx-4 my-6 sm:m-10" : undefined}>
      {listingAddress === undefined && <><h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-white">
        Contact Agent
      </h1>
      <hr /></>}
      <form
        className={listingAddress === undefined ? "flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-10" : "flex flex-col gap-3 mt-4"}
        onSubmit={handleSubmit}
      >
        <div className={`grid grid-cols-2 gap-3 ${listingAddress === undefined ? "sm:gap-4" : "min-w-0"}`}>
          <div>
            <Label
              htmlFor="firstName"
              value="First Name"
              className="text-white text-sm mb-1 block"
            />
            <TextInput
              id="firstName"
              type="text"
              sizing="md"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label
              htmlFor="lastName"
              value="Last Name"
              className="text-white text-sm mb-1 block"
            />
            <TextInput
              id="lastName"
              type="text"
              sizing="md"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label
              htmlFor="phonenumber"
              value="Phone Number"
              className="text-white text-sm mb-1 block"
            />
            <TextInput
              id="phonenumber"
              type="text"
              sizing="md"
              value={formData.phonenumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label
              htmlFor="property"
              value="Property"
              className="text-white text-sm mb-1 block"
            />
            <Select
              id="property"
              sizing="md"
              value={formData.property}
              onChange={handleInputChange}
            >
              <option value="">Select Property</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
            </Select>
          </div>

          <div className="col-span-2">
            <Label
              htmlFor="address"
              value="Address"
              className="text-white text-sm mb-1 block"
            />
            <TextInput
              id="address"
              type="text"
              sizing="md"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-span-2">
            <Label
              htmlFor="email"
              value="Your Email"
              className="text-white text-sm mb-1 block"
            />
            <TextInput
              id="email"
              type="email"
              placeholder="name@domain.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label
              htmlFor="category"
              value="Category"
              className="text-white text-sm mb-1 block"
            />
            <Select
              id="category"
              sizing="md"
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

          <div>
            <Label
              htmlFor="agent"
              value="Select Agent"
              className="text-white text-sm mb-1 block"
            />
            <Select
              id="agent"
              sizing="md"
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

        <div className="flex flex-col ">
          <Label htmlFor="queryMessgae" value="Your Message" />
          <Textarea
            id="queryMessgae"
            placeholder="Leave a comment..."
            rows={3}
            value={formData.queryMessgae}
            onChange={handleInputChange}
          />
        </div>

        {submitError && <p role="alert" className="text-sm text-red-600">Couldn’t send your enquiry. Please try again.</p>}
        <Button
          style={{ backgroundColor: listingAddress === undefined ? "#F27423" : "#a74710" }}
          type="submit"
          disabled={submitting}
          className={listingAddress === undefined ? "mt-4 sm:mt-6 self-center w-full" : "w-full"}
        >
          {submitting ? "Sending…" : listingAddress === undefined ? "Submit" : "Send enquiry"}
        </Button>
      </form>
      {/* popup modal */}
      <Modal
        dismissible
        show={openModal}
        size="lg"
        onClose={onCloseModal}
        popup
        style={{ zIndex: 100000 }}
      >
        <Modal.Header />
        <Modal.Body className="px-4 sm:px-6">
          <div className="relative">
            <h1 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-5">
              Thank you for your submission!
            </h1>
            <hr />
            <div className="text-base sm:text-lg mt-3">
              Thank you for contacting us! Your message has been received, and
              we will get back to you as soon as possible. In the meantime, feel
              free to browse our listings or check out our resources for more
              information.
            </div>
            <Button
              className="mt-6 sm:mt-10 float-end"
              color="failure"
              onClick={handleResponeClose}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* popup modal */}
    </div>
  );
};

export default ContactAgentFormDark;
