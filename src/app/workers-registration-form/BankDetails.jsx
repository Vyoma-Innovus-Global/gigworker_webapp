"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getAllBankAPI, getBankBranchNameByIFSCCodeAPI, getIFSCCodeByBankIDAPI } from "./api.js";
import Cookies from "react-cookies";

export default function BankDetailsForm({ formData, setFormData }) {
  const [bankOptions, setBankOptions] = useState([]);
  const [IFSCSelfOptions, setIFSCSelfOptions] = useState([]);
  const [IFSCNomineeOptions, setIFSCNomineeOptions] = useState([]);
  const [branchNameSelfOptions, setBranchNameSelfOptions] = useState([]);
  const [branchNameNomineeOptions, setBranchNameNomineeOptions] = useState([]);
  // Separate open state for each combobox
  const [openSelf, setOpenSelf] = useState(false);
  const [openSelfIFSC, setOpenSelfIFSC] = useState(false);
  const [openSelfBranch, setOpenSelfBranch] = useState(false);
  const [openNominee, setOpenNominee] = useState(false);
  const [openNomineeIFSC, setOpenNomineeIFSC] = useState(false);
  const [openNomineeBranch, setOpenNomineeBranch] = useState(false);
  const udinNo = Cookies.load("uno");
  const readOnly = false;

  const fetchIFSCCodeSelfList = async (bank_id) => {
    try {
      const result = await getIFSCCodeByBankIDAPI(bank_id);
      if (result && result.data) {
        const mapped = result.data.map((item) => ({
          value: item.ifsc_code.toString(),
          label: item.ifsc_code,
        }));
        setIFSCSelfOptions(mapped);
      }
    } catch (error) {
      console.error("Error fetching bank options:", error);
    }
  };

  const fetchBranchNameSelfList = async (ifsc_code) => {
    try {
      console.log("ifsc", ifsc_code)
      const result = await getBankBranchNameByIFSCCodeAPI(ifsc_code);
      if (result && result?.data) {
        setFormData((prev) => ({ ...prev, self_bank_branch: result?.data?.bank_branch_id, self_bank_branch_name: result?.data?.bank_branch_name }))
      }
    } catch (error) {
      console.error("Error fetching bank options:", error);
    }
  };

  const fetchIFSCCodeNomineeList = async (bank_id) => {
    try {
      const result = await getIFSCCodeByBankIDAPI(bank_id);
      if (result && result.data) {
        const mapped = result.data.map((item) => ({
          value: item.ifsc_code.toString(),
          label: item.ifsc_code,
        }));
        setIFSCNomineeOptions(mapped);
      }
    } catch (error) {
      console.error("Error fetching bank options:", error);
    }
  };

  // Add this function
  const fetchBranchNameNomineeList = async (ifsc_code) => {
    try {
      const result = await getBankBranchNameByIFSCCodeAPI(ifsc_code);
      if (result && result?.data) {
        setFormData((prev) => ({ ...prev, nominee_bank_branch: result?.data?.bank_branch_id, nominee_bank_branch_name: result?.data?.bank_branch_name }))
      }
    } catch (error) {
      console.error("Error fetching branch options for nominee:", error);
    }
  };

  // Fetch bank options on mount.
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const result = await getAllBankAPI(0);
        if (result && result.data) {
          const mapped = result.data.map((item) => ({
            value: item.bank_id.toString(),
            label: item.bank_name,
          }));
          setBankOptions(mapped);
        }
      } catch (error) {
        console.error("Error fetching bank options:", error);
      }
    };

    const fetchSavedBankData = async () => {
      await fetchBanks();
      if (formData?.self_bank_id && formData?.self_bank_ifsc_code) {
        await fetchIFSCCodeSelfList(formData?.self_bank_id);
        await fetchBranchNameSelfList(formData?.self_bank_ifsc_code);
      }

      if (formData?.nominee_bank_id && formData?.nominee_bank_ifsc_code) {
        await fetchIFSCCodeNomineeList(formData?.nominee_bank_id);
        await fetchBranchNameNomineeList(formData?.nominee_bank_ifsc_code);
      }
    }

    fetchSavedBankData();
  }, [formData?.self_bank_id, formData?.self_bank_ifsc_code, formData?.nominee_bank_id, formData?.nominee_bank_ifsc_code]); // ✅ Add dependencies

  // Update text inputs; convert value to uppercase.
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "self_bank_acc_no" || name === "nominee_bank_acc_no") {
      const upperValue = value.toUpperCase();

      // Allow only A-Z and 0-9
      const isAlphaNumeric = /^[A-Z0-9]*$/.test(upperValue);
      if (!isAlphaNumeric) return;

      // ✅ Before setting form data, check length
      if (upperValue.length >= 14) {
        // Clear field if user crosses 10 characters
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: upperValue }));
      return;
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
    }
  };



  return (
    <div className="p-3">
      <form className="space-y-8">
        {/* Self Bank Details Section */}
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold mb-4">Self Bank Details</h3>
          <div className="grid grid-cols-4 gap-6">
            {/* Bank Name Combobox */}
            <div>
              <Label htmlFor="self_bank_id" className="block mb-2">
                Bank Name<span className="text-red-600 font-bold">*</span>
              </Label>
              <Popover open={openSelf} onOpenChange={setOpenSelf}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSelf}
                    id="self_bank_id"
                    className={`w-[200px] justify-between overflow-hidden ${readOnly ? "pointer-events-none opacity-50" : ""
                      }`}
                  >
                    {formData.self_bank_name
                      ? bankOptions.find(
                        (option) =>
                          option.label == formData?.self_bank_name.toString()
                      )?.label
                      : "Select Bank..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Bank..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      {bankOptions.length > 0 ? (
                        <CommandGroup>
                          {bankOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={(selectedLabel) => {
                                const selectedBank = bankOptions.find(
                                  (bank) => bank.label === selectedLabel
                                );
                                if (!selectedBank) return;

                                setFormData((prev) => ({
                                  ...prev,
                                  self_bank_id: Number(selectedBank.value),
                                  self_bank_name: selectedBank.label,
                                  self_bank_ifsc_code: "",
                                  self_bank_branch_name: "",
                                }));
                                setOpenSelf(false);
                                fetchIFSCCodeSelfList(selectedBank.value);
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formData.self_bank_name &&
                                    formData.self_bank_name.toString() ===
                                    option.label
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>No data available.</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* IFSC Combobox */}
            <div>
              <Label htmlFor="self_bank_ifsc_code" className="block mb-2">
                IFSC Code<span className="text-red-600 font-bold">*</span>
              </Label>
              <Popover open={openSelfIFSC} onOpenChange={setOpenSelfIFSC}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSelfIFSC}
                    id="self_bank_ifsc_code"
                    className={`w-[200px] justify-between overflow-hidden ${readOnly ? "pointer-events-none opacity-50" : ""
                      }`}
                  >
                    {formData?.self_bank_ifsc_code
                      ? formData?.self_bank_ifsc_code
                      : "Select IFSC..."}

                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search IFSC..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      {IFSCSelfOptions.length > 0 ? (
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={(currentValue) => {
                              const selectedIFSC = IFSCSelfOptions.find(
                                (bank) => bank.value == currentValue
                              );
                              setFormData((prev) => ({
                                ...prev,
                                self_bank_ifsc_code: "0",
                                self_bank_ifsc_code_name: selectedIFSC?.label || "0",
                              }));
                              setOpenSelfIFSC(false);
                            }}
                          >
                            Select IFSC
                          </CommandItem>
                          {IFSCSelfOptions.map((option, index) => (
                            <CommandItem
                              key={index}
                              value={option.value}
                              onSelect={(currentValue) => {
                                const selectedIFSC = IFSCSelfOptions.find(
                                  (bank) => bank.value == currentValue
                                );
                                if (currentValue && selectedIFSC?.label) {

                                  setFormData((prev) => ({
                                    ...prev,
                                    self_bank_ifsc_code: currentValue,
                                    self_bank_ifsc_code_name: selectedIFSC?.label,
                                  }));
                                }
                                setOpenSelfIFSC(false);
                                fetchBranchNameSelfList(currentValue);
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formData?.self_bank_ifsc_code &&
                                    formData?.self_bank_ifsc_code.toString() ===
                                    option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>Please Select Bank First.</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Branch Name */}
            <div>
              <Label htmlFor="self_bank_branch_name" className="block mb-2">
                Branch Name<span className="text-red-600 font-bold">*</span>
              </Label>
              <Input
                id="self_bank_branch_name"
                name="self_bank_branch_name"
                placeholder="Enter Bank Branch Name"
                value={formData?.self_bank_branch_name || ""}
                onChange={handleChange}
                readOnly={true}
              />
            </div>

            {/* Account Number */}
            <div>
              <Label htmlFor="self_bank_acc_no" className="block mb-2">
                Account Number<span className="text-red-600 font-bold">*</span>
              </Label>
              <Input
                id="self_bank_acc_no"
                name="self_bank_acc_no"
                placeholder="Enter Account Number"
                value={formData?.self_bank_acc_no || ""}
                onChange={handleChange}
                readOnly={readOnly}
                pattern="\d{12,14}"
                title="Account number must be between 12 and 14 digits"
              />
            </div>
          </div>
        </div>

        {/* Nominee Bank Details Section */}
        <div className="p-4 border rounded">
          <h3 className="text-xl font-semibold mb-4">Nominee Bank Details</h3>
          <div className="grid grid-cols-4 gap-6">
            {/* Bank Name Combobox */}
            <div>
              <Label htmlFor="nominee_bank_id" className="block mb-2">
                Bank Name<span className="text-red-600 font-bold">*</span>
              </Label>
              <Popover open={openNominee} onOpenChange={setOpenNominee}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openNominee}
                    id="nominee_bank_id"
                    className={`w-[200px] justify-between overflow-hidden ${readOnly ? "pointer-events-none opacity-50" : ""
                      }`}
                  >
                    {formData.nominee_bank_id
                      ? bankOptions.find(
                        (option) =>
                          option.value ===
                          formData?.nominee_bank_id.toString()
                      )?.label
                      : "Select Bank..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Bank..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      {bankOptions.length > 0 ? (
                        <CommandGroup>
                          {bankOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={(currentValue) => {
                                const selectedBank = bankOptions.find(
                                  (bank) => bank.label === currentValue
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  nominee_bank_id: Number(selectedBank?.value),
                                  nominee_bank_name: selectedBank?.label || "",
                                  nominee_bank_ifsc_code: "",
                                  nominee_bank_ifsc_code_name: "",
                                  nominee_bank_branch_name: "",
                                }));
                                setOpenNominee(false);
                                fetchIFSCCodeNomineeList(selectedBank?.value);
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formData?.nominee_bank_id &&
                                    formData?.nominee_bank_id.toString() ===
                                    option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>No data available.</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* IFSC Combobox */}
            <div>
              <Label htmlFor="nominee_bank_ifsc_code" className="block mb-2">
                IFSC Code<span className="text-red-600 font-bold">*</span>
              </Label>
              <Popover open={openNomineeIFSC} onOpenChange={setOpenNomineeIFSC}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openNomineeIFSC}
                    id="nominee_bank_ifsc_code"
                    className={`w-[200px] justify-between overflow-hidden ${readOnly ? "pointer-events-none opacity-50" : ""
                      }`}
                  >
                    {formData?.nominee_bank_ifsc_code ? formData?.nominee_bank_ifsc_code
                      : "Select IFSC..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search IFSC..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      {IFSCNomineeOptions.length > 0 ? (
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={(currentValue) => {
                              const selectedIFSC = IFSCNomineeOptions.find(
                                (bank) => bank.value == currentValue
                              );
                              setFormData((prev) => ({
                                ...prev,
                                nominee_bank_ifsc_code: "0",
                                nominee_bank_ifsc_code_name: selectedIFSC?.label || "0",
                              }));
                              setOpenNomineeIFSC(false);
                            }}
                          >
                            Select IFSC
                          </CommandItem>
                          {IFSCNomineeOptions.map((option, index) => (
                            <CommandItem
                              key={index}
                              value={option.value}
                              onSelect={(currentValue) => {
                                const selectedBank = IFSCNomineeOptions.find(
                                  (bank) => bank.value === currentValue
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  nominee_bank_ifsc_code: currentValue || "0",
                                  nominee_bank_ifsc_code_name: selectedBank?.label || "",
                                }));
                                setOpenNomineeIFSC(false);
                                fetchBranchNameNomineeList(currentValue);
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formData?.nominee_bank_ifsc_code &&
                                    formData?.nominee_bank_ifsc_code.toString() ===
                                    option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>Please Select Bank First.</CommandEmpty>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Nominee Branch Name  */}
            <div>
              <Label htmlFor="nominee_bank_branch" className="block mb-2">
                Branch Name<span className="text-red-600 font-bold">*</span>
              </Label>
              <Input
                id="nominee_bank_branch"
                name="nominee_bank_branch"
                placeholder="Enter Bank Branch Name"
                value={formData?.nominee_bank_branch_name || ""}
                onChange={handleChange}
                readOnly={true}
              />
            </div>

            {/* Account Number */}
            <div>
              <Label htmlFor="nominee_bank_acc_no" className="block mb-2">
                Account Number<span className="text-red-600 font-bold">*</span>
              </Label>
              <Input
                id="nominee_bank_acc_no"
                name="nominee_bank_acc_no"
                placeholder="Enter Account Number"
                value={formData?.nominee_bank_acc_no || ""}
                onChange={handleChange}
                readOnly={readOnly}
                title="Account number must be between 12 and 14 digits"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
