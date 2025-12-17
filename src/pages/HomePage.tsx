import { TopbarLayout } from "@/components/TopbarLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { Router, Users, Share2, Server, ArrowRight } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: "Device Tracking",
      description:
        "View and manage all network devices including routers, switches, ONUs, and monitor their live status in real-time.",
      icon: <Router className="text-primary w-10 h-10" />,
      link: "/devices",
      bg: "bg-primary/10",
    },
    {
      title: "Customer Tracking",
      description:
        "Track your customers along with their service plans, usage history, and support requests—all from a single, easy-to-use dashboard.",
      icon: <Users className="text-success w-10 h-10" />,
      link: "/customers",
      bg: "bg-success/10",
    },
    {
      title: "Junction Tracking",
      description:
        "View and control all junction points, splitters, and fiber connections with clear visual mapping and hierarchy.",
      icon: <Share2 className="text-warning w-10 h-10" />,
      link: "/junctions",
      bg: "bg-warning/10",
    },
    {
      title: "OLT Monitoring",
      description:
        "Monitor OLT devices, ports, and their performance metrics for proactive management and fault detection.",
      icon: <Server className="text-purple-600 w-10 h-10" />,
      link: "/olt",
      bg: "bg-purple-100",
    },
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
      <div className="min-h-screen bg-background flex flex-col">
        {/* Main SaaS Landing Content */}
        <div className="flex-1">
          {/* Hero Section */}
          <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
            {/* <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20fiber%20optic%20network%20visualization%20with%20glowing%20blue%20nodes%20and%20connections%2C%20dark%20tech%20background%20with%20geometric%20patterns%2C%20futuristic%20digital%20network%20infrastructure%2C%20clean%20minimalist%20style%20with%20blue%20and%20white%20color%20scheme&width=1920&height=1080&seq=hero-network-bg&orientation=landscape')`
              }}
            /> */}
            <div className="relative max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                      Visualize & Manage Your{" "}
                      <span className="text-primary">Fiber Network</span> in
                      Real-Time
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      FiberOnix is a sophisticated optical distributed network
                      mapping solution that has been developed and is managed by{" "}
                      <a href="https://rcubeventures.co.in/">
                        <span className="font-bold text-primary">
                          Rcube Ventures & Infrastructure Pvt Ltd
                        </span>
                      </a>{" "}
                      . It allows for the precise tracking of devices,
                      connections, couplers, splitters, OLTs, and ONTs. This
                      application is accessible on both mobile and web
                      platforms, and it includes an API for CRM integration. The
                      app will provide you with the route and distance, which
                      will allow you to figure out the optical fiber lengths for
                      a new feasibility check.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <a
                      href="https://github.com/AmmuVijayan2001/fibronics/releases/download/v1.0.0/app-release.apk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                        Download App
                      </button>
                    </a>

                    <button
                      className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
                      onClick={handleDashboardClick}
                    >
                      Go to Dashboard
                    </button>
                  </div>

                  {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-success w-5 h-5 flex items-center justify-center"></i>
                      <span>14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-check-line text-success w-5 h-5 flex items-center justify-center"></i>
                      <span>No credit card required</span>
                    </div>
                  </div> */}
                </div>
                <div className="relative">
                  <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-card/20">
                    <img
                      src="/title-image.png"
                      //  src="https://readdy.ai/api/search-image?query=Network%20topology%20diagram%20showing%20fiber%20optic%20connections%20with%20blue%20nodes%20and%20lines%2C%20professional%20technical%20illustration%2C%20clean%20modern%20design%20with%20interconnected%20devices%2C%20routers%20and%20fiber%20optic%20cables%2C%20blue%20and%20white%20color%20scheme%2C%20dashboard%20interface%20style&width=600&height=400&seq=network-illustration&orientation=landscape"
                      alt="Network mapping visualization"
                      className="w-full h-auto rounded-xl shadow-2xl object-top"
                    />
                  </div>
                  {/* Floating elements for visual appeal */}
                  <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                    <i className="ri-wifi-line w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-success text-white p-3 rounded-full shadow-lg">
                    <i className="ri-pulse-line w-6 h-6 flex items-center justify-center"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* App Screenshots Section */}
          <section id="screenshots" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                See Fiberonix in Action
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                Explore how Fiberonix looks and works with our clean, intuitive,
                and powerful interface.
              </p>

              {/* Desktop Grid */}
              <div className="hidden lg:grid grid-cols-5 gap-6">
                {[
                  "WhatsApp Image 2025-08-21 at 5.11.49 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.12.44 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.13.00 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.13.26 PM.jpeg",
                  "WhatsApp Image 2025-08-21 at 5.13.55 PM.jpeg",
                ].map((img, i) => (
                  <div key={i} className="rounded-xl shadow-lg overflow-hidden">
                    <img
                      src={`./${img}`}
                      alt={`App Screenshot ${i + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className="lg:hidden relative">
                <div
                  id="screenshot-carousel"
                  className="flex  overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 p-8"
                >
                  {[
                    "WhatsApp Image 2025-08-21 at 5.11.49 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.12.44 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.13.00 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.13.26 PM.jpeg",
                    "WhatsApp Image 2025-08-21 at 5.13.55 PM.jpeg",
                  ].map((img, i) => (
                    <div
                      key={i}
                      className="min-w-full snap-center flex-shrink-0 rounded-xl overflow-hidden"
                    >
                      <img
                        src={`./${img}`}
                        alt={`App Screenshot ${i + 1}`}
                        className="w-full h-[500px] object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-center gap-2 mt-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          document
                            .getElementById("screenshot-carousel")
                            .scrollTo({
                              left: i * window.innerWidth,
                              behavior: "smooth",
                            });
                        }}
                        className="w-3 h-3 rounded-full bg-gray-400 hover:bg-primary transition-all"
                      ></button>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Powerful Network Management Features
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Everything you need to monitor, manage, and optimize your
                  fiber optic network infrastructure
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(feature.link)}
                    className="cursor-pointer bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all transform hover:-translate-y-2 group"
                  >
                    <div
                      className={`w-16 h-16 mb-6 flex items-center justify-center rounded-xl ${feature.bg}`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary font-semibold group-hover:underline">
                      <span>Go to {feature.title}</span>
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 bg-gradient-primary relative overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground">
                  Start Mapping Your Network Today
                </h2>
                <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                  Join thousands of ISPs who have revolutionized their network
                  management. Get started with your free trial and experience
                  the future of fiber network monitoring.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md mx-auto">
                  <a
                    href="https://github.com/AmmuVijayan2001/fibronics/releases/download/v1.0.0/app-release.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button className="w-full bg-white hover:bg-gray-50 text-primary px-10 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-xl whitespace-nowrap cursor-pointer">
                      Download App
                    </button>
                  </a>

                  <button
                    className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl text-lg font-bold transition-all whitespace-nowrap cursor-pointer"
                    onClick={handleDashboardClick}
                  >
                    Go to Dashboard
                  </button>
                </div>

                {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/80">
                  <div className="flex items-center gap-2">
                    <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
                    <span>24/7 support</span>
                  </div>
                </div> */}  
              </div>
            </div>
          </section>
        </div>
        {/* Custom SaaS Footer */}
        <footer className="bg-card text-muted-foreground py-16 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <div className="mb-4">
                  {/* <span
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-pacifico)" }}
                  >
                    Network Command Center
                  </span> */}

                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    <img
                      src="./Fiberonix Logo 23.png"
                      alt="Fiberonix Logo"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </div>
                <p className="mb-6">
                  The complete solution for fiber optic network mapping,
                  monitoring, and management.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-primary transition-colors">
                    <i className="ri-twitter-fill w-6 h-6 flex items-center justify-center"></i>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <i className="ri-linkedin-fill w-6 h-6 flex items-center justify-center"></i>
                  </a>
                  <a href="#" className="hover:text-primary transition-colors">
                    <i className="ri-github-fill w-6 h-6 flex items-center justify-center"></i>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Integrations
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Status
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://rcubeventures.co.in/about.html"
                      className="hover:text-primary transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://rcubeventures.co.in/blog.html"
                      className="hover:text-primary transition-colors"
                    >
                      Blog
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://rcubeventures.co.in/services.html"
                      className="hover:text-primary transition-colors"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://rcubeventures.co.in/contact.html"
                      className="hover:text-primary transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-12 pt-8 text-center">
              <p>
                &copy; 2025 <span className="font-bold">Fiberonix</span>. All
                rights reserved.
              </p>

              <p>
                Designed & Developed By 
                <span className="font-bold">
                  <a href="https://rcubeventures.co.in/index.html">
                    Rcube Ventures & Infrastructure Pvt Ltd
                  </a>
                </span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TopbarLayout>
  );
}
