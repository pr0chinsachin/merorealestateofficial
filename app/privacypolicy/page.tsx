"use client";
import { Card } from "flowbite-react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto my-9 justify-center">
      <div className="max-auto rounded overflow-hidden">
        <div className="flex justify-between mr-4 ml-4 mb-4 mt-4">
          <Card className="max-auto container">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <hr />
            <div className="px-4">
                <p>
                Mero Real Estate Partnership and its related bodies corporate (we, our, us) recognize the importance of protecting the privacy and the rights of individuals in relation to their personal information. This document is our privacy policy and it tells you how we collect and manage your personal information.
                </p>
              <h2 className="text-xl font-bold mt-6">What is your personal information?</h2>
              <p>
                Personal information refers to information that can identify you, such as your name, address, email, telephone number, etc. Under the Privacy Act 1998 (Cth), it includes any data that makes you reasonably identifiable.
              </p>

              <h2 className="text-xl font-bold mt-6">What personal information do we collect and hold?</h2>
              <p>
                We may collect details like your name, mailing address, email, phone number, age, birth date, profession, and other relevant information. Information provided through our websites or to our representatives may also be collected.
              </p>

              <h2 className="text-xl font-bold mt-6">How do we collect your personal information?</h2>
              <p>
                We collect your information directly from you through various methods such as website access, phone calls, emails, and through our representatives. Information can also come from third parties such as credit reporting agencies or public sources.
              </p>

              <h2 className="text-xl font-bold mt-6">Cookies</h2>
              <p>
                Cookies are used to track activity on our website. They do not collect personal information but help improve user experience. You can choose to reject cookies through your browser settings.
              </p>

              <h2 className="text-xl font-bold mt-6">What happens if we can’t collect your personal information?</h2>
              <p>
                If you do not provide your personal information, we may not be able to deliver certain services or personalize your experience with our website.
              </p>

              <h2 className="text-xl font-bold mt-6">For what purposes do we collect, hold, use, and disclose your personal information?</h2>
              <p>
                We collect personal information to provide services, answer inquiries, process transactions, update records, and comply with legal requirements.
              </p>

              <h2 className="text-xl font-bold mt-6">To whom may we disclose your information?</h2>
              <p>
                We may disclose your personal information to employees, contractors, service providers, or other third parties for business and service delivery purposes.
              </p>

              <h2 className="text-xl font-bold mt-6">Direct marketing materials</h2>
              <p>
                We may send you marketing communications based on your preferences. You can opt-out at any time by contacting us or using the opt-out options provided.
              </p>

              <h2 className="text-xl font-bold mt-6">How can you access and correct your personal information?</h2>
              <p>
                You can request access to or correction of your personal information by contacting us. We will provide suitable access options and may charge reasonable fees for requests.
              </p>

              <h2 className="text-xl font-bold mt-6">What is the process for complaining about a breach of privacy?</h2>
              <p>
                If you believe your privacy has been breached, you can contact us, and we will investigate the matter based on our complaint handling procedures.
              </p>

              <h2 className="text-xl font-bold mt-6">Do we disclose your personal information to anyone outside Australia?</h2>
              <p>
                We may share your personal information with overseas entities as part of our services. You consent to this when using our services.
              </p>

              <h2 className="text-xl font-bold mt-6">Security</h2>
              <p>
                While we take steps to protect your data, the internet is inherently insecure, and we cannot guarantee full security during transmission.
              </p>

              <h2 className="text-xl font-bold mt-6">Links</h2>
              <p>
                Our website may contain links to third-party sites. We are not responsible for their privacy practices.
              </p>

              <h2 className="text-xl font-bold mt-6">Contacting us</h2>
              <p>
                For any questions or complaints regarding our privacy policy, please reach out using the contact details on our website.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
