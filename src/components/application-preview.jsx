"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    User,
    Briefcase,
    CreditCard,
    Car,
    MapPin,
    GraduationCap,
    Users,
    Calendar,
    Building,
    Clock,
    FileText,
    IdCard,
    Droplet,
    UsersRound,
    Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
    getGigWorkerBankInfoAPI,
    getGigWorkerBasicInfoAPI,
    getGigWorkerWorkRelatedInfoAPI,
    getGigWorkerVehicleInfoAPI,
    getGigWorkerAadharVerifiedDetailsAPI
} from "@/app/workers-registration-form/api";
import Cookies from "react-cookies";

const ApplicationPreview = ({ openDisclaimerDialog = true, aadhaarNotVerified=false, applicationNo, applicationID }) => {

    const [workData, setWorkData] = useState(null);
    const [basicData, setBasicData] = useState(null);
    const [bankData, setBankData] = useState(null);
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("basic");
    const [otherInfo, setOtherInfo] = useState(null);


    useEffect(() => {
        const fetchDataAadhaarVerified = async () => {
            try {
                const response = await getGigWorkerAadharVerifiedDetailsAPI(applicationID);
                const details = response?.data;

                setBasicData(details);

                // Bank Mapping
                const parsedBankInfo = details?.bank_info ? JSON.parse(details.bank_info)[0] : null;
                setBankData(parsedBankInfo ? {
                    self_bank_name: parsedBankInfo.SelfBankName,
                    self_bank_branch: parsedBankInfo.SelfBankBranch,
                    self_bank_ifsc_code: parsedBankInfo.SelfBankIFSCCode,
                    self_bank_acc_no: parsedBankInfo.SelfBankAccNo,
                    nominee_bank_name: parsedBankInfo.NomineeBankName,
                    nominee_bank_branch: parsedBankInfo.NomineeBankBranch,
                    nominee_bank_ifsc_code: parsedBankInfo.NomineeBankIFSCCode,
                    nominee_bank_acc_no: parsedBankInfo.NomineeBankAccNo,
                } : null);

                // Vehicle Mapping
                const parsedVehicleInfo = details?.vehicle_info ? JSON.parse(details.vehicle_info) : [];
                setVehicleData(parsedVehicleInfo?.length > 0
                    ? {
                        arr_vehicle_details: parsedVehicleInfo.map(vehicle => ({
                            vehicle_id: vehicle.VehicleID,
                            vehicle_registration_type_id: vehicle.VehicleRegistrationTypeID,
                            vehicle_registration_type_name: vehicle.VehicleRegistrationTypeName,
                            vehicle_category_id: vehicle.VehicleCategoryID,
                            vehicle_category_name: vehicle.VehicleCategoryName,
                            vehicle_type_id: vehicle.VehicleTypeID,
                            vehicle_type_name: vehicle.VehicleTypeName,
                            is_self_owned: vehicle.IsSelfOwned,
                            registration_number: vehicle.RegistrationNumber,
                            driving_license: vehicle.DrivingLicense,
                        }))
                    }
                    : { arr_vehicle_details: [] }
                );

                // Work Mapping
                const parsedWorkInfo = details?.work_related_info ? JSON.parse(details.work_related_info) : [];
                setWorkData(parsedWorkInfo?.length > 0
                    ? parsedWorkInfo.map(work => ({
                        applicationID: work.ApplicationID,
                        occupation_type_id: work.OccupationTypeID,
                        occupation_type_name: work.OccupationTypeName,
                        nature_industry_id: work.NatureIndustryID,
                        nature_industry_name: work.NatureIndustryName,
                        organization_id: work.OrganizationID,
                        organization_name: work.OrganizationName,
                        experience_year: work.ExperienceYear,
                        occupation_id: work.OccupationID,
                        is_currently_working: work.IsCurrentlyWorking,
                    }))
                    : []
                );

                // Other Info Mapping
                const parsedOtherInfo = details?.other_info ? JSON.parse(details.other_info)[0] : null;
                setOtherInfo(parsedOtherInfo || null);

            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            try {
                const uid = Cookies.load("uid");
                const aid = Cookies.load("aid");
              const workResponse = await getGigWorkerWorkRelatedInfoAPI(
                aid,
                uid
              );
              const basicResponse = await getGigWorkerBasicInfoAPI(aid, uid);
              const bankResponse = await getGigWorkerBankInfoAPI(aid, uid);
              const vehicleResponse = await getGigWorkerVehicleInfoAPI(aid, uid);
      
              setWorkData(workResponse.data);
              setBasicData(basicResponse.data);
              setBankData(bankResponse.data);
              setVehicleData(vehicleResponse.data);
            } catch (err) {
              setError("Failed to fetch data");
            } finally {
              setLoading(false);
            }
          };

        if (applicationID && aadhaarNotVerified) {
            console.log("Fetching Aadhaar Verified Data");
            fetchData();
        }else {
            fetchDataAadhaarVerified();
        }
    }, [openDisclaimerDialog, applicationID]);


    const InfoItem = ({ icon, label, value, className = "" }) => (
        <div
            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${className}`}
        >
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="font-medium">{value || "-"}</p>
            </div>
        </div>
    );

    return (
        <Card className="border-0 shadow-lg overflow-hidden z-1">
            <div className="bg-gradient-to-r from-violet-600 to-amber-600 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center">
                    <div className="bg-white/10 p-3 rounded-full mr-4">
                        <User
                            src={basicData?.photo_file}
                            className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {loading
                                ? "Loading..."
                                : basicData?.gig_worker_name || "GIG Worker Details"}
                        </h1>
                    </div>
                </div>
                <div className="text-slate-200 text-sm flex flex-col">{applicationNo ? <><span>Registration Number:</span> <span className="text-lg font-bold">{applicationNo}</span></> : null}</div>
            </div>

            <CardContent className="p-0">
                {loading ? (
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="p-6">
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                            <FileText className="h-6 w-6 mx-auto mb-2" />
                            {error}
                        </div>
                    </div>
                ) : (
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <div className="border-b">
                            <TabsList className="h-auto p-0 bg-transparent w-full justify-start overflow-x-auto">
                                <TabsTrigger
                                    value="basic"
                                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Basic Info
                                </TabsTrigger>
                                <TabsTrigger
                                    value="vehicle"
                                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                                >
                                    <Car className="h-4 w-4 mr-2" />
                                    Vehicle Details
                                </TabsTrigger>
                                <TabsTrigger
                                    value="work"
                                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                                >
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Work Experience
                                </TabsTrigger>
                                {!aadhaarNotVerified && <TabsTrigger
                                    value="other"
                                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Educational and Nominee Info
                                </TabsTrigger>}
                                <TabsTrigger
                                    value="bank"
                                    className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Banking Info
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Basic Info */}
                        <TabsContent value="basic" className="p-6 mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {/* Personal Info */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-primary" />
                                        Personal Information
                                    </h3>
                                    <div className="border bg-muted/30 rounded-xl p-2 grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <InfoItem icon={<User className="h-5 w-5 text-primary" />} label="Full Name" value={basicData?.gig_worker_name} />
                                        <InfoItem icon={<Users className="h-5 w-5 text-primary" />} label="Gender" value={basicData?.gender_name} />
                                        <InfoItem icon={<Calendar className="h-5 w-5 text-primary" />} label="Date of Birth" value={basicData?.date_of_birth} />
                                        <InfoItem icon={<User className="h-5 w-5 text-primary" />} label="Father/Husband Name" value={basicData?.father_or_husband_name} />
                                        <InfoItem icon={<UsersRound className="h-5 w-5 text-primary" />} label="Marital Status" value={basicData?.marital_status === "1" ? "Married" : "Unmarried"} />
                                        <InfoItem icon={<Droplet className="h-5 w-5 text-primary" />} label="Blood Group" value={basicData?.blood_group_name} />
                                        <InfoItem icon={<IdCard className="h-5 w-5 text-primary" />} label="PAN Card" value={basicData?.pan_card} />
                                    </div>
                                </div>

                                {/* Address Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Permanent Address */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                                            Permanent Address
                                        </h3>
                                        <div className="border bg-muted/30 rounded-xl p-2 space-y-4">
                                            <InfoItem icon={<MapPin className="h-5 w-5 text-primary" />} label="Address" value={basicData?.permanent_address} />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <InfoItem icon={<GraduationCap className="h-5 w-5 text-primary" />} label="District" value={basicData?.perm_district_name} />
                                                {(basicData?.perm_subdivision_name?.toUpperCase() !== "KOLKATA" && basicData?.perm_sub_division_name?.toUpperCase() !== "KOLKATA") ? <InfoItem icon={<GraduationCap className="h-5 w-5 text-primary" />} label="Sub-Division" value={basicData?.perm_subdivision_name || basicData?.perm_sub_division_name} /> : null }
                                                <InfoItem icon={<MapPin className="h-5 w-5 text-primary" />} label="Block/Municipality/Corporation" value={basicData?.perm_block_municipality_corp_name} />
                                                <InfoItem icon={<MapPin className="h-5 w-5 text-primary" />} label="Ward/Gram-Panchayat" value={basicData?.perm_gp_ward_name} />
                                                <InfoItem icon={<MapPin className="h-5 w-5 text-primary" />} label="PIN Code" value={basicData?.perm_pin_code} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact Details */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                            <Phone className="h-5 w-5 mr-2 text-primary" />
                                            Emergency Contact Details
                                        </h3>
                                        <div className="border bg-muted/30 rounded-xl p-2">
                                            <h4 className="text-md font-semibold flex items-center">Primary Contact Person:</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2">
                                                <InfoItem icon={null} label="Name" value={basicData?.emergency_person_contact_one_name} />
                                                <InfoItem icon={null} label="Contact" value={basicData?.emergency_person_contact_one} />
                                                <InfoItem icon={null} label="Relation" value={basicData?.emergency_person_contact_one_relation} />
                                            </div>
                                            <h4 className="text-md font-semibold flex items-center">Secondary Contact Person:</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                                                <InfoItem icon={null} label="Name" value={basicData?.emergency_person_contact_two_name} />
                                                <InfoItem icon={null} label="Contact" value={basicData?.emergency_person_contact_two} />
                                                <InfoItem icon={null} label="Relation" value={basicData?.emergency_person_contact_two_relation} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                        </TabsContent>

                        {/* Vehicle Details */}
                        <TabsContent value="vehicle" className="p-6 mt-0">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Car className="h-5 w-5 mr-2 text-primary" />
                                Vehicle Details
                            </h3>
                            <div className="overflow-hidden rounded-xl border shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Register as
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Vehicle Category
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Vehicle Type
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Nature of Ownership
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Driving License No.
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Registration Number
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vehicleData?.arr_vehicle_details &&
                                                vehicleData?.arr_vehicle_details?.length > 0 ? (
                                                vehicleData?.arr_vehicle_details?.map(
                                                    (vehicle, index) => (
                                                        <tr
                                                            key={index}
                                                            className={
                                                                index % 2 === 0
                                                                    ? "bg-background"
                                                                    : "bg-muted/20 hover:bg-muted/30"
                                                            }
                                                        >
                                                            <td className="px-4 py-3 text-sm">
                                                                {vehicle?.vehicle_registration_type_name}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                {vehicle?.vehicle_category_name || "-"}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                {vehicle?.vehicle_type_name}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                {vehicle?.is_self_owned ? "Own" : "Hired"}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="font-mono"
                                                                >
                                                                    {vehicle?.driving_license || "-"}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="font-mono"
                                                                >
                                                                    {vehicle?.registration_number || "-"}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="text-center py-8 text-muted-foreground"
                                                    >
                                                        <Car className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                        No vehicle data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Work Experience */}
                        <TabsContent value="work" className="p-6 mt-0">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                                Work Experience
                            </h3>
                            <div className="overflow-hidden rounded-xl border shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Occupation
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Industry
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Organization
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Experience
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Currently Working
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workData && workData?.length > 0 ? (
                                                workData?.map((worker, index) => (
                                                    <tr
                                                        key={index}
                                                        className={
                                                            index % 2 === 0
                                                                ? "bg-background"
                                                                : "bg-muted/20 hover:bg-muted/30"
                                                        }
                                                    >
                                                        <td className="px-4 py-3 text-sm">
                                                            <div className="flex items-center">
                                                                <Briefcase className="h-4 w-4 mr-2 text-primary/70" />
                                                                {worker?.occupation_type_name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <div className="flex items-center">
                                                                <Building className="h-4 w-4 mr-2 text-primary/70" />
                                                                {worker?.nature_industry_name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {worker?.organization_name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <Badge className="flex items-center bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {worker?.experience_year}+ years
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <Badge className="flex items-center bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                                                {worker?.is_currently_working ? "Yes" : "No"}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center py-8 text-muted-foreground"
                                                    >
                                                        <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                        No work experience data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Educational & Nominee Information */}
                        {!aadhaarNotVerified && <TabsContent value="other" className="p-6 mt-0">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-primary" />
                                Educational & Nominee Information
                            </h3>

                            {otherInfo ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Education Details */}
                                    <div className="bg-muted/30 rounded-xl p-4 border shadow-sm space-y-4">
                                        <h4 className="text-md font-semibold flex items-center mb-2">
                                            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                                            Education Details
                                        </h4>
                                        <InfoItem
                                            icon={<Building className="h-5 w-5 text-primary" />}
                                            label="Highest Qualification"
                                            value={otherInfo?.GradeName || "-"}
                                        />
                                        <InfoItem
                                            icon={<GraduationCap className="h-5 w-5 text-primary" />}
                                            label="Degree/Certificate"
                                            value={otherInfo?.EducationalQualification || "-"}
                                        />
                                        <InfoItem
                                            icon={<UsersRound className="h-5 w-5 text-primary" />}
                                            label="Spoken Languages"
                                            value={otherInfo?.SpokenLang ? otherInfo?.SpokenLang.join(", ") : "-"}
                                        />
                                        <InfoItem
                                            icon={<UsersRound className="h-5 w-5 text-primary" />}
                                            label="Written Languages"
                                            value={otherInfo?.WrittenLang ? otherInfo?.WrittenLang.join(", ") : "-"}
                                        />
                                    </div>

                                    {/* Nominee Details */}
                                    <div className="bg-muted/30 rounded-xl p-4 border shadow-sm space-y-4">
                                        <h4 className="text-md font-semibold flex items-center mb-2">
                                            <UsersRound className="h-5 w-5 mr-2 text-primary" />
                                            Nominee Details
                                        </h4>
                                        <InfoItem
                                            icon={<UsersRound className="h-5 w-5 text-primary" />}
                                            label="Relationship with Nominee"
                                            value={otherInfo?.RelationshipWithNomineeName || "-"}
                                        />
                                        <InfoItem
                                            icon={<UsersRound className="h-5 w-5 text-primary" />}
                                            label="Name of The Nominee"
                                            value={otherInfo?.NomineeName || "-"}
                                        />
                                        <InfoItem
                                            icon={<Calendar className="h-5 w-5 text-primary" />}
                                            label="Date of Birth of Nominee"
                                            value={otherInfo?.NomineeDOB || "-"}
                                        />
                                        <InfoItem
                                            icon={<IdCard className="h-5 w-5 text-primary" />}
                                            label="Aadhaar Number of Nominee"
                                            value={otherInfo?.NomineeAadharNo?.slice(0, 8) + "XXXX" || "-"}
                                        />
                                        <InfoItem
                                            icon={<CreditCard className="h-5 w-5 text-primary" />}
                                            label="Contact Number of Nominee"
                                            value={otherInfo?.NomineeContactNo || "-"}
                                        />
                                    </div>

                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    No other information available
                                </div>
                            )}
                        </TabsContent>}

                        {/* Bank Details */}
                        <TabsContent value="bank" className="p-6 mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-muted/20 rounded-xl p-5 border">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                                        Self Banking Details
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem
                                            icon={<Building className="h-5 w-5 text-primary" />}
                                            label="Bank Name"
                                            value={bankData?.self_bank_name}
                                        />
                                        <InfoItem
                                            icon={<MapPin className="h-5 w-5 text-primary" />}
                                            label="Branch"
                                            value={bankData?.self_bank_branch}
                                        />
                                        <InfoItem
                                            icon={<FileText className="h-5 w-5 text-primary" />}
                                            label="IFSC Code"
                                            value={bankData?.self_bank_ifsc_code}
                                            className="font-mono"
                                        />
                                        <InfoItem
                                            icon={<CreditCard className="h-5 w-5 text-primary" />}
                                            label="Account Number"
                                            value={bankData?.self_bank_acc_no?.slice(0, 8) + "XXXX"}
                                            className="font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="bg-muted/20 rounded-xl p-5 border">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <Users className="h-5 w-5 mr-2 text-primary" />
                                        Nominee Banking Details
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem
                                            icon={<Building className="h-5 w-5 text-primary" />}
                                            label="Bank Name"
                                            value={bankData?.nominee_bank_name}
                                        />
                                        <InfoItem
                                            icon={<MapPin className="h-5 w-5 text-primary" />}
                                            label="Branch"
                                            value={bankData?.nominee_bank_branch}
                                        />
                                        <InfoItem
                                            icon={<FileText className="h-5 w-5 text-primary" />}
                                            label="IFSC Code"
                                            value={bankData?.nominee_bank_ifsc_code}
                                            className="font-mono"
                                        />
                                        <InfoItem
                                            icon={<CreditCard className="h-5 w-5 text-primary" />}
                                            label="Account Number"
                                            value={bankData?.nominee_bank_acc_no?.slice(0, 8) + "XXXX"}
                                            className="font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </CardContent>
        </Card>
    );
};

export default ApplicationPreview;
