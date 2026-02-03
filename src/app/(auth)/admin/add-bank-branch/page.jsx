"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { Label } from "@/components/ui/label";
import { saveBankBranchDetails } from "./api";
import Cookies from "react-cookies";
import { Input } from "@/components/ui/input";
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
import { getAllBankAPI, getIFSCCodeByBankIDAPI } from "@/app/workers-registration-form/api";

const Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);
  const [IFSCSelfOptions, setIFSCSelfOptions] = useState([]);
  const [openSelf, setOpenSelf] = useState(false);
  const [openSelfIFSC, setOpenSelfIFSC] = useState(false);
  const [formData, setFormData] = useState({
    bank_id: "",
    bank_ifsc_code: "",
    branch_name: ""
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const userID = Cookies.load("authority_user_id");
      const result = await saveBankBranchDetails(
        formData.bank_id,
        formData.bank_ifsc_code,
        formData.branch_name,
        userID,
      );

      if (result?.status == 0) {
        toast({
          title: "Success!",
          description: result?.message,
          status: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failure!",
          description: result?.message,
          status: "error",
        });
      }
    } catch (err) {
      setError("Failed to save data");
    } finally {
      setLoading(false);
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

    fetchBanks();
  }, []);

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

  return (
    <div className="px-6 py-2 justify-center flex w-full">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />
      <Card className="max-w-2xl w-full mx-auto z-10">
        <div className="my-0 bg-white dark:bg-gray-800 overflow-hidden rounded-md">
          <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
            <h2 className="text-2xl font-bold text-white">
              Add Bank Branch
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            {/* Bank Name Combobox */}
            <div>
              <Label htmlFor="bank_id" className="block mb-2">
                Bank Name
              </Label>
              <Popover open={openSelf} onOpenChange={setOpenSelf}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSelf}
                    id="bank_id"
                    className={`w-[400px] justify-between overflow-hidden`}
                  >
                    {formData.bank_id
                      ? bankOptions.find(
                        (option) =>
                          option.value === formData?.bank_id.toString()
                      )?.label
                      : "Select Bank..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
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
                              value={option.value}
                              onSelect={(currentValue) => {
                                const selectedBank = bankOptions.find(
                                  (bank) => bank.value === currentValue
                                );
                                setFormData((prev) => ({
                                  ...prev,
                                  bank_id: Number(currentValue),
                                  bank_name: selectedBank?.label || "",
                                }));
                                setOpenSelf(false);
                                fetchIFSCCodeSelfList(option.value);
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formData.bank_id &&
                                    formData.bank_id.toString() ===
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
            <div className="flex flex-col justify-center gap-2 mx-auto w-[400px]">
              <Label htmlFor="branchName">Bank IFSC Code</Label>
              <Input
                value={formData?.bank_ifsc_code || ""}
                onChange={(e) => {
                  setFormData({ ...formData, bank_ifsc_code: e.target.value })
                }}
                placeholder="Enter Bank IFSC Code"
              />
            </div>
            <div className="flex flex-col justify-center gap-2 mx-auto w-[400px]">
              <Label htmlFor="branchName">Bank Branch</Label>
              <Input
                value={formData?.branch_name || ""}
                onChange={(e) => {
                  setFormData({ ...formData, branch_name: e.target.value })
                }}
                placeholder="Enter Bank Branch Name"
              />
              <Button
                className="bg-blue-600 flex justify-center mx-auto mb-10 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </Button>
            </div>
          </div>

        </div>
        {error && <p className="text-red-600">{error}</p>}

      </Card >
    </div >
  );
};

export default Page;
