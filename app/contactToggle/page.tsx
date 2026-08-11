"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import ContactAgentForm from "../contactAgentForm/AgentForm";
import contact from "../../public/contactagent.svg";
import Image from "next/image";

function ContactToggle() {
  const [openModal, setOpenModal] = useState(false);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormSubmitSuccess = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button
        id="noBorder"
        style={{ backgroundColor: "#F27423" }}
        className="fixed right-5 bottom-5 md:right-10 md:bottom-10 rounded-full shadow-lg"
        onClick={() => setOpenModal(true)}
      >
        <Image
          src={contact}
          alt="Contact Agent"
          width={200}
          height={200}
          className="object-cover rounded-full h-12 w-8" // 3rem = 12, 2rem = 8
        />
      </Button>
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
          <ContactAgentForm onSubmitSuccess={handleFormSubmitSuccess} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ContactToggle;
