"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  SquarePenIcon,
  SquarePen,
  Upload,
  CirclePlus,
  AlertCircle,
} from "lucide-react";
import {
  getAllOccupationAPI,
  getAllNatureIndustryAPI,
  getAllOrganizationAPI,
} from "./api.js";
import { useToast } from "@/hooks/use-toast";
import Cookies from "react-cookies";

export default function WorkRelatedForm({ formData, setFormData }) {
  const { toast } = useToast();

  const [occupationOptions, setOccupationOptions] = useState([]);
  const [natureIndustryOptions, setNatureIndustryOptions] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const udinNo = Cookies.load("uno");
  const readOnly = false;
  const experienceOptions = [
    { value: "0", label: "0-1 Years" },
    { value: "1", label: "1-3 Years" },
    { value: "3", label: "3-5 Years" },
    { value: "5", label: "5-10 Years" },
    { value: "10", label: "10+ Years" },
  ];

  // Local state for new occupation entry (IDs stored as strings).
  const [newOccupation, setNewOccupation] = useState({
    occupation: "",
    natureOfIndustry: "",
    organization: "",
    gigExperience: "",
    IsCurrentlyWorking: "",
  });

  // State for editing an occupation entry: null means add new.
  const [editOccupationIndex, setEditOccupationIndex] = useState(null);
  // Store a copy of the original record for comparison when editing.
  const [originalOccupation, setOriginalOccupation] = useState(null);

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


  const fetchNatureIndustry = async (occupation_type_id) => {
    try {
      const result = await getAllNatureIndustryAPI(0, occupation_type_id);
      if (result && result.data) {
        console.log(result)
        const mapped = result.data.map((item) => ({
          value: item.nature_of_industry_id.toString(),
          label: item.nature_of_industry_name,
        }));
        setNatureIndustryOptions(mapped);
      }
    } catch (error) {
      if (error.name === "AbortError") {
      } else {
        console.error("Error fetching nature industry options:", error);
      }
    }
  };

  const fetchOrganizations = async (natureIndustryId) => {
    try {
      const result = await getAllOrganizationAPI(0, natureIndustryId);
      if (result && result.data) {
        const mapped = result.data.map((item) => ({
          value: item.organization_id.toString(),
          label: item.organization_name,
        }));
        setOrganizationOptions(mapped);
      }
    } catch (error) {
      if (error.name === "AbortError") {
      } else {
        console.error("Error fetching organization data:", error);
      }
    }
  };

  // Update newOccupation state.
  const handleNewOccupationChange = async (field, value) => {

    if (field === "occupation") {
      await fetchNatureIndustry(value);
    } else if (field === "natureOfIndustry") {
      await fetchOrganizations(value);
    }

    setNewOccupation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add or update an occupation entry.
  // Add or update an occupation entry.
  const addOccupation = () => {
    if (editOccupationIndex !== null && originalOccupation) {
      // Convert form values (strings) to numbers (or null) for comparison.
      const occupation_type_id =
        newOccupation.occupation === ""
          ? null
          : Number(newOccupation.occupation);
      const nature_industry_id =
        newOccupation.natureOfIndustry === ""
          ? null
          : Number(newOccupation.natureOfIndustry);
      const organization_id =
        newOccupation.organization === ""
          ? null
          : Number(newOccupation.organization);
      const experience_year =
        newOccupation.gigExperience === ""
          ? null
          : Number(newOccupation.gigExperience);
      const is_currently_working =
        newOccupation.IsCurrentlyWorking === ""
          ? 0
          : Number(newOccupation.IsCurrentlyWorking);

      // Get the labels for display
      const occupation_type_name = getLabel(occupationOptions, occupation_type_id);
      const nature_industry_name = getLabel(natureIndustryOptions, nature_industry_id);
      const organization_name = getLabel(organizationOptions, organization_id);

      // Check the original record's occupation_id.
      // If it's 0, we always mark the record as "i" (new).
      // Otherwise, compare the new values with the original.
      const opType =
        originalOccupation.occupation_id == 0
          ? "i"
          : occupation_type_id != originalOccupation.occupation_type_id ||
            nature_industry_id != originalOccupation.nature_industry_id ||
            organization_id != originalOccupation.organization_id ||
            experience_year != originalOccupation.experience_year ||
            is_currently_working != originalOccupation.is_currently_working
            ? "e"
            : "n";

      const occupationEntry = {
        ...(originalOccupation.occupation_id && {
          occupation_id: originalOccupation.occupation_id,
        }),
        occupation_type_id,
        occupation_type_name,
        nature_industry_id,
        nature_industry_name,
        organization_id,
        organization_name,
        experience_year,
        is_currently_working,
        operation_type: opType,
      };

      setFormData((prev) => {
        const updated = [...(prev.arr_occupation_info || [])];
        updated[editOccupationIndex] = occupationEntry;
        return { ...prev, arr_occupation_info: updated };
      });
      toast({
        title: "Occupation Updated",
        description: "The occupation record has been updated successfully.",
      });
      setEditOccupationIndex(null);
      setOriginalOccupation(null);
    } else {
      // Get the labels for display (for new records too)
      const occupation_type_id = newOccupation.occupation === ""
        ? null
        : Number(newOccupation.occupation);
      const nature_industry_id = newOccupation.natureOfIndustry === ""
        ? null
        : Number(newOccupation.natureOfIndustry);
      const organization_id = newOccupation.organization === ""
        ? null
        : Number(newOccupation.organization);

      const occupation_type_name = getLabel(occupationOptions, occupation_type_id);
      const nature_industry_name = getLabel(natureIndustryOptions, nature_industry_id);
      const organization_name = getLabel(organizationOptions, organization_id);

      // New record: flag as "i".
      const occupationEntry = {
        occupation_type_id,
        occupation_type_name,
        nature_industry_id,
        nature_industry_name,
        organization_id,
        organization_name,
        experience_year:
          newOccupation.gigExperience === ""
            ? null
            : Number(newOccupation.gigExperience),
        operation_type: "i",
        is_currently_working:
          newOccupation.IsCurrentlyWorking === ""
            ? 0
            : Number(newOccupation.IsCurrentlyWorking),
      };

      setFormData((prev) => ({
        ...prev,
        arr_occupation_info: [
          ...(prev.arr_occupation_info || []),
          occupationEntry,
        ],
      }));
      toast({
        title: "Occupation Added",
        description: "The occupation record has been added successfully.",
      });
    }

    // Reset form fields.
    setNewOccupation({
      occupation: "",
      natureOfIndustry: "",
      organization: "",
      gigExperience: "",
      IsCurrentlyWorking: "",
    });
  };
  // Prepare an entry for editing.
  // Prepare an entry for editing.
  const handleEditOccupation = async (index) => {
    const entry = formData.arr_occupation_info[index];
    setOriginalOccupation({ ...entry });

    // Fetch dependent dropdowns based on the entry's values
    if (entry.occupation_type_id) {
      await fetchNatureIndustry(entry.occupation_type_id);
    }

    if (entry.nature_industry_id) {
      await fetchOrganizations(entry.nature_industry_id);
    }

    setNewOccupation({
      occupation: entry.occupation_type_id
        ? entry.occupation_type_id.toString()
        : "",
      natureOfIndustry: entry.nature_industry_id
        ? entry.nature_industry_id.toString()
        : "",
      organization: entry.organization_id
        ? entry.organization_id.toString()
        : "",
      gigExperience: entry.experience_year !== null && entry.experience_year !== undefined
        ? entry.experience_year.toString()
        : "",
      IsCurrentlyWorking: entry.is_currently_working
        ? entry.is_currently_working.toString()
        : "0",
    });
    setEditOccupationIndex(index);
  };

  // Mark an entry for deletion (operation_type "d").
  const deleteOccupation = (index) => {
    setFormData((prev) => {
      const updated = [...(prev.arr_occupation_info || [])];
      updated[index] = { ...updated[index], operation_type: "d" };
      return { ...prev, arr_occupation_info: updated };
    });
    toast({
      title: "Occupation Deleted",
      description: "The occupation record has been marked for deletion.",
    });
    if (editOccupationIndex === index) {
      setNewOccupation({
        occupation: "",
        natureOfIndustry: "",
        organization: "",
        gigExperience: "",
        IsCurrentlyWorking: "No",
      });
      setEditOccupationIndex(null);
      setOriginalOccupation(null);
    }
  };

  // Helper to get a display label from an options array.
  const getLabel = (options, id) => {
    if (id === null || id === undefined) return "N/A";
    const found = options.find((option) => Number(option.value) == id);
    return found ? found.label : id;
  };

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-6">
        {/* Occupation */}
        <div className="p-0 rounded">
          <Label htmlFor="occupation" className="block mb-2">
            Occupation<span className="text-red-600 font-bold">*</span>
          </Label>
          <Select
            value={newOccupation.occupation}
            onValueChange={(value) =>
              handleNewOccupationChange("occupation", value)
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

        {/* Nature of Industry */}
        <div className="p-0 rounded">
          <Label htmlFor="natureOfIndustry" className="block mb-2">
            Nature of Industry<span className="text-red-600 font-bold">*</span>
          </Label>
          <Select
            value={newOccupation.natureOfIndustry}
            onValueChange={(value) =>
              handleNewOccupationChange("natureOfIndustry", value)
            }
          >
            <SelectTrigger id="natureOfIndustry">
              <SelectValue placeholder="Select Nature of Industry" />
            </SelectTrigger>
            <SelectContent>
              {natureIndustryOptions?.length > 0 ? (
                natureIndustryOptions?.map((option, i) => (
                  <SelectItem key={i} value={option?.value}>
                    {option?.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  <span className="flex gap-2"><AlertCircle /> Select occupation first</span>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Organization */}
        <div className="p-0 rounded">
          <Label htmlFor="organization" className="block mb-2">
            Organization<span className="text-red-600 font-bold">*</span>
          </Label>
          <Select
            value={newOccupation.organization}
            onValueChange={(value) =>
              handleNewOccupationChange("organization", value)
            }
          >
            <SelectTrigger id="organization">
              <SelectValue placeholder="Select Organization" />
            </SelectTrigger>
            <SelectContent>
              {organizationOptions.length > 0 ? (
                organizationOptions.map((option, i) => (
                  <SelectItem key={i} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  <span className="flex gap-2"><AlertCircle /> Select nature of industry first</span>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-5">
        {/* Experience as GIG Worker */}
        <div className="p-0 rounded">
          <Label htmlFor="gigExperience" className="block mb-2">
            Experience as GIG Worker in the organization <span className="text-slate-400 font-bold">(optional)</span>
          </Label>
          <Select
            value={newOccupation.gigExperience}
            onValueChange={(value) =>
              handleNewOccupationChange("gigExperience", value)
            }
          >
            <SelectTrigger id="gigExperience">
              <SelectValue placeholder="Select Experience" />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map((option, i) => (
                <SelectItem key={i} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currently Working */}
        <div className="p-0 rounded">
          <Label htmlFor="IsCurrentlyWorking" className="block mb-2">
            Whether Currently Working or Not<span className="text-red-600 font-bold">*</span>
          </Label>
          <Select
            value={newOccupation?.IsCurrentlyWorking}
            onValueChange={(value) =>
              handleNewOccupationChange("IsCurrentlyWorking", value)
            }
          >
            <SelectTrigger id="IsCurrentlyWorking">
              <SelectValue placeholder="Select Work Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Yes</SelectItem>
              <SelectItem value="0">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="secondary"
          className="border border-slate-400 rounded-full text-sm hover:bg-slate-200"
          type="button"
          onClick={addOccupation}
          disabled={readOnly}
        >
          {editOccupationIndex !== null ? (
            <>
              <SquarePenIcon />
              Update Occupation
            </>
          ) : (
            <>
              <CirclePlus />
              Add More
            </>
          )}
        </Button>
      </div>

      {formData.arr_occupation_info &&
        formData.arr_occupation_info.length > 0 && (
          <div className="mt-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">S.No</th>
                  <th className="border px-4 py-2">Occupation</th>
                  <th className="border px-4 py-2">Nature of Industry</th>
                  <th className="border px-4 py-2">Organization</th>
                  <th className="border px-4 py-2">Experience</th>
                  <th className="border px-4 py-2">Working Status</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.arr_occupation_info
                  .reduce((acc, occupation, idx) => {
                    if (occupation.operation_type === "d") return acc;
                    return [...acc, { occupation, idx }];
                  }, [])
                  .map(({ occupation, idx }, visibleIndex) => (
                    <tr key={idx}>
                      <td className="border px-4 py-2 text-center">
                        {visibleIndex + 1}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {occupation.occupation_type_name ? occupation.occupation_type_name :
                          getLabel(
                            occupationOptions,
                            occupation.occupation_type_id
                          )}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {occupation.nature_industry_name ? occupation.nature_industry_name :
                          getLabel(
                            natureIndustryOptions,
                            occupation.nature_industry_id
                          )}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {occupation.organization_name ? occupation.organization_name :
                          "N/A"}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {getLabel(
                          experienceOptions,
                          occupation.experience_year
                        )}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {occupation.is_currently_working ? "Working" : "Not Working"}
                      </td>
                      <td className="border px-4 py-2 flex space-x-2 justify-center">
                        <Button
                          variant="outline"
                          className="text-yellow-600 hover:text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-500"
                          onClick={() => handleEditOccupation(idx)}
                          disabled={readOnly}
                        >
                          <SquarePenIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-500 hover:text-slate-100 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500"
                          onClick={() => deleteOccupation(idx)}
                          disabled={readOnly}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
