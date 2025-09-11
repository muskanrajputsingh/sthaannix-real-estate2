import { useState, useEffect } from "react";
import {
  Trash2,
  Edit3,
  Search,
  Filter,
  Plus,
  Home,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Building,
  Grid3X3,
  List,
  Eye,
  Calendar,
  TrendingUp,
  Star,
  ChevronDown,
  RefreshCw,
  Clipboard,
  Landmark,
  TableProperties,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { propertiesAPI } from "../api/api";
import { useNavigate } from "react-router-dom";
const PropertyListings = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.get();
      // console.log("res: ",response.data);

      if (response.data) {
        const parsedProperties = response.data.map((property) => ({
          _id: property._id,
          title: property.title,
          description: property.description,
          location:
            typeof property.location === "object"
              ? `${property.location.address}, ${property.location.city},${
                  property.location.pincode
                }, ${property.location.state || ""}`
              : property.location,
          type: property.propertyType,
          availability: property.transactionType,
          price: property.price,
          beds: property.bhk || 0,
          baths: property.baths || 1,
          sqft: property.size || 0,
          image: property.images || ["/placeholder.jpg"],
          amenities: parseAmenities(property.amenities || []),
          createdAt: property.createdAt || new Date().toISOString(),
        }));
        setProperties(parsedProperties);
      } else {
        toast.error("No properties found");
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
    toast.success("Properties refreshed!");
  };

  const parseAmenities = (amenities) => {
    if (!amenities || !Array.isArray(amenities)) return [];
    try {
      return typeof amenities[0] === "string"
        ? JSON.parse(amenities[0].replace(/'/g, '"'))
        : amenities;
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleRemoveProperty = async (propertyId, propertyTitle) => {
    if (window.confirm(`Are you sure you want to remove "${propertyTitle}"?`)) {
      try {
        const response = await propertiesAPI.delete(propertyId);
        if (response.status == 200) {
          toast.success("Property removed successfully");
          // navigate("/list");
          await fetchProperties();
        } else {
          toast.error(response.data.message || "Failed to remove property");
        }
      } catch (error) {
        console.error("Error removing property:", error);
        toast.error("Failed to remove property");
      }
    }
  };

  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch =
        !searchTerm ||
        [property.title, property.location, property.type].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesType =
        filterType === "all" ||
        property.type.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-700 mb-2"
          >
            Loading Properties
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500"
          >
            Fetching the latest property listings...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-10 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-8">
        {/* Header Section */}
        {/* <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Property Management
              </h1>
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{filteredProperties.length} Properties Listed</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Portfolio Overview</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-3 w-full xs:w-auto xl:w-auto mt-4 xs:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex-1 xs:flex-none justify-center"
              >
                <RefreshCw
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden xs:inline ">Refresh</span>
              </motion.button>

              <Link to="/add" className="flex-1 xs:flex-none">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl w-full justify-center"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base xl:text-base">Add Property</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div> */}

        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-normal">
                Property Management
              </h1>
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{filteredProperties.length} Properties Listed</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Portfolio Overview</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-3 w-full xs:w-auto xl:w-auto mt-4 xs:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex-1 xs:flex-none justify-center min-w-[120px]"
              >
                <RefreshCw
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </motion.button>

              <Link to="/add" className="flex-1 xs:flex-none ">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl w-full justify-center"
                >
                  <Plus className="w-5 h-5 text-white" />
                  <span className="text-sm sm:text-base xl:text-base whitespace-nowrap">
                    Add Property
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8"
        >
          {/* Total Properties */}
          <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg md:rounded-xl">
                <TableProperties className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  {properties?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* For Rent */}
          <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="p-2 md:p-3 bg-green-50 rounded-lg md:rounded-xl">
                <Home className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  For Rent
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  {properties?.filter((p) => p.availability === "rent")
                    .length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* For Buy */}
          <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="p-2 md:p-3 bg-purple-50 rounded-lg md:rounded-xl">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  For Buy
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  {properties?.filter((p) => p.availability === "buy").length ||
                    0}
                </p>
              </div>
            </div>
          </div>

          {/* For Lease */}
          <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="p-2 md:p-3 bg-yellow-50 rounded-lg md:rounded-xl">
                <Clipboard className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  For Lease
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  {properties?.filter((p) => p.availability === "lease")
                    .length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Avg. Price */}
          <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border border-gray-100 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              <div className="p-2 md:p-3 bg-orange-50 rounded-lg md:rounded-xl">
                <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Avg. Price
                </p>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  ₹
                  {properties?.length > 0
                    ? Math.round(
                        properties.reduce((sum, p) => sum + (p.price || 0), 0) /
                          properties.length /
                          100000
                      )
                    : 0}
                  L
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 shadow-sm border border-gray-100 mb-6 md:mb-8"
        >
          <div className="space-y-3 md:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, location, or property type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Filter className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Filters</span>
                  <ChevronDown
                    className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="plot">Plots</option>
                  <option value="apartment">Apartments</option>
                  <option value="commercial">Commercial</option>
                  <option value="villa">Villas</option>
                  <option value="house">Houses</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-center gap-1 md:gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Property Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
          className="space-y-4 md:space-y-6"
        >
          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 md:py-16 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="max-w-md mx-auto px-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Home className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Get started by adding your first property"}
                </p>
                {!searchTerm && filterType === "all" && (
                  <Link to="/add">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1 md:gap-2 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm md:text-base"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      Add Your First Property
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <div
              className={`grid gap-4 md:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              <AnimatePresence>
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden group ${
                      viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                    }`}
                  >
                    <Link
                      to={`/property/${property._id}`}
                      className="block group"
                    >
                      {/* Property Image */}
                      <div
                        className={`relative ${
                          viewMode === "list"
                            ? "sm:w-60 md:w-80 h-48 sm:h-auto flex-shrink-0"
                            : "h-48 sm:h-56"
                        }`}
                      >
                        <img
                          src={property.image[0] || "/placeholder.jpg"}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Property Type Badge */}
                        <div className="absolute top-3 left-3 md:top-4 md:left-4">
                          <span className="px-2 py-1 md:px-3 md:py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs md:text-sm font-medium rounded-full shadow-sm text-transform: capitalize">
                            {property.type}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 md:top-4 md:right-4">
                          <span
                            className={`px-2 py-1 md:px-3 text-transform: capitalize md:py-1 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm ${
                              property.availability === "rent"
                                ? "bg-green-500/90 text-white"
                                : "bg-blue-500/90 text-white"
                            }`}
                          >
                            For {property.availability}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Link
                            to={`/update/${property._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 md:p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg"
                          >
                            <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleRemoveProperty(
                                property._id,
                                property.title
                              );
                            }}
                            className="p-1.5 md:p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-200 shadow-lg"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </Link>
                    {/* Property Details */}
                    <div
                      className={`p-4 md:p-5 lg:p-6 flex-1 ${
                        viewMode === "list"
                          ? "flex flex-col justify-between"
                          : ""
                      }`}
                    >
                      <div>
                        <div className="mb-3 md:mb-4">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-2 text-transform: capitalize">
                            {property.title}
                          </h3>
                          <p className="mb-2 text-sm md:text-base text-gray-600 line-clamp-2">
                            {property.description}
                          </p>
                          <div className="flex items-center text-gray-600 mb-2 md:mb-3">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray-400" />
                            <span className="text-xs md:text-sm">
                              {property.location}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                              ₹{property.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                              <span className="text-xs md:text-sm text-gray-500">
                                2.4k views
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Property Stats */}
                        <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-5 lg:mb-6">
                          <div className="text-center p-2 md:p-3 bg-gray-50 rounded-xl">
                            <BedDouble className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs md:text-sm font-medium text-gray-900">
                              {property.beds}
                            </div>
                            <div className="text-xs text-gray-500">
                              Bedrooms
                            </div>
                          </div>
                          <div className="text-center p-2 md:p-3 bg-gray-50 rounded-xl">
                            <Bath className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs md:text-sm font-medium text-gray-900">
                              {property.baths}
                            </div>
                            <div className="text-xs text-gray-500">
                              Bathrooms
                            </div>
                          </div>
                          <div className="text-center p-2 md:p-3 bg-gray-50 rounded-xl">
                            <Maximize className="w-4 h-4 md:w-5 md:h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-xs md:text-sm font-medium text-gray-900">
                              {property.sqft}
                            </div>
                            <div className="text-xs text-gray-500">Sq Ft</div>
                          </div>
                        </div>

                        {/* Amenities */}
                        {property.amenities.length > 0 && (
                          <div className="border-t pt-3 md:pt-4">
                            <h4 className="text-xs md:text-sm font-medium text-gray-900 mb-2 md:mb-3">
                              Top Amenities
                            </h4>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {property.amenities
                                .slice(0, 4)
                                .map((amenity, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                  >
                                    <Building className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                                    {amenity}
                                  </span>
                                ))}
                              {property.amenities.length > 4 && (
                                <span className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                  +{property.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {viewMode === "list" && (
                        <div className="flex items-center justify-between pt-3 md:pt-4 mt-3 md:mt-4 border-t">
                          <div className="text-xs md:text-sm text-gray-500">
                            Listed{" "}
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 md:gap-2">
                            <Link
                              to={`/update/${property._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 md:p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleRemoveProperty(
                                  property._id,
                                  property.title
                                );
                              }}
                              className="p-1 md:p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyListings;
