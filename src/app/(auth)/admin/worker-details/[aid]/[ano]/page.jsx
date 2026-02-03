"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Briefcase,
  CreditCard,
  Car,
  MapPin,
  GraduationCap,
  Users,
  Calendar,
  Building,
  Clock,
  FileText,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import {
  getGigWorkerBankInfoAPI,
  getGigWorkerBasicInfoAPI,
  getGigWorkerWorkRelatedInfoAPI,
  getGigWorkerVehicleInfoAPI
} from "@/app/workers-registration-form/api";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import ApplicationPreview from "@/components/application-preview";
const Page = ({ params }) => {
  const unwrappedParams = use(params);
  const { aid, ano } = unwrappedParams;
  const dec_aid = decodeURIComponent(aid);
  const dec_ano = decodeURIComponent(ano);
  const application_id = atob(dec_aid);
  const application_no = atob(dec_ano);

  const [applicationNo, setApplicationNo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationID, setApplicationID] = useState(null);

  useEffect(() => {
    if (application_id && application_no) {
      setApplicationNo(application_no);
      setApplicationID(application_id);
      setLoading(false);
    } else {
      setApplicationNo(null);
      setApplicationID(null);
      setLoading(true);
    }
  }
    , [application_no, application_id]);


  return (
    <div className="container">
      <div>
        <Image
          src={BackgroundImg}
          alt="Background Image"
          objectFit="cover"
          className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
        />
      </div>
      <div className="relative w-[80vw] mx-auto py-8 px-4 md:px-6">
      {loading ? "Loading..." : <ApplicationPreview applicationNo={applicationNo} applicationID={applicationID} />}
      </div>
    </div>
  );
};

export default Page;
