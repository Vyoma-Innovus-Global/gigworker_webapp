"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getAuthorityMISReport } from "./api"
import { Check, ChevronsUpDown, ContactRound, Loader2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import moment from "moment"
import Image from "next/image"
import BackgroundImg from "@/assets/bg_img_1.jpg"
import { DataTable } from "@/components/reusable-datatable"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { fetchBoundaryDetailsAPI, getAllAgeGroupDetailsAPI, getAllNatureIndustryAPI, getAllOccupationAPI, getAllOrganizationAPI, getBlockMunicipalityCoorporationAPI, getGPWardDetailsAPI } from "@/app/workers-registration-form/api"
import Cookies from "react-cookies"
import { DatePicker } from "@/components/reusables/date-picker"
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/multi-select"

const UdinGeneratedDtlsTable = () => {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [occupationOptions, setOccupationOptions] = useState([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [natureIndustryOptions, setNatureIndustryOptions] = useState([]);
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [formData, setFormData] = useState({
    permDistrict: null,
    perm_district_id: 0,
    permSubDivision: null,
    perm_sub_divison_id: 0,
    permLocationType: "",
    permBlock: null,
    block_id: 0,
    municipality: null,
    perm_block_municipality_corp_id: 0,
    perm_block_municipality_corp_name: "",
    permMunicipality: null,
    permGramPanchayat: null,
    perm_gp_ward_id: "0",
    ward_no: "",
    perm_pin_code: "",
    gender_id: "0",
    grade_id: "0",
    occupation_type_id: "0",
    nature_of_industry_id: "0",
    organization_id: "",
    age_group_id: "0",
    work_experience: "0",
  })

  const gradeOptions = [
    { value: "0", label: "All Grade" },
    { value: "1", label: "Undergraduate" },
    { value: "2", label: "Graduate" },
    { value: "3", label: "Postgraduate" },
    { value: "4", label: "PhD" },
    { value: "5", label: "Diploma" },
    { value: "6", label: "High School" },
    { value: "7", label: "None" },
  ];

  const experienceOptions = [
    { value: "0", label: "0-1 Years" },
    { value: "1", label: "1-3 Years" },
    { value: "3", label: "3-5 Years" },
    { value: "5", label: "5-10 Years" },
    { value: "10", label: "10+ Years" },
  ];

  const [permDistrictOpen, setPermDistrictOpen] = useState(false)
  const [permSubDivisionOpen, setPermSubDivisionOpen] = useState(false)
  const [permBlockOpen, setPermBlockOpen] = useState(false)
  const [permGpOpen, setPermGpOpen] = useState(false)
  const [districts, setDistricts] = useState([])
  const [permSubDivisions, setPermSubDivisions] = useState([])
  const [permBlocks, setPermBlocks] = useState([])
  const [permGramPanchayats, setPermGramPanchayats] = useState([])
  const [errors, setErrors] = useState({})
  const [startDate, setStartDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));

  const loginUserID = Cookies.load("login_user_id") || 1
  const uid = Cookies.load("authority_user_id")
  const boundary_level_id = Cookies.load("boundary_level_id")
  const boundary_id = Cookies.load("boundary_id")
  console.log("boundary_level_id:", boundary_level_id)
  console.log("boundary_level_id type:", typeof boundary_level_id)
  // 1. On load: Fetch districts
  // Around line 107-119, modify to:
  useEffect(() => {
    const getDistricts = async () => {
      try {
        const response = await fetchBoundaryDetailsAPI(1, 1, 1, loginUserID)
        console.log("Districts response:", response) // ADD THIS
        setDistricts(response?.data || [])
      } catch (error) {
        console.error("Error fetching districts:", error)
        setDistricts([])
      }
    }
    getDistricts()
    setIsClient(true)
  }, [loginUserID])


  // Add this after your existing district-fetching useEffect (around line 115)
  useEffect(() => {
    // Pre-select district if user is at district level (boundary_level_id = 2)
    if (Number(boundary_level_id) === 2 && boundary_id && districts.length > 0) {
      const userDistrict = districts.find(
        (d) => d.inner_boundary_id === Number(boundary_id)
      );

      if (userDistrict && !formData.permDistrict) {
        console.log("Pre-selecting district:", userDistrict);
        setFormData((prev) => ({
          ...prev,
          permDistrict: userDistrict,
          perm_district_id: userDistrict.inner_boundary_id,
        }));
      }
    }
  }, [districts, boundary_level_id, boundary_id, formData.permDistrict]);

  // 2. Fetch Subdivisions after District selection
  // Set default permanent district


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


  // get Block/Municipality/Corporation
  const getPermBlocks = async (subdivision_id) => {
    try {
      const response = await getBlockMunicipalityCoorporationAPI(subdivision_id)
      const data = response.data
      if (data.length === 1) {
        setFormData((prev) => ({
          ...prev,
          permBlock: data[0],
          perm_block_municipality_corp_id: data[0].block_municipality_corp_id,
          perm_block_municipality_corp_name: data[0].block_municipality_corp_name,
        }))
      }
      setPermBlocks(response.data || [])
    } catch (error) {
      console.error("Error fetching permanent blocks:", error)
      setPermBlocks([])
    }
  }

  // get GP/Ward Details
  const getGPWardDetails = async (block_municipality_corp_id) => {
    try {
      const response = await getGPWardDetailsAPI(block_municipality_corp_id)
      setPermGramPanchayats(response.data || [])
    } catch (error) {
      console.error("Error fetching permanent gram panchayats/wards:", error)
      setPermGramPanchayats([])
    }
  }

  // Fetch blocks when subdivision changes
  useEffect(() => {
    if (formData?.perm_sub_divison_id) {
      getPermBlocks(formData.perm_sub_divison_id)
    }
  }, [formData.perm_sub_divison_id])

  // Fetch GP/Ward details when block/municipality changes
  useEffect(() => {
    if (formData?.perm_block_municipality_corp_id) {
      getGPWardDetails(formData.perm_block_municipality_corp_id)
    }
  }, [formData.perm_block_municipality_corp_id])

  // Validation function
  const handleValidation = (field, value) => {
    const newErrors = { ...errors }

    setErrors(newErrors)
  }

  // 1. On load: Fetch districts


  // Occupation Api
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

  // Age Group Api
  useEffect(() => {

    const fetchAgeGroups = async () => {
      try {
        const result = await getAllAgeGroupDetailsAPI();
        if (result && result.data) {
          const mapped = result.data.map((item) => ({
            value: item.age_group_id.toString(),
            label: item.age_group_name,
          }));
          setAgeGroupOptions(mapped);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAgeGroups();
  }, []);

  // Fetch Nature Industry Options using AbortController.
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
      console.error("Error fetching nature industry options:", error);
    }
  };

  const fetchOrganizations = async (nature_of_industry_id) => {
    try {
      const result = await getAllOrganizationAPI(0, nature_of_industry_id);
      if (result && result.data) {
        const mapped = result.data.map((item) => ({
          value: item.organization_id.toString(),
          label: item.organization_name,
        }));
        setOrganizationOptions(mapped);
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    // Form validation before search
    let formIsValid = true
    const newErrors = {}

    if (!formIsValid) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {

      const result = await getAuthorityMISReport(
        uid || 1, // login_user_id
        startDate, // from_date
        endDate, // to_date
        0, // gender_id
        formData.perm_district_id || 0, // perm_district_id
        formData.perm_sub_divison_id || 0, // perm_sub_divison_id
        formData.perm_pin_code || 0, // perm_pin_code
        0, // grade_id
        0, // occupation_type_id
        0, // nature_of_industry_id
        "", // organisation_id
        0, // age_group_id
        0, // work_experience
        formData.perm_block_municipality_corp_id || 0, // perm_block_municipality_corp_id
        formData.perm_gp_ward_id || 0, // perm_gp_ward_id
      );

      if (result?.status === 4) {
        setError(result?.message || "No Data found")
        setData([])
      } else {
        console.log(result?.data)

        setData(result?.data || [])
        if (result?.data?.length == 0) {
          setError("No data found")
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch data. Please try again.")
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "application_number", header: "Application No." },
    { accessorKey: "individual_name", header: "Name" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "blood_group", header: "Blood Group" },
    { accessorKey: "perm_district_name", header: "District" },
    { accessorKey: "perm_subdivision_name", header: "Sub-Division" },
    { accessorKey: "perm_block_name", header: "Block" },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => row.original?.grade || "N/A",
    },
    { accessorKey: "pin_code", header: "PIN Code" },
    {
      accessorKey: "list_of_organisations",
      header: "Organizations",
      cell: ({ row }) => row.original?.list_of_organisations || "N/A",
    },
    {
      accessorKey: "list_of_occupation_types",
      header: "Occupation Types",
      cell: ({ row }) => row.original?.list_of_occupation_types || "N/A",
    },
    {
      accessorKey: "list_of_nature_of_industry",
      header: "Nature of Industry",
      cell: ({ row }) => row.original?.list_of_nature_of_industry || "N/A",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" className="rounded-full hover:animate-pulse">
          <Link
            href={`/admin/worker-details/${btoa(
              row.original?.application_id || "",
            )}/${btoa(row.original?.application_number || "")}`}
          >
            <ContactRound />
          </Link>
        </Button>
      ),
    },
  ];



  useEffect(() => {
    console.log("fetched")
  }, [data])

  if (!isClient) return null

  return (
    <div className="px-6 py-2 justify-center flex w-full">
      <Image
        src={BackgroundImg || "/placeholder.svg"}
        alt="Background Image"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-10 object-cover"
        width={1920}
        height={1080}
        priority
      />
      <Card className="max-w-6xl w-full mx-auto z-10">
        <div className="my-0 bg-white dark:bg-gray-800 overflow-hidden rounded-md">
          <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
            <h2 className="text-2xl font-bold text-white">Custom Query Wise MIS Report</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Start Date */}
              <div className="flex flex-col gap-2 justify-end">
                <Label htmlFor="from_date">
                  Start Date<span className="text-red-700">*</span>
                </Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-2 justify-end">
                <Label htmlFor="to_date">
                  To Date<span className="text-red-700">*</span>
                </Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>

              {/* District Combobox */}
              {Number(boundary_level_id) != 4 && Number(boundary_level_id) != 5 && (
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
                        className="w-full justify-between mt-1"
                        id="district"
                        disabled={Number.parseInt(boundary_level_id) === 2}
                      >
                        {formData?.permDistrict ? formData?.permDistrict.inner_boundary_name : "Select District"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search district..." className="h-9 outline-none" />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value={0}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  permDistrict: null,
                                  perm_district_id: 0,
                                  permSubDivision: null,
                                  perm_sub_divison_id: 0,
                                  permLocationType: "",
                                  permBlock: null,
                                  perm_block_municipality_corp_id: 0,
                                  perm_block_municipality_corp_name: "",
                                  permMunicipality: null,
                                  permGramPanchayat: null,
                                  perm_gp_ward_id: 0,
                                  ward_no: "",
                                  perm_pin_code: "",
                                }))
                                setPermDistrictOpen(false)
                              }}
                            >
                              All District
                            </CommandItem>
                            {districts.map((district) => (
                              <CommandItem
                                key={district.inner_boundary_id}
                                value={district.inner_boundary_name || ""}
                                onSelect={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    permDistrict: district || null,
                                    perm_district_id: district?.inner_boundary_id || 0,
                                    permSubDivision: null,
                                    perm_sub_divison_id: 0,
                                    permLocationType: "",
                                    permBlock: null,
                                    perm_block_municipality_corp_id: 0,
                                    perm_block_municipality_corp_name: "",
                                    permMunicipality: null,
                                    permGramPanchayat: null,
                                    perm_gp_ward_id: 0,
                                    ward_no: "",
                                    perm_pin_code: "",
                                  }))
                                  setPermDistrictOpen(false)
                                }}
                              >
                                {district.inner_boundary_name}
                                {formData?.permDistrict?.inner_boundary_id === district.inner_boundary_id && (
                                  <Check className="ml-auto h-4 w-4" />
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

              {/* Sub-Division Combobox */}
              {boundary_level_id != 5 && formData?.permDistrict?.inner_boundary_name?.toUpperCase() !== "KOLKATA" && (
                <div>
                  <Label htmlFor="subDivision">
                    Sub-Division<span className="text-red-700">*</span>
                  </Label>
                  <Popover open={permSubDivisionOpen} onOpenChange={setPermSubDivisionOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={permSubDivisionOpen}
                        className="w-full justify-between mt-1"
                        id="subDivision"
                        disabled={Number.parseInt(boundary_level_id) === 4 || !formData.permDistrict}
                      >
                        {formData?.permSubDivision
                          ? formData?.permSubDivision.inner_boundary_name
                          : "Select Sub-Division"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search sub-division..." className="h-9 outline-none" />
                        <CommandList>
                          <CommandEmpty>No sub-division found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value={0}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  permDistrict: null,
                                  perm_district_id: 0,
                                  permSubDivision: null,
                                  perm_sub_divison_id: 0,
                                  permLocationType: "",
                                  permBlock: null,
                                  perm_block_municipality_corp_id: 0,
                                  perm_block_municipality_corp_name: "",
                                  permMunicipality: null,
                                  permGramPanchayat: null,
                                  perm_gp_ward_id: 0,
                                  ward_no: "",
                                  perm_pin_code: "",
                                }))
                                setPermDistrictOpen(false)
                              }}
                            >
                              All Sub-Division
                            </CommandItem>
                            {permSubDivisions.map((subDiv) => (
                              <CommandItem
                                key={subDiv.inner_boundary_id}
                                value={subDiv.inner_boundary_name}
                                onSelect={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    permSubDivision: subDiv,
                                    perm_sub_divison_id: subDiv.inner_boundary_id,
                                    permLocationType: "",
                                    permBlock: null,
                                    perm_block_municipality_corp_id: 0,
                                    perm_block_municipality_corp_name: "",
                                    permMunicipality: null,
                                    permGramPanchayat: null,
                                    perm_gp_ward_id: 0,
                                    ward_no: "",
                                    perm_pin_code: "",
                                  }))
                                  setPermSubDivisionOpen(false)
                                  getPermBlocks(subDiv.inner_boundary_id)
                                }}
                              >
                                {subDiv.inner_boundary_name}
                                {formData?.permSubDivision?.inner_boundary_id === subDiv.inner_boundary_id && (
                                  <Check className="ml-auto h-4 w-4" />
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

              {/* Block/Municipality/Corporation Combobox */}
              <div>
                <Label htmlFor="block">
                  Block/Municipality/Corporation<span className="text-red-600 font-bold">*</span>
                </Label>
                <Popover open={permBlockOpen} onOpenChange={setPermBlockOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={permBlockOpen}
                      className="w-full justify-between mt-1"
                      id="block"
                      disabled={Number.parseInt(boundary_level_id) === 5}
                    >
                      {formData?.permBlock?.block_municipality_corp_name
                        ? formData?.permBlock?.block_municipality_corp_name
                        : "Block/Municipality/Corporation"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                          <CommandItem
                            value={0}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                permDistrict: null,
                                perm_district_id: 0,
                                permSubDivision: null,
                                perm_sub_divison_id: 0,
                                permLocationType: "",
                                permBlock: null,
                                perm_block_municipality_corp_id: 0,
                                perm_block_municipality_corp_name: "",
                                permMunicipality: null,
                                permGramPanchayat: null,
                                perm_gp_ward_id: 0,
                                ward_no: "",
                                perm_pin_code: "",
                              }))
                              setPermDistrictOpen(false)
                            }}
                          >
                            All Block/Municipality/Corporation
                          </CommandItem>
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
                                }))
                                setPermBlockOpen(false)
                                getGPWardDetails(block?.block_municipality_corp_id)
                              }}
                            >
                              {block?.block_municipality_corp_name}
                              {formData?.permBlock?.block_municipality_corp_id === block.block_municipality_corp_id && (
                                <Check className="ml-auto h-4 w-4" />
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
                        className="w-full justify-between mt-1"
                        id="permGramPanchayat"
                        disabled={Number.parseInt(boundary_level_id) === 6}
                      >
                        {formData?.permGramPanchayat
                          ? formData?.permGramPanchayat?.gp_ward_name
                          : "Select Ward/Gram Panchayat"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search ward/gram-panchayat..." className="h-9 outline-none" />
                        <CommandList>
                          <CommandEmpty>No ward/gram-panchayat found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value={0}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  permDistrict: null,
                                  perm_district_id: 0,
                                  permSubDivision: null,
                                  perm_sub_divison_id: 0,
                                  permLocationType: "",
                                  permBlock: null,
                                  perm_block_municipality_corp_id: 0,
                                  perm_block_municipality_corp_name: "",
                                  permMunicipality: null,
                                  permGramPanchayat: null,
                                  perm_gp_ward_id: 0,
                                  ward_no: "",
                                  perm_pin_code: "",
                                }))
                                setPermDistrictOpen(false)
                              }}
                            >
                              All Ward/Gram-Panchayat
                            </CommandItem>
                            {permGramPanchayats.map((gp) => (
                              <CommandItem
                                key={gp?.gp_ward_id}
                                value={gp?.gp_ward_name}
                                onSelect={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    permGramPanchayat: gp,
                                    perm_gp_ward_id: gp?.gp_ward_id,
                                  }))
                                  setPermGpOpen(false)
                                }}
                              >
                                {gp?.gp_ward_name}
                                {formData?.permGramPanchayat?.gp_ward_id === gp?.gp_ward_id && (
                                  <Check className="ml-auto h-4 w-4" />
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

              {/* Gender Dropdown */}
              <div className="flex flex-col gap-2 justify-end">
                <Label>Gender</Label>
                <Select value={formData.gender_id || 0} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Gender</SelectItem>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="2">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pincode */}
              <div className="flex flex-col gap-2 justify-end">
                <Label htmlFor="from_date">
                  Pin Code
                </Label>
                <Input
                  id="pin_code"
                  name="pin_code"
                  type="number"

                  value={formData?.pin_code || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, pin_code: e.target.value }))
                  }}
                  placeholder="Enter Pincode"
                />
              </div>

              {/* Grade Selection Dropdown */}
              <div className="flex flex-col gap-2 justify-end">
                <Label>Grade</Label>
                <Select value={formData?.grade_id || 0} onValueChange={(value) => setFormData((prev) => ({ ...prev, grade_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions?.map((grade, i) => (
                      <SelectItem key={i} value={grade?.value}>
                        {grade?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Occupation Dropdown */}
              <div className="flex flex-col gap-2">
                <Label>Occupation</Label>
                <Select value={formData.occupation_type_id}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, occupation_type_id: value }))
                    fetchNatureIndustry(value);
                  }
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      All Occupations
                    </SelectItem>
                    {occupationOptions.map((option, i) => (
                      <SelectItem key={i} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nature of Industry Dropdown */}
              <div className="flex flex-col gap-2">
                <Label>Nature of Industry</Label>
                <Select value={formData.nature_of_industry_id}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, nature_of_industry_id: value }))
                    fetchOrganizations(value);
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Nature of Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      All Nature of Industry
                    </SelectItem>
                    {natureIndustryOptions?.map((option, i) => (
                      <SelectItem key={i} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end gap-2">
                <Label htmlFor="organizations">
                  Organizations
                </Label>
                <MultiSelect
                  options={organizationOptions}
                  selected={organizationOptions?.filter((option) =>
                    formData?.organization_id?.includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    setFormData((prev) => ({
                      ...prev,
                      organization_id: selectedOptions.map((opt) => opt.value),
                    }));
                  }}
                  placeholder="Organizations"
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                />
              </div>

              {/* Age Group Dropdown */}
              <div className="flex flex-col gap-2">
                <Label>Age Group</Label>
                <Select value={formData.age_group_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, age_group_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Age Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      All Age Groups
                    </SelectItem>
                    {ageGroupOptions?.map((option, i) => (
                      <SelectItem key={i} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience as GIG Worker */}
              <div className="p-0 rounded">
                <Label htmlFor="work_experience" className="block mb-2">
                  Work Experience
                </Label>
                <Select
                  value={formData?.work_experience}
                  onValueChange={(value) =>
                    setFormData({ ...formData, work_experience: value })
                  }
                >
                  <SelectTrigger id="work_experience">
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

            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto md:px-8 mx-auto block"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                {error}
              </div>
            )}
          </div>

          <hr className="my-4" />

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <span className="flex gap-1 justify-center items-center">
                  <Loader2 className="animate-spin" />
                  Loading...
                </span>
              </div>
            ) : data?.length == 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data available. Please adjust your search criteria.
              </div>
            ) : (
              <div className="max-w-[100%] flex justify-center overflow-hidden">
                <DataTable data={data} columns={columns} className="w-full" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default UdinGeneratedDtlsTable
