// import { TopbarLayout } from "@/components/TopbarLayout";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import toast, { Toaster } from "react-hot-toast";
// import { Router, Users, Share2, Server, ArrowRight } from "lucide-react";

// export default function HomePage() {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   const features = [
//     {
//       title: "Device Tracking",
//       description:
//         "View and manage all network devices including routers, switches, ONUs, and monitor their live status in real-time.",
//       icon: <Router className="text-primary w-10 h-10" />,
//       link: "/devices",
//       bg: "bg-primary/10",
//     },
//     {
//       title: "Customer Tracking",
//       description:
//         "Track your customers along with their service plans, usage history, and support requests—all from a single, easy-to-use dashboard.",
//       icon: <Users className="text-success w-10 h-10" />,
//       link: "/customers",
//       bg: "bg-success/10",
//     },
//     {
//       title: "Junction Tracking",
//       description:
//         "View and control all junction points, splitters, and fiber connections with clear visual mapping and hierarchy.",
//       icon: <Share2 className="text-warning w-10 h-10" />,
//       link: "/junctions",
//       bg: "bg-warning/10",
//     },
//     {
//       title: "OLT Monitoring",
//       description:
//         "Monitor OLT devices, ports, and their performance metrics for proactive management and fault detection.",
//       icon: <Server className="text-purple-600 w-10 h-10" />,
//       link: "/olt",
//       bg: "bg-purple-100",
//     },
//   ];

//   const handleDashboardClick = () => {
//     if (isAuthenticated) {
//       navigate("/dashboard");
//     } else {
//       toast.error("Please login to access the dashboard");
//       setTimeout(() => {
//         navigate("/login");
//       }, 500);
//     }
//   };
//   return (
//     <TopbarLayout>
//       <div className="min-h-screen bg-background flex flex-col">
//         {/* Main SaaS Landing Content */}
//         <div className="flex-1">
//           {/* Hero Section */}
//           <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
//             {/* <div 
//               className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
//               style={{
//                 backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20fiber%20optic%20network%20visualization%20with%20glowing%20blue%20nodes%20and%20connections%2C%20dark%20tech%20background%20with%20geometric%20patterns%2C%20futuristic%20digital%20network%20infrastructure%2C%20clean%20minimalist%20style%20with%20blue%20and%20white%20color%20scheme&width=1920&height=1080&seq=hero-network-bg&orientation=landscape')`
//               }}
//             /> */}
//             <div className="relative max-w-7xl mx-auto">
//               <div className="grid lg:grid-cols-2 gap-12 items-center">
//                 <div className="space-y-8">
//                   <div className="space-y-4">
//                     <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
//                       Visualize & Manage Your{" "}
//                       <span className="text-primary">Fiber Network</span> in
//                       Real-Time
//                     </h1>
//                     <p className="text-xl text-muted-foreground leading-relaxed">
//                       FiberOnix is a sophisticated optical distributed network
//                       mapping solution that has been developed and is managed by{" "}
//                       <a href="https://zentryxglobal.com/">
//                         <span className="font-bold text-primary">
//                         Zentryx Global Systems Pvt Ltd
//                         </span>
//                       </a>{" "}
//                       . It allows for the precise tracking of devices,
//                       connections, couplers, splitters, OLTs, and ONTs. This
//                       application is accessible on both mobile and web
//                       platforms, and it includes an API for CRM integration. The
//                       app will provide you with the route and distance, which
//                       will allow you to figure out the optical fiber lengths for
//                       a new feasibility check.
//                     </p>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-4 w-full">
//                     <a
//                       href="https://github.com/AmmuVijayan2001/fibronics/releases/download/v1.0.0/app-release.apk"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full sm:w-auto"
//                     >
//                       <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
//                         Download App
//                       </button>
//                     </a>

//                     <button
//                       className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
//                       onClick={handleDashboardClick}
//                     >
//                       Go to Dashboard
//                     </button>
//                   </div>

