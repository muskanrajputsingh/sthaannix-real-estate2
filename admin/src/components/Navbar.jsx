// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Home,
//   List,
//   PlusSquare,
//   Calendar,
//   Menu,
//   X,
//   LogOut,
//   LayoutDashboard,
//   Settings,
//   Bell,
//   HandCoins,
//   User,
//   ChevronDown,
//   ChartCandlestick,
//   MessageSquareText
// } from 'lucide-react';

// import { userAPI } from '../api/api';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//  const storedUser = localStorage.getItem("user");
// const user = storedUser ? JSON.parse(storedUser) : null;
// const role = user?.role;

// const [balance, setBalance] = useState(user?.walletBalance || 0);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('isAdmin');
//     navigate('/login');
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     setIsProfileOpen(false);
//   };

//   const toggleProfile = () => {
//     setIsProfileOpen(!isProfileOpen);
//     setIsMenuOpen(false);
//   };

//   // const navItems = [
//   //   { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//   //   { path: '/list', label: 'Properties', icon: List },
//   //   { path: '/add', label: 'Add Property', icon: PlusSquare },
//   //   { path: '/appointments', label: 'Leads', icon: Calendar },
//   // ];

//   const containerVariants = {
//     hidden: { opacity: 0, y: -10 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.3,
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -10 },
//     visible: { opacity: 1, x: 0 }
//   };

//    const navConfig = {
//     admin: [
//       { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       { path: '/list', label: 'Properties', icon: List },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//       { path: '/appointments', label: 'Leads', icon: Calendar },
//       { path: '/revenue', label: 'Revenue', icon: ChartCandlestick },
//       { path: '/users-messages', label: 'User Messages', icon: MessageSquareText  },
//     ],
//     broker: [
//       { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       // { path: '/leads', label: 'My Leads', icon: Calendar },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//        { path: '/appointments', label: 'Leads', icon: Calendar },
//     ],
//     builder: [
//     { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       // { path: '/leads', label: 'My Leads', icon: Calendar },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//        { path: '/appointments', label: 'Leads', icon: Calendar },
//     ],
//     owner: [
//    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       // { path: '/leads', label: 'My Leads', icon: Calendar },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//        { path: '/appointments', label: 'Leads', icon: Calendar },
//     ],
//   };

//   /////////////////////////
//   const formatRoleName = (role) => {
//   switch(role?.toLowerCase()) {
//     case 'broker': return 'Broker';
//     case 'builder': return 'Builder';
//     case 'owner': return 'Property Owner';
//     case 'admin': return 'Administrator';
//     default: return 'User';
//   }
// };
// /////////////////

//   const navItems = navConfig[role] || [];

//   useEffect(() => {
//   const fetchBalance = async () => {
//     try {
//       if (!user) return;
//       const res = await userAPI.getWalletBalance(user.id);

//       setBalance(res.data.walletBalance);
//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           ...user,
//           walletBalance: res.data.walletBalance,
//         })
//       );
//     } catch (error) {
//       console.error("Error fetching wallet balance:", error);
//     }
//   };

//   fetchBalance();
//   const interval = setInterval(fetchBalance, 30000);
//   return () => clearInterval(interval);
// }, []);

//   return (
//     <motion.header
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.5 }}
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//         scrolled
//           ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
//           : 'bg-white shadow-md'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/dashboard" className="flex items-center group">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="relative p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
//             >
//               <Home className="h-5 w-5 text-white" />

//             </motion.div>
//             <div className="ml-3">
//               <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                 Sthaanix
//               </span>
//               <div className="text-xs text-gray-500 font-medium">Admin Panel</div>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-1">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
//                   isActive(item.path)
//                     ? 'text-blue-700 bg-blue-50 shadow-sm'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <item.icon className={`h-4 w-4 mr-2 transition-colors ${
//                     isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
//                   }`} />
//                   {item.label}
//                 </div>
//                 {isActive(item.path) && (
//                   <motion.div
//                     layoutId="activeTab"
//                     className="absolute inset-0 bg-blue-50 rounded-xl border border-blue-100"
//                     style={{ zIndex: -1 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 30 }}
//                   />
//                 )}
//               </Link>
//             ))}
//           </nav>

