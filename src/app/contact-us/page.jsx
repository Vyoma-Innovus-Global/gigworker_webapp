"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    ExternalLink,
    ChevronRight,
    BadgeIcon as IdCard,
    MapPin, Phone, Mail, Clock
} from "lucide-react"
import BiswaBangla from "@/assets/biswa_bangla.png"
import Image from "next/image"
import Link from "next/link"

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Image src={BiswaBangla || "/placeholder.svg"} alt="West Bengal State Emblem" className="h-16 w-auto" />
                                <div className="ml-4">
                                    <h1 className="text-xl font-bold text-gray-900">Department of Labour</h1>
                                    <p className="text-sm text-gray-600">Government of West Bengal</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="link" className="text-blue-600">
                                    <Link href="/">Home</Link>
                                </Button>

                                <Button variant="link" className="text-blue-600">
                                    <Link href="#about-us">About the Initiative</Link>
                                </Button>

                                <Button variant="link" className="text-blue-600">
                                    <Link href="/contact-us">Contact us</Link>
                                </Button>

                                {/* Notifications & Circulars Dropdown */}
                                <div className="relative group">
                                    <Button variant="link" className="text-blue-600 flex items-center">
                                        Notifications & Circulars
                                        <ChevronRight className="ml-1 h-4 w-4 transform group-hover:rotate-90 transition-transform" />
                                    </Button>
                                    <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        <div className="py-1">
                                            <Link
                                                href="/"
                                                target="_blank"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Latest Circular (May 2025)
                                            </Link>
                                            <Link
                                                href="/"
                                                target="_blank"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Notification (April 2025)
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* RTI Dropdown */}
                                <div className="relative group">
                                    <Button variant="link" className="text-blue-600 flex items-center">
                                        RTI
                                        <ChevronRight className="ml-1 h-4 w-4 transform group-hover:rotate-90 transition-transform" />
                                    </Button>
                                    <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        <div className="py-1">
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://wblabour.gov.in/sites/default/files/pdf/the-right-to-information-act.pdf"
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                RTI Act, 2005
                                            </a>
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://wblabour.gov.in/sites/default/files/pdf/wb-rti-rules-2006.pdf"
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                WB RTI Rules, 2006
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="link" className="text-blue-600">
                                    <Link href="/admin/login">Admin Login</Link>
                                </Button>
                                <Button variant="link" className="text-blue-600">
                                    <Link href="/login">Gig Worker Login</Link>
                                </Button>
                                <div id="google_translate_element"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="mx-auto px-4 py-10 sm:px-6 lg:px-8">
                {/* Contact Header */}
                <div className="flex items-start justify-center mb-12">
                    <h1 className="text-5xl font-bold text-blue-700">
                        <span className="text-green-600">C</span>ONTACT US
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="col-span-1">
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="border-l-4 border-blue-800 pl-4 mb-8">
                                <h2 className="text-3xl font-semibold text-blue-600">Labour Department</h2>
                            </div>

                            <div className="space-y-6 text-gray-700">
                                <p className="text-lg">Department of Labour, Government of West Bengal,</p>
                                <p className="text-lg">12th Floor, N.S Building, Block-A,</p>
                                <p className="text-lg">1, Kiran Shankar Roy Road,</p>
                                <p className="text-lg">Kolkata-700001</p>
                            </div>

                            <div className="mt-12">
                                <p className="text-xl font-semibold text-gray-800">
                                    Help line of Labour Department, Govt. of West Bengal
                                </p>
                                <p className="text-lg mt-2">Shramik Sathi : 1800-103-0009</p>
                            </div>

                            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <Phone className="h-6 w-6 text-blue-600 mr-4" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Phone</h3>
                                            <p className="mt-1 text-gray-600">1800-103-0009 (Toll Free)</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <Mail className="h-6 w-6 text-blue-600 mr-4" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Email</h3>
                                            <p className="mt-1 text-gray-600">labour.wb@gov.in</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <MapPin className="h-6 w-6 text-blue-600 mr-4" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Address</h3>
                                            <p className="mt-1 text-gray-600">12th Floor, N.S Building, Block-A,</p>
                                            <p className="text-gray-600">1, Kiran Shankar Roy Road, Kolkata-700001</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <Clock className="h-6 w-6 text-blue-600 mr-4" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Office Hours</h3>
                                            <p className="mt-1 text-gray-600">Monday - Friday: 10:00 AM - 5:30 PM</p>
                                            <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Our Location</h3>
                            <div className="aspect-square w-full bg-gray-200 rounded-md overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.252607582909!2d88.34062037349021!3d22.56965363308181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277a200f6df61%3A0xca19a1b2688346e!2sNew%20Secretariat%20Building!5e0!3m2!1sen!2sin!4v1746377718879!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Department of Labour, Government of West Bengal"
                                ></iframe>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
