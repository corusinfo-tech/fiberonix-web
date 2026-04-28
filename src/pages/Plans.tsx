"use client";

import { NetworkLayout } from "@/components/NetworkLayout";
import "./Plans.css";
import { useEffect, useState } from "react";
import { Globe, Map, Route, Navigation, Zap, Database } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { load } from "@cashfreepayments/cashfree-js";

declare global {
  interface Window {}
}

const ICONS = [Globe, Zap, Map, Route, Navigation];
const THEMES = ["plan-green", "plan-blue", "plan-orange", "plan-red", "plan-purple"];

interface ApiPlan {
  id: number;
  name: string;
  price: string;
  duration_days: number;
  max_users: number;
  max_customers: number;
  max_devices: number;
  max_junctions: number;
  max_km: number;
}

const crmPlan = {
  id: 6,
  icon: Database,
  name: "Plan – CRM Integration",
  description: "₹9,999 (One-Time Charge)",
  price: 9999,
  period: "one-time",
  features: [
    "One-time CRM integration",
    "Basic data sync",
    "Secure API connection",
    "App & Web supported",
    "Standard integration support",
  ],
  theme: "plan-teal",
};

export default function Plans() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [apiPlans, setApiPlans] = useState<ApiPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = typeof token === "string" && token.startsWith("Bearer") ? token : `Bearer ${token}`;
        }
        
        const res = await fetch("https://backend.fiberonix.in/api/payment/plans/", {
          headers,
        });
        
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data = await res.json();
        setApiPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, [token]);

  const mappedPlans = apiPlans.map((plan, index) => {
    const Icon = ICONS[index % ICONS.length];
    const theme = THEMES[index % THEMES.length];
    return {
      id: plan.id,
      icon: Icon,
      name: plan.name,
      description: `Up to ${plan.max_km} km`,
      price: parseFloat(plan.price),
      period: plan.duration_days === 365 ? "year" : plan.duration_days === 30 ? "month" : `${plan.duration_days} days`,
      features: [
        `${plan.max_users} user${plan.max_users !== 1 ? "s" : ""}`,
        `${plan.max_km} km route length`,
        `${plan.max_customers} customers`,
        `${plan.max_devices} devices`,
        `${plan.max_junctions} junctions`,
      ],
      theme: theme,
    };
  });

  // Load Cashfree SDK once
  useEffect(() => {
    async function initializeSDK() {
      const cf = await load({ mode: "sandbox" });
      setCashfree(cf);
    }
    initializeSDK();
  }, []);

  const handleSelectPlan = async (price: number, planName: string) => {
    // ✅ FREE PLAN HANDLING (ONLY CHANGE)
    if (price === 0) {
      try {
        setLoading(true);

        await fetch(
          "https://backend.fiberonix.in/api/plans/activate-free/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan: planName }),
          }
        );

        alert("🎉 Free plan activated successfully!");
        setCurrentPlan(planName);
        return;
      } catch {
        alert("Failed to activate free plan");
        return;
      } finally {
        setLoading(false);
      }
    }

    // 🔒 PAID PLAN FLOW (UNCHANGED)
    if (!cashfree) return;
    setLoading(true);

    try {
      const res = await fetch(
        "https://backend.fiberonix.in/api/payment/initiate/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({ phone: "1234567890", amount: price }),
        }
      );

      const data = await res.json();
      console.log("Backend response:", data);

      if (data.payment_session_id) {
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal",
        });
      } else {
        alert("Payment initialization failed. Try again.");
      }
    } catch (err) {
      alert("Payment initiation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NetworkLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {loadingPlans ? (
            <div className="col-span-full py-10 flex justify-center text-gray-500">
              Loading plans...
            </div>
          ) : mappedPlans.length > 0 ? (
            mappedPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`flex flex-col h-full p-6 rounded-2xl border ${
                  plan.name.toLowerCase().includes("enterprise") || index === mappedPlans.length - 1
                    ? "border-purple-500 border-2 shadow-2xl relative z-10"
                    : "border-gray-200 shadow-md hover:shadow-lg"
                } transition-all duration-300 ${plan.theme}`}
              >
                <div className="icon-box flex justify-center items-center w-10 h-10 rounded-lg mb-4">
                  <plan.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold min-h-[3.5rem] flex items-center">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4 min-h-[2.5rem]">{plan.description}</p>

                <div className="text-2xl font-bold">
                  ₹{plan.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / {plan.period}
                  </span>
                </div>

                <ul className="mt-4 space-y-1 text-sm text-gray-700">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={loading || currentPlan === plan.name}
                  onClick={() => handleSelectPlan(plan.price, plan.name)}
                  className={`select-btn mt-auto w-full py-2 rounded-lg ${
                    currentPlan === plan.name
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {currentPlan === plan.name ? "Current Plan" : "Select Plan"}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 flex justify-center text-gray-500">
              No plans available.
            </div>
          )}
        </div>

        {/* CRM Integration Plan - Horizontal Card */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 ${crmPlan.theme}`}
        >
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="icon-box flex justify-center items-center w-16 h-16 rounded-lg flex-shrink-0">
              <crmPlan.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">{crmPlan.name}</h3>
              <p className="text-gray-500 mt-1">{crmPlan.description}</p>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mb-6 md:mb-0">
            {crmPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✔</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="text-3xl font-bold whitespace-nowrap">
            ₹{crmPlan.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 block text-right">
              One-time
            </span>
          </div>
        </div>
      </div>
    </NetworkLayout>
  );
}
