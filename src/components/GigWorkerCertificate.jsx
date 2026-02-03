"use client"
import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle, Shield } from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/biswa_bangla.png";

const GigWorkerCertificate = ({ data }) => {

    // Helper: Handle Null/Empty values
    const display = (val) => val || "N/A";

    // Helper: Mask Aadhaar (Show last 4 digits)
    const getMaskedAadhaar = (num) => {
        if (!num) return "XXXX-XXXX-XXXX";
        const cleanNum = num.replace(/\D/g, ''); // remove non-digits
        if (cleanNum.length < 4) return num;
        return `XXXX-XXXX-${cleanNum.slice(-4)}`;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 py-8 px-4 font-sans text-slate-900 print:bg-white print:p-0 print:m-0">

            {/* Print Button (Hidden on Paper) */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-end print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2 rounded shadow hover:bg-blue-800 transition-colors text-sm font-medium"
                >
                    <Printer size={16} /> Print Certificate
                </button>
            </div>

            {/* A4 Container */}
            <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl print:shadow-none print:w-full print:h-auto relative overflow-hidden">

                {/* Decorative Border */}
                <div className="absolute inset-0 border-[3px] border-double border-slate-800 m-3 pointer-events-none z-20"></div>
                <div className="absolute inset-0 border border-slate-300 m-4 pointer-events-none z-20"></div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0">
                    <Image src={logo} alt="Watermark" className="w-96 grayscale" />
                </div>

                <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">

                    {/* --- HEADER --- */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-3">
                            {/* WB Gov Logo Placeholder - Using text or generic icon if image not available */}
                            <div className="h-20 w-auto">
                                <Image src={logo} alt="Emblem" className="h-20 w-auto mx-auto" />
                                <Shield className="h-16 w-16 text-slate-800 mx-auto hidden" /> {/* Fallback icon */}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Government of West Bengal</h2>
                        <h3 className="text-lg font-semibold uppercase text-slate-700">Department of Labour</h3>
                        <div className="mt-6 border-b-2 border-slate-800 w-fit mx-auto pb-1 px-4">
                            <h1 className="text-2xl font-serif font-bold uppercase text-slate-900">Certificate of Declaration</h1>
                        </div>
                        <p className="text-xs font-bold tracking-widest uppercase mt-2 text-slate-500">Gig Worker Registration Portal</p>
                    </div>

                    {/* --- DECLARATION TEXT --- */}
                    <div className="mb-8 font-serif text-justify leading-relaxed text-sm md:text-base px-2">
                        <p className="mb-4">
                            I, <span className="font-bold text-slate-900 border-b border-dotted border-slate-400">{display(data._gig_worker_name)}</span>,
                            Son/Daughter/Wife of <span className="font-bold text-slate-900 border-b border-dotted border-slate-400">{display(data._father_or_husband_name)}</span>,
                            residing at <span className="font-bold text-slate-900 border-b border-dotted border-slate-400">{display(data._permanent_address)}</span>,
                            District: <span className="font-bold text-slate-900 border-b border-dotted border-slate-400">{display(data._perm_district_name)}</span>,
                            Sub-Division: <span className="font-bold text-slate-900 border-b border-dotted border-slate-400">{display(data._perm_sub_division_name)}</span>,
                            <span className="font-bold text-slate-900 ml-1">{display(data._perm_block_municipality_corp_name)}</span>,
                            <span className="font-bold text-slate-900 ml-1">{display(data._perm_gp_ward)}</span>,
                            PIN Code: <span className="font-bold text-slate-900 border-b border-dotted border-slate-400">{display(data._perm_pin_code)}</span>,
                            hereby declare that I am a gig worker.
                        </p>
                        <p className="text-xs italic text-slate-500 mt-2">
                            * All information provided is true to the best of my knowledge. Registration does not entitle automatic benefits.
                        </p>
                    </div>

                    {/* --- DETAILS GRID --- */}
                    <div className="flex-grow">
                        <div className="border border-slate-300 rounded overflow-hidden mb-6">
                            {/* Row 1: Basic Info */}
                            <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 font-bold text-xs uppercase text-slate-700">Personal Information</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-xs">
                                <DataField label="Gender" value={data._gender_name} />
                                <DataField label="Date of Birth" value={data._date_of_birth} />
                                <DataField label="Blood Group" value={data._blood_group_name} />
                                <DataField label="Marital Status" value={data._marital_status} />
                                <DataField label="Mobile No" value={data._aadhaar_mobile} />
                                <DataField label="Alt Mobile" value={data._alternate_mobile} />
                                <DataField label="Relation Name" value={data._father_or_husband_name} />
                            </div>

                            {/* Row 2: IDs & Bank */}
                            <div className="bg-slate-100 px-4 py-2 border-y border-slate-300 font-bold text-xs uppercase text-slate-700">Identification & Bank Details</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-xs">
                                {/* Aadhaar logic: Prefer actual number if secure context, else mask */}
                                <DataField label="Aadhaar (Masked)" value={getMaskedAadhaar(data._aadhaar_number)} isMono />
                                <DataField label="PAN Card" value={data._pan_card} isMono />
                                <DataField label="Driving License" value={data._driving_license_number} />
                                <DataField label="Bank Name" value={data._bank_name} />
                                <DataField label="Branch" value={data._branch} />
                                <DataField label="IFSC Code" value={data._ifsc_code} isMono />
                                <DataField label="Account No" value={data._account_number} isMono />
                            </div>

                            {/* Row 3: Emergency */}
                            <div className="bg-slate-100 px-4 py-2 border-y border-slate-300 font-bold text-xs uppercase text-slate-700">Emergency Contact</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-xs">
                                <DataField label="Contact Person" value={data._emergency_person_contact_one_name} />
                                <DataField label="Relationship" value={data._emergency_person_contact_one_relation} />
                                <DataField label="Phone Number" value={data._emergency_person_contact_one} />
                            </div>
                        </div>

                        {/* --- LISTS (Vehicles / Experience) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                            {/* Vehicles */}
                            <div className="border border-slate-300 rounded">
                                <div className="bg-slate-50 px-3 py-2 border-b border-slate-300 font-bold text-xs uppercase">Vehicle Details</div>
                                <div className="p-2">
                                    {data._arr_vehicle_details && data._arr_vehicle_details.length > 0 ? (
                                        <table className="w-full text-[10px] text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200">
                                                    <th className="pb-1">Type</th>
                                                    <th className="pb-1">Reg No</th>
                                                    <th className="pb-1">Owner</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data._arr_vehicle_details.map((v, i) => (
                                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                                        <td className="py-1">{display(v.automobile_cycle)} ({display(v.two_four_wheelers)})</td>
                                                        <td className="py-1 font-mono font-bold">{display(v.registration_no)}</td>
                                                        <td className="py-1">{display(v.self_owned)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <span className="text-xs text-slate-400">N/A</span>}
                                </div>
                            </div>

                            {/* Work Exp */}
                            <div className="border border-slate-300 rounded">
                                <div className="bg-slate-50 px-3 py-2 border-b border-slate-300 font-bold text-xs uppercase">Work Experience</div>
                                <div className="p-2">
                                    {data._arr_work_experience_details && data._arr_work_experience_details.length > 0 ? (
                                        <table className="w-full text-[10px] text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200">
                                                    <th className="pb-1">Role</th>
                                                    <th className="pb-1">Org/Platform</th>
                                                    <th className="pb-1">Exp</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data._arr_work_experience_details.map((w, i) => (
                                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                                        <td className="py-1">{display(w.occupation)}</td>
                                                        <td className="py-1">{display(w.organization)}</td>
                                                        <td className="py-1">{display(w.experience)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : <span className="text-xs text-slate-400">N/A</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER: E-SIGNATURE --- */}
                    <div className="mt-8 pt-4 border-t-[2px] border-slate-300 flex items-end justify-between">

                        <div className="text-xs text-slate-500 relative">
                            <p>Generated on: <strong>{display(data._application_date_time)}</strong></p>
                            <p>System Reference: {display(data._application_no)}</p>
                        </div>

                        <div className="p-1 border rounded-md min-w-[200px] flex flex-col items-center bg-slate-50 relative">

                            <div className="flex flex-col items-center justify-center gap-0">
                                <CheckCircle size={14} className="text-green-600" />
                                <p className="text-[8px] font-bold text-slate-700 uppercase tracking-wide font-mono">Aadhaar Verified E-Sign</p>
                                <small className="font-sans text-[10px]">{getMaskedAadhaar(data._aadhaar_number)}</small>
                            </div>

                            <div className="text-center mt-2 border-t border-slate-300 pt-1 w-full">
                                <p className="text-[9px] text-slate-500 font-light font-sans italic">Digitally Signed By</p>
                                <p className="text-xs font-light text-slate-900">{display(data._gig_worker_name)}</p>
                            </div>
                        </div>

                    </div>

                    <div className="text-[10px] text-center text-slate-400 mt-4 print:mt-2">
                        This is a computer-generated certificate based on the self-declaration of the worker under the Government of West Bengal portal.
                    </div>

                </div>
            </div>
        </div>
    );
};

// Sub-component for clean data grids
const DataField = ({ label, value, isMono }) => (
    <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 uppercase tracking-tight mb-0.5">{label}</span>
        <span className={`font-semibold text-slate-900 break-words ${isMono ? 'font-mono' : ''}`}>
            {value || "N/A"}
        </span>
    </div>
);

export default GigWorkerCertificate;