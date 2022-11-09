import React from "react";
import { BsArrowRight } from "react-icons/bs";

function Index() {
  return (
    <div className="text-primary my-12 max-w-4xl mx-auto px-4">
      <h4 className="text-5xl pt-12">Terms of Service</h4>
      <p className="italic mt-2">Last Revised: July 11th 2022</p>
      <p className="text-gray-700 my-4">
        Please read these Terms of Service (this “Agreement”) carefully. Your
        use or access of the Site or the Services (as defined below) constitutes
        your consent to this Agreement. If you do not agree to this Agreement,
        and all of the terms herein, you must immediately discontinue using the
        Site and the Services. Your continued use of the Site and Services is
        your ongoing acceptance of this Agreement.
      </p>
      <p className="text-gray-700 my-4">
        This Agreement is between you (the “User” or “You”, and collectively
        with others using the Site, “Users”) and Oazo Apps Limited, a company
        incorporated and registered in England, United Kingdom (“Company” or
        “we,” “our” or “us” and together with you, the “Parties”) concerning
        your use of (including any access to) Company’s websites, currently
        located at oasis.app, mobile applications, web applications,
        decentralized applications, smart contracts and API located at any of
        Company’s websites (together with any materials and services available
        therein, and successor website(s) or application(s) thereto, the
        “Site”). This Agreement hereby incorporates by this reference any
        additional terms and conditions with respect to the Site posted by
        Company to the Site, or otherwise made available to you by Company.
      </p>

      {/* <h5 className="text-2xl font-semibold mb-8 flex items-center hover:gap-1">
        Meet the team
        <span className="ml-2">
          <BsArrowRight />
        </span>
      </h5> */}

    </div>
  );
}

export default Index;
