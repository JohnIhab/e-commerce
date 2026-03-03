import React from "react";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
      {title}
    </h2>
    <div className="h-1 w-14 bg-primary mb-4" />
    <div className="prose prose-sm md:prose-base max-w-none text-baseTwo leading-7">
      {children}
    </div>
  </section>
);

const PrivacyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-base mb-3">
            Privacy Policy
          </h1>
          <p className="text-baseTwo">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <Section title="Disclaimer">
          <p>
            Al-Shifa Al-Dawaeya Pharmacy is dedicated to respecting the privacy
            of website and smartphone application users, protecting any personal
            information obtained during the data collection process. This
            includes information provided by users through website/application
            usage, in stores, or via phone or email, and will be handled by our
            Privacy Policy.
          </p>
        </Section>

        <Section title="Your Explicit Consent to the Collection and Use of Your Information">
          <p>
            Your explicit consent is essential for the collection and
            utilization of personal information by Al-Shifa Al-Dawaeya Pharmacy.
            This may include your name, address, phone number, email,
            demographic data, transaction details, and personal profiles like
            Internet IP address, domain, browser, reference information, and
            user agent. This information is collected through means such as
            cookies or other user-provided data, all of which are stored
            securely on our servers and treated with the utmost confidentiality.
          </p>
          <p>
            By using our website or application, you expressly consent to the
            collection, transfer, processing, use, and storage of your personal
            information, as highlighted in our privacy policy.
          </p>
          <p>
            This may occur within your country of residence or outside it in
            jurisdictions with different privacy laws. If you do not agree with
            the terms or require more information, please contact our customer
            service directly at 1888124 in Kuwait. Your access or use of the
            website/application grants Al-Shifa Pharmacy a perpetual,
            non-exclusive, worldwide license to use your personal information
            for the purposes outlined in this document, without charge.
          </p>
        </Section>

        <Section title="Information Sharing">
          <p>
            We do not sell your data to third parties. However, selected
            customer information may be shared with:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Our group of companies.</li>
            <li>Companies granting exclusive franchise rights.</li>
            <li>
              Databases of other parties to which Al-Shifa Pharmacy or any of
              its brands subscribe.
            </li>
            <li>
              Governmental bodies or other authorities when necessary to comply
              with laws or protect rights and property.
            </li>
            <li>
              Agencies assisting in collecting statistics on visitors, sales,
              demographics, and other business information to improve our
              services.
            </li>
          </ul>
          <p className="mt-3">
            We will retain and use your data for corporate purposes permitted by
            law, and will promptly dispose of such personal data securely.
          </p>
          <p className="mt-3">
            We also reserve the right to use third-party advertising companies
            to display advertisements on our websites. These advertisements may
            contain cookies. While we may use cookies in other parts of our
            websites, cookies related to advertising or from third-party sources
            may be collected by third parties without our direct involvement or
            control.
          </p>
        </Section>

        <Section title="Data Security">
          <p>
            We employ rigorous security measures. All personal data is stored on
            a secure server, and we implement procedures designed to prevent
            random or unauthorized access, destruction, use, modification, or
            disclosure. Our commitment to keeping your data confidential and
            secure is outlined in this policy. We apply technical and
            organizational measures to prevent accidental or unlawful damage,
            loss, unauthorized disclosure or access, or any other form of
            illegal use.
          </p>
          <p className="mt-3">
            While we strive to implement commercially applicable security
            measures, users acknowledge and agree that Al-Shifa Pharmacy does
            not control the transmission of information or data through our
            websites/applications or any other websites or media.
          </p>
        </Section>

        <Section title="Privacy Policy Updates">
          <p>
            Due to our ongoing efforts to enhance the quality of service for our
            customers through regular updates and improvements to our systems
            and services, Al-Shifa Al-Dawaeya Pharmacy reserves the right to
            review, amend, or change the terms and conditions of this privacy
            policy at any time without notice. Your continued use of our
            websites/applications or other means following the posting of
            modifications to the Privacy Policy will be considered as your
            acceptance of such changes.
          </p>
        </Section>

        <Section title="Other Parties' Websites">
          <p>
            Our websites/applications may include links to other websites. We do
            not assume responsibility for the privacy practices of these
            unaffiliated websites or the content and information-handling
            methods they employ. We strongly advise you to review the privacy
            policies of all websites you visit to understand how they manage
            your data.
          </p>
        </Section>

        <Section title="Warranty and Guarantee">
          <p>
            The user acknowledges that Al-Shifa Al-Dawaeya Pharmacy does not
            provide any warranty, guarantee, or representation regarding the
            control, collection, correction, access, processing, use, storage,
            protection, or transfer of personal information, or the existence or
            effectiveness of any security measures employed.
          </p>
          <p className="mt-3">
            The user agrees that Al-Shifa Pharmacy will not be held responsible
            for any claims, losses, or damages resulting from access,
            disclosure, use, or modification by any authorized or unauthorized
            party, or the introduction of viruses, software, or any other
            harmful factors and their subsequent impact on the personal data
            stored on the website or application.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            Under no circumstances will Al-Shifa Al-Dawaeya Pharmacy, its
            affiliates, partners, employees, officers, directors, or insurers
            bear any liability to you or any other person for costs or damages,
            including any special or unintentional, punitive, indirect, or
            consequential damages, arising from the collection, use,
            transmission, processing, or storage of personal information
            resulting from your access to our websites/applications.
          </p>
        </Section>

        <Section title="Governing Law and Jurisdiction">
          <p>
            All disputes arising from the provision of this service shall be
            subject to the jurisdiction of the law of the country in which you
            registered your personal information on the Al-Shifa Drugstore
            website or application. This exclusively includes the countries in
            which Al-Shifa Al-Dawaeya Pharmacy operates the website/application.
            Judicial departments are competent to hear disputes about this
            privacy policy, depending on the country in which the dispute arose.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
