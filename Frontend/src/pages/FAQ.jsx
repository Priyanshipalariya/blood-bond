import React from "react";

const FAQ = () => {
    return(
        <section className="py-14 bg-gray-100">
        <div className=" px-5">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  q: "How can I schedule a blood donation appointment?",
                  a: "You can schedule an appointment by calling our donor support line at +1 234 567 890, visiting our website, or using our mobile app. Walk-ins are also welcome at our donation centers, but appointments are preferred."
                },
                {
                  q: "Can I host a blood drive at my organization?",
                  a: "Absolutely! We partner with businesses, schools, places of worship, and community organizations to host blood drives. Contact our community outreach team at outreach@bloodbond.org to learn more."
                },
                {
                  q: "How can I volunteer with Blood Bond?",
                  a: "We're always looking for volunteers to help at donation centers, blood drives, and community events. Contact our volunteer coordinator at volunteer@bloodbond.org for opportunities."
                },
                {
                  q: "I have a question about my eligibility to donate blood. Who should I contact?",
                  a: "For questions about donation eligibility, please call our donor support line at +1 234 567 890 or email donors@bloodbond.org. Our trained staff can help determine your eligibility."
                },
                {
                  q: "How can I request a speaker for my event?",
                  a: "We have speakers available to discuss blood donation, our mission, and the impact of blood donations. Email speakers@bloodbond.org with details about your event."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
}

export default FAQ