"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Users,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Building2,
  GraduationCap,
  Headphones,
  BadgeIcon as IdCard,
  Briefcase,
  AlertCircle,
  Dot,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import GigWorker from "@/assets/gig_worker.png"
import BiswaBangla from "@/assets/biswa_bangla.png"
import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useState } from "react"

const stats = [
  {
    key: "total_gig_worker_registered",
    label: "Workers Registered",
    value: "50,000+",
    icon: <Users className="h-6 w-6 text-blue-600 mb-2" />,
  },
  // { key: "total_cerificate_generated", label: "Certificate Generated", value: "15+", icon: <IdCard className="h-6 w-6 text-blue-600 mb-2" /> },
  {
    key: "total_district",
    label: "Districts Covered",
    value: "23",
    icon: <Building2 className="h-6 w-6 text-blue-600 mb-2" />,
  },
]

const benefits = [
  {
    icon: <IdCard className="h-8 w-8 text-blue-600" />,
    title: "Unique GIG Worker ID",
    description:
      "Receive an official, government-issued GIG Worker ID that validates your status as a platform worker.",
  },
  // {
  //   icon: <Award className="h-8 w-8 text-blue-600" />,
  //   title: "UDIN Certification",
  //   description: "Get a UDIN-based certificate and become a recognized gig worker under government records."
  // },
]

