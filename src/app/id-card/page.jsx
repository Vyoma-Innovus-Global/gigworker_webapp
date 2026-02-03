"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User, FileSignature, QrCode, Download, Printer, ImageDown, FileText, Loader2, Phone } from "lucide-react";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import qr_img from "@/assets/qr.png";
import applicant_img from "@/assets/gig_user.jpg";
import BiswaBangla from "@/assets/biswa_bangla.png";
import signature from "@/assets/Big-Signature.webp";
import { Button } from "@/components/ui/button";
import { getGigWorkerIDCardDetailsApi } from "./api";
import { Skeleton } from "@/components/ui/skeleton";
import QRCode from 'react-qr-code';
import moment from "moment";

const IDCardPage = () => {
  const cardRef = useRef();
  const [workerDetails, setWorkerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingPNG, setLoadingPNG] = useState(false);


  const handleExportPNG = async () => {
    try {
      setLoadingPNG(true);
      if (!cardRef.current) {
        throw new Error("Card reference is not available.");
      }
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        skipFonts: true, // <--- add this
        skipAutoScale: true,
      });

      if (!dataUrl) {
        throw new Error("Failed to generate PNG data URL.");
      }

      const link = document.createElement("a");
      link.download = "gig_worker_id.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error.message || error);
      alert("An error occurred while exporting the PNG. Please try again.");
    } finally {
      setLoadingPNG(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoadingPDF(true);
      if (cardRef.current) {
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          backgroundColor: "#ffffff",
          skipFonts: true, // <--- add this
          skipAutoScale: true,
        });
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("gig_worker_id.pdf");
      }
    }
    catch (error) {
      console.error("Failed to export PDF:", error.message || error);
      alert("An error occurred while exporting the PDF. Please try again.");
    } finally {
      setLoadingPDF(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getGigWorkerIDCardDetailsApi();

      // Get the Aadhaar photo from localStorage first
      const aadhaarPhoto = localStorage.getItem("aadhaar_photo");

      // Use Aadhaar photo if available, otherwise fall back to pic
      const photoToUse = aadhaarPhoto || localStorage.getItem("pic");

      setWorkerDetails({
        ...response?.data,
        photo_file_url: photoToUse ? `data:image/png;base64,${photoToUse}` : null
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-10">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        fill
        className="object-cover absolute opacity-5 inset-0 mt-[3rem] -z-2"
      />
      <div className="p-6 w-full flex flex-col items-center justify-center mx-auto relative z-10">
        {/* Buttons */}
        <div className="mb-4 flex gap-4">
          <Button
            variant="outline"
            onClick={handleExportPNG}
            className="spx-4 py-2 rounded-md flex items-center gap-2"
            disabled={loadingPNG}
          >
            {loadingPNG ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</> : <><ImageDown className="w-4 h-4" /> Download as Image</>}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-md flex items-center gap-2"
            disabled={loadingPDF}
          >
            {loadingPDF ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading...</> : <><FileText className="w-4 h-4" /> Download as PDF</>}
          </Button>
        </div>

        {/* ID Card */}
        {loading ? (
          <>
            <div className="relative border-2 border-violet-500/20 rounded-lg shadow-md p-4 w-[500px] h-[250px] bg-gradient-to-r from-blue-100 to-violet-200">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-16 h-16 rounded" />
              </div>
              <div className="flex items-center mb-2">
                <Skeleton className="w-20 h-20 rounded" />
                <div className="ml-4 flex-1">
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-3/4 h-4 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div></div>
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
            <div className="relative border-2 border-violet-500/20 rounded-lg shadow-md p-4 mt-4 w-[500px] h-[250px] bg-gradient-to-r from-blue-100 to-violet-200">
              <div className="flex justify-center items-center mb-2">
                <Skeleton className="w-full mx-4 h-28" />
              </div>
              <div className="flex gap-2 flex-col items-start mt-10">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-72 h-4" />
              </div>
            </div>
          </>
        ) : (
          <div
            ref={cardRef}
            id="generate-png"
          >
            {/* Front */}
            <div
              className="relative border-2 border-violet-500/20 rounded-lg shadow-md p-4 w-[500px] h-[250px] bg-gradient-to-r from-blue-100 to-violet-200"
            >
              <div className="flex justify-between items-center mb-2 relative z-10">
                <Image
                  src={BiswaBangla}
                  alt="BiswaBangla Logo"
                  width={60}
                  height={60}
                  className="rounded bg-transparent"
                />
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs flex text-center font-bold text-violet-800 leading-tight">Government of West Bengal</span>
                  <span className="text-lg flex text-center font-bold text-violet-800 leading-tight">Department of Labour</span>
                  <span className="text-lg flex text-center font-bold text-violet-800 leading-tight">GIG Worker Registration Card</span>
                </div>
                {
                  // workerDetails?.base64_qr_code ? (
                  //   <Image width={60}
                  //     height={60} alt="qr" src={`data:image/svg+xml;base64,${workerDetails?.base64_qr_code}`} />
                  // ) 
                  workerDetails?.application_qr_image ? (
                    <QRCode size={56} value={workerDetails?.application_qr_image} />
                  )
                    : (
                      <QrCode className="w-12 h-12 text-gray-400" />
                    )}
              </div>
              <div className="flex items-center mb-2 relative z-10">
                {workerDetails?.photo_file_url ? (
                  <Image
                    src={workerDetails?.photo_file_url}
                    alt="Photo"
                    width={100}
                    height={100}
                    className="w-[80px] h-[80px] rounded-sm border bg-gray-50 shadow-sm ring-2 ring-violet-400 object-fit"
                  />
                ) : (
                  <User className="w-24 h-24 text-gray-400 border rounded-full" />
                )}
                <div className="ml-4">
                  <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {workerDetails?.user_full_name || "Not Available"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Registration No:</strong>{" "}
                    {workerDetails?.application_number || "Not Available"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Mobile No.:</strong> {workerDetails?.mobile_number || "Not Available"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Blood Group:</strong> {workerDetails?.blood_group || "Not Available"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Address:</strong>{" "}
                    <span className="text-xs">{workerDetails?.address || "Not Available"}</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-end relative z-10">
                <div>

                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Date of Issue</p>
                  <p className="text-sm font-semibold  text-gray-600">
                    {moment(workerDetails?.application_verified_on).format("DD/MM/YYYY") || "Not Available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="relative border-2 border-violet-500/20 rounded-lg shadow-md p-4 mt-2 w-[500px] h-[250px] bg-gradient-to-r from-blue-100 to-violet-200"
            >
              <span className="text-lg flex mx-auto text-center justify-center mb-2 font-bold text-violet-800 leading-tight">GIG Worker Registration Card</span>
              <div className="bg-white/10 rounded-lg border border-slate-400/70">
                <h3 className="text-center mb-5 flex mx-auto justify-center gap-2 rounded-t-lg text-slate-500 uppercase bg-slate-50/50 w-auto"><Phone className="text-violet-500" />Emergency Contact Details</h3>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  {/* Primary Emergency Contact No. */}

                  <div className="mx-4">
                    <p className="text-sm text-gray-700">
                      <strong>Primary Contact Person</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Name:</strong> {workerDetails?.emergency_person_contact_one_name || "Not Available"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Mobile No.:</strong> {workerDetails?.emergency_person_contact_one || "Not Available"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Relation:</strong>{" "}
                      {workerDetails?.emergency_person_contact_one_relation || "Not Available"}
                    </p>
                  </div>

                  {/* Secondary Emergency Contact No. */}
                  <div className="mx-4">
                    <p className="text-sm text-gray-700">
                      <strong>Secondary Contact Person</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Name:</strong> {workerDetails?.emergency_person_contact_two_name || "Not Available"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Mobile No.:</strong> {workerDetails?.emergency_person_contact_two || "Not Available"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Relation:</strong>{" "}
                      {workerDetails?.emergency_person_contact_two_relation || "Not Available"}
                    </p>
                  </div>
                </div>
              </div>

              <span className="absolute bottom-2 left-2 text-md text-gray-500 leading-tight text-center">This is a system generated card based on information provided by the applicant and subject to verification.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCardPage;