//                   {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-2">
//                       <i className="ri-check-line text-success w-5 h-5 flex items-center justify-center"></i>
//                       <span>14-day free trial</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <i className="ri-check-line text-success w-5 h-5 flex items-center justify-center"></i>
//                       <span>No credit card required</span>
//                     </div>
//                   </div> */}
//                 </div>
//                 <div className="relative">
//                   <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-card/20">
//                     <img
//                       src="/title-image.png"
//                       //  src="https://readdy.ai/api/search-image?query=Network%20topology%20diagram%20showing%20fiber%20optic%20connections%20with%20blue%20nodes%20and%20lines%2C%20professional%20technical%20illustration%2C%20clean%20modern%20design%20with%20interconnected%20devices%2C%20routers%20and%20fiber%20optic%20cables%2C%20blue%20and%20white%20color%20scheme%2C%20dashboard%20interface%20style&width=600&height=400&seq=network-illustration&orientation=landscape"
//                       alt="Network mapping visualization"
//                       className="w-full h-auto rounded-xl shadow-2xl object-top"
//                     />
//                   </div>
//                   {/* Floating elements for visual appeal */}
//                   <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
//                     <i className="ri-wifi-line w-6 h-6 flex items-center justify-center"></i>
//                   </div>
//                   <div className="absolute -bottom-4 -left-4 bg-success text-white p-3 rounded-full shadow-lg">
//                     <i className="ri-pulse-line w-6 h-6 flex items-center justify-center"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* App Screenshots Section */}
//           <section id="screenshots" className="py-20 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//               <h2 className="text-4xl font-bold text-foreground mb-4">
//                 See Fiberonix in Action
//               </h2>
//               <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
//                 Explore how Fiberonix looks and works with our clean, intuitive,
//                 and powerful interface.
//               </p>

//               {/* Desktop Grid */}
//               <div className="hidden lg:grid grid-cols-5 gap-6">
//                 {[
//                   "WhatsApp Image 2025-08-21 at 5.11.49 PM.jpeg",
//                   "WhatsApp Image 2025-08-21 at 5.12.44 PM.jpeg",
//                   "WhatsApp Image 2025-08-21 at 5.13.00 PM.jpeg",
//                   "WhatsApp Image 2025-08-21 at 5.13.26 PM.jpeg",
//                   "WhatsApp Image 2025-08-21 at 5.13.55 PM.jpeg",
//                 ].map((img, i) => (
//                   <div key={i} className="rounded-xl shadow-lg overflow-hidden">
//                     <img
//                       src={`./${img}`}
//                       alt={`App Screenshot ${i + 1}`}
//                       className="w-full h-auto object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Mobile Carousel */}
//               <div className="lg:hidden relative">
//                 <div
//                   id="screenshot-carousel"
//                   className="flex  overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 p-8"
//                 >
//                   {[
//                     "WhatsApp Image 2025-08-21 at 5.11.49 PM.jpeg",
//                     "WhatsApp Image 2025-08-21 at 5.12.44 PM.jpeg",
//                     "WhatsApp Image 2025-08-21 at 5.13.00 PM.jpeg",
//                     "WhatsApp Image 2025-08-21 at 5.13.26 PM.jpeg",
//                     "WhatsApp Image 2025-08-21 at 5.13.55 PM.jpeg",
//                   ].map((img, i) => (
//                     <div
//                       key={i}
//                       className="min-w-full snap-center flex-shrink-0 rounded-xl overflow-hidden"
//                     >
//                       <img
//                         src={`./${img}`}
//                         alt={`App Screenshot ${i + 1}`}
//                         className="w-full h-[500px] object-contain"
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Navigation buttons */}
//                 <div className="flex justify-center gap-2 mt-4">
//                   {Array(5)
//                     .fill(0)
//                     .map((_, i) => (
//                       <button
//                         key={i}
//                         onClick={() => {
//                           document
//                             .getElementById("screenshot-carousel")
//                             .scrollTo({
//                               left: i * window.innerWidth,
//                               behavior: "smooth",
//                             });
//                         }}
//                         className="w-3 h-3 rounded-full bg-gray-400 hover:bg-primary transition-all"
//                       ></button>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Features Section */}
//           <section id="features" className="py-20 bg-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="text-center mb-16">
//                 <h2 className="text-4xl font-bold text-foreground mb-4">
//                   Powerful Network Management Features
//                 </h2>
//                 <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                   Everything you need to monitor, manage, and optimize your
//                   fiber optic network infrastructure
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//                 {features.map((feature, index) => (
//                   <div
//                     key={index}
//                     onClick={() => navigate(feature.link)}
//                     className="cursor-pointer bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all transform hover:-translate-y-2 group"
//                   >
//                     <div
//                       className={`w-16 h-16 mb-6 flex items-center justify-center rounded-xl ${feature.bg}`}
//                     >
//                       {feature.icon}
//                     </div>
//                     <h3 className="text-xl font-bold text-foreground mb-3">
//                       {feature.title}
//                     </h3>
//                     <p className="text-muted-foreground mb-6">
//                       {feature.description}
//                     </p>
//                     <div className="flex items-center text-primary font-semibold group-hover:underline">
//                       <span>Go to {feature.title}</span>
//                       <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* Final CTA Section */}
//           <section className="py-20 bg-gradient-primary relative overflow-hidden">
//             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//               <div className="space-y-8">
//                 <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground">
//                   Start Mapping Your Network Today
//                 </h2>
//                 <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
//                   Join thousands of ISPs who have revolutionized their network
//                   management. Get started with your free trial and experience
//                   the future of fiber network monitoring.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md mx-auto">
//                   <a
//                     href="https://github.com/AmmuVijayan2001/fibronics/releases/download/v1.0.0/app-release.apk"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="w-full sm:w-auto"
//                   >
//                     <button className="w-full bg-white hover:bg-gray-50 text-primary px-10 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-xl whitespace-nowrap cursor-pointer">
//                       Download App
//                     </button>
//                   </a>

