"use client";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import ContactAgentForm from "../contactAgentForm/page";
import contact from "../../public/contactagent.svg";
import Image from "next/image";

function ContactToggle() {
  const [openModal, setOpenModal] = useState(false);
  const [response, setResponse] = useState(false);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  const handleResponse = (newState: boolean) => {
    setResponse(newState);
  };

  const handleResponeClose = () => {
    setResponse(false);
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
          {response ? (
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
          ) : (
            <ContactAgentForm/>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ContactToggle;
