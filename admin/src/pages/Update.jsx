// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { Backendurl } from '../config/constants';
// import { X, Upload } from 'lucide-react';

// const PROPERTY_TYPES = ["house", "apartment", "commercial", "villa", "plot"];
// const AVAILABILITY_TYPES = ["buy", "rent", "lease"];
// const AMENITIES = ['Lake View', 'Fireplace', 'Central heating and air conditioning', 'Dock', 'Pool', 'Garage', 'Garden', 'Gym', 'Security system', 'Master bathroom', 'Guest bathroom', 'Home theater', 'Exercise room/gym', 'Covered parking', 'High-speed internet ready'];

// const Update = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     type: '',
//     price: '',
//     location: '',
//     description: '',
//     beds: '',
//     baths: '',
//     sqft: '',
//     phone: '',
//     availability: '',
//     amenities: [],
//     images: []
//   });
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const response = await axios.get(`${Backendurl}/properties/get-by-id/${id}`);
//         console.log('Response:', response.data); // Log the response
//         if (response.status==200) {
//           const property = response.data;
//           setFormData({
//             title: property.title,
//             type: property.type,
//             price: property.price,
//             location: property.location,
//             description: property.description,
//             beds: property.beds,
//             baths: property.baths,
//             sqft: property.sqft,
//             phone: property.phone,
//             availability: property.availability,
//             amenities: property.amenities,
//             images: property.image
//           });
//           setPreviewUrls(property.image);
//         } else {
//           toast.error(response.data.message);
//         }
//       } catch (error) {
//         console.log('Error fetching property:', error); // Log the error
//         toast.error('An error occurred. Please try again.');
//       }
//     };

//     fetchProperty();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAmenityToggle = (amenity) => {
//     setFormData((prev) => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter((a) => a !== amenity)
//         : [...prev.amenities, amenity]
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
//     setFormData((prev) => ({
//       ...prev,
//       images: files
//     }));
//   };

//   const removeImage = (index) => {
//     setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formdata = new FormData();
//       formdata.append('id', id);
//       formdata.append('title', formData.title);
//       formdata.append('type', formData.type);
//       formdata.append('price', formData.price);
//       formdata.append('location', formData.location);
//       formdata.append('description', formData.description);
//       formdata.append('beds', formData.beds);
//       formdata.append('baths', formData.baths);
//       formdata.append('sqft', formData.sqft);
//       formdata.append('phone', formData.phone);
//       formdata.append('availability', formData.availability);
//       formdata.append('amenities', JSON.stringify(formData.amenities));
//       formData.images.forEach((image, index) => {
//         formdata.append(`image${index + 1}`, image);
//       });

