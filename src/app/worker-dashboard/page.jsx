"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  ArrowRight,
  BadgeCheck,
  FilePen,
  MoveRight,
  FileDown,
  Download,
  Eye,
  IdCard,
  FileBadge,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "./api";
import Cookies from "react-cookies";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { useRouter } from 'next/navigation'

export default function Home() {
  const [step, setStep] = useState(0);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const name = Cookies.load("name");
  const user_type = Cookies.load("user_type");
  const aadhaar_no = Cookies.load("aadhaar_no");
  const address = Cookies.load("address");
  const gender = Cookies.load("gender");
  const dob = Cookies.load("dob");
  const authority_name = Cookies.load("authority_user_desigantion");
  const [user, setUser] = useState(null);
  const router = useRouter()

  useEffect(() => {
    try {
      setUser({
        type: user_type,
        name,
        pic: null,
        aadhaar_no,
        address,
        gender,
        dob,
        authority_name,
      });
    } catch (error) {
      setUser({});
    }
    setIsMounted(true);
  }, []);

  const cardData = [
    {
      title: "Register",
      subtitle: "Apply new GIG worker's application",
      value: "40",
      icon: FileText,
      color: "bg-[#51829B]",
      link: "/workers-registration-form",
      type: "pre-final-submit",
      step: [0],
    },
    {
      title: "Update Profile",
      subtitle: "Update existing GIG worker's profile",
      value: "40",
      icon: FilePen,
      color: "bg-[#DEAA79]",
      link: "/workers-registration-form",
      type: "pre-final-submit",
      step: [1, 2, 3, 4, 5],
    },
    {
      title: "Submit & Generate Registration Card",
      subtitle: "Complete the processs",
      value: "40",
      icon: BadgeCheck,
      color: "bg-[#A594F9]",
      link: "/gen-certificate",
      type: "pre-final-submit",
      step: [5],
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        Cookies.save("application_no", data?.data[0]?.application_no || "");
        setApplicationNo(data?.data[0]?.application_no || "");
        Cookies.save("aid", data?.data[0]?.application_id || 0);
        Cookies.save("is_application_aadhar_verified", data?.data[0]?.is_application_aadhar_verified || 0);
        Cookies.save("bank_details_visibility", data?.data[0]?.bank_details_visibility || 0);
        Cookies.save("personal_vehicle_visibility", data?.data[0]?.personal_vehicle_visibility || 0);
        setIsAadhaarVerified(data?.data[0]?.is_application_aadhar_verified || "");

        const formStep = data?.data[0]?.form_step || 0;
        Cookies.save("step", formStep);
        setStep(formStep);

        if (formStep === 0) {
          router.push('/workers-registration-form');
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center gap-2 px-4 py-6">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {cardData.map(
          (card, index) =>
            card.step.includes(step) && (
              <Card
                key={index}
                className={`w-full p-4 text-white shadow-lg rounded-xl transform transition-all hover:ring-2 hover:ring-white hover:shadow-2xl ${card.color}`}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold">{card.title}</p>
                    <card.icon size={30} className="opacity-70" />
                  </div>
                  <p className="text-xs mt-2 font-medium whitespace-pre-wrap">
                    {card?.subtitle}
                  </p>

                  <Link
                    href={card.link}
                    className="text-sm mt-4 flex gap-1 items-center w-auto hover:underline group"
                  >
                    Click here
                    <span className="text-white">
                      <MoveRight className="group-hover:animate-pulse" />
                    </span>
                  </Link>

                </CardContent>
              </Card>
            )
        )}
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-gray-900 dark:text-white font-medium">
      {value || "N/A"}
    </p>
  </div>
);