import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/Accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { Card, CardContent } from "../components/Card";
import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa"
import { CiCalendarDate } from "react-icons/ci"

const InformationPage = () => {
    return (
        <>
            <section className="bg-red-100 py-14">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Donation Information</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about blood donation, eligibility, and the donation process.
                    </p>
                </div>
            </section>


            <section className="py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <Tabs defaultValue="eligibility" className="max-w-4xl mx-auto">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                            <TabsTrigger value="process">Donation Process</TabsTrigger>
                            <TabsTrigger value="facts">Blood Facts</TabsTrigger>
                        </TabsList>

                        {/* Eligibility Tab */}
                        <TabsContent value="eligibility" className="mt-6">
                            <Card className={`border border-gray-200`}>
                                <CardContent className="pt-6">
                                    <h2 className="text-2xl font-bold mb-4 text-center">Donor Eligibility</h2>
                                    <p className="mb-6">
                                        Most healthy adults are eligible to donate blood. Review these requirements to see if you can donate.
                                    </p>

                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Basic Requirements</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                <span>Be at least 17 years old (16 with parental consent in some states)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                <span>Weigh at least 110 pounds</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                <span>Be in good general health and feeling well</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                <span>Have not donated whole blood in the last 56 days</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Common Reasons for Deferral</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2">
                                                <FiXCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                                <span>Low hemoglobin or iron levels</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiXCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                                <span>Recent tattoos or piercings (typically within 3-12 months)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiXCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                                <span>Certain medications</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiXCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                                <span>Recent international travel to certain regions</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiXCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                                <span>Pregnancy (must wait 6 weeks after giving birth)</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-3">Common Eligibility Questions</h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>Can I donate if I have high blood pressure?</AccordionTrigger>
                                                <AccordionContent>
                                                    Yes, as long as your blood pressure is below 180/100 at the time of donation and you feel well. Blood pressure medications do not disqualify you.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger>Can I donate if I have diabetes?</AccordionTrigger>
                                                <AccordionContent>
                                                    Yes, people with diabetes who are well controlled on medication are generally eligible to donate blood.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-3">
                                                <AccordionTrigger>Can I donate if I'm taking medication?</AccordionTrigger>
                                                <AccordionContent>
                                                    Most medications do not prevent you from donating blood. Some medications require a waiting period after your last dose. Our staff will review your medications during the screening process.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-4">
                                                <AccordionTrigger>Can I donate if I've had COVID-19?</AccordionTrigger>
                                                <AccordionContent>
                                                    Yes, but you must be symptom-free for at least 10 days before donating. If you received convalescent plasma as treatment, you'll need to wait 3 months.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-5">
                                                <AccordionTrigger>Can I donate after receiving a vaccine?</AccordionTrigger>
                                                <AccordionContent>
                                                    For most vaccines, including flu shots and COVID-19 vaccines, there's no waiting period if you're feeling well. Some live attenuated vaccines require a 2-4 week waiting period.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>

                                    <div className="mt-6 pt-6">
                                        <h4 className="font-semibold text-gray-500 mb-2">Not Sure If You're Eligible?</h4>
                                        <p className="text-gray-700 text-sm">
                                            Contact our team at <span className="text-red-600 font-medium">+123 4567 890</span> for a confidential eligibility check.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Donation Process Tab */}
                        <TabsContent value="process" className="mt-6">
                            <Card className={`border border-gray-200`}>
                                <CardContent className="pt-6">
                                    <h2 className="text-2xl font-bold mb-4 text-center">The Donation Process</h2>
                                    <p className="mb-6">
                                        Donating blood is a simple and straightforward process that takes about an hour from start to finish.
                                    </p>


                                    <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400 mb-6">
                                        <h3 className="font-semibold text-blue-800 mb-2">Before Your Donation</h3>
                                        <ul className="space-y-2 text-blue-700">
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>Eat a healthy meal and drink plenty of fluids</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>A donor card or any form of valid identification.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>Provide a list of medications you're currently taking</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>Inform about your health, travel, and lifestyle.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-semibold text-center mb-6">During Donation</h2>
                                        <div className="space-y-8 mb-6">
                                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                                <div className="flex-shrink-0 bg-red-100 border-transparent px-4 py-2 rounded-full self-center md:self-start">
                                                    <span className="text-2xl font-bold text-red-700 ">1</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2 text-center md:text-start">Registration</h3>
                                                    <p className="text-gray-600 text-center md:text-start">
                                                        You'll complete a registration form and provide identification. Our staff will explain the donation process and answer any questions you may have.
                                                    </p>
                                                    <div className="flex items-center mt-2 text-gray-500 text-sm justify-center md:justify-start">
                                                        <FiClock className="h-4 w-4 mr-1" />
                                                        <span>Approximately 10-15 minutes</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                                <div className="flex-shrink-0 bg-red-100 border-transparent px-4 py-2 rounded-full self-center md:self-start">
                                                    <span className="text-2xl font-bold text-red-700">2</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb- text-center md:text-start">Health Screening</h3>
                                                    <p className="text-gray-600 text-center md:text-start">
                                                        A healthcare professional will check your temperature, blood pressure, pulse, and hemoglobin level. You'll also complete a confidential health history questionnaire.
                                                    </p>
                                                    <div className="flex items-center mt-2 text-gray-500 text-sm justify-center md:justify-start">
                                                        <FiClock className="h-4 w-4 mr-1" />
                                                        <span>Approximately 10-15 minutes</span>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                                <div className="flex-shrink-0 bg-red-100 border-transparent px-4 py-2 rounded-full self-center md:self-start">
                                                    <span className="text-2xl font-bold text-red-700">3</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2 text-center md:text-start">Blood Donation</h3>
                                                    <p className="text-gray-600 text-center md:text-start">
                                                        A trained phlebotomist will cleanse your arm and insert a new, sterile needle. The actual blood collection usually takes only 8-10 minutes. You'll donate approximately one pint of blood.
                                                    </p>
                                                    <div className="flex items-center mt-2 text-gray-500 text-sm justify-center md:justify-start">
                                                        <FiClock className="h-4 w-4 mr-1" />
                                                        <span>Approximately 8-10 minutes</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                                <div className="flex-shrink-0 bg-red-100 border-transparent px-4 py-2 rounded-full self-center md:self-start">
                                                    <span className="text-2xl font-bold text-red-700">4</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2 text-center md:text-start">Refreshments & Recovery</h3>
                                                    <p className="text-gray-600 text-center md:text-start">
                                                        After donating, you'll rest and enjoy refreshments for 10-15 minutes. This helps your body adjust to the slight decrease in fluid volume.
                                                    </p>
                                                    <div className="flex items-center mt-2 text-gray-500 text-sm justify-center md:justify-start">
                                                        <FiClock className="h-4 w-4 mr-1" />
                                                        <span>Approximately 10-15 minutes</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400 mb-6">
                                        <h3 className="font-semibold text-blue-800 mb-2">After Your Donation</h3>
                                        <ul className="space-y-2 text-blue-700">
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>Drink extra fluids for the next 48 hours</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>Keep the bandage on for at least 4 hours</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>Avoid strenuous activity for the rest of the day</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiAlertCircle className="h-4 w-4 mt-1 text-blue-500" />
                                                <span>If you feel dizzy, sit or lie down until you feel better</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-center">Types of Blood Donation</h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>Whole Blood Donation</AccordionTrigger>
                                                <AccordionContent>
                                                    The most common type of donation where you donate approximately one pint of blood. This usually takes 8-10 minutes and you can donate every 56 days.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger>Platelet Donation (Apheresis)</AccordionTrigger>
                                                <AccordionContent>
                                                    A specialized donation that collects only platelets while returning other blood components to your body. Takes 2-3 hours and you can donate every 7 days, up to 24 times per year.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-3">
                                                <AccordionTrigger>Plasma Donation</AccordionTrigger>
                                                <AccordionContent>
                                                    Plasma is the liquid portion of blood that carries blood cells. Donation takes about 1-2 hours and you can donate every 28 days.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-4">
                                                <AccordionTrigger>Double Red Cell Donation</AccordionTrigger>
                                                <AccordionContent>
                                                    Collects two units of red blood cells while returning plasma and platelets to your body. Takes 30-45 minutes and you can donate every 112 days.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Blood Facts Tab */}
                        <TabsContent value="facts" className="mt-6">
                            <Card className={`border border-gray-200`}>
                                <CardContent className="pt-6">
                                    <h2 className="text-2xl font-bold mb-4 text-center">Blood Facts & Statistics</h2>
                                    <p className="mb-6">
                                        Learn about blood and why donation is so important for healthcare systems and patients.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-red-50 p-6 rounded-lg">
                                            <div className="flex justify-center mb-4">
                                                <FaRegHeart className="h-12 w-12 text-red-700" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-center mb-4">Blood Needs</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>Every 2 seconds, someone in the world needs blood</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>A single car accident victim can require up to 100 units of blood</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>Only 37% of the population is eligible to donate blood</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>One donation can save up to 3 lives</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-red-50 p-6 rounded-lg">
                                            <div className="flex justify-center mb-4">
                                                <CiCalendarDate className="h-12 w-12 text-red-700" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-center mb-4">Blood Storage</h3>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>Red blood cells can be stored for up to 42 days</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>Platelets can only be stored for 5 days</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>Plasma can be frozen and stored for up to one year</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="bg-blood rounded-full w-2 h-2"></span>
                                                    <span>Blood banks need constant replenishment of supplies</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold mb-4">Blood Types & Compatibility</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="border px-4 py-2 bg-gray-100">Blood Type</th>
                                                        <th className="border px-4 py-2 bg-gray-100">Can Donate To</th>
                                                        <th className="border px-4 py-2 bg-gray-100">Can Receive From</th>
                                                        <th className="border px-4 py-2 bg-gray-100">Population %</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">O+</td>
                                                        <td className="border px-4 py-2">O+, A+, B+, AB+</td>
                                                        <td className="border px-4 py-2">O+, O-</td>
                                                        <td className="border px-4 py-2 text-center">38%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">O-</td>
                                                        <td className="border px-4 py-2">All Blood Types</td>
                                                        <td className="border px-4 py-2">O-</td>
                                                        <td className="border px-4 py-2 text-center">7%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">A+</td>
                                                        <td className="border px-4 py-2">A+, AB+</td>
                                                        <td className="border px-4 py-2">A+, A-, O+, O-</td>
                                                        <td className="border px-4 py-2 text-center">34%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">A-</td>
                                                        <td className="border px-4 py-2">A+, A-, AB+, AB-</td>
                                                        <td className="border px-4 py-2">A-, O-</td>
                                                        <td className="border px-4 py-2 text-center">6%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">B+</td>
                                                        <td className="border px-4 py-2">B+, AB+</td>
                                                        <td className="border px-4 py-2">B+, B-, O+, O-</td>
                                                        <td className="border px-4 py-2 text-center">9%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">B-</td>
                                                        <td className="border px-4 py-2">B+, B-, AB+, AB-</td>
                                                        <td className="border px-4 py-2">B-, O-</td>
                                                        <td className="border px-4 py-2 text-center">2%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">AB+</td>
                                                        <td className="border px-4 py-2">AB+</td>
                                                        <td className="border px-4 py-2">All Blood Types</td>
                                                        <td className="border px-4 py-2 text-center">3%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border px-4 py-2 font-semibold text-center">AB-</td>
                                                        <td className="border px-4 py-2">AB+, AB-</td>
                                                        <td className="border px-4 py-2">AB-, A-, B-, O-</td>
                                                        <td className="border px-4 py-2 text-center">1%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-4">Common Uses for Donated Blood</h3>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>Cancer Treatment</AccordionTrigger>
                                                <AccordionContent>
                                                    Many patients undergoing chemotherapy or radiation require blood transfusions due to the treatments affecting their ability to produce blood cells.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger>Trauma and Accidents</AccordionTrigger>
                                                <AccordionContent>
                                                    Victims of accidents, burns, or other trauma may need large quantities of blood quickly to replace what they've lost and stabilize their condition.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-3">
                                                <AccordionTrigger>Surgeries</AccordionTrigger>
                                                <AccordionContent>
                                                    Many surgical procedures, especially heart surgeries, organ transplants, and other major operations, require blood transfusions.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-4">
                                                <AccordionTrigger>Childbirth Complications</AccordionTrigger>
                                                <AccordionContent>
                                                    Women with complications during pregnancy or childbirth may need blood transfusions, particularly in cases of severe bleeding.
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-5">
                                                <AccordionTrigger>Blood Disorders</AccordionTrigger>
                                                <AccordionContent>
                                                    People with blood disorders like sickle cell anemia, thalassemia, and hemophilia often require regular blood transfusions throughout their lives.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </>
    )
}

export default InformationPage