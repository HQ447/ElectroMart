import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Star,
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [data, setData] = useState([]);
  // const domain = "http://localhost:8080";
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();
  const heroSlides = [
    {
      title: "Smartphones That Impress",
      subtitle: "Top Brands • Great Prices",
      description:
        "Explore cutting-edge smartphones with stunning displays, powerful performance, and unbeatable deals.",
      image:
        "https://c4.wallpaperflare.com/wallpaper/953/97/219/samsung-galaxy-f-foldable-smartphone-hd-wallpaper-preview.jpg",
      gradient: "from-gray-900/80 to-blue-900/60",
    },
    {
      title: "Style Meets Tech",
      subtitle: "Premium Smartwatches",
      description:
        "Upgrade your wrist with smartwatches that combine elegance and functionality – perfect for every lifestyle.",
      image:
        " https://c4.wallpaperflare.com/wallpaper/778/389/237/watch-omega-seamaster-1957-chronometer-wallpaper-preview.jpg",
      gradient: "from-green-900/80 to-emerald-800/60",
    },
    {
      title: "Laptops for Every Need",
      subtitle: "For Everything",
      description:
        "From powerful gaming rigs to ultra-portables – discover laptops that match your pace.",

      image: " https://images6.alphacoders.com/991/991781.jpg",
      gradient: "from-indigo-900/80 to-slate-900/60",
    },
    {
      title: "Smart Gadgets & Accessories",
      subtitle: "Tech That Simplifies Life",
      description:
        "Get the latest in tech accessories – from wireless earbuds to smart home devices, all in one place.",
      image:
        "https://cdn.pixabay.com/photo/2019/09/25/14/09/gadgets-4503773_1280.jpg",
      gradient: "from-rose-900/80 to-yellow-900/60",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Poedagar 985 Green Dial Men Watch",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://poedagar.store/wp-content/uploads/2022/03/02-4.jpg",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Galaxy Note 8",
      price: 159.99,
      originalPrice: 199.99,
      image:
        "https://down-id.img.susercontent.com/file/52d833df4fc445b3c6b8098ff184a4c2",
      rating: 4.9,
      reviews: 89,
      badge: "New Arrival",
    },
    {
      id: 3,
      name: "Nova ThinkBook S33",
      price: 79.99,
      originalPrice: 109.99,
      image:
        "https://www.notebookcheck.net/fileadmin/Notebooks/Sonstiges/bestmobilelaptops.jpg",
      rating: 4.7,
      reviews: 156,
      badge: "Sale",
    },
    {
      id: 4,
      name: "Redmi 14 Pro",
      price: 129.99,
      originalPrice: 169.99,
      image:
        "https://www.slashgear.com/img/gallery/the-rise-and-fall-of-samsungs-galaxy-note-series/intro-1666275364.jpg",
      rating: 4.6,
      reviews: 203,
      badge: "Popular",
    },
  ];

  const categories = [
    {
      name: "Smart Phones",
      image:
        "https://images.unsplash.com/photo-1719945421298-f03d3d80c3e1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXN8ZW58MHx8MHx8fDA%3D",
      count: "245+ items",
    },
    {
      name: "Laptops",
      image:
        "https://propakistani.pk/wp-content/uploads/2018/04/multiple-laptops-laptop-brands-laptop-list.png",
      count: "189+ items",
    },
    {
      name: "Watches",
      image:
        "https://zimsonwatches.com/cdn/shop/articles/Fossil-Blog-Image.png?v=1710996978&width=1100",
      count: "124+ items",
    },
    {
      name: "Electronics",
      image:
        "https://t4.ftcdn.net/jpg/03/64/41/07/360_F_364410756_Ev3WoDfNyxO9c9n4tYIsU5YBQWAP3UF8.jpg",
      count: "87+ items",
    },
  ];

  // async function getData() {
  //   try {
  //     const response = await fetch(`${domain}/api/products`);
  //     const responsedata = await response.json();
  //     if (response.ok) {
  //       console.log("Fetched data:", responsedata);
  //       if (responsedata.length > 0) {
  //         //console.log("First product structure:", responsedata[0]);
  //       }
  //       setData(responsedata);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }

  useEffect(() => {
    //getData();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden pb-10">
        {/* Background Slider */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
              />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
          <div className="w-full md:w-1/2 space-y-8 text-white">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                TechMart
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {heroSlides[currentSlide].title}{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent block md:inline">
                {heroSlides[currentSlide].subtitle}
              </span>
            </h1>

            <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
              {heroSlides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 ">
              <button className="group relative overflow-hidden px-5 py-2 bg-white text-gray-900 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10 flex items-center justify-center text-sm">
                  <ShoppingBag
                    className="h-5 w-5 mr-2"
                    onClick={() => navigate("/product")}
                  />
                  SHOP NOW
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </button>

              <button
                onClick={() => navigate("/product")}
                className="px-5 py-2 text-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                VIEW COLLECTION
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 ">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-3 border-white bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-white/90 text-sm">
                  Trusted by{" "}
                  <span className="font-bold text-white">5,000+</span> happy
                  customers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-16 w-16 h-16 border border-yellow-300/30 rounded-lg rotate-12 animate-bounce" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "On orders over $99",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "100% protected payments",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                description: "30-day return policy",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Dedicated customer service",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:shadow-xl transition-shadow duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our Popular Products Categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => navigate("/product")}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-white/80">{category.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked favorites from our latest collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-300"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.has(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Style Meet Tech
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Subscribe to our newsletter and be the first to know about new
            arrivals, exclusive deals, and fashion tips
          </p>

          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white px-6 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}

export default Home;
