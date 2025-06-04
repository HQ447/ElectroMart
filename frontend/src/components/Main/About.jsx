import React from "react";
import developerImg from "../../assets/creator.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            About Our Platform
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover the ultimate destination for cutting-edge electronics, from
            smartphones to laptops and smartwatches, all curated for you.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-8">
            Our Mission
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <img
                src="https://www.magixtechnology.com/cdn/shop/collections/Mobile_Accessories.png?v=1691958878"
                alt="Electronics"
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-gray-600 text-lg leading-relaxed">
                Our platform is dedicated to providing a seamless shopping
                experience for electronics enthusiasts. We offer a wide range of
                high-quality smartphones, laptops, smartwatches, and gadgets,
                ensuring you find the perfect device to suit your needs. With a
                focus on innovation, quality, and customer satisfaction, we aim
                to be your trusted source for the latest technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Meet the Creator
          </h2>
          <div className="max-w-lg mx-auto">
            <img
              src={developerImg}
              alt="Hammad Ahmad"
              className="rounded-full w-32 h-32 mx-auto mb-4 object-cover"
            />
            <h3 className="text-2xl font-bold text-gray-800">Hammad Ahmad</h3>
            <p className="text-gray-600 text-lg">MERN Stack Developer</p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              As a passionate MERN Stack Developer, I built this platform to
              bring the best electronics to your fingertips. With expertise in
              the MERN stack, I’ve crafted a user-friendly, responsive, and
              secure shopping experience that caters to tech lovers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Quality
              </h3>
              <p className="text-gray-600">
                We source only the best electronics from trusted brands to
                ensure top-notch performance and durability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                Stay ahead with the latest gadgets and cutting-edge technology
                curated for the modern user.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Customer First
              </h3>
              <p className="text-gray-600">
                Your satisfaction is our priority, with seamless navigation,
                secure payments, and dedicated support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