//           {/* Desktop Profile & Actions */}
//           <div className="hidden md:flex items-center space-x-3">
//             {/* Notifications */}
//             {/* <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
//             >
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
//             </motion.button> */}

//             {/* Profile Dropdown */}
//             <div className="relative">
//               <motion.button
//                 onClick={toggleProfile}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
//               >
//                 <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                   <User className="h-4 w-4 text-white" />
//                 </div>

//                <div className="text-left hidden lg:block">
//                 <div className="text-sm font-medium text-gray-900">
//                   {formatRoleName(user?.role)}
//                 </div>
//                 {/* <div className="text-xs text-gray-500">
//                   {user?.role === 'admin' ? 'Administrator' : formatRoleName(user?.role)}
//                 </div>   */}
//               </div>

//                 <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
//                   isProfileOpen ? 'rotate-180' : ''
//                 }`} />
//               </motion.button>

//               <AnimatePresence>
//                 {isProfileOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
//                   >
//                     <div className="px-4 py-2 border-b border-gray-100">
//                       <div className="text-sm font-medium text-gray-900">Admin Panel</div>
//                       <div className="text-xs text-gray-500">Manage your properties</div>
//                     </div>

//                     {role !== "admin" && (
//                     <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
//                       <HandCoins className="h-4 w-4 mr-2" />
//                       Balance: {balance === 0 ? "0" : balance}
//                     </button>
//                   )}
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
//                     >
//                       <LogOut className="h-4 w-4 mr-2" />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <motion.button
//               onClick={toggleMenu}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
//             >
//               <motion.div
//                 animate={{ rotate: isMenuOpen ? 180 : 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {isMenuOpen ? (
//                   <X className="h-6 w-6" />
//                 ) : (
//                   <Menu className="h-6 w-6" />
//                 )}
//               </motion.div>
//             </motion.button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg"
//           >
//             <div className="px-4 pt-4 pb-6 space-y-2">
//               {navItems.map((item) => (
//                 <motion.div key={item.path} variants={itemVariants}>
//                   <Link
//                     to={item.path}
//                     className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
//                       isActive(item.path)
//                         ? 'bg-blue-50 text-blue-700 border border-blue-100'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <item.icon className={`h-5 w-5 mr-3 ${
//                       isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
//                     }`} />
//                     {item.label}
//                   </Link>
//                 </motion.div>
//               ))}

//               {/* Mobile Profile Section */}
//               <motion.div variants={itemVariants} className="pt-4 border-t border-gray-200">
//                 <div className="flex items-center px-4 py-3 mb-2">
//                   <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                     <User className="h-5 w-5 text-white" />
//                   </div>
//                   <div className="ml-3">
//                     <div className="text-sm font-medium text-gray-900">   {formatRoleName(user?.role)} </div>
//                     {/* <div className="text-xs text-gray-500">Administrator</div> */}
//                   </div>
//                 </div>

//                 {role !== "admin" && (
//                     <button  className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 flex items-center mb-2">
//                       <HandCoins className="h-4 w-4 mr-3" />
//                       Balance: {balance === 0 ? "0" : balance}
//                     </button>
//                   )}
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 flex items-center"
//                 >
//                   <LogOut className="h-4 w-4 mr-3" />
//                   Logout
//                 </button>
//               </motion.div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.header>
//   );
// };

// export default Navbar;

// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Home,
//   List,
//   PlusSquare,
//   Calendar,
//   LogOut,
//   LayoutDashboard,
//   ChartCandlestick,
//   MessageSquareText,
//   User,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   HandCoins
// } from 'lucide-react';
// import { userAPI } from '../api/api';

// const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const role = user?.role;
//   const [balance, setBalance] = useState(user?.walletBalance || 0);

//   const isActive = (path) => location.pathname === path;