export default function Hero({ landingPageDetails }) {
  const [open, setOpen] = useState(false)

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
                        href="https://wblabour.gov.in/sites/default/files/upload/circular/Labr-13-Law%20dated-22-01-2025.pdf"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Latest Circular (May 2025) <span className="bg-red-500 text-white px-1 rounded-full animate-pulse text-xs mx-1">New</span>
                      </Link>
                      <Link
                        href="https://wblabour.gov.in/sites/default/files/pdf/the-right-to-information-act.pdf"
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
                      <Link
                        href="https://wblabour.gov.in/sites/default/files/pdf/the-right-to-information-act.pdf"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        RTI Act, 2005
                      </Link>
                      <Link
                        href="https://wblabour.gov.in/sites/default/files/pdf/wb-rti-rules-2006.pdf"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        WB RTI Rules, 2006
                      </Link>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <Image
          src={GigWorker || "/placeholder.svg"}
          alt="Gig Workers"
          className="absolute inset-0 opacity-25 bg-cover bg-center"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">Empowering the Backbone of the Digital Economy</h1>
              <p className="text-xl mb-8 text-blue-100">
                Join the West Bengal Gig Worker Portal to get Digital ID Card and recognition as gig worker
              </p>

              <div className="flex flex-col items-center justify-center lg:justify-start mb-8">
                <div className="flex items-center gap-6 mb-4 lg:mb-0">
                  {/* Who can register */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border p-5 rounded-sm text-slate-700 border-violet-300 hover:bg-violet-100 hover:border-violet-400"
                      >
                        Who Can Register ?
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[80%] min-w-[80%] h-[90%] overflow-y-auto p-4 rounded">
                      {/* Header */}
                      <DialogHeader className="p-4 border-b">
                        <DialogTitle className="flex justify-center items-center gap-2 text-xl">
                          <AlertCircle className="text-violet-500" />
                          Who Can Register ?
                        </DialogTitle>
                      </DialogHeader>

                      {/* Scrollable Content */}
                      <div className="w-[100%] overflow-y-auto px-6 py-4">
                        <div className="space-y-10 w-5xl mx-auto">
                          <section>
                            <h3 className="text-xl font-bold mb-2">Gig Workers</h3>
                            <p className="text-base text-muted-foreground leading-relaxed">
                              A gig worker, ie "a person aged between 18-60 Years, engaged in West Bengal, who performs
                              work or participates in a work arrangement through a web based online platform or any
                              arrangements otherwise and carns by providing goods and or services on temporary basis
                              rather than a permanent employer employee relationship under a contract that results in a
                              given rate of payment based on terms and conditions laid down in such contract,
                              irrespective of designation assigned by the 'aggregator" but does not include permanent
                              staffs and employees of the "aggregator
                            </p>
                          </section>

                          {/* Who Can Register */}
                          <section className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <h2 className="text-3xl font-bold text-center mb-12">Who Can Register?</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border-blue-100">
                                  <Users className="h-12 w-12 text-blue-600 mb-6" />
                                  <h3 className="text-xl font-semibold mb-3">Delivery Agents</h3>
                                  <p className="text-gray-600">Zomato, Swiggy, Amazon, etc.</p>
                                </Card>
                                <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border-blue-100">
                                  <Headphones className="h-12 w-12 text-blue-600 mb-6" />
                                  <h3 className="text-xl font-semibold mb-3">App-based Drivers</h3>
                                  <p className="text-gray-600">Ola, Uber, and other platforms</p>
                                </Card>
                                <Card className="p-8 hover:shadow-lg transition-shadow duration-300 border-blue-100">
                                  <Briefcase className="h-12 w-12 text-blue-600 mb-6" />
                                  <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
                                  <p className="text-gray-600">Electricians, plumbers, appliance repair, etc.</p>
                                </Card>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>

                      {/* Footer */}
                      <DialogFooter className="p-4 border-t flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Benefits of Registration */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border p-5 rounded-sm text-slate-700 border-violet-300 hover:bg-violet-100 hover:border-violet-400"
                      >
                        Benefits of Registration
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[80%] min-w-[80%] h-[90%] overflow-y-auto p-4 rounded">
                      {/* Header */}
                      <DialogHeader className="p-4 border-b">
                        <DialogTitle className="flex justify-center items-center gap-2 text-xl">
                          <AlertCircle className="text-violet-500" />
                          How to Register ?
                        </DialogTitle>
                      </DialogHeader>

                      {/* Scrollable Content */}
                      <div className="w-[100%] overflow-y-auto px-6 py-4">
                        <div className="space-y-10 w-5xl mx-auto">
                          {/* Benefits Section */}
                          <section className="py-20 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <h2 className="text-3xl font-bold text-center mb-12">Benefits of Registration</h2>
                              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                                {benefits.map((benefit, index) => (
                                  <Card
                                    key={index}
                                    className="p-8 hover:shadow-lg transition-shadow duration-300 border-blue-100"
                                  >
                                    <div className="flex flex-col items-center text-center">
                                      {benefit.icon}
                                      <h3 className="text-xl font-semibold mt-6 mb-3">{benefit.title}</h3>
                                      <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>

                      {/* Footer */}
                      <DialogFooter className="p-4 border-t flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* How to register */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border p-5 rounded-sm text-slate-700 border-violet-300 hover:bg-violet-100 hover:border-violet-400"
                      >
                        How to Register ?
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[80%] min-w-[80%] h-[90%] overflow-y-auto p-4 rounded">
                      {/* Header */}
                      <DialogHeader className="p-4 border-b">
                        <DialogTitle className="flex justify-center items-center gap-2 text-xl">
                          <AlertCircle className="text-violet-500" />
                          How to Register ?
                        </DialogTitle>
                      </DialogHeader>

                      {/* Scrollable Content */}
                      <div className="w-[100%] overflow-y-auto px-6 py-4">
                        <div className="space-y-10 w-5xl mx-auto">
                          {/* How to Register */}
                          <section className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <h2 className="text-3xl font-bold text-center mb-12">Register in 4 simple steps</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[1, 2, 3, 4].map((step) => (
                                  <div key={step} className="flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-blue-700 transition-colors duration-300">
                                      {step}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">
                                      {step === 1 && "Click on 'Register Now'"}
                                      {step === 2 && "Enter Application Details"}
                                      {step === 3 && "Submit Application"}
                                      {step === 4 && "Get GIG Worker ID"}
                                    </h3>
                                    <p className="text-gray-600">
                                      {step === 1 && "Start your registration process"}
                                      {step === 2 && "Provide information about yourself"}
                                      {step === 3 && "Complete the application submit"}
                                      {step === 4 && "Receive ID via SMS & Email"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>

                      {/* Footer */}
                      <DialogFooter className="p-4 border-t flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex items-center justify-center w-full mb-4 lg:mb-0">
                <Button
                  size="lg"
                  className="w-[50%] rounded-full border border-white bg-white/10 hover:bg-white text-white hover:text-blue-800 font-semibold m-2 p-5"
                >
                  <Link href="/registration" className="flex items-center justify-center">
                    Register Now <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={GigWorker || "/placeholder.svg"}
                  alt="Gig Workers"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={stat?.key}
                className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-blue-100"
              >
                <div className="flex flex-col items-center">
                  {stat.icon}
                  <h3 className="text-4xl font-bold text-blue-600 mb-2">{landingPageDetails[stat.key]}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className=" bg-gray-50" id="about-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center my-12">About the Initiative</h2>
          <div className="prose lg:prose-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-600 text-center text-lg leading-relaxed">
              The Department of Labour, Government of West Bengal, proudly launches a dedicated portal to register GIG
              and platform-based workers across the state. This initiative aims to create a formal identity for informal
              workers and connect them with highway of social and economic developement.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center group">
                  <Mail className="h-5 w-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="group-hover:text-blue-300 transition-colors duration-300">labour.wb@gov.in</span>
                </div>
                <div className="flex items-center group">
                  <Phone className="h-5 w-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="group-hover:text-blue-300 transition-colors duration-300">
                    1800-103-0009 (Toll-Free)
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <div className="space-y-4">
                <div className="flex items-center group">
                  <ExternalLink className="h-5 w-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <a href="https://wblabour.gov.in/sites/default/files/pdf/the-right-to-information-act.pdf" className="hover:text-blue-300 transition-colors duration-300">
                    Notifications & Circulars
                  </a>
                </div>
                <div className="flex items-center group">
                  <ExternalLink className="h-5 w-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <a href="https://wblabour.gov.in/sites/default/files/pdf/the-right-to-information-act.pdf" className="hover:text-blue-300 transition-colors duration-300">
                    RTI Rules & Acts.
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Department of Labour</h3>
              <p className="text-gray-400">Government of West Bengal</p>
              <p className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-300">
                www.labour.wb.gov.in
              </p>
            </div>
          </div>
          <Separator className="my-10 bg-gray-700" />
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Department of Labour, Government of West Bengal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
