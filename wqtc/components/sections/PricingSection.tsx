"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "FREE",
    price: "$0",
    period: "month",
    features: [
      "Access to beginner courses",
      "Community support",
      "Basic learning resources",
      "Mobile app access",
      "Monthly live Q&A",
    ],
    gradient: "from-gray-50 to-gray-100",
    buttonColor: "bg-gradient-to-r from-gray-700 to-gray-800",
    popular: false,
  },
  {
    name: "BASIC",
    price: "$29",
    period: "month",
    features: [
      "Everything in Free",
      "Advanced courses",
      "Priority support",
      "Downloadable resources",
      "Weekly live sessions",
      "Certificate of completion",
    ],
    gradient: "from-blue-50 to-cyan-50",
    buttonColor: "bg-gradient-to-r from-blue-600 to-cyan-600",
    popular: true,
  },
  {
    name: "PRO",
    price: "$59",
    period: "month",
    features: [
      "Everything in Basic",
      "1-on-1 mentorship",
      "Custom learning path",
      "Unlimited resources",
      "Daily live classes",
      "Lifetime access",
      "Premium certificate",
    ],
    gradient: "from-purple-50 to-pink-50",
    buttonColor: "bg-gradient-to-r from-purple-600 to-pink-600",
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Curved Wave Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="#6366f1" fill="none" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave)" />
        </svg>
      </div>

      {/* Gradient Blobs */}
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700">Pricing Plans</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose The Best Package<br />
            For your Learning
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <Card className={`relative overflow-hidden border-0 shadow-xl h-full bg-gradient-to-br ${plan.gradient} backdrop-blur-sm ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-slate-600 mb-2">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.buttonColor} hover:opacity-90 text-white shadow-lg`}
                    size="lg"
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