//   const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   const navConfig = {
//     admin: [
//       { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       { path: '/list', label: 'Properties', icon: List },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//       { path: '/appointments', label: 'Leads', icon: Calendar },
//       { path: '/revenue', label: 'Revenue', icon: ChartCandlestick },
//       { path: '/users-messages', label: 'User Messages', icon: MessageSquareText },
//     ],
//     broker: [
//       { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//       { path: '/appointments', label: 'Leads', icon: Calendar },
//     ],
//     builder: [
//       { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//       { path: '/appointments', label: 'Leads', icon: Calendar },
//     ],
//     owner: [
//       { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//       { path: '/add', label: 'Add Property', icon: PlusSquare },
//       { path: '/appointments', label: 'Leads', icon: Calendar },
//     ],
//   };

//   const navItems = navConfig[role] || [];

//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (!user) return;
//       try {
//         const res = await userAPI.getWalletBalance(user.id);
//         setBalance(res.data.walletBalance);
//         localStorage.setItem(
//           "user",
//           JSON.stringify({ ...user, walletBalance: res.data.walletBalance })
//         );
//       } catch (error) {
//         console.error("Error fetching wallet balance:", error);
//       }
//     };

//     fetchBalance();
//     const interval = setInterval(fetchBalance, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <motion.aside
//       initial={{ x: -280 }}
//       animate={{ x: 0 }}
//       className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transition-all duration-300
//         ${isCollapsed ? 'w-16' : 'w-64'}
//       `}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200">
//         <Link to="/dashboard" className="flex items-center">
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="relative p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg"
//           >
//             <Home className="h-5 w-5 text-white" />
//           </motion.div>
//           {!isCollapsed && (
//             <div className="ml-3">
//               <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                 Sthaanix
//               </span>
//               <div className="text-xs text-gray-500 font-medium">Admin Panel</div>
//             </div>
//           )}
//         </Link>

//         <motion.button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
//         >
//           {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
//         </motion.button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 space-y-2">
//         {navItems.map(item => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
//               isActive(item.path)
//                 ? 'text-blue-700 bg-blue-50 shadow-sm border border-blue-100'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//             }`}
//             title={isCollapsed ? item.label : ''}
//           >
//             <item.icon className={`h-5 w-5 transition-colors ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
//             {!isCollapsed && item.label}
//           </Link>
//         ))}
//       </nav>

//       {/* Profile Section */}
//       <div className="border-t border-gray-200 p-4">
//         {!isCollapsed ? (
//           <>
//             {role !== 'admin' && (
//               <div className="mb-3 px-3 py-2 bg-gray-50 rounded-xl flex items-center">
//                 <HandCoins className="h-4 w-4 mr-2 text-gray-500" />
//                 <span className="text-sm text-gray-700">Balance: {balance}</span>
//               </div>
//             )}

//             <div className="relative">
//               <motion.button
//                 onClick={toggleProfile}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
//               >
//                 <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                   <User className="h-5 w-5 text-white" />
//                 </div>
//                 <div className="flex-1 text-left min-w-0">
//                   <div className="text-sm font-medium text-gray-900 truncate">{role}</div>
//                   <div className="text-xs text-gray-500">Click to manage</div>
//                 </div>
//                 <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
//               </motion.button>

//               <AnimatePresence>
//                 {isProfileOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
//                   >
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
//                     >
//                       <LogOut className="h-4 w-4 mr-2" />
//                       Logout
//                     </button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </>
//         ) : (
//           <div className="flex justify-center">
//             <motion.button
//               onClick={toggleProfile}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-all duration-200"
//               title="Profile"
//             >
//               <User className="h-5 w-5 text-gray-600" />
//             </motion.button>

//             <AnimatePresence>
//               {isProfileOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute bottom-16 left-16 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
//                 >
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
//                   >
//                     <LogOut className="h-4 w-4 mr-2" />
//                     Logout
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>
//     </motion.aside>
//   );
// };

