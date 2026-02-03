"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveGigWorkerNatureIndustry } from "./api";
import Cookies from "react-cookies";
import { Input } from "@/components/ui/input";
import { getAllOccupationAPI } from "@/app/workers-registration-form/api";

const Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [natureIndustryName, setNatureIndustryName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [newOccupation, setNewOccupation] = useState({
    occupation: "",
    natureOfIndustry: "",
  });
  const [occupationOptions, setOccupationOptions] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const userID = Cookies.load("authority_user_id");
      const nature_industry_id = 0;

      // console.log({
      //   userID,
      //   occupation,
      //   nature_industry_id,
      //   natureIndustryName
      // });

      const result = await saveGigWorkerNatureIndustry(
        userID,
        newOccupation.occupation,
        nature_industry_id,
        natureIndustryName
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

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchOccupations = async () => {
      try {
        const result = await getAllOccupationAPI(0, { signal });
        if (result && result.data) {
          const mapped = result.data.map((item) => ({
            value: item.occupation_type_id.toString(),
            label: item.occupation_type_name,
          }));
          setOccupationOptions(mapped);
        }
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          console.error("Error fetching occupation data:", error);
        }
      }
    };

    fetchOccupations();

    return () => {
      abortController.abort();
    };
  }, []);
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
              Add Nature of Industry
            </h2>
          </div>

          {/* Nature of Industry */}
          <div className="gap-4 px-6 mb-6 flex justify-center items-end py-10">

            <div className="flex flex-col justify-center gap-2 mx-auto min-w-[400px]">

              {/* Occupation */}
              <div className="p-0 rounded">
                <Label htmlFor="occupation" className="block mb-2">
                  Occupation<span className="text-red-600 font-bold">*</span>
                </Label>
                <Select
                  value={occupation}
                  onValueChange={(value) =>
                    setOccupation(value)
                  }
                >
                  <SelectTrigger id="occupation">
                    <SelectValue placeholder="Select Occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupationOptions.length > 0 ? (
                      occupationOptions.map((option, i) => (
                        <SelectItem key={i} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-0 rounded">
                <Label htmlFor="natureIndustryName">Nature of Industry<span className="text-red-600 font-bold">*</span></Label>
                <Input
                  value={natureIndustryName || ""}
                  onChange={(e) => {
                    setNatureIndustryName(e.target.value)
                  }}
                  placeholder="Enter Nature of Industry"
                />
              </div>
              
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
