import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

const planFeatures = [
  {
    type: "Financial data",
    features: [
      {
        name: "Open/High/Low/Close",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Price-volume difference indicator	",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
    ],
  },
  {
    type: "On-chain data",
    features: [
      {
        name: "Network growth",
        free: true,
        startup: false,
        team: true,
        enterprise: true,
      },
      {
        name: "Average token age consumed",
        free: true,
        startup: false,
        team: true,
        enterprise: true,
      },
      {
        name: "Exchange flow",
        free: false,
        startup: false,
        team: true,
        enterprise: true,
      },
      {
        name: "Total ERC20 exchange funds flow",
        free: false,
        startup: false,
        team: true,
        enterprise: true,
      },
    ],
  },
  {
    type: "Social data",
    features: [
      {
        name: "Dev activity",
        free: false,
        startup: true,
        team: false,
        enterprise: true,
      },
      {
        name: "Topic search",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Relative social dominance",
        free: true,
        startup: true,
        team: false,
        enterprise: true,
      },
    ],
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PricingSectionCards() {
  const [proActive, setProActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProActive(res.data.isPro === true);
        localStorage.setItem("isPro", res.data.isPro ? "true" : "false");
      } catch (err) {
        setProActive(false);
        localStorage.setItem("isPro", "false");
      }
    };
    fetchProStatus();
  }, []);

  const handleSubscribe = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!accessToken || !userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    // 1. Create order
    let orderRes;
    try {
      orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { userId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (err) {
      setLoading(false);
      alert("Failed to create order. Please try again.");
      return;
    }
    const { orderId, amount, currency } = orderRes.data;
    // 2. Load Razorpay script
    const ok = await loadRazorpayScript();
    if (!ok) {
      setLoading(false);
      alert("Failed to load Razorpay. Please try again.");
      return;
    }
    // 3. Open Razorpay modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "Password Manager Pro Subscription",
      description: "Pro Plan (Monthly)",
      order_id: orderId,
      handler: async function (response) {
        // 4. Verify payment
        try {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          if (verifyRes.data.success) {
            setProActive(true);
            localStorage.setItem("isPro", "true");
            alert("Pro subscription activated!");
          } else {
            alert("Payment verification failed.");
          }
        } catch (err) {
          alert("Payment verification failed.");
        }
        setLoading(false);
      },
      prefill: {
        email: localStorage.getItem("userEmail") || "",
      },
      theme: { color: "#7c3aed" },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      {/* Pricing */}
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-24 lg:py-32">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Pricing
          </h2>
          <p className="mt-1 text-muted-foreground">
            Choose the plan that fits your needs.
          </p>
        </div>
        {/* End Title */}
        {/* Switch (hidden for now) */}
        {/* Grid */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6 lg:items-center">
          {/* Free Card */}
          <Card className="flex flex-col">
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-7">Free</CardTitle>
              <span className="font-bold text-5xl">Free</span>
            </CardHeader>
            <CardDescription className="text-center">
              Forever free
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">1 user</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">
                    Max 10 passwords
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Basic features</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={"outline"} disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
          {/* Pro Card */}
          <Card className="border-primary flex flex-col relative">
            <CardHeader className="text-center pb-2">
              <Badge className="uppercase w-max self-center mb-3 bg-primary text-primary-foreground">
                Most popular
              </Badge>
              <CardTitle className="!mb-7">Pro</CardTitle>
              <span className="font-bold text-5xl">₹399</span>
              <span className="block text-sm text-muted-foreground mt-1">
                per month
              </span>
            </CardHeader>
            <CardDescription className="text-center w-11/12 mx-auto">
              Unlimited passwords & premium features
            </CardDescription>
            <CardContent className="flex-1">
              <ul className="mt-7 space-y-2.5 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">1 user</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">
                    Unlimited passwords
                  </span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">
                    Premium features (sharing, support)
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleSubscribe}
                disabled={proActive || loading}>
                {proActive
                  ? "Pro Active"
                  : loading
                  ? "Processing..."
                  : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* End Grid */}
        {/* Comparison table */}
        <div className="mt-20 lg:mt-32">
          <div className="lg:text-center mb-10 lg:mb-20">
            <h3 className="text-2xl font-semibold">Compare plans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-muted hover:bg-muted">
                  <th className="w-4/12 text-primary p-3">Feature</th>
                  <th className="w-4/12 text-primary text-lg font-medium text-center p-3">
                    Free
                  </th>
                  <th className="w-4/12 text-primary text-lg font-medium text-center p-3">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-muted/50">
                  <td className="font-bold p-3">Max passwords</td>
                  <td className="text-center p-3">10</td>
                  <td className="text-center p-3">Unlimited</td>
                </tr>
                <tr>
                  <td className="font-bold p-3">Users</td>
                  <td className="text-center p-3">1</td>
                  <td className="text-center p-3">1</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="font-bold p-3">Password sharing</td>
                  <td className="text-center p-3">—</td>
                  <td className="text-center p-3">✔️</td>
                </tr>
                <tr>
                  <td className="font-bold p-3">Priority support</td>
                  <td className="text-center p-3">—</td>
                  <td className="text-center p-3">✔️</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="font-bold p-3">2FA Security</td>
                  <td className="text-center p-3">✔️</td>
                  <td className="text-center p-3">✔️</td>
                </tr>
                <tr>
                  <td className="font-bold p-3">Export/Import</td>
                  <td className="text-center p-3">✔️</td>
                  <td className="text-center p-3">✔️</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="font-bold p-3">Dark mode</td>
                  <td className="text-center p-3">✔️</td>
                  <td className="text-center p-3">✔️</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* End Comparison table */}
      </div>
      {/* End Pricing */}
    </>
  );
}
