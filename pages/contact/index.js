import React from "react";

function Index() {
  return (
    <div className="w-full p-8 md:px-12 lg:w-9/12 lg:pl-20 lg:pr-20 mx-auto my-20 rounded-2xl shadow-2xl">
      <div className="">
        <h1 className="font-semibold uppercase text-3xl">
          Contact Us
        </h1>
        <p>Send us feedback, questions, or suggestions or below.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
        <input
          className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Name"
        />
        <input
          className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
          type="email"
          placeholder="Email*"
        />
        <input
          className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
          type="number"
          placeholder="Subject*"
        />
      </div>
      <div className="my-4">
        <textarea
          placeholder="Message* "
          className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <div className="my-2 w-1/2 lg:w-1/4">
        <button
          className="uppercase text-sm font-bold tracking-wide bg-gradient-to-r from-grad-one via-grad-two to-grad-three rounded-xl shadow-md  p-3 w-full 
                      focus:outline-none focus:shadow-outline"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default Index;
