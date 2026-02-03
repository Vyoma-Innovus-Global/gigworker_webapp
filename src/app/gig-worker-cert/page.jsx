"use client"
import GigWorkerCertificate from '@/components/GigWorkerCertificate'
import React, { useEffect, useState } from 'react'
import { getGigWorkerNotAadharVerifiedDetailsAPI } from './api'

const Page = () => {

    const [certificateData, setCertificateData] = useState(null);
    const mapApiToCertificateData = (apiData) => {
        // parse JSON strings safely
        const bankInfo = apiData?.bank_info ? JSON.parse(apiData?.bank_info) : [];
        const vehicleInfo = apiData?.vehicle_info ? JSON.parse(apiData?.vehicle_info) : [];
        const workInfo = apiData?.work_related_info ? JSON.parse(apiData?.work_related_info) : [];

        return {
            _gig_worker_name: apiData?.gig_worker_name || "",
            _father_or_husband_name: apiData?.father_or_husband_name || "",
            _permanent_address: apiData?.permanent_address || "",

            _perm_district_name: apiData?.perm_district_name || "",
            _perm_sub_division_name: apiData?.perm_sub_division_name || "",
            _perm_block_municipality_corp_name:
                apiData?.perm_block_municipality_corp_name || "",
            _perm_gp_ward: apiData?.perm_gp_ward_name || "",
            _perm_pin_code: apiData?.perm_pin_code || "",

            _gender_name: apiData?.gender_name || "",
            _date_of_birth: apiData?.date_of_birth || "",
            _marital_status: apiData?.marital_status === "1" ? "Married" : "Single",

            _aadhaar_mobile: apiData?.emergency_person_contact_one || "",
            _alternate_mobile: apiData?.emergency_person_contact_two || "",

            _blood_group_name: apiData?.blood_group_name || "",
            _aadhaar_number: apiData?.nominee_aadhar_no
                ? `XXXX-XXXX-${apiData?.nominee_aadhar_no.slice(-4)}`
                : "",
            _pan_card: apiData?.pan_card || "",

            _driving_license_number:
                vehicleInfo[0]?.DrivingLicense || "",

            _bank_name: bankInfo[0]?.SelfBankName || "",
            _branch: bankInfo[0]?.SelfBankBranch || "",
            _ifsc_code: bankInfo[0]?.SelfBankIFSCCode || "",
            _account_number: bankInfo[0]?.SelfBankAccNo || "",

            _emergency_person_contact_one:
                apiData?.emergency_person_contact_one || "",
            _emergency_person_contact_one_name:
                apiData?.emergency_person_contact_one_name || "",
            _emergency_person_contact_one_relation:
                apiData?.emergency_person_contact_one_relation || "",

            _application_no: apiData?.application_no || "",
            _application_date_time: apiData?.created_at || "",

            _arr_vehicle_details: vehicleInfo.map(v => ({
                automobile_cycle: v.VehicleCategoryName || "",
                personal_commercial: v.VehicleRegistrationTypeName || "",
                two_four_wheelers: v.VehicleTypeName || "",
                self_owned: v.IsSelfOwned ? "Self Owned" : "Not Self Owned",
                registration_no: v.RegistrationNumber || ""
            })),

            _arr_work_experience_details: workInfo.map(w => ({
                occupation: w.OccupationTypeName || "",
                industry: w.NatureIndustryName || "",
                organization: w.OrganizationName || "N/A",
                experience: `${w.ExperienceYear} Year`,
                currently_working: w.IsCurrentlyWorking ? "Yes" : "No"
            }))
        };
    };


    const fetchData = async () => {
        const res = await getGigWorkerNotAadharVerifiedDetailsAPI();

        const mappedData = mapApiToCertificateData(res.data);
        setCertificateData(mappedData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        certificateData ? (
            <GigWorkerCertificate data={certificateData} />
        ) : (
            <div>Loading...</div>
        )
    )
}

export default Page