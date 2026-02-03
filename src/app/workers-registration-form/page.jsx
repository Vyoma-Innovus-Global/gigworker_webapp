"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Cookies from "react-cookies";
import { useToast } from "@/hooks/use-toast";
import Stepper from "@/components/Stepper";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { useRouter } from "next/navigation";
import {
  saveGigWorkerBasicInfoAPI,
  saveGigWorkerVehicleInfoAPI,
  saveGigWorkerOtherInfoAPI,
  saveGigWorkRelatedInfoAPI,
  saveGigBankDetailsAPI,
  getGigWorkerBasicInfoAPI,
  getGigWorkerVehicleInfoAPI, // Import the API here
  getGigWorkerOtherInfoAPI,
  getGigWorkerWorkRelatedInfoAPI,
  getGigWorkerBankInfoAPI,
  uploadGigWorkerFiles,
  getGigWorkerDocumentsAPI,
} from "./api.js";

import {
  AlertCircle,
  ArrowLeftCircle,
  ArrowRightCircle,
  BadgeCheck,
  CheckCircle2,
  CircleCheckBig,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
const BasicContactDetailsSection = dynamic(
  () => import("./BasicContactDetailsSection"),
  { ssr: false }
);
import VehicleDetails from "./VehicleDetails";
import OtherDetailsSection from "./OtherDetailsSection";
import WorkRelatedForm from "./workRelatedInfo";
import BankDetailsForm from "./BankDetails";
import UploadDocuments from "./UploadDocuments";
import Link from "next/link.js";
import ApplicationPreview from "@/components/application-preview.jsx";

export default function WorkersRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false); // Track client-side rendering
  const [isApplicationModified, setIsApplicationModified] = useState(false); // Track client-side rendering
  const [initialVehicles, setInitialVehicles] = useState([]); // New state: initialVehicles holds the original API data.
  const is_aadhaar_verified = Cookies.load("is_application_aadhar_verified");
  const aid = Cookies.load("aid");
  const is_application_modified_after_udin_generation = Cookies.load("is_application_modified_after_udin_generation");
  const [step, setStep] = useState(0);
  const [openDisclaimerDialog, setOpenDisclaimerDialog] = useState(false);
  const [applicationNo, setApplicationNo] = useState(0);

  const bank_details_visibility = Cookies.load("bank_details_visibility");
  const [checked, setChecked] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);


  useEffect(() => {
    if (is_aadhaar_verified) {
      setIsAadhaarVerified(true);
    } else {
      setIsAadhaarVerified(false);
    }
    if (is_application_modified_after_udin_generation) {
      setIsApplicationModified(true);
    } else {
      setIsApplicationModified(false);
    }
  }, [is_aadhaar_verified, is_application_modified_after_udin_generation]);
  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    application_id: Cookies.load("aid") || 0,
    entry_user_id: Cookies.load("uid"),
    gig_worker_name: "",
    gender_id: 0,
    date_of_birth: "",
    father_or_husband_name: "",
    permanent_address: "",
    aadhaar_address: "",
    current_address: "",
    district_id: 0,
    subdivision_id: 0,
    is_urban: 0,
    block_id: 0,
    gram_panchayat_id: 0,
    corporation_municipality_id: 0,
    ward_no: "",
    pincode: "",
    address_other_details: "",
    district: null,
    subDivision: null,
    block: null,
    municipality: null,
    gramPanchayat: null,
    locationType: null,
    permDistrict: null,
    permSubDivision: null,
    permBlock: null,
    permMunicipality: null,
    permGramPanchayat: null,
    permLocationType: null,
    blood_group_id: "N/A",
    perm_district_id: 0,
    perm_subdivision_id: 0,
    perm_is_urban: 0,
    perm_block_municipality_corp_id: 0,
    perm_gp_ward_id: 0,
    perm_corporation_municipality_id: 0,
    perm_ward_no: 0,
    perm_pincode: 0,
    pan_card: "",
    marital_status: 0
  });

  // Step 2: Vehicle Info
  const [vehicleInfo, setVehicleInfo] = useState({
    arr_vehicle_details: [],
  });

  // Step 3: Other Info
  const [otherInfo, setOtherInfo] = useState({
    social_security_scheme_type_id: 0,
    nominee_name: "",
    relationship_with_nominee_id: 0,
    nominee_aadhar_no: "",
    nominee_date_of_birth: "",
    arr_written_lang: [],
    arr_spoken_lang: [],
    educational_qualification: "",
    grade_id: "",
    nominee_contact_no: "",
  });

  // Step 4: Work Related Info
  const [workRelatedInfo, setWorkRelatedInfo] = useState({
    occupation: null,
    nature_of_industry: null,
    organization: null,
    gig_experience: null,
    is_currently_working: null,
    arr_occupation_info: [],
  });

  // Step 5: Bank Details
  const [bankDetails, setBankDetails] = useState({
    self_bank_id: null,
    self_bank_branch: "",
    self_bank_ifsc_code: "",
    self_bank_acc_no: "",
    nominee_bank_id: null,
    nominee_bank_branch: "",
    nominee_bank_ifsc_code: "",
    nominee_bank_acc_no: "",
  });

  // Step 6: Documents
  const [documents, setDocuments] = useState({
    photo_file: "",
    signature_file: "",
    pan_card_file: "",
    driving_license_file: "",
    bank_passbook_file: "",
    aadhaar_file: ""
  });

  const { toast } = useToast();
  const userID = Cookies.load("uid");
  const applicationId = Cookies.load("aid");
  const router = useRouter();

  // Mark as client-side after mount
  useEffect(() => {
    const aid = Cookies.load("application_no");
    setApplicationNo(aid);
    setIsClient(true);
  }, []);

  // Update currentStep from cookies only on client-side after mount
  useEffect(() => {
    if (isClient) {
      const step = Cookies.load("step");
      const cookieNumber = Number(step);
      if (cookieNumber > 0 && cookieNumber != 5) {
        setCurrentStep(cookieNumber + 1);
      } else {
        setCurrentStep(1);
      }
    }
  }, [isClient]);

  // Helper: Format date as YYYY-MM-DD
  const formatDate = (dateStrOrObj) => {
    if (typeof dateStrOrObj === "string") return dateStrOrObj;
    if (dateStrOrObj instanceof Date && !isNaN(dateStrOrObj)) {
      const y = dateStrOrObj.getFullYear();
      const m = String(dateStrOrObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateStrOrObj.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return "";
  };

  const handleSubmitStep1 = async () => {

    // Check for mandatory fields
    const mandatoryFields = {
      gig_worker_name: basicInfo?.gig_worker_name,
      gender: basicInfo?.gender_id,
      date_of_birth: formatDate(basicInfo?.date_of_birth),
      father_or_husband_name: basicInfo?.father_or_husband_name,
      // permanent_address: basicInfo?.permanent_address,
      permanent_address_district: basicInfo?.perm_district_id,
      permanent_address_subdivision: basicInfo?.perm_subdivision_id,
      permanent_address_block_or_municipality_or_corporation: basicInfo?.perm_block_municipality_corp_id,
      permanent_address_gram_panchayat_or_ward: basicInfo?.perm_gp_ward_id,
      permanent_address_pin_code: basicInfo?.perm_pincode,
      emergency_person_contact_one: basicInfo?.emergency_person_contact_one,
      emergency_person_contact_one_name: basicInfo?.emergency_person_contact_one_name,
      emergency_person_contact_one_relation: basicInfo?.emergency_person_contact_one_relation,
      emergency_person_contact_two: basicInfo?.emergency_person_contact_two,
      emergency_person_contact_two_name: basicInfo?.emergency_person_contact_two_name,
      emergency_person_contact_two_relation: basicInfo?.emergency_person_contact_two_relation
    };

    // Loop and show the first missing field
    for (const [key, value] of Object.entries(mandatoryFields)) {
      if (!value) {
        const fieldName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{fieldName} is required!</span>
            </div>
          ),
        });
        return;
      }
    }


    const requestBody = {
      application_id: Number(basicInfo?.application_id) || 0,
      gig_worker_name: basicInfo?.gig_worker_name,
      gender_id: basicInfo?.gender_id,
      date_of_birth: formatDate(basicInfo?.date_of_birth),
      father_or_husband_name: basicInfo?.father_or_husband_name,
      permanent_address: basicInfo?.permanent_address,
      current_address: basicInfo?.current_address,
      district_id: basicInfo?.district_id,
      subdivision_id: basicInfo?.subdivision_id,
      is_urban: basicInfo?.locationType == "municipality" ? 1 : 0,
      block_id: basicInfo?.block_id,
      gram_panchayat_id: basicInfo?.gram_panchayat_id,
      corporation_municipality_id: basicInfo?.corporation_municipality_id,
      ward_no: basicInfo?.ward_no,
      pincode: basicInfo?.pincode,
      address_other_details: basicInfo?.address_other_details,
      blood_group_id: basicInfo?.blood_group_id,
      form_step: 1,
      entry_user_id: Number(userID),
      perm_district_id: basicInfo?.perm_district_id,
      perm_subdivision_id: basicInfo?.perm_subdivision_id,
      perm_block_municipality_corp_id: basicInfo?.perm_block_municipality_corp_id,
      perm_gp_ward_id: basicInfo?.perm_gp_ward_id,
      perm_pincode: basicInfo?.perm_pincode,
      pan_card: basicInfo?.pan_card,
      marital_status: basicInfo?.marital_status,
      emergency_person_contact_one: basicInfo?.emergency_person_contact_one,
      emergency_person_contact_one_name: basicInfo?.emergency_person_contact_one_name,
      emergency_person_contact_one_relation: basicInfo?.emergency_person_contact_one_relation,
      emergency_person_contact_two: basicInfo?.emergency_person_contact_two,
      emergency_person_contact_two_name: basicInfo?.emergency_person_contact_two_name,
      emergency_person_contact_two_relation: basicInfo?.emergency_person_contact_two_relation
    };

    try {
      const response = await saveGigWorkerBasicInfoAPI(requestBody);
      if (response?.status === 0) {
        setBasicInfo((prev) => ({
          ...prev,
          application_id: response?.data?.application_id,
          application_no: response?.data?.application_no,
        }));
        Cookies.save("aid", response?.data?.application_id);
        Cookies.save("ano", response?.data?.application_no);
        toast({
          variant: "success",
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span>Success!</span>
            </div>
          ),
          description: response?.message,
        });
        setCurrentStep(2);
        let cookie_step = Cookies.load("step");

        if (cookie_step < 1) {
          Cookies.save("step", 1);
        }
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to Save!</span>
            </div>
          ),
          description: response?.message,
        });
      }
    } catch (error) {
      console.error("Basic Info submission failed:", error);
    }
  };

  const handleSubmitStep2 = async () => {
    const requestBody = {
      application_id: Number(basicInfo?.application_id),
      arr_vehicle_details: (vehicleInfo?.arr_vehicle_details || []).map(
        (vehicle) => ({
          operation_type: vehicle?.operation_type || "i", // insert if new
          vehicle_id: vehicle?.vehicle_id || 0,
          registration_type_id: vehicle?.registration_type_id,
          automobile_cycle_id: vehicle?.automobile_cycle_id,
          vehicle_type_id: vehicle?.vehicle_type_id,
          is_self_owned: vehicle?.is_self_owned,
          registration_number: vehicle?.registration_number,
          driving_license: vehicle?.driving_license,
        })
      ),
      form_step: 2,
      entry_user_id: Number(userID),
    };

    const isAutomobile = vehicleInfo?.arr_vehicle_details.find((item) => item.automobile_cycle_id == 10);
    console.log("isAutomobile", isAutomobile);
    if (isAutomobile) {
      setDocuments((prev) => ({
        ...prev,
        is_automobile: 1,
      }));
    }
    try {
      const response = await saveGigWorkerVehicleInfoAPI(requestBody);
      if (response?.status === 0) {
        toast({
          variant: "success",
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span>Vehicle Info Saved!</span>
            </div>
          ),
          description: response?.message,
        });
        setCurrentStep(3);
        let cookie_step = Cookies.load("step");
        if (cookie_step < 2) {
          Cookies.save("step", 2);
        }
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to Save!</span>
            </div>
          ),
          description: response?.message,
        });
      }
    } catch (error) {
      console.error("Vehicle Info submission failed:", error);
    }
  };

  const handleSubmitStep3 = async () => {

    // Check for mandatory fields
    const mandatoryFields = {
      nominee_name: otherInfo.nominee_name,
      relationship_with_nominee: otherInfo.relationship_with_nominee_id,
      aadhaar_number_of_the_nominee: otherInfo.nominee_aadhar_no,
      contact_number_of_the_nominee: otherInfo.nominee_contact_no,
      date_of_birth_of_the_nominee: formatDate(otherInfo.nominee_date_of_birth),
    };

    // Loop and show the first missing field
    for (const [key, value] of Object.entries(mandatoryFields)) {
      if (!value) {
        const fieldName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()); // Format to "Gig Worker Name"

        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{fieldName} is required!</span>
            </div>
          ),
        });
        return;
      }
    }

    const requestBody = {
      application_id: Number(basicInfo?.application_id) || 0,
      social_security_scheme_type_id: otherInfo.social_security_scheme_type_id,
      nominee_name: otherInfo.nominee_name,
      relationship_with_nominee_id: otherInfo.relationship_with_nominee_id,
      nominee_aadhar_no: otherInfo.nominee_aadhar_no,
      nominee_contact_no: otherInfo.nominee_contact_no,
      nominee_date_of_birth: formatDate(otherInfo.nominee_date_of_birth),
      arr_written_lang: otherInfo.arr_written_lang,
      arr_spoken_lang: otherInfo.arr_spoken_lang,
      educational_qualification: otherInfo.educational_qualification,
      grade_id: otherInfo.grade_id,
      form_step: 3,
      entry_user_id: Number(userID),
    };

    try {
      const response = await saveGigWorkerOtherInfoAPI(requestBody);
      if (response?.status === 0) {
        toast({
          variant: "success",
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span>Other Info Saved!</span>
            </div>
          ),
          description: response?.message,
        });
        setCurrentStep(4);
        let cookie_step = Cookies.load("step");
        if (cookie_step < 3) {
          Cookies.save("step", 3);
        }
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{response?.message}</span>
            </div>
          ),
          description: response?.message || "Failed to save other info",
        });
      }
    } catch (error) {
      console.error("Other Info submission failed:", error);
    }
  };

  const handleSubmitStep4 = async () => {

    // Check for mandatory fields
    const mandatoryFields = {
      work_related_information_details: workRelatedInfo?.arr_occupation_info?.length
    };

    // Loop and show the first missing field
    for (const [key, value] of Object.entries(mandatoryFields)) {
      if (!value) {
        const fieldName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()); // Format to "Gig Worker Name"

        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{fieldName} is required!</span>
            </div>
          ),
        });
        return;
      }
    }

    const requestBody = {
      application_id: basicInfo?.application_id || 0,
      entry_user_id: Number(userID),
      form_step: 4,
      arr_occupation_info: (workRelatedInfo.arr_occupation_info || []).map(
        (item) => ({
          occupation_id: item.occupation_id || 0,
          occupation_type_id: item.occupation_type_id,
          nature_industry_id: item.nature_industry_id,
          organization_id: item.organization_id,
          experience_year: item.experience_year || 0,
          operation_type: item.operation_type || "n",
          is_currently_working: item.is_currently_working || 0,
        })
      ),
    };

    try {
      const response = await saveGigWorkRelatedInfoAPI(requestBody);
      if (response?.status === 0) {
        toast({
          variant: "success",
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span>Work Related Info Saved!</span>
            </div>
          ),
          description: response?.message,
        });

        if (bank_details_visibility == 0) {
          setCurrentStep(4);
        } else {
          setCurrentStep(5);
        }
        let cookie_step = Cookies.load("step");
        if (cookie_step < 4) {
          Cookies.save("step", 4);
        }
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to Save!</span>
            </div>
          ),
          description: response?.message,
        });
      }
    } catch (error) {
      console.error("Work Related Info submission failed:", error);
    }
  };

  const handleSubmitStep5 = async () => {
    // Check for mandatory fields
    const mandatoryFields = {
      self_bank: bankDetails.self_bank_id,
      self_branch: bankDetails.self_bank_branch,
      self_ifsc_code: bankDetails.self_bank_ifsc_code,
      self_account_number: bankDetails.self_bank_acc_no,
      nominee_bank: bankDetails.nominee_bank_id,
      nominee_branch: bankDetails.nominee_bank_branch,
      nominee_ifsc_code: bankDetails.nominee_bank_ifsc_code,
      nominee_account_number: bankDetails.nominee_bank_acc_no,
    };

    // Loop and show the first missing field
    for (const [key, value] of Object.entries(mandatoryFields)) {
      if (!value) {
        const fieldName = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{fieldName} is required!</span>
            </div>
          ),
        });
        return;
      }
    }

    const requestBody = {
      application_id: basicInfo?.application_id || 0,
      entry_user_id: userID,
      form_step: 5,
      self_bank_id: bankDetails.self_bank_id || 0,
      self_bank_branch: bankDetails.self_bank_branch,
      self_bank_ifsc_code: bankDetails.self_bank_ifsc_code,
      self_bank_acc_no: bankDetails.self_bank_acc_no,
      nominee_bank_id: bankDetails.nominee_bank_id || 0,
      nominee_bank_branch: bankDetails.nominee_bank_branch,
      nominee_bank_ifsc_code: bankDetails.nominee_bank_ifsc_code || "0",
      nominee_bank_acc_no: bankDetails.nominee_bank_acc_no,
    };

    try {
      const response = await saveGigBankDetailsAPI(requestBody);
      if (response?.status === 0) {
        toast({
          variant: "success",
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span>Bank Details Saved!</span>
            </div>
          ),
          description: response?.message,
        });

        // Redirect to /gen-certificate
        router.push("/gen-certificate");
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to Save!</span>
            </div>
          ),
          description: response?.message,
        });
      }
    } catch (error) {
      console.error("Bank Details submission failed:", error);
    }
  };

  // Fetch Data for each step using AbortController
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      try {
        let response;
        if (currentStep === 1 && basicInfo?.application_id && userID) {
          response = await getGigWorkerBasicInfoAPI(
            basicInfo?.application_id || 0,
            userID,
            { signal }
          );

          let locationType = null;

          setBasicInfo({
            ...basicInfo,
            gig_worker_name:
              response?.data?.gig_worker_name || basicInfo?.gig_worker_name,
            gender_id: response?.data?.gender_id || basicInfo?.gender_id,
            date_of_birth:
              response?.data?.date_of_birth || basicInfo?.date_of_birth,
            father_or_husband_name:
              response?.data?.father_or_husband_name ||
              basicInfo?.father_or_husband_name,
            permanent_address:
              response?.data?.permanent_address || basicInfo?.permanent_address,
            current_address:
              response?.data?.current_address || basicInfo?.current_address,
            district: response?.data?.district_id
              ? {
                inner_boundary_id: response.data.district_id,
                inner_boundary_name: response.data.district_name,
              }
              : null,
            district_id: response?.data?.district_id || 0,

            subDivision: response?.data?.sub_division_id
              ? {
                inner_boundary_id: response.data.sub_division_id,
                inner_boundary_name: response.data.sub_division_name,
              }
              : null,
            subdivision_id: response?.data?.sub_division_id || 0,

            locationType: locationType,

            block: response?.data?.block_id
              ? {
                inner_boundary_id: response.data.block_id,
                inner_boundary_name: response.data.block_name,
              }
              : null,
            block_id: response?.data?.block_id || 0,

            gramPanchayat: response?.data?.gram_panchayet_id
              ? {
                inner_boundary_id: response.data.gram_panchayet_id,
                inner_boundary_name: response.data.gram_panchayet_name,
              }
              : null,
            gram_panchayat_id: response?.data?.gram_panchayet_id || 0,

            municipality: response?.data?.municipality_id
              ? {
                inner_boundary_id: response.data.municipality_id,
                inner_boundary_name: response.data.municipality_name,
              }
              : null,
            corporation_municipality_id:
              response?.data?.corporation_municipality_id || 0,

            ward_no: response?.data?.ward_no,
            pincode: response?.data?.pin_code || "",
            address_other_details: response?.data?.address_other_details,
            blood_group_id: response?.data?.blood_group_id,

            permDistrict: response?.data?.perm_district_id
              ? {
                inner_boundary_id: response.data.perm_district_id,
                inner_boundary_name: response.data.perm_district_name,
              }
              : null,
            perm_district_id: response?.data?.perm_district_id || 0,

            permSubDivision: response?.data?.perm_subdivision_id
              ? {
                inner_boundary_id: response.data.perm_subdivision_id,
                inner_boundary_name: response.data.perm_subdivision_name,
              }
              : null,
            perm_subdivision_id: response?.data?.perm_subdivision_id || 0,
            perm_is_urban: response?.data?.perm_is_urban,
            permBlock: response?.data?.perm_block_municipality_corp_id
              ? {
                block_municipality_corp_id: response.data.perm_block_municipality_corp_id,
                block_municipality_corp_name: response.data.perm_block_municipality_corp_name,
              }
              : null,
            perm_block_municipality_corp_id: response?.data?.perm_block_municipality_corp_id || 0,

            permGramPanchayat: response?.data?.perm_gp_ward_id
              ? {
                gp_ward_id: response.data.perm_gp_ward_id,
                gp_ward_name: response.data.perm_gp_ward_name,
              }
              : null,
            perm_gp_ward_id: response?.data?.perm_gp_ward_id || 0,

            permMunicipality: response?.data?.perm_municipality_id
              ? {
                inner_boundary_id: response.data.perm_municipality_id,
                inner_boundary_name: response.data.municipality_name,
              }
              : null,
            perm_corporation_municipality_id:
              response?.data?.perm_corporation_municipality_id || 0,
            perm_ward_no: response?.data?.perm_ward_no,
            perm_pincode: response?.data?.perm_pin_code,
            pan_card: response?.data?.pan_card,
            marital_status: response?.data?.marital_status,
            emergency_person_contact_one: response?.data?.emergency_person_contact_one || "",
            emergency_person_contact_one_name: response?.data?.emergency_person_contact_one_name || "",
            emergency_person_contact_one_relation: response?.data?.emergency_person_contact_one_relation || "",
            emergency_person_contact_two: response?.data?.emergency_person_contact_two || "",
            emergency_person_contact_two_name: response?.data?.emergency_person_contact_two_name || "",
            emergency_person_contact_two_relation: response?.data?.emergency_person_contact_two_relation || ""
          });
          // Update basicInfo state with fetched data as needed...
        }
        if (currentStep === 2 || currentStep === 5) {
          const fetchVehicleDetails = async () => {
            try {
              const result = await getGigWorkerVehicleInfoAPI(
                Number(applicationId) || 0,
                Number(userID) || 0,
                { signal }
              );
              if (result && result.data && result.data.arr_vehicle_details) {
                // Map each record to include an initial operation_type of "n"
                const vehicles = result.data.arr_vehicle_details.map((v) => ({
                  ...v,
                  operation_type: "n",
                }));
                console.log(result?.data?.arr_vehicle_details);

                const isAutomobile = result?.data?.arr_vehicle_details.find((item) => item.vehicle_category_id == 10);

                if (isAutomobile) {
                  console.log("isAutomobile", isAutomobile);
                  setDocuments((prev) => ({
                    ...prev,
                    is_automobile: 1,
                  }));
                }
                setVehicleInfo((prev) => ({
                  ...prev,
                  arr_vehicle_details: vehicles,
                }));
                setInitialVehicles(vehicles); // Store the original API data.
              } else {
                setVehicleInfo((prev) => ({
                  ...prev,
                  arr_vehicle_details: [],
                }));
                setInitialVehicles([]);
                console.warn("No vehicle details found in API response.");
              }
            } catch (error) {
              if (error.name === "AbortError") {
              } else {
                console.error(
                  "Error fetching vehicle details from API:",
                  error
                );
                setVehicleInfo((prev) => ({
                  ...prev,
                  arr_vehicle_details: [],
                }));
                setInitialVehicles([]);
              }
            }
          };

          fetchVehicleDetails();
        }
        if (currentStep === 3 && basicInfo?.application_id && userID) {
          response = await getGigWorkerOtherInfoAPI(
            basicInfo?.application_id,
            userID,
            { signal }
          );
          setOtherInfo({
            social_security_scheme_type_id:
              response?.data?.social_security_scheme_type_id || 0,
            nominee_name: response?.data?.nominee_name || "",
            relationship_with_nominee_id:
              response?.data?.relationship_with_nominee_id || 0,
            nominee_aadhar_no: response?.data?.nominee_aadhar_no || "",
            nominee_date_of_birth: response?.data?.nominee_dob || "",
            arr_written_lang: response?.data?.written_lang
              ? JSON.parse(response.data.written_lang)
              : [],
            arr_spoken_lang: response?.data?.spoken_lang
              ? JSON.parse(response.data.spoken_lang)
              : [],
            educational_qualification:
              response?.data?.educational_qualification || "",
            grade_id:
              response?.data?.grade_id || "",
            grade_name:
              response?.data?.grade_name || "",
            nominee_contact_no: response?.data?.nominee_contact_no
          });
        } else if (currentStep === 4 && basicInfo?.application_id && userID) {
          response = await getGigWorkerWorkRelatedInfoAPI(
            basicInfo?.application_id,
            userID,
            { signal }
          );
          console.log("akash", response?.data);

          setWorkRelatedInfo({
            arr_occupation_info: Array.isArray(response?.data)
              ? response.data
              : [],
          });
        } else if (currentStep === 5 && basicInfo?.application_id && userID) {
          response = await getGigWorkerBankInfoAPI(
            basicInfo?.application_id,
            userID,
            { signal }
          );
          setBankDetails({
            self_bank_id: response?.data?.self_bank_id || null,
            self_bank_branch: response?.data?.self_bank_branch || "",
            self_bank_name: response?.data?.self_bank_name || "",
            self_bank_ifsc_code: response?.data?.self_bank_ifsc_code || "",
            self_bank_acc_no: response?.data?.self_bank_acc_no || "",
            nominee_bank_id: response?.data?.nominee_bank_id || null,
            nominee_bank_branch: response?.data?.nominee_bank_branch || "",
            nominee_bank_name: response?.data?.nominee_bank_name || "",
            nominee_bank_ifsc_code:
              response?.data?.nominee_bank_ifsc_code || "",
            nominee_bank_acc_no: response?.data?.nominee_bank_acc_no || "",
          });
        }
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          console.error("Error fetching data", error);
        }
      }
    };
    fetchData();
    return () => abortController.abort();
  }, [currentStep, basicInfo?.application_id, userID, applicationId]); // Added applicationId to dependency array

  // Render form based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicContactDetailsSection
            formData={basicInfo}
            setFormData={setBasicInfo}
          />
        );
      case 2:
        return (
          <VehicleDetails
            formData={vehicleInfo}
            setFormData={setVehicleInfo}
            initialVehicles={initialVehicles} // Pass as prop

          />
        );
      case 3:
        return (
          <OtherDetailsSection
            formData={otherInfo}
            setFormData={setOtherInfo}
          />
        );
      case 4:
        return (
          <WorkRelatedForm
            formData={workRelatedInfo}
            setFormData={setWorkRelatedInfo}
          />
        );
      case 5:
        return (
          <BankDetailsForm
            formData={bankDetails}
            setFormData={setBankDetails}
          />
        );
      default:
        return <h1 className="font-bold">There was a mistake.</h1>;
    }
  };

  const prevStep = () => setCurrentStep((prev) => {
    if (bank_details_visibility == 0 && prev == 6) {
      return Math.max(1, prev - 2)
    } else {
      return Math.max(1, prev - 1)
    }
  });

  return (
    <div className="relative w-full">
      <div className="absolute inset-0">
        <Image
          src={BackgroundImg}
          alt="Background Image"
          objectFit="cover"
          layout="fill"
          className="absolute opacity-10"
        />
      </div>
      <div className="px-6 py-2 justify-center flex w-full bg-transparent relative">
        <Card className="w-[70vw] mx-auto z-100">
          <div className="my-0 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden min-h-[200px]">
            <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
              <h2 className="text-2xl font-bold text-white flex justify-between items-baseline">
                <span>
                  {currentStep == 1
                    ? "Personal & Address Details"
                    : currentStep == 2
                      ? "Vehicle Details"
                      : currentStep == 3
                        ? "Educational Details"
                        : currentStep == 4
                          ? "Work Experience"
                          : currentStep == 5
                            ? "Bank Details"
                            : "Document Upload"}
                </span>
                <span className="text-sm">
                  Application Step: {currentStep}/6
                </span>
              </h2>
            </div>
            <Stepper
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formStep={isClient ? currentStep : 1} // Use 1 on server, currentStep on client
            />
            <CardContent>{renderFormStep()}</CardContent>
            {(
              <CardContent className="flex justify-between p-4">
                {currentStep > 1 && (
                  <Button type="button" variant="secondary" onClick={prevStep}>
                    <ArrowLeftCircle /> Previous
                  </Button>
                )}
                {currentStep === 1 && (
                  <Button
                    type="button"
                    className="ml-auto hover:bg-violet-100 hover:border-1 hover:border-violet-400"
                    variant="outline"
                    onClick={handleSubmitStep1}
                  >
                    Save as Draft & Next <ArrowRightCircle className="text-violet-500" />
                  </Button>
                )}
                {currentStep === 2 && (
                  <Button
                    type="button"
                    className="ml-auto hover:bg-violet-100 hover:border-1 hover:border-violet-400"
                    variant="outline"
                    onClick={handleSubmitStep2}
                  >
                    Save as Draft & Next <ArrowRightCircle className="text-violet-500" />
                  </Button>
                )}
                {currentStep === 3 && (
                  <Button
                    type="button"
                    className="ml-auto hover:bg-violet-100 hover:border-1 hover:border-violet-400"
                    variant="outline"
                    onClick={handleSubmitStep3}
                  >
                    Save as Draft & Next <ArrowRightCircle className="text-violet-500" />
                  </Button>
                )}
                {currentStep === 4 && (
                  <Button
                    type="button"
                    className="ml-auto hover:bg-violet-100 hover:border-1 hover:border-violet-400"
                    variant="outline"
                    onClick={handleSubmitStep4}
                  >
                    Save as Draft & Next <ArrowRightCircle className="text-violet-500" />
                  </Button>
                )}
                {currentStep === 5 && (
                  <Button
                    type="button"
                    className="ml-auto hover:bg-violet-100 hover:border-1 hover:border-violet-400"
                    variant="outline"
                    onClick={handleSubmitStep5}
                  >
                    Save as Draft & Next <ArrowRightCircle className="text-violet-500" />
                  </Button>
                )}

                <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex justify-center items-center gap-2 text-green-600">
                        <BadgeCheck className="h-20 w-20 animate-pulse" />
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-center flex flex-col gap-4 mt-5">
                        {isApplicationModified ?
                          <span>Your application has been updated as draft successfully.</span>
                          :
                          <span>Your application has been saved as draft successfully.</span>}

                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <div className="flex justify-center items-center gap-2 text-xl my-5 w-full">
                        <Link
                          className="px-3 py-2 text-sm hover:bg-violet-700 bg-violet-500 text-white hover:text-white rounded-md"
                          href="/gen-certificate">Submit & generate registration card</Link>
                        <Link
                          className="px-3 py-2 text-sm hover:bg-slate-300 bg-slate-200 border rounded-md"
                          href="/worker-dashboard">Submit Later</Link>
                      </div>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </CardContent>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