//       const response = await axios.post(`${backendurl}/api/products/update`, formdata);
//       if (response.data.success) {
//         toast.success('Property updated successfully');
//         navigate('/list');
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen pt-32 px-4 bg-gray-50">
//       <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Property</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                 Property Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 required
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 required
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="type" className="block text-sm font-medium text-gray-700">
//                   Property Type
//                 </label>
//                 <select
//                   id="type"
//                   name="type"
//                   required
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 >
//                   <option value="">Select Type</option>
//                   {PROPERTY_TYPES.map(type => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
//                   Availability
//                 </label>
//                 <select
//                   id="availability"
//                   name="availability"
//                   required
//                   value={formData.availability}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 >
//                   <option value="">Select Availability</option>
//                   {AVAILABILITY_TYPES.map(type => (
//                     <option key={type} value={type}>
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   required
//                   min="0"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   id="location"
//                   name="location"
//                   required
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
//                   Bedrooms
//                 </label>
//                 <input
//                   type="number"
//                   id="beds"
//                   name="beds"
//                   required
//                   min="0"
//                   value={formData.beds}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="baths" className="block text-sm font-medium text-gray-700">
//                   Bathrooms
//                 </label>
//                 <input
//                   type="number"
//                   id="baths"
//                   name="baths"
//                   required
//                   min="0"
//                   value={formData.baths}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
//                   Square Feet
//                 </label>
//                 <input
//                   type="number"
//                   id="sqft"
//                   name="sqft"
//                   required
//                   min="0"
//                   value={formData.sqft}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                 Contact Phone
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 required
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           {/* Amenities */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Amenities
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {AMENITIES.map(amenity => (
//                 <button
//                   key={amenity}
//                   type="button"
//                   onClick={() => handleAmenityToggle(amenity)}
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     formData.amenities.includes(amenity)
//                       ? 'bg-indigo-600 text-white'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   {amenity}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Property Images (Max 4)
//             </label>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               {previewUrls.map((url, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={url}
//                     alt={`Preview ${index + 1}`}
//                     className="h-40 w-full object-cover rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//             {previewUrls.length < 4 && (
//               <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                 <div className="space-y-1 text-center">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="flex text-sm text-gray-600">
//                     <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
//                       <span>Upload images</span>
//                       <input
//                         id="images"
//                         name="images"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="sr-only"
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               disabled={loading}
//             >
//               {loading ? 'Updating...' : 'Update Property'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Update;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Backendurl } from "../config/constants";
import { X, Upload } from "lucide-react";
import http from "../api/http";

const PROPERTY_TYPES = ["house", "apartment", "commercial", "villa", "plot"];
const TRANSACTION_TYPES = ["buy", "rent", "lease"];
// const AMENITIES = [
//   'Lake View', 'Fireplace', 'Central heating and air conditioning', 'Dock',
//   'Pool', 'Garage', 'Garden', 'Gym', 'Security system', 'Master bathroom',
//   'Guest bathroom', 'Home theater', 'Exercise room/gym', 'Covered parking',
//   'High-speed internet ready'
// ];

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    price: "",
    description: "",
    bhk: "",
    bathroom: "",
    size: "",
    transactionType: "",
    images: [],
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await http.get(`${Backendurl}/properties/get-by-id/${id}`);
        if (res.status === 200) {
          const property = res.data;

          setFormData({
            title: property.title || "",
            propertyType: property.propertyType || "",
            price: property.price || "",
            description: property.description || "",
            bhk: property.bhk || "",
            bathroom: property.bathroom || "",
            size: property.size || "",
            transactionType: property.transactionType || "",
            images: (property.images || []).map((url) => ({
              type: "url",
              value: url,
            })),
            location: property.location || {
              address: "",
              city: "",
              state: "",
              pincode: "",
            },
          });

          setPreviewUrls(property.images || []);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch property");
      }
    };

    fetchProperty();
  }, [id]);

  // Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  // Handle new image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newImageObjs = files.map((file) => ({
      type: "file",
      value: file,
    }));

    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageObjs],
    }));
  };

  // Remove image
  const removeImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("id", id);
      formdata.append("title", formData.title);
      formdata.append("propertyType", formData.propertyType);
      formdata.append("price", formData.price);
      formdata.append("description", formData.description);
      formdata.append("bhk", formData.bhk);
      formdata.append("bathroom", formData.bathroom);
      formdata.append("size", formData.size);
      formdata.append("transactionType", formData.transactionType);
      formdata.append("location", JSON.stringify(formData.location));

      // Append images properly
      formData.images.forEach((imgObj) => {
        if (imgObj.type === "file") {
          formdata.append("images", imgObj.value); // File
        } else if (imgObj.type === "url") {
          formdata.append("existingImages", imgObj.value); // String URL
        }
      });

      const res = await http.put(
        `${Backendurl}/properties/update/${id}`,
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        toast.success("Property updated successfully!");
        navigate(-1);
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Update Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              required
            />
          </div>

          {/* Property Type & Transaction Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
                required
              >
                <option value="">Select Type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
                required
              >
                <option value="">Select Transaction</option>
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              required
            />
          </div>

          {/* BHK, Bathrooms, Size */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                BHK
              </label>
              <input
                type="number"
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathroom"
                value={formData.bathroom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size (sqft)
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="address"
              value={formData.location.address}
              onChange={handleLocationChange}
              placeholder="Address"
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              <input
                type="text"
                name="city"
                value={formData.location.city}
                onChange={handleLocationChange}
                placeholder="City"
                className="rounded-md border border-gray-200 p-2"
              />
              <input
                type="text"
                name="state"
                value={formData.location.state}
                onChange={handleLocationChange}
                placeholder="State"
                className="rounded-md border border-gray-200 p-2"
              />
              <input
                type="text"
                name="pincode"
                value={formData.location.pincode}
                onChange={handleLocationChange}
                placeholder="Pincode"
                className="rounded-md border border-gray-200 p-2"
              />
            </div>
          </div>

          {/* Phone */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
            />
          </div> */}

          {/* Amenities */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(amenity => (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    formData.amenities.includes(amenity)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div> */}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Images
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={
                      typeof url === "string" ? url : URL.createObjectURL(url)
                    }
                    alt=""
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {previewUrls.length < 4 && (
              <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                <div className="text-center">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <label className="mt-2 block text-sm text-indigo-600 cursor-pointer">
                    <span>Upload images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            {loading ? "Updating..." : "Update Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;
