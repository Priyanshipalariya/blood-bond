import React, { useState } from "react";
import { Link } from "react-router";
import { IoCallOutline, IoMailOutline, IoLocationOutline } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { Card, CardContent } from '../components/Card'
import { Button, ButtonLink } from "../components/Button";
import { Input, TextArea } from "../components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/SelectComponent";

const ContactPage = () => {
    function handleSubmit() {
        console.log("Form Submitted")
    }

    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleChange = ({ target: { name, value } }) =>
        setFormValues(prev => ({ ...prev, [name]: value }));

    return (
        <>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 py-6 md:py-10 px-5 justify-between ">
                <div className="lg:col-span-1" >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 md:mb-10 text-center hidden md:block">Get in touch</h2>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 md:mb-10 text-center md:hidden">Contact us</h2>
                    <Card>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name">Your Name</label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formValues.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email">Email Address</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone">Contact No. (Optional)</label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleChange}
                                        type="phone"
                                        placeholder="Enter your Contact Number"
                                        
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject">Subject</label>
                                    <Select
                                        onValueChange={(value) =>
                                            setFormValues((prev) => ({
                                                ...prev,
                                                subject: value,
                                            }))
                                        }
                                        value={formValues.subject}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Inquiry</SelectItem>
                                            <SelectItem value="donation">Blood Donation Question</SelectItem>
                                            <SelectItem value="request">Blood Request Help</SelectItem>
                                            <SelectItem value="feedback">Feedback</SelectItem>
                                            <SelectItem value="urgent">Urgent Assistance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message">Your Message</label>
                                    <TextArea
                                        id="message"
                                        name="message"
                                        value={formValues.message}
                                        onChange={handleChange}
                                        placeholder="Type your message here..."
                                        rows={6}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full ">
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card> 
                </div>

                 <div className="lg:col-span-2 hidden md:block">
                    <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Contact us</h2> 

                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"> 
                         <Card className = "hover:border-red-600 ">
                            <CardContent className="p-6">
                                <div className="flex gap-5 sm:gap-0">
                                    
                                        <div className="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-700">
                                            <IoCallOutline className="h-6 w-6" />
                                        </div>
                                  
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                                        <p className="mt-2 text-gray-600 text-sm md:text-lg">
                                            Main Office: +123 4567 890
                                        </p>
                                        <p className="text-gray-600 text-sm md:text-lg">
                                            Hotline: +123 4567 111
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card> 

                         <Card className = " hover:border-red-600 ">
                            <CardContent className="p-6">
                                <div className="flex gap-5 sm:gap-0">
                                   
                                        <div className="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-700">
                                            <IoMailOutline className="h-6 w-6" />
                                        </div>
                                
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                        <p className="mt-2 text-gray-600 text-sm md:text-lg">
                                            info@bloodbond.org
                                        </p>
                                        <p className="text-gray-600 text-sm md:text-lg">
                                            support@bloodbond.org
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className = "hover:border-red-600 ">
                            <CardContent className="p-6">
                                <div className="flex gap-5 sm:gap-0">
                                    
                                        <div className="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-700">
                                            <IoLocationOutline className="h-6 w-6" />
                                        </div>
                            
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Location</h3>
                                        <p className="mt-2 text-gray-600 text-sm md:text-lg">
                                        123 XYZ ,
                                        
                                        </p>
                                        <p className="text-gray-600 text-sm md:text-lg">
                                        Healthcare City, 12345
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className = "hover:border-red-600 ">
                            <CardContent className="p-6">
                                <div className="flex gap-5 sm:gap-0">
                                   
                                        <div className="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-700">
                                            <FiClock className="h-6 w-6" />
                                        </div>
                                  
                                    <div className="ml-4">
                                        <h3 className="text-xl font-medium text-gray-900">Hours</h3>
                                        <p className="mt-2 text-gray-600 text-sm md:text-lg">
                                            Monday-Friday: 8am-8pm
                                        </p>
                                        <p className="text-gray-600 text-sm md:text-lg">
                                            Saturday: 9am-5pm
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card> 
                    </div> 

<div className=" md:hidden lg:block">
                     <Card className = " hover:border-red-600 my-8">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">Emergency Assistance</h3>
                            <p className="text-gray-600 mb-4 text-sm md:text-lg">
                                For urgent blood needs or emergencies, please call our 24/7 hotline at +1 234 567 980.
                            </p>
                            <p className="text-red-600 font-medium text-sm md:text-lg">
                                If this is a medical emergency, please dial 911 immediately.
                            </p>
                        </CardContent>
                    </Card>
                    </div>

                    {/* <div className="text-center mt-10 hidden lg:block lg:text-start">
                    <Link to="/faq">
                        <ButtonLink>
                            Want to know more? Click here.
                        </ButtonLink>
                    </Link>
                </div> */}
                 </div> 
            </div>
        
            
        </>
    )
}

export default ContactPage
