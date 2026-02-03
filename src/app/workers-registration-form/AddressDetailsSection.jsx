"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchBoundaryDetailsAPI, getAllRelationTypeAPI, getBlockMunicipalityCoorporationAPI, getGPWardDetailsAPI } from "./api.js";
import { Textarea } from "@/components/ui/textarea.jsx";
import Cookies from "react-cookies";
import { Checkbox } from "@/components/ui/checkbox.jsx";

function AddressDetailsSection({ formData, setFormData }) {
  // States for dropdown options
  const [districts, setDistricts] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [wards, setWards] = useState([]);

  // Local state for controlling popovers for each combobox
  const [districtOpen, setDistrictOpen] = useState(false);
  const [subDivisionOpen, setSubDivisionOpen] = useState(false);
  const [locationTypeOpen, setLocationTypeOpen] = useState(false);
  const [relationTypes, setRelationTypes] = useState([]);
  const [openRelationship1, setOpenRelationship1] = useState(false);
  const [openRelationship2, setOpenRelationship2] = useState(false);
  const udinNo = Cookies.load("uno");
  const readOnly = udinNo ? true : false;
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [sameAsAadhaar, setSameAsAadhaar] = useState(false);
  const [errors, setErrors] = useState({});

  const [permDistrictOpen, setPermDistrictOpen] = useState(false);
  const [permSubDivisionOpen, setPermSubDivisionOpen] = useState(false);
  const [permLocationTypeOpen, setPermLocationTypeOpen] = useState(false);
  const [permBlockOpen, setPermBlockOpen] = useState(false);
  const [permGpOpen, setPermGpOpen] = useState(false);
  const [permMunicipalityOpen, setPermMunicipalityOpen] = useState(false);

  const [permDistricts, setPermDistricts] = useState([]);
  const [permSubDivisions, setPermSubDivisions] = useState([]);
  const [permBlocks, setPermBlocks] = useState([]);
  const [permMunicipalities, setPermMunicipalities] = useState([]);
  const [permGramPanchayats, setPermGramPanchayats] = useState([]);
  const [permWards, setPermWards] = useState([]);

  const loginUserID = 1;

  useEffect(() => {
    const fetchRelationTypes = async () => {
      try {
        const response = await getAllRelationTypeAPI(1); // Pass appropriate user_id
        if (response?.status == 0) {
          setRelationTypes(response?.data);
        }
      } catch (error) {
        console.error("Error fetching relation types:", error);
      }
    };

    fetchRelationTypes();
  }, []);

  // 1. On load: Fetch districts
  useEffect(() => {
    const getDistricts = async () => {
      try {
        const response = await fetchBoundaryDetailsAPI(1, 1, 1, loginUserID);
        setDistricts(response?.data || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistricts([]);
      }
    };
    getDistricts();
  }, []);

  // Set default district
  useEffect(() => {
    if (formData?.district_id && districts.length > 0 && !formData?.district) {
      const selectedDistrict = districts.find(
        (d) => d.inner_boundary_id === formData?.district_id
      );
      if (selectedDistrict) {
        setFormData((prev) => ({
          ...prev,
          district: selectedDistrict,
        }));
      }
    }
  }, [districts, formData?.district_id, formData?.district, setFormData]);

  // Set default subdivision
  useEffect(() => {
    if (
      formData.subdivision_id &&
      subDivisions.length > 0 &&
      !formData.subDivision
    ) {
      const selectedSubDivision = subDivisions.find(
        (sd) => sd.inner_boundary_id === formData.subdivision_id
      );
      if (selectedSubDivision) {
        setFormData((prev) => ({
          ...prev,
          subDivision: selectedSubDivision,
        }));
      }
    }
  }, [
    subDivisions,
    formData.subdivision_id,
    formData.subDivision,
    setFormData,
  ]);

  // Set default block
  useEffect(() => {
    if (
      formData?.locationType === "block" &&
      formData?.block_id &&
      blocks.length > 0 &&
      !formData?.block
    ) {
      const selectedBlock = blocks.find(
        (b) => b.inner_boundary_id === formData?.block_id
      );
      if (selectedBlock) {
        setFormData((prev) => ({
          ...prev,
          block: selectedBlock,
        }));
      }
    }
  }, [
    blocks,
    formData?.block_id,
    formData?.block,
    formData?.locationType,
    setFormData,
  ]);

  // Set default gram panchayat
  useEffect(() => {
    if (
      formData?.block &&
      formData?.gram_panchayat_id &&
      gramPanchayats.length > 0 &&
      !formData?.gramPanchayat
    ) {
      const selectedGP = gramPanchayats.find(
        (gp) => gp?.inner_boundary_id === formData?.gram_panchayat_id
      );
      if (selectedGP) {
        setFormData((prev) => ({
          ...prev,
          gramPanchayat: selectedGP,
        }));
      }
    }
  }, [
    gramPanchayats,
    formData?.gram_panchayat_id,
    formData?.gramPanchayat,
    formData?.block,
    setFormData,
  ]);

  // Set default municipality
  useEffect(() => {
    if (
      formData?.locationType === "municipality" &&
      formData?.corporation_municipality_id &&
      municipalities.length > 0 &&
      !formData?.municipality
    ) {
      const selectedMunicipality = municipalities.find(
        (m) => m.inner_boundary_id === formData?.corporation_municipality_id
      );
      if (selectedMunicipality) {
        setFormData((prev) => ({
          ...prev,
          municipality: selectedMunicipality,
        }));
      }
    }
  }, [
    municipalities,
    formData?.corporation_municipality_id,
    formData?.municipality,
    formData?.locationType,
    setFormData,
  ]);

  useEffect(() => {
    if (formData?.locationType) {
      return;
    }
    if (formData?.locationType == null && formData.block_id > 0) {
      setFormData((prev) => ({ ...prev, locationType: "block" }));
    }
    if (
      formData?.locationType == null &&
      formData.corporation_municipality_id > 0
    ) {
      setFormData((prev) => ({ ...prev, locationType: "municipality" }));
    }
  }, [
    formData.locationType,
    formData.block_id,
    formData.corporation_municipality_id,
    setFormData,
  ]);

  // 1. On load: Fetch permanent districts
  useEffect(() => {
    const getPermDistricts = async () => {
      try {
        const response = await fetchBoundaryDetailsAPI(1, 1, 1, loginUserID);
        setPermDistricts(response?.data || []);
      } catch (error) {
        console.error("Error fetching permanent districts:", error);
        setPermDistricts([]);
      }
    };
    getPermDistricts();
  }, []);

  // 2. Fetch Permanent Subdivisions after District selection
  useEffect(() => {
    if (formData?.permDistrict?.inner_boundary_id) {
      const getPermSubDivisions = async () => {
        try {
          const { inner_boundary_id } = formData.permDistrict;
          const response = await fetchBoundaryDetailsAPI(
            2,
            inner_boundary_id,
            1,
            loginUserID
          );
          if (response?.data?.length == 1) {
            setFormData((prev) => ({
              ...prev,
              permSubDivision: response.data[0],
              perm_subdivision_id: response.data[0].inner_boundary_id,
              perm_subdivision_name: response.data[0].inner_boundary_name,
            }));
          }
          setPermSubDivisions(response.data || []);
        } catch (error) {
          console.error("Error fetching permanent sub-divisions:", error);
        }
      };
      getPermSubDivisions();
    } else {
      setPermSubDivisions([]);
    }
  }, [formData.permDistrict]);

  // 3a. If permLocationType === "block" => fetch Blocks (is_urban=0)
  useEffect(() => {
    if (
      formData?.permSubDivision?.inner_boundary_id &&
      formData?.permLocationType === "block"
    ) {
      const getPermBlocks = async () => {
        try {
          const { inner_boundary_id } = formData?.permSubDivision;
          const response = await fetchBoundaryDetailsAPI(
            4,
            inner_boundary_id,
            0,
            loginUserID
          );
          if (response?.data?.length == 1) {
            setFormData((prev) =>
            ({
              ...prev,
              permBlock: response.data[0],
              perm_block_municipality_corp_id: response.data[0].block_municipality_corp_id,
              perm_block_municipality_corp_name: response.data[0].block_municipality_corp_name,
            })
            );
          }

          setPermBlocks(response.data || []);
        } catch (error) {
          console.error("Error fetching permanent blocks:", error);
        }
      };
      getPermBlocks();
    } else {
      setPermBlocks([]);
    }
  }, [formData.permSubDivision, formData.permLocationType]);

  // 3b. If block is selected => fetch Gram Panchayats (is_urban=0)
  useEffect(() => {
    if (
      formData?.permBlock?.inner_boundary_id &&
      formData?.permLocationType === "block"
    ) {
      const getPermGramPanchayats = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(
            5,
            formData?.permBlock.inner_boundary_id,
            0,
            loginUserID
          );
          setPermGramPanchayats(response.data || []);
        } catch (error) {
          console.error("Error fetching permanent gram panchayats:", error);
        }
      };
      getPermGramPanchayats();
    } else {
      setPermGramPanchayats([]);
    }
  }, [formData.permBlock, formData.permLocationType]);

  // 4a. If permLocationType === "municipality" => fetch Municipalities (is_urban=1)
  useEffect(() => {
    if (
      formData?.permSubDivision?.inner_boundary_id &&
      formData?.permLocationType === "municipality"
    ) {
      const getPermMunicipalities = async () => {
        try {
          const { inner_boundary_id } = formData?.permSubDivision;
          const response = await fetchBoundaryDetailsAPI(
            2,
            inner_boundary_id,
            1,
            loginUserID
          );
          setPermMunicipalities(response.data || []);
        } catch (error) {
          console.error("Error fetching permanent municipalities:", error);
        }
      };
      getPermMunicipalities();
    } else {
      setPermMunicipalities([]);
    }
  }, [formData.permSubDivision, formData.permLocationType]);

  // 4b. If municipality is selected => fetch Wards (is_urban=1)
  useEffect(() => {
    if (
      formData?.permMunicipality?.inner_boundary_id &&
      formData?.permLocationType === "municipality"
    ) {
      const getPermWards = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(
            formData?.permMunicipality.inner_boundary_id,
            1,
            1,
            loginUserID
          );
          setPermWards((response.data ||= []));
        } catch (error) {
          console.error("Error fetching permanent wards:", error);
        }
      };
      getPermWards();
    } else {
      setPermWards([]);
    }
  }, [formData.permMunicipality, formData.permLocationType]);

  // Set default permanent district
  useEffect(() => {
    if (formData?.perm_district_id && permDistricts.length > 0 && !formData?.permDistrict) {
      const selectedPermDistrict = permDistricts.find(
        (d) => d.inner_boundary_id === formData?.perm_district_id
      );
      if (selectedPermDistrict) {
        setFormData((prev) => ({
          ...prev,
          permDistrict: selectedPermDistrict,
        }));
      }
    }
  }, [permDistricts, formData.perm_district_id, formData.permDistrict]);

  // Set default permanent block
  useEffect(() => {
    if (formData?.perm_block_municipality_corp_id &&
      permBlocks.length > 0 &&
      !formData?.permBlock
    ) {
      const selectedPermBlock = permBlocks.find(
        (b) => b.perm_block_municipality_corp_id == formData?.perm_block_municipality_corp_id
      );
      if (selectedPermBlock) {
        setFormData((prev) => ({
          ...prev,
          permBlock: selectedPermBlock,
        }));
      }
    }
  }, [
    permBlocks,
    formData.perm_block_municipality_corp_id,
    formData.permBlock,
  ]);

  // Set default permanent gram panchayat
  useEffect(() => {
    if (
      formData?.permBlock &&
      formData?.perm_gram_panchayat_id &&
      permGramPanchayats.length > 0 &&
      !formData?.permGramPanchayat
    ) {
      const selectedPermGP = permGramPanchayats.find(
        (gp) => gp?.inner_boundary_id === formData?.perm_gram_panchayat_id
      );
      if (selectedPermGP) {
        setFormData((prev) => ({
          ...prev,
          permGramPanchayat: selectedPermGP,
        }));
      }
    }
  }, [
    permGramPanchayats,
    formData.perm_gram_panchayat_id,
    formData.permGramPanchayat,
    formData.permBlock,
  ]);

  // Set default permanent municipality
  useEffect(() => {
    if (
      formData?.permLocationType === "municipality" &&
      formData?.perm_corporation_municipality_id &&
      permMunicipalities.length > 0 &&
      !formData?.permMunicipality
    ) {
      const selectedPermMunicipality = permMunicipalities.find(
        (m) => m.inner_boundary_id === formData?.perm_corporation_municipality_id
      );
      if (selectedPermMunicipality) {
        setFormData((prev) => ({
          ...prev,
          permMunicipality: selectedPermMunicipality,
        }));
      }
    }
  }, [
    permMunicipalities,
    formData.perm_corporation_municipality_id,
    formData.permMunicipality,
    formData.permLocationType,
  ]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    handleValidation(name, value);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Extend validation rules
  const validationRules = {
    name: /^[A-Za-z\s]+$/,
    current_address: /^[A-Za-z0-9\s,.-/]*$/,
    // permanent_address: /^[A-Za-z0-9\s,.-/]*$/,
    perm_pincode: /^\d{6}$/,
    permanent_pincode: /^\d{6}$/,
    current_pincode: /^\d{6}$/,
    phone: /^\d{10}$/,
    permanent_phone: /^\d{10}$/,
    current_phone: /^\d{10}$/,
    ward_no: /^\d+$/,
    address_other_details: /^[A-Za-z0-9\s,.-/]*$/,
  };

  const handleValidation = (name, value) => {
    let errorMsg = "";

    if (validationRules[name] && !validationRules[name].test(value)) {
      switch (name) {
        // case "permanent_address":
        case "current_address":
          errorMsg = "Invalid address format.";
          break;
        case "permanent_pincode":
        case "current_pincode":
        case "perm_pincode":
          errorMsg = "Pincode must be 6 digits.";
          break;
        case "permanent_phone":
        case "current_phone":
        case "phone":
          errorMsg = "Phone number must be 10 digits.";
          break;
        case "ward_no":
          errorMsg = "Ward number must be numeric.";
          break;
        case "address_other_details":
          errorMsg = "Invalid characters in landmark.";
          break;
        default:
          errorMsg = "Invalid input.";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };


  // get Block/Municipality/Coorporation
  const getPermBlocks = async (subdivision_id) => {
    try {
      const response = await getBlockMunicipalityCoorporationAPI(subdivision_id);
      const data = response.data;
      if (data.length === 1) {
        setFormData((prev) => ({
          ...prev,
          ["permBlock"]: data[0],
          ["perm_block_municipality_corp_id"]: data[0].block_municipality_corp_id,
          ["perm_block_municipality_corp_name"]: data[0].block_municipality_corp_name,
        }));
      }
      setPermBlocks(response.data || []);
    } catch (error) {
      console.error("Error fetching permanent blocks:", error);
    }
  };

  // get Block/Municipality/Coorporation
  const getGPWardDetails = async (block_municipality_corp_id) => {
    try {
      const response = await getGPWardDetailsAPI(block_municipality_corp_id);
      setPermGramPanchayats(response.data || []);
    } catch (error) {
      console.error("Error fetching permanent blocks:", error);
    }
  };

  useEffect(() => {
    getPermBlocks(formData?.perm_subdivision_id);
  }, [
    formData.perm_subdivision_id,
    formData.permSubDivision,
  ]);

  useEffect(() => {
    getGPWardDetails(formData?.perm_block_municipality_corp_id);
  }, [
    formData?.perm_block_municipality_corp_id,
  ]);

  return (
    <>
      {/* Aadhaar Address */}
      {/* <div className="p-4 border rounded mb-4">
        <h3 className="text-xl font-semibold mb-4">Permanent Address</h3>
        <div className="mb-4">
          <Label htmlFor="aadhaar_address">
            Flat/ House no./ Street/ Area/ Village <span className="text-red-700">*</span>
          </Label>
          <Textarea
            id="aadhaar_address"
            name="aadhaar_address"
            value={formData?.aadhaar_address || ""}
            required
            onChange={handleChange}
            className="text-start focus-visible:ring-1 focus-visible:shadow-none shadow-sm h-20"
          />
        </div>
      </div> */}

      {/* Permanent Address */}
      <div className="p-4 border rounded mb-4">
        {/* <h3 className="text-xl font-semibold mb-4">Permanent Address Details</h3> */}

        {/* Permanent Address */}
        {/* <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="permanent_address">
              Flat/ House no./ Street/ Area/ Village
              <span className="text-red-700">*</span>
            </Label>
         
            <div className="flex items-center">
              <Checkbox
                id="sameAsAadhaar"
                checked={sameAsAadhaar}
                onCheckedChange={handleSameAsAadhaar}
                className="border-slate-400 shadow-sm"
                disabled={readOnly}
              />
              <Label htmlFor="sameAsAadhaar" className="ml-2">
                Same as Aadhaar Address
              </Label>
            </div>
          </div>
          <Textarea
            id="permanent_address"
            name="permanent_address"
            value={formData?.permanent_address || ""}
            onChange={handleChange}
            required
            disabled={readOnly}
            className={`text-start focus-visible:ring-none focus-visible:ring-0 transition-all ${errors?.permanent_address
              ? "border-red-400 focus-visible:border-red-400 border-2"
              : ""
              }`}
          />
          {errors?.permanent_address && (
            <p className="text-red-500 text-sm">{errors?.permanent_address}</p>
          )}
        </div> */}

        {/* District / Sub-Division / Location Type row */}
        <div className="grid grid-cols-3 gap-6 mb-4">
          {/* PIN Code / Other Details */}
          <div>
            <Label htmlFor="pincode">
              PIN Code<span className="text-red-700">*</span>
            </Label>
            <Input
              id="perm_pincode"
              name="perm_pincode"
              type="number"
              value={formData?.perm_pincode || ""}
              onChange={(e) => {
                const numericValue =
                  e.target.value === "" ? "" : Number(e.target.value);
                handleValidation("perm_pincode", numericValue);
                setFormData((prev) => ({
                  ...prev,
                  perm_pincode: numericValue,
                }));
              }}
              disabled={readOnly}
              required
              className={`${errors?.perm_pincode
                ? "border-red-400 focus-visible:border-red-400 border-2"
                : ""
                }`}
            />
            {errors?.perm_pincode && (
              <p className="text-red-500 text-sm">{errors?.perm_pincode}</p>
            )}
          </div>

          {/* District Combobox */}
          <div>
            <Label htmlFor="district">
              District<span className="text-red-700">*</span>
            </Label>
            <Popover open={permDistrictOpen} onOpenChange={setPermDistrictOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={permDistrictOpen}
                  className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                    }`}
                  id="district"
                >
                  {formData?.permDistrict
                    ? formData?.permDistrict?.inner_boundary_name
                    : "Select District"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search district..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {districts.map((district, index) => (
                        <CommandItem
                          key={index}
                          value={district?.inner_boundary_name || ""}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              permDistrict: district || null,
                              perm_district_id: district?.inner_boundary_id || 0,
                              permSubDivision: null,
                              perm_subdivision_id: 0,
                              permLocationType: "",
                              permBlock: null,
                              perm_block_id: 0,
                              permMunicipality: null,
                              perm_corporation_municipality_id: 0,
                              permGramPanchayat: null,
                              perm_gram_panchayat_id: 0,
                              permWard: "",
                              permWard_id: 0,
                            }));
                            setPermDistrictOpen(false);
                          }}
                        >
                          {district?.inner_boundary_name}
                          {formData?.permDistrict?.inner_boundary_id ===
                            district.inner_boundary_id && (
                              <Check className={cn("ml-auto")} />
                            )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sub-Division Combobox */}
          {(formData?.permDistrict?.inner_boundary_name?.toUpperCase() !== "KOLKATA") && <div>
            <Label htmlFor="subDivision">
              Sub-Division<span className="text-red-700">*</span>
            </Label>
            <Popover open={permSubDivisionOpen} onOpenChange={setPermSubDivisionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={permSubDivisionOpen}
                  className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                    }`}
                  id="subDivision"
                  disabled={!formData.permDistrict}
                >
                  {formData?.permSubDivision
                    ? formData?.permSubDivision?.inner_boundary_name
                    : "Select Sub-Division"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search sub-division..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No sub-division found.</CommandEmpty>
                    <CommandGroup>
                      {permSubDivisions.map((subDiv) => (
                        <CommandItem
                          key={subDiv.inner_boundary_id}
                          value={subDiv?.inner_boundary_name}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              permSubDivision: subDiv,
                              perm_subdivision_id: subDiv.inner_boundary_id,
                              permLocationType: "",
                              permBlock: null,
                              perm_block_id: 0,
                              permMunicipality: null,
                              perm_corporation_municipality_id: 0,
                              permGramPanchayat: null,
                              perm_gram_panchayat_id: 0,
                              permWard: "",
                              permWard_id: 0,
                            }));
                            setPermSubDivisionOpen(false);
                            getPermBlocks(subDiv.inner_boundary_id);
                          }}
                        >
                          {subDiv?.inner_boundary_name}
                          {formData?.permSubDivision?.inner_boundary_id ===
                            subDiv.inner_boundary_id && (
                              <Check className={cn("ml-auto")} />
                            )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          }

          {/* Block/Municipality/Corporation Combobox */}
          <div>
            <Label htmlFor="block">Block/Municipality/Corporation<span className="text-red-600 font-bold">*</span></Label>
            <Popover open={permBlockOpen} onOpenChange={setPermBlockOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={permBlockOpen}
                  className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                    }`}
                  id="block"
                  disabled={
                    readOnly
                  }
                >
                  {formData?.permBlock?.block_municipality_corp_name
                    ? formData?.permBlock?.block_municipality_corp_name
                    : "Select Block/Municipality/Corporation"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search block/municipality/corporation..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No block/municipality/corporation found.</CommandEmpty>
                    <CommandGroup>
                      {permBlocks.map((block) => (
                        <CommandItem
                          key={block.block_municipality_corp_id}
                          value={block?.block_municipality_corp_name}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              permBlock: block,
                              perm_block_municipality_corp_id: block.block_municipality_corp_id,
                              perm_block_municipality_corp_name: block.block_municipality_corp_name,
                              permGramPanchayat: null,
                              perm_gp_ward_id: 0,
                            }));
                            setPermBlockOpen(false);
                            getGPWardDetails(block?.block_municipality_corp_id);
                          }}
                        >
                          {block?.block_municipality_corp_name}
                          {formData?.permBlock?.block_municipality_corp_id ===
                            block.block_municipality_corp_id && (
                              <Check className={cn("ml-auto")} />
                            )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Gram Panchayat/ Ward Combobox */}
          {formData?.permBlock && (
            <div>
              <Label htmlFor="permGramPanchayat">
                Ward/Gram Panchayat<span className="text-red-700">*</span>
              </Label>
              <Popover open={permGpOpen} onOpenChange={setPermGpOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={permGpOpen}
                    className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                      }`}
                    id="permGramPanchayat"
                    disabled={readOnly}
                  >
                    {formData?.permGramPanchayat
                      ? formData?.permGramPanchayat?.gp_ward_name
                      : "Select Ward/Gram Panchayat"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search ward/gram-panchayat..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      <CommandEmpty>No ward/gram-panchayat found.</CommandEmpty>
                      <CommandGroup>
                        {permGramPanchayats.map((gp) => (
                          <CommandItem
                            key={gp?.gp_ward_id}
                            value={gp?.gp_ward_name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                permGramPanchayat: gp,
                                perm_gp_ward_id: gp?.gp_ward_id,
                              }));
                              setPermGpOpen(false);
                            }}
                          >
                            {gp?.gp_ward_name}
                            {formData?.permGramPanchayat?.gp_ward_id ===
                              gp?.gp_ward_id && (
                                <Check className={cn("ml-auto")} />
                              )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

        </div>

      </div>

      {/* Other Address */}
      <div className="p-4 border rounded">
        <h3 className="text-xl font-semibold mb-4">Other Address Details <span className="text-slate-400 text-sm">(if any)</span></h3>

        {/* Current Address */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="current_address">
              Any Other Address <span className="text-slate-400 font-bold">(optional)</span>
            </Label>
          </div>

          <Textarea
            id="address_other_details"
            name="address_other_details"
            value={formData?.address_other_details || ""}
            disabled={readOnly}
            onChange={handleChange}
            required
            className={`text-start focus-visible:ring-none focus-visible:ring-0 transition-all ${errors?.address_other_details
              ? "border-red-400 focus-visible:border-red-400 border-2"
              : ""
              }`}
          />
          {errors?.address_other_details && (
            <p className="text-red-500 text-sm">{errors?.address_other_details}</p>
          )}
        </div>

      </div>

      {/* emergency contact details */}
      <div className="p-4 border rounded mt-4">
        <h3 className="text-xl font-semibold mb-4">Emergency Contact Details</h3>

        <h3 className="text-md font-semibold mb-4 text-slate-400">Primary Contact Person</h3>
        {/* 1st contact details */}
        <div className="grid grid-cols-3 gap-6 mb-4">

          <div>
            <Label htmlFor="emergency_person_contact_one">
              Contact No. <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              disabled={readOnly}
              id="emergency_person_contact_one"
              name="emergency_person_contact_one"
              value={formData?.emergency_person_contact_one || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="emergency_person_contact_one_name">
              Name <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              disabled={readOnly}
              id="emergency_person_contact_one_name"
              name="emergency_person_contact_one_name"
              value={formData?.emergency_person_contact_one_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="emergency_person_contact_one_relation">
              Relation<span className="text-red-500">*</span>
            </Label>
            {/* Replacing the Select dropdown with a combobox */}
            <Popover
              open={openRelationship1}
              onOpenChange={setOpenRelationship1}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openRelationship1}
                  id="emergency_person_contact_one_relation"
                  className={`w-full justify-between`}
                >
                  {formData.emergency_person_contact_one_relation &&
                    relationTypes.length > 0
                    ? relationTypes.find(
                      (relation) =>
                        relation.relation_type_name ===
                        formData.emergency_person_contact_one_relation
                    )?.relation_type_name || "Select Relationship"
                    : "Select Relationship"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search Relationship..."
                    className="h-9"
                  />
                  <CommandList>
                    {relationTypes.length > 0 ? (
                      <CommandGroup>
                        {relationTypes.map((relation) => (
                          <CommandItem
                            key={relation.relation_type_id}
                            value={relation.relation_type_name.toString()}
                            onSelect={(currentValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                emergency_person_contact_one_relation: currentValue,
                              }));
                              setOpenRelationship1(false);
                            }}
                          >
                            {relation.relation_type_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>Loading...</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <h3 className="text-md font-semibold mb-4 text-slate-400">Secondary Contact Person</h3>
        {/* 2nd contact details */}
        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <Label htmlFor="emergency_person_contact_two">
              Contact No. <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              disabled={readOnly}
              id="emergency_person_contact_two"
              name="emergency_person_contact_two"
              value={formData?.emergency_person_contact_two || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="emergency_person_contact_two_name">
              Name <span className="text-red-500 font-bold">*</span>
            </Label>
            <Input
              disabled={readOnly}
              id="emergency_person_contact_two_name"
              name="emergency_person_contact_two_name"
              value={formData?.emergency_person_contact_two_name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="emergency_person_contact_two_relation">
              Relation<span className="text-red-500">*</span>
            </Label>
            {/* Replacing the Select dropdown with a combobox */}
            <Popover
              open={openRelationship2}
              onOpenChange={setOpenRelationship2}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openRelationship2}
                  id="emergency_person_contact_two_relation"
                  className={`w-full justify-between`}
                >
                  {formData.emergency_person_contact_two_relation &&
                    relationTypes.length > 0
                    ? relationTypes.find(
                      (relation) =>
                        relation.relation_type_name ===
                        formData.emergency_person_contact_two_relation
                    )?.relation_type_name || "Select Relationship"
                    : "Select Relationship"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search Relationship..."
                    className="h-9"
                  />
                  <CommandList>
                    {relationTypes.length > 0 ? (
                      <CommandGroup>
                        {relationTypes.map((relation) => (
                          <CommandItem
                            key={relation.relation_type_id}
                            value={relation.relation_type_name.toString()}
                            onSelect={(currentValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                emergency_person_contact_two_relation: currentValue,
                              }));
                              setOpenRelationship2(false);
                            }}
                          >
                            {relation.relation_type_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>Loading...</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

        </div>
      </div>

    </>
  );
}

export default AddressDetailsSection;
