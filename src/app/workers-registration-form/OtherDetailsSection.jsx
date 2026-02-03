"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  getAllLanguagesAPI,
  uploadGigWorkerFiles,
  getAllRelationTypeAPI,
  getGigWorkerBasicInfoAPI,
} from "./api";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2Icon,
  ChevronsUpDown,
  Upload,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import Cookies from "react-cookies";
import { DatePicker } from "@/components/reusables/date-picker";

function OtherDetailsSection({ formData, setFormData }) {
  const [languages, setLanguages] = useState([]);
  const [relationTypes, setRelationTypes] = useState([]);
  const [openRelationship, setOpenRelationship] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(false);
  const udinNo = Cookies.load("uno");
  const readOnly = udinNo ? true : false;
  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;

    if (name === "nominee_aadhar_no") {
      // Allow only digits, max 12
      sanitizedValue = value.replace(/\D/g, "").slice(0, 12);
    } else if (name === "nominee_contact_no") {
      // Allow only digits, max 10
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "nominee_name") {
      // Allow only alphabets and spaces
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };


  // Fetch languages and relation types on component mount
  useEffect(() => {
    const abortController = new AbortController();

    const fetchLanguages = async () => {
      try {
        const result = await getAllLanguagesAPI(0, {
          signal: abortController.signal,
        });
        if (result?.data) {
          setLanguages(result.data);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();

    return () => {
      abortController.abort();
    };
  }, []);

  const gradeOptions = [
    { value: "1", label: "Undergraduate" },
    { value: "2", label: "Graduate" },
    { value: "3", label: "Postgraduate" },
    { value: "4", label: "PhD" },
    { value: "5", label: "Diploma" },
    { value: "6", label: "High School" },
    { value: "7", label: "None" },
  ];

  const languageOptions = languages.map((lang) => ({
    value: lang.lang_id,
    label: lang.lang_name,
  }));

  useEffect(() => {
    const applicationId = Cookies.load("aid");
    const userID = Cookies.load("uid");

    const fetchRelationTypes = async () => {
      try {
        const basic_details = await getGigWorkerBasicInfoAPI(
          applicationId,
          userID
        );

        const marital_status = basic_details?.data?.marital_status;

        const response = await getAllRelationTypeAPI(1); // Pass appropriate user_id
        if (response?.status == 0) {
          if (marital_status == 1) {
            const filteredRelations = response?.data?.filter((relation) => relation.relation_type_id == 1 || relation.relation_type_id == 2 || relation.relation_type_id == 5 || relation.relation_type_id == 10 || relation.relation_type_id == 11)
            setRelationTypes(filteredRelations || []);
          } else {
            setRelationTypes(response?.data);
          }
        }
      } catch (error) {
        console.error("Error fetching relation types:", error);
      }
    };

    fetchRelationTypes();
  }, []);

  return (
    <>
      {/* Languages & Education */}
      <div className="p-4 border rounded mt-8">
        <h3 className="text-xl font-semibold mb-4">Languages & Education</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="languages">
              Select language(s) which you can write
            </Label>
            <MultiSelect
              options={languageOptions}
              selected={languageOptions.filter((option) =>
                formData.arr_written_lang.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                if (!readOnly) {
                  setFormData((prev) => ({
                    ...prev,
                    arr_written_lang: selectedOptions.map((opt) => opt.value),
                  }));
                }
              }}
              placeholder="Select languages..."
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label htmlFor="spokenLanguages">
              Select language(s) which you can speak
            </Label>
            <MultiSelect
              options={languageOptions}
              selected={languageOptions.filter((option) =>
                formData.arr_spoken_lang.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                if (!readOnly) {
                  setFormData((prev) => ({
                    ...prev,
                    arr_spoken_lang: selectedOptions.map((opt) => opt.value),
                  }));
                }
              }}
              placeholder="Languages"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />
          </div>
          {/* Grade Selection Dropdown */}
          <div className="">
            <Label className="text-sm font-medium">Highest Qualification</Label>
            <Select value={formData?.grade_id?.toString()} onValueChange={(value) => handleSelectChange("grade_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Highest Qualification" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade?.value} value={grade?.value}>
                    {grade?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="educational_qualification">
              Degree Details
            </Label>
            <Input
              id="educational_qualification"
              name="educational_qualification"
              placeholder="(like B.Sc. in Computer Science, MBA, etc."
              value={formData?.educational_qualification || ""}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>

      {/* Uploads */}

      {/* Social Security & Nominee Details */}
      <div className="p-4 border rounded mt-8">
        <h3 className="text-xl font-semibold mb-4">
          Nominee Details
        </h3>
        <div className="grid grid-cols-2 gap-6">

          <div>
            <Label htmlFor="nomineeName">
              Name of the Nominee<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nominee_name"
              name="nominee_name"
              value={formData?.nominee_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="nomineeRelation">
              Relationship with Nominee<span className="text-red-500">*</span>
            </Label>

            <Select
              value={formData.relationship_with_nominee_id.toString() || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  relationship_with_nominee_id: value,
                }))
              }
            >
              <SelectTrigger id="nomineeRelation" className="w-full">
                <SelectValue placeholder="Select Relationship" />
              </SelectTrigger>

              <SelectContent>
                {relationTypes.map((relation) => (
                  <SelectItem
                    key={relation.relation_type_id}
                    value={relation.relation_type_id.toString()}
                  >
                    {relation.relation_type_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nomineeAadhaar">
              Aadhaar Number of Nominee<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nominee_aadhar_no"
              name="nominee_aadhar_no"
              type="text"
              value={formData?.nominee_aadhar_no || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="nominee_contact_no">
              Contact Number of Nominee<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nominee_contact_no"
              name="nominee_contact_no"
              type="text"
              value={formData?.nominee_contact_no || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col justify-end">
            <Label htmlFor="nomineeDob" className="mb-1">
              Date of Birth of Nominee<span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={formData?.nominee_date_of_birth}
              setDate={(e) =>
                handleSelectChange("nominee_date_of_birth", e)
              }
              fromYear={1947}
              toYear={new Date().getFullYear() - 18}
            />

          </div>
        </div>
      </div>
    </>
  );
}

export default OtherDetailsSection;