//                   <button
//                     className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl text-lg font-bold transition-all whitespace-nowrap cursor-pointer"
//                     onClick={handleDashboardClick}
//                   >
//                     Go to Dashboard
//                   </button>
//                 </div>

//                 {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/80">
//                   <div className="flex items-center gap-2">
//                     <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
//                     <span>14-day free trial</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
//                     <span>No setup fees</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
//                     <span>24/7 support</span>
//                   </div>
//                 </div> */}  
//               </div>
//             </div>
//           </section>
//         </div>
//         {/* Custom SaaS Footer */}
//         <footer className="bg-card text-muted-foreground py-16 border-t border-border">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid md:grid-cols-4 gap-8">
//               <div className="col-span-2 md:col-span-1">
//                 <div className="mb-4">
//                   {/* <span
//                     className="text-2xl font-bold"
//                     style={{ fontFamily: "var(--font-pacifico)" }}
//                   >
//                     Network Command Center
//                   </span> */}

//                   <div
//                     className="flex items-center gap-2 cursor-pointer"
//                     onClick={() => navigate("/")}
//                   >
//                     <img
//                       src="./Fiberonix Logo 23.png"
//                       alt="Fiberonix Logo"
//                       className="h-12 w-auto object-contain"
//                     />
//                   </div>
//                 </div>
//                 <p className="mb-6">
//                   The complete solution for fiber optic network mapping,
//                   monitoring, and management.
//                 </p>
//                 <div className="flex gap-4">
//                   <a href="#" className="hover:text-primary transition-colors">
//                     <i className="ri-twitter-fill w-6 h-6 flex items-center justify-center"></i>
//                   </a>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     <i className="ri-linkedin-fill w-6 h-6 flex items-center justify-center"></i>
//                   </a>
//                   <a href="#" className="hover:text-primary transition-colors">
//                     <i className="ri-github-fill w-6 h-6 flex items-center justify-center"></i>
//                   </a>
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-4">Product</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Features
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Pricing
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       API
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Integrations
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-4">Support</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Documentation
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Help Center
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Contact Us
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Status
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-4">Company</h4>
//                 <ul className="space-y-2">
//                   <li>
//                     <a
//                       href="https://zentryxglobal.com/about.html"
//                       className="hover:text-primary transition-colors"
//                     >
//                       About
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="https://zentryxglobal.com/career.html"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Career
//                     </a>
//                   </li>

