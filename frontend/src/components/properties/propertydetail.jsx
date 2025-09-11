import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BedDouble,
  Bath,
  Maximize,
  ArrowLeft,
  MapPin,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Compass,
  Building,
  MessageCircle,
} from "lucide-react";

import {
  getLocalStorage,
  setLocalStorage,
} from "../../utils/localStorageUtil.js";
import { fetchPropertyDetail } from "../../services/property-InqueryService.js";
import http from "../../api/http.js";

const LOCAL_STORAGE_PREFIX = "propertyDetail_";

const PropertyDetails = () => {
  const { id } = useParams();
  const localStorageKey = `${LOCAL_STORAGE_PREFIX}${id}`;
  const [property, setProperty] = useState(() =>
    getLocalStorage(localStorageKey)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [user,setUser]=useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [whatsappNum, setWhatsappNum] = useState(null);

  const images = React.useMemo(() => {
    if (!property?.images) return [];
    return Array.isArray(property.images) ? property.images : [property.images];
  }, [property]);

  const getFullLocationString = () => {
    if (!property?.location) return "";
    const { address, city, state, pincode } = property.location;
    return [address, city, state, pincode].filter(Boolean).join(", ");
  };

  const locationString = getFullLocationString();

  const whatsappMessage = `Hello! I'm interested in your property: ${
    property?.title || ""
  } at ${locationString}. Price: ₹${Number(property?.price || 0).toLocaleString(
    "en-IN"
  )}. Please contact me for more details.`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedMessage}`;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const propertyData = await fetchPropertyDetail(id);
        if (propertyData) {
          const processedProperty = {
            ...propertyData,
            amenities: parseAmenities(propertyData?.amenities),
          };
          setProperty(processedProperty);
          setLocalStorage(localStorageKey, processedProperty);
          setError(null);
        } else {
          setError("Failed to load property details. No data found.");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, localStorageKey]);

  useEffect(() => {
    if (!property || !property.owner) return;
    const fetchPropertyOwner = async () => {
      try {
        const res = await http.get(`/user/get-by-id/${property.owner}`);
        if (!res.data.user) return;
        setUser(res.data.user);
        setWhatsappNum(res.data.user.phone);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPropertyOwner();
  }, [property]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  const parseAmenities = (amenities) => {
    if (!amenities) return [];
    if (Array.isArray(amenities)) {
      return amenities.filter(
        (amenity) => amenity && typeof amenity === "string"
      );
    }
    if (typeof amenities === "string") {
      try {
        const parsed = JSON.parse(amenities.replace(/'/g, '"'));
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        console.error("Error parsing amenities:", error);
        return amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  const handleKeyNavigation = useCallback(
    (e) => {
      if (!images.length) return;
      if (e.key === "ArrowLeft") {
        setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    },
    [images.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this ${property.type || "property"}: ${
            property.title || ""
          }`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
    toast.error("Please log in to make an inquiry.");
    return;
  }

  if (currentUser.role !== "buyer") {
    toast.error("Only buyers can send inquiries.");
    setInquiryData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    return;
  }
    if (!property?._id) {
      toast.error("Property not loaded yet.");
      return;
    }
    setInquirySubmitting(true);
    try {
      const payload = {
        propertyId: property._id,
        message: inquiryData.message,
      };
      await http.post("/leads/create", payload);
      toast.success("Inquiry submitted successfully!");
      setInquirySuccess(true);
      setInquiryData({ ...inquiryData, message: "" });
      setTimeout(() => {
        setInquirySuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Inquiry submission error:", err.message);
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Bad request");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized. Please log in.");
      } else {
        toast.error("Failed to submit inquiry. Please try again.");
      }
    } finally {
      setInquirySubmitting(false);
    }
  };
  useEffect(() => {
  const getUser = getLocalStorage("user");
  if (getUser) {
    setCurrentUser(getUser);
  }
}, []);

  // Preload and Auto-play images safely
  useEffect(() => {
    if (!images || !images.length) return;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    if (images.length < 2) return;
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/properties"
            className="text-blue-600 hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <Link
            to="/properties"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                hover:bg-gray-100 transition-colors relative"
          >
            {copySuccess ? (
              <span className="text-green-600">
                <Copy className="w-5 h-5" />
                Copied!
              </span>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share
              </>
            )}
          </button>
        </nav>

        {/* Image gallery */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-[500px] bg-gray-100 rounded-xl overflow-hidden">
            {images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[activeImage]}
                  src={images[activeImage]}
                  alt={`${property.title} - View ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                  bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) => (prev + 1) % images.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                  bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            {images.length > 0 && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 
                bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm"
              >
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Property Details Section (Full-Width) */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6 space-y-4">
          <h3
            className="text-xl font-semibold text-gray-900 line-clamp-2 
              group-hover:text-blue-600 transition-colors text-transform: capitalize"
          >
            {property.title}
          </h3>
          <h5
            className="text-m font-semibold text-gray-900 line-clamp-2 
              group-hover:text-blue-600 transition-colors text-transform: capitalize"
          >
            - {property.propertyType}
          </h5>
          <p className="text-3xl font-bold text-blue-600 mb-2">
            ₹{Number(property.price).toLocaleString("en-IN")}
          </p>
          <p className="text-gray-600">
            Available for {property.transactionType}
          </p>
          <div className="flex gap-4 mt-4">
            {["buy", "rent", "lease"].map((option) => {
              const isActive = property.transactionType === option;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={!isActive}
                  className={`flex-1 py-2 rounded-lg text-white font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}{" "}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <BedDouble className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {property.bhk} {property.bhk > 1 ? "Bedrooms" : "Bedroom"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Bath className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              {property.bathroom}{" "}
              {property.bathroom > 1 ? "Bathrooms" : "Bathroom"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Maximize className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{property.size} sqft</p>
          </div>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <Building className="w-4 h-4 mr-2 text-blue-600" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-8">
          {/* Left Column: Description & Location */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
            {locationString && locationString !== "Location not specified" && (
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <Compass className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>
                <p className="text-gray-600">{property.location.address}</p>
                <p className="text-gray-600">{property.location.city}</p>
                <p className="text-gray-600">{property.location.state}</p>
                <p className="text-gray-600 mb-4">
                  Pincode: {property.location.pincode}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    locationString
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <MapPin className="w-4 h-4" />
                  View on Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="sticky top-20 h-fit">
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Send Inquiry</h2>
              {inquirySuccess && (
                <p className="mb-4 text-green-600 font-medium">
                  Inquiry sent successfully!
                </p>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-3 rounded-lg 
                  hover:bg-green-700 transition-colors flex items-center 
                  justify-center gap-2 mb-6"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={inquiryData.name}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                    px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                    px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={inquiryData.phone}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                    px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={inquiryData.message}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                    px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any questions or details..."
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700
                    transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {inquirySubmitting ? "Sending..." : "Send Inquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