// export default Sidebar;

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  List,
  PlusSquare,
  Calendar,
  LayoutDashboard,
  Settings,
  Bell,
  HandCoins,
  User,
  ChevronDown,
  ChartCandlestick,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { userAPI } from "../api/api";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role;

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navConfig = {
    admin: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/list", label: "Properties", icon: List },
      { path: "/add", label: "Add Property", icon: PlusSquare },
      { path: "/appointments", label: "Leads", icon: Calendar },
      { path: "/revenue", label: "Revenue", icon: ChartCandlestick },
      {
        path: "/users-messages",
        label: "User Messages",
        icon: MessageSquareText,
      },
    ],
    broker: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/add", label: "Add Property", icon: PlusSquare },
      { path: "/appointments", label: "Leads", icon: Calendar },
    ],
    builder: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/add", label: "Add Property", icon: PlusSquare },
      { path: "/appointments", label: "Leads", icon: Calendar },
    ],
    owner: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/add", label: "Add Property", icon: PlusSquare },
      { path: "/appointments", label: "Leads", icon: Calendar },
    ],
  };

  const navItems = navConfig[role] || [];

  const formatRoleName = (role) => {
    switch (role?.toLowerCase()) {
      case "broker":
        return "Broker";
      case "builder":
        return "Builder";
      case "owner":
        return "Property Owner";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!user) return;
        const res = await userAPI.getWalletBalance(user.id);
        setBalance(res.data.walletBalance);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            walletBalance: res.data.walletBalance,
          })
        );
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {user?.role.toLowerCase() !== "admin" && (
        <div
          className="fixed top-4 right-4 z-50 bg-blue-100 text-blue-700 font-semibold rounded-md px-4 py-2 shadow-lg "
          title="Wallet Balance"
        >
          <button className="w-full text-left  text-sm text-gray-700 flex items-center">
            <HandCoins className="h-4 w-4 mr-2" />
            Balance: ₹{balance === 0 ? "0" : balance}
          </button>
        </div>
      )}

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed ? (
            <Link to="/dashboard" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <Home className="h-5 w-5 text-white" />
              </motion.div>
              <div className="ml-3">
                <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Sthaanix
                </span>
                <div className="text-xs text-gray-500 font-medium">
                  Admin Panel
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg transition-all duration-300"
              >
                <Home className="h-6 w-6 text-white" />
              </motion.div>
            </Link>
          )}

          <motion.button
            onClick={toggleSidebar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ml-6"
          >
            {isCollapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? "text-blue-700 bg-blue-50 shadow-sm border border-blue-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon
                className={`transition-colors ${
                  isActive(item.path) ? "text-blue-600" : "text-gray-500"
                } ${isCollapsed ? "mx-auto h-6 w-6" : "mr-3 h-5 w-5"}`}
              />
              {!isCollapsed && item.label}
            </Link>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200/50">
          <motion.div className="relative flex justify-center">
            <motion.button
              onClick={toggleProfile}
              className={`flex items-center ${
                isCollapsed ? "justify-center w-12 h-12" : "w-full"
              } p-2 rounded-xl hover:bg-gray-50 transition-all duration-200`}
            >
              <div
                className={`${
                  isCollapsed ? "h-10 w-10" : "h-8 w-8"
                } bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}
              >
                <User
                  className={`${
                    isCollapsed ? "h-6 w-6" : "h-4 w-4"
                  } text-white`}
                />
              </div>
              {!isCollapsed && (
                <>
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {formatRoleName(user?.role)}
                    </div>
                  </div>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute ${
                    isCollapsed
                      ? "left-14 top-full mt-2"
                      : "left-0 top-full mt-2"
                  } w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50`}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      Admin Panel
                    </div>
                    <div className="text-xs text-gray-500">
                      Manage your properties
                    </div>
                  </div>

                  {user?.role.toLowerCase() !== "admin" && (
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                      <HandCoins className="h-4 w-4 mr-2" />
                      Balance: {balance === 0 ? "0" : balance}
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