//                   <li>
//                     <a
//                       href="https://zentryxglobal.com/blog.html"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Blog
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="https://zentryxglobal.com/contact.html"
//                       className="hover:text-primary transition-colors"
//                     >
//                       Contact Us
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             <div className="border-t border-border mt-12 pt-8 text-center">
//               <p>
//                 &copy; 2025 <span className="font-bold">Fiberonix</span>. All
//                 rights reserved.
//               </p>

//               <p>
//                 Designed & Developed By 
//                 <span className="font-bold">
//                   <a href="https://zentryxglobal.com/index.html">
//                   Zentryx Global Systems Pvt Ltd
//                   </a>
//                 </span>
//               </p>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </TopbarLayout>
//   );
// }




import { TopbarLayout } from "@/components/TopbarLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Router, Users, Share2, Server, ArrowRight, Activity, Shield, Zap, Map } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: "Device Tracking",
      description:
        "View and manage all network devices including routers, switches, ONUs, and monitor their live status in real-time.",
      icon: <Router />,
      link: "/devices",
      gradient: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/20"
    },
    {
      title: "Customer Tracking",
      description:
        "Track your customers along with their service plans, usage history, and support requests—all from a single, easy-to-use dashboard.",
      icon: <Users />,
      link: "/customers",
      gradient: "from-emerald-500 to-teal-400",
      shadow: "shadow-emerald-500/20"
    },
    {
      title: "Junction Tracking",
      description:
        "View and control all junction points, splitters, and fiber connections with clear visual mapping and hierarchy.",
      icon: <Share2 />,
      link: "/junctions",
      gradient: "from-orange-500 to-amber-400",
      shadow: "shadow-orange-500/20"
    },
    {
      title: "OLT Monitoring",
      description:
        "Monitor OLT devices, ports, and their performance metrics for proactive management and fault detection.",
      icon: <Server />,
      link: "/olt",
      gradient: "from-purple-500 to-pink-400",
      shadow: "shadow-purple-500/20"
    },
  ];

  const capabilityHighlights = [
    { icon: <Activity className="w-6 h-6" />, title: "Live Diagnostics", desc: "Instant visibility into network health and signal strength." },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Infrastructure", desc: "Enterprise-grade encryption for all management pathways." },
    { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", desc: "Optimized performance to handle massive node scaling seamlessly." },
    { icon: <Map className="w-6 h-6" />, title: "GIS Integration", desc: "Accurate geographical representations of fiber routes." }
  ];

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      toast.error("Please login to access the dashboard");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  };

  return (
    <TopbarLayout>
      <div className="-mt-16 min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary/30 ">
        
        {/* HERO SECTION (Dark Mode Aesthetic for Fiber Optic Vibe) */}
        <section className="relative pt-[100px] pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900 border-b border-white/10">
          {/* Animated Fiber lines background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Glowing Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/20 blur-[100px] mix-blend-screen animate-pulse duration-7000"></div>
            <div className="absolute top-[20%] left-[20%] w-[20vw] h-[20vw] rounded-full bg-blue-600/20 blur-[80px] mix-blend-screen animate-pulse duration-5000"></div>
            
            {/* Grid Pattern Overlay */}
            {/* <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5"></div> */}
            
            {/* Abstract animated lines */}
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent top-[20%] animate-[moveLeft_15s_linear_infinite] shadow-[0_0_10px_rgba(var(--primary),0.8)]"></div>
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent top-[50%] animate-[moveRight_20s_linear_infinite] shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent top-[80%] animate-[moveLeft_18s_linear_infinite] shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          </div>

          <div className="relative max-w-7xl mx-auto z-10 mt-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              
              {/* Left Content */}
              <div className="space-y-10 lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="text-sm font-medium text-blue-200">System Online - Platform v1.0.0</span>
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                    Master Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-emerald-400 animate-gradient-x drop-shadow-lg">
                      Fiber Network
                    </span>
                  </h1>
                  <p className="text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl font-light">
                    FiberOnix is a sophisticated optical distributed network mapping solution that has been developed and is managed by{" "}
                    <a href="https://zentryxglobal.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:text-primary-foreground hover:underline transition-all">
                      Zentryx Global Systems Pvt Ltd
                    </a>{" "}
                    . It allows for the precise tracking of devices, connections, couplers, splitters, OLTs, and ONTs. This application is accessible on both mobile and web platforms, and it includes an API for CRM integration. The app will provide you with the route and distance, which will allow you to figure out the optical fiber lengths for a new feasibility check.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <a
                    href="https://github.com/AmmuVijayan2001/fibronics/releases/download/v1.0.0/app-release.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button className="relative w-full overflow-hidden group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] hover:-translate-y-1">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <i className="ri-android-fill text-xl"></i>
                        Download App
                      </span>
                      <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                    </button>
                  </a>

                  <button
                    onClick={handleDashboardClick}
                    className="w-full sm:w-auto group relative border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:border-white/40 hover:-translate-y-1 shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Media (Floating Device / Dashboard showcase) */}
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-2xl p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-500 group">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-500 opacity-50"></div>
                  <img
                    src="/title-image.png"
                    alt="Network mapping visualization"
                    className="w-full h-auto rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover border border-white/5 relative z-20"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop';
                    }}
                  />
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 bg-emerald-500/90 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 animate-bounce delay-150 z-30">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-primary/90 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 animate-bounce z-30">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS / CAPABILITIES SECTION */}
        <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilityHighlights.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-4 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-slate-50 text-primary shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CORE FEATURES SECTION */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Powerful Network Management Features</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900">
                Everything you need
              </h3>
              <p className="text-lg text-slate-600">
                Everything you need to monitor, manage, and optimize your fiber optic network infrastructure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => navigate(feature.link)}
                  className="cursor-pointer group relative bg-white p-8 rounded-3xl border border-slate-100 hover:border-transparent transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
                  <div className={`absolute inset-0 rounded-3xl ring-1 ring-inset ring-slate-900/5 group-hover:ring-0 shadow-sm ${feature.shadow} group-hover:shadow-xl transition-all duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <div className="w-7 h-7 flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-sm font-bold text-primary group-hover:text-slate-900 transition-colors">
                      Explore Module
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APP SCREENSHOTS SECTION (Modernized) */}
        <section id="screenshots" className="py-24 bg-white border-t border-slate-100 overflow-hidden relative">
          <div className="absolute top-1/2 left-0 w-full h-[500px] bg-primary/5 -translate-y-1/2 skew-y-3"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">See Fiberonix in Action</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Explore how Fiberonix looks and works
            </h3>
            <p className="text-lg text-slate-600 mb-16 max-w-3xl mx-auto">
              Explore how Fiberonix looks and works with our clean, intuitive, and powerful interface.
            </p>

            {/* Screenshots container */}
            <div className="relative">
              {/* Desktop view */}
              <div className="hidden lg:flex justify-center items-center gap-6">
                {[
                  "WhatsApp Image 2025-08-21 at 5.11.49 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.12.44 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.13.00 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.13.26 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.13.55 PM.jpeg",
                ].map((img, i) => (
                  <div key={i} className={`relative rounded-[2.5rem] bg-slate-900 p-2 shadow-2xl transition-all duration-500 hover:scale-105 hover:z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black ${i % 2 !== 0 ? 'translate-y-8' : ''}`}>
                    <div className="absolute top-0 inset-x-0 h-6 bg-transparent rounded-t-[2.5rem] flex justify-center items-center z-20">
                      <div className="w-16 h-1 bg-slate-600/50 rounded-full mt-3"></div>
                    </div>
                    <div className="bg-white rounded-[2rem] overflow-hidden pt-4 h-[500px] w-[240px] relative">
                       <img
                          src={`./${img}`}
                          alt={`App Interface ${i + 1}`}
                          className="w-full h-full object-cover rounded-b-[2rem]"
                        />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className="lg:hidden relative">
                <div
                  id="screenshot-carousel"
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 py-8 px-4"
                >
                  {[
                    "WhatsApp Image 2025-08-21 at 5.11.49 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.12.44 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.13.00 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.13.26 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.13.55 PM.jpeg",
                  ].map((img, i) => (
                    <div key={i} className="min-w-[280px] snap-center flex-shrink-0">
                      <div className="relative rounded-[2.5rem] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black p-2 shadow-2xl mx-auto w-fit">
                         <div className="absolute top-0 inset-x-0 h-6 bg-transparent rounded-t-[2.5rem] flex justify-center items-center z-20">
                          <div className="w-16 h-1 bg-slate-600/50 rounded-full mt-3"></div>
                        </div>
                        <div className="bg-white rounded-[2rem] overflow-hidden min-h-[500px]">
                          <img
                            src={`./${img}`}
                            alt={`App Screenshot ${i + 1}`}
                            className="w-full h-[550px] object-cover pt-4 rounded-b-[2rem]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-24 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 pointer-events-none">
            {/* <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div> */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-primary/40 filter blur-[100px] rounded-[100%] pointer-events-none"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Start Mapping Your Network Today
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
              Join thousands of ISPs who have revolutionized their network management. Get started with your free trial and experience the future of fiber network monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
               <button 
                  onClick={handleDashboardClick}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-5 rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1"
                >
                  Enter Command Center
                </button>
               <a
                  href="https://github.com/AmmuVijayan2001/fibronics/releases/download/v1.0.0/app-release.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <button className="w-full border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white px-10 py-5 rounded-xl text-lg font-bold transition-all hover:border-slate-500">
                    Download Mobile App
                  </button>
                </a>
            </div>
          </div>
        </section>

        {/* MODERN FOOTER */}
        <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div onClick={() => navigate("/")} className="cursor-pointer inline-block">
                  <img
                    src="./Fiberonix Logo 23.png"
                    alt="Fiberonix Logo"
                    className="h-14 w-auto object-contain brightness-0 invert opacity-90 transition-opacity hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png'; // fallback
                    }}
                  />
                </div>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                  The ultimate spatial and logical mapping platform for advanced optical fiber infrastructure. 
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <i className="ri-twitter-x-line text-lg"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <i className="ri-linkedin-fill text-lg"></i>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <i className="ri-github-fill text-lg"></i>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6">Support</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact Team</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6">Company</h4>
                <ul className="space-y-3 text-sm">
                   <li><a href="https://zentryxglobal.com/about.html" className="hover:text-primary transition-colors">About Us</a></li>
                   <li><a href="https://zentryxglobal.com/career.html" className="hover:text-primary transition-colors">Careers</a></li>
                   <li><a href="https://zentryxglobal.com/blog.html" className="hover:text-primary transition-colors">Blog</a></li>
                   <li><a href="https://zentryxglobal.com/contact.html" className="hover:text-primary transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
              <p>&copy; {new Date().getFullYear()} Fiberonix. All rights reserved.</p>
              <p>
                Engineered by <a href="https://zentryxglobal.com/index.html" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">Zentryx Global Systems</a>
              </p>
            </div>
          </div>
        </footer>

      </div>
      
      {/* Global CSS injections for quick animations if tailwind config lacks them */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes moveLeft {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes moveRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </TopbarLayout>
  );
}
