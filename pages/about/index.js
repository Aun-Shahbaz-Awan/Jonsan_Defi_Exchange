import React from "react";
import { BsArrowRight } from "react-icons/bs";

function Index() {
  return (
    <div className="text-primary my-12 max-w-4xl mx-auto px-4">
      <h4 className="text-5xl text-center my-8">About us</h4>
      <p className="text-secondary-dark text-center my-12">
        Our mission is to provide the best and most trusted entry point to
        deploy your capital. We are building this platform to let our users
        benefit from all of the potential in DeFi. Our team is made of
        passionate thinkers and builders.
      </p>

      <h5 className="text-2xl font-semibold mb-8 flex items-center hover:gap-1">
        Meet the team
        <span className="ml-2">
          <BsArrowRight />
        </span>
      </h5>
      <div class="grid gap-12 items-center md:grid-cols-3">
        <div class="space-y-4 text-center">
          <img
            class="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
            src="https://tailus.io/sources/blocks/classic/preview/images/woman1.jpg"
            alt="woman"
            loading="lazy"
            width="640"
            height="805"
          />
          <div>
            <h4 class="text-2xl">Hentoni Doe</h4>
            <span class="block text-sm text-gray-500">CEO-Founder</span>
          </div>
        </div>
        <div class="space-y-4 text-center">
          <img
            class="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
            src="https://tailus.io/sources/blocks/classic/preview/images/man.jpg"
            alt="man"
            loading="lazy"
            width="1000"
            height="667"
          />
          <div>
            <h4 class="text-2xl">Jonathan Doe</h4>
            <span class="block text-sm text-gray-500">
              Chief Technical Officer
            </span>
          </div>
        </div>
        <div class="space-y-4 text-center">
          <img
            class="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
            src="/images/team/aun.jpeg"
            alt="aun_shahbaz"
            loading="lazy"
            width="1000"
            height="667"
          />
          <div>
            <h4 class="text-2xl">Aun Shahbaz</h4>
            <span class="block text-sm text-gray-500">
              Blockchain Developer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
