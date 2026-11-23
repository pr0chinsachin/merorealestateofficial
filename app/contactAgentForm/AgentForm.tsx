"use client";

import React, { useEffect, useRef, useState } from "react";
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
  queryMessgae: string;
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

interface ContactAgentFormProps {
  onSubmitSuccess?: () => void;
  autoCloseDelayMs?: number;
}

//regex to extract product id from the url
const PRODUCT_ID_REGEX =
  /hotlistProductView\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;

const extractProductId = (path: string | null | undefined): string | null => {
  if (!path) return null;
  const match = path.match(PRODUCT_ID_REGEX);
  return match ? match[1] : null;
};

const ContactAgentForm: React.FC<ContactAgentFormProps> = ({
  onSubmitSuccess,
  autoCloseDelayMs = 3000,
}) => {
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

  const [openModal, setOpenModal] = useState(false);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeSuccessModal = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
    setOpenModal(false);
    onSubmitSuccess?.();
  };

  const onCloseModal = () => {
    closeSuccessModal();
  };

  const handleResponeClose = () => {
    closeSuccessModal();
  };

  useEffect(() => {
    fetchAgentData();
    fetchServiceData();
  }, []);

  useEffect(() => {
    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, []);

  useEffect(() => {
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
  }, [pathname]);

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

    const finalAddress = productAddress
      ? `${formData.address} - [${productAddress}]`
      : formData.address;

    const payload: CustomerLead = {
      ...formData,
      address: finalAddress,
    };

    console.log("Form Data:", payload); // Debug log
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
        if (autoCloseTimer.current) {
          clearTimeout(autoCloseTimer.current);
        }
        autoCloseTimer.current = setTimeout(() => {
          closeSuccessModal();
        }, autoCloseDelayMs);
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
          <Label htmlFor="queryMessgae" value="Your Message" />
          <Textarea
            id="queryMessgae"
            placeholder="Leave a comment..."
            rows={4}
            value={formData.queryMessgae}
            onChange={handleInputChange}
          />
        </div>

        <Button
          type="submit"
          className="brand-button mt-6 self-center w-full"
        >
          Submit
        </Button>
      </form>

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
              we will get back to you as soon as possible. In the meantime, feel
              free to browse our listings or check out our resources for more
              information.
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
    </div>
  );
};

export default ContactAgentForm;
