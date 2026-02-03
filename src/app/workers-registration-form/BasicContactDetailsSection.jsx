"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddressDetailsSection from "./AddressDetailsSection";
import Cookies from "react-cookies";
import { getBloodGroupDetailsApi } from "./api";
import Image from "next/image";

function BasicContactDetailsSection({ formData, setFormData, onTabChange }) {

  const udinNo = Cookies.load("uno");
  const readOnly = udinNo ? true : false;
  const [bloodGroupOptions, setBloodGroupOptions] = useState([]);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "father_or_husband_name") {
      const isValid = /^[A-Za-z\s]*$/.test(value);
      if (!isValid) return;
    }

    if (name === "pan_card") {
      const upperValue = value.toUpperCase();

      // Allow only A-Z and 0-9
      const isAlphaNumeric = /^[A-Z0-9]*$/.test(upperValue);
      if (!isAlphaNumeric) return;

      // ✅ Before setting form data, check length
      if (upperValue.length > 10) {
        // Clear field if user crosses 10 characters
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: upperValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const getBloodGroupDetails = async () => {
      try {
        const response = await getBloodGroupDetailsApi();
        setBloodGroupOptions(response.data.map((item) => ({ label: item.blood_group_name, value: item.blood_group_id })));
      } catch (error) {
        console.error("Error fetching blood group details:", error);
      }
    };

    getBloodGroupDetails();
  }, []);

  return (
    <>
      {/* Basic Information */}
      <div className="p-4 border rounded w-full">
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="gig_worker_name">Name<span className="text-red-600 font-bold">*</span></Label>
            <Input
              className=""
              id="gig_worker_name"
              name="gig_worker_name"
              value={formData?.gig_worker_name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender_id">Gender<span className="text-red-600 font-bold">*</span></Label>
            <Select
              value={formData?.gender_id || ""}
              onValueChange={(value) => handleChange({ target: { name: "gender_id", value } })}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Select Gender</SelectItem>
                <SelectItem value="1">Male</SelectItem>
                <SelectItem value="2">Female</SelectItem>
                <SelectItem value="3">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-1 flex flex-col w-full">
            <Label className="pb-1" htmlFor="date_of_birth">
              Date of Birth<span className="text-red-600 font-bold">*</span>
            </Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData?.date_of_birth || ""}
              className="w-full px-4 py-2 text-sm rounded-sm border-[1px]"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="father_or_husband_name">
              Father’s/Husband’s Name<span className="text-red-600 font-bold">*</span>
            </Label>
            <Input
              disabled={readOnly}
              id="father_or_husband_name"
              name="father_or_husband_name"
              value={formData?.father_or_husband_name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="blood_group_id">Blood Group <span className="text-slate-400 font-bold">(optional)</span></Label>
            <Select
              value={formData?.blood_group_id || ""}
              onValueChange={(value) => handleChange({ target: { name: "blood_group_id", value } })}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Select Blood Group</SelectItem>
                {bloodGroupOptions.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pan_card">
              PAN Card No. <span className="text-slate-400 font-bold">(optional)</span>
            </Label>
            <Input
              disabled={readOnly}
              id="pan_card"
              name="pan_card"
              value={formData?.pan_card || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="marital_status">Marital Status <span className="text-slate-400 font-bold">(optional)</span></Label>
            <Select
              value={formData?.marital_status || ""}
              onValueChange={(value) => handleChange({ target: { name: "marital_status", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Married</SelectItem>
                <SelectItem value="0">Unmarried</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="mt-4">
        <AddressDetailsSection
          formData={formData}
          setFormData={setFormData}
          handleSelectChange={handleSelectChange}
          handleChange={handleChange}
        />
      </div>
    </>
  );
}

export default BasicContactDetailsSection;
