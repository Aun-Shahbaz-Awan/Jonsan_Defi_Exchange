import React, { useState } from "react";
import axios from "axios";
// React_Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// React_Toastify
import ContactFormPopup from "../../components/utils/modals/ContactFormPopup";

function Index() {
  const [isOpen, setIsOpen] = useState(false);
  const [modelOption, setModelOption] = useState({
    title: "",
    message: "",
  });
  const [messageInfo, setMessageInfo] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  function closeModal() {
    setIsOpen(false);
  }
  // To get User Id hit this UrL https://api.telegram.org/bot{Your_Telegram_Bot_Id_Here}/getupdates
  const sendMessage = () => {
    if (
      messageInfo?.name === "" ||
      messageInfo?.email === "" ||
      messageInfo?.subject === "" ||
      messageInfo?.message === ""
    ) {
      toast.error("Please fill all the fields!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(messageInfo?.email)) {
      toast.error("Please enter the a valid email address!");
      return;
    }
    // Message
    let message =
      "Name: " +
      messageInfo?.name +
      "\nEmail: " +
      messageInfo?.email +
      "\nSubject: " +
      messageInfo?.subject +
      "\nMessage: " +
      messageInfo?.message;
    // Reset From Data
    setMessageInfo({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    // API Options
    var options = {
      async: true,
      crossDomain: true,
      url:
        "https://api.telegram.org/bot" +
        process.env.Telegram_CF_Bot_Id +
        "/sendMessage",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache",
      },
      data: JSON.stringify({
        chat_id: process.env.Chat_Id,
        text: message,
      }),
    };
    // API Call
    axios(options)
      .then((responce) => {
        console.log("Msg Responce:", responce);
        setModelOption({
          title: "Successfully Submitted!",
          message:
            "You have successfully submitted your request, We will reach you soon.",
        });
        setIsOpen(true);
      })
      .catch((err) => {
        console.log("Error:", err);
        setModelOption({
          title: err?.message ? err?.message : "Bad Request!",
          message: "Their is something wrong. Please retry later!",
        });
        setIsOpen(true);
      });
  };

  return (
    <div>
      <ToastContainer />
      <ContactFormPopup
        isOpen={isOpen}
        closeModal={closeModal}
        title={modelOption.title}
        message={modelOption.message}
      />
      <div className="w-full p-8 md:px-12 lg:w-9/12 lg:pl-20 lg:pr-20 mx-auto my-20 rounded-2xl shadow-2xl">
        <div className="">
          <h1 className="font-semibold uppercase text-3xl">Contact Us</h1>
          <p>Send us feedback, questions, or suggestions or below.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
          <input
            onChange={(e) =>
              setMessageInfo((messageInfo) => ({
                ...messageInfo,
                name: e.target.value,
              }))
            }
            value={messageInfo.name}
            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Name*"
          />
          <input
            onChange={(e) =>
              setMessageInfo((messageInfo) => ({
                ...messageInfo,
                email: e.target.value,
              }))
            }
            value={messageInfo.email}
            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Email*"
          />
          <input
            onChange={(e) =>
              setMessageInfo((messageInfo) => ({
                ...messageInfo,
                subject: e.target.value,
              }))
            }
            value={messageInfo.subject}
            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Subject*"
          />
        </div>
        <div className="my-4">
          <textarea
            onChange={(e) =>
              setMessageInfo((messageInfo) => ({
                ...messageInfo,
                message: e.target.value,
              }))
            }
            value={messageInfo.message}
            placeholder="Message*"
            className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="my-2 w-1/2 lg:w-1/4">
          <button
            onClick={() => sendMessage()}
            className="uppercase text-sm font-bold tracking-wide bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl shadow-md  p-3 w-full 
                      focus:outline-none focus:shadow-outline"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default Index;
