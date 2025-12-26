"use client";

import { NetworkLayout } from "@/components/NetworkLayout";
import "./Plans.css";
import { useEffect, useState } from "react";
import { Globe, Map, Route, Navigation, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { load } from "@cashfreepayments/cashfree-js";

declare global {
  interface Window {}
}

const plans = [
  {
    id: 1,
    icon: Globe,
    name: "Free",
    description: "Single user",
    price: 0,
    period: "year",
    features: [
      "Single user",
      "50 km",
      "Demo videos",
    ],
    theme: "plan-green",
  },
  {
    id: 2,
    icon: Zap,
    name: "Plan Starter",
    description: "500 km",
    price: 12000,
    period: "year",
    features: [
      "Single user – App / Web",
      "1 session / user",
      "500 km",
      "Standard support",
      "Add-on: ₹3,000 / year – additional user",
    ],
    theme: "plan-blue",
  },
  {
    id: 3,
    icon: Map,
    name: "Plan Standard",
    description: "1,000 km",
    price: 18000,
    period: "year",
    features: [
      "2 users",
      "2 sessions total (1 app, 1 web)",
      "1,000 km",
      "Standard support",
      "Add-on: ₹4,000 / year – additional users",
    ],
    theme: "plan-orange",
  },
  {
    id: 4,
    icon: Route,
    name: "Plan Pro",
    description: "2,000 km",
    price: 24000,
    period: "year",
    features: [
      "2 users",
      "2 sessions / user (1 app, 1 web)",
      "2,000 km",
      "Standard support",
      "Add-on: ₹4,000 / user – additional user",
    ],
    theme: "plan-red",
  },
  {
    id: 5,
    icon: Navigation,
    name: "Plan Enterprise",
    description: "Up to 10,000 km",
    price: 48000,
    period: "year",
    features: [
      "Unlimited users",
      "2 sessions / user (1 app, 1 web)",
      "Up to 10,000 km",
      "Standard support",
      "Add-on: ₹4,000 / user – additional user",
    ],
    theme: "plan-purple",
  },
];

export default function Plans() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

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
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col justify-between p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 ${plan.theme}`}
            >
              <div className="icon-box flex justify-center items-center w-10 h-10 rounded-lg mb-4">
                <plan.icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="text-2xl font-bold">
                ₹{plan.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-500">
                  {" "}
                  / {plan.period}
                </span>
              </div>

              <ul className="mt-4 space-y-1 text-sm text-gray-700">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={loading || currentPlan === plan.name}
                onClick={() => handleSelectPlan(plan.price, plan.name)}
                className={`select-btn mt-6 w-full py-2 rounded-lg ${
                  currentPlan === plan.name
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {currentPlan === plan.name ? "Current Plan" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </NetworkLayout>
  );
}
