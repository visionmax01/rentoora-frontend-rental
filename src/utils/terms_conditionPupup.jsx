import React from "react";

const TermsAndConditionsPopup = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-75 p-3">
      <div className="relative bg-white rounded-lg p-6 md:w-3/4 w-[100%] max-h-fit">
        <h2 className="text-2xl font-semibold mb-4">Terms and Conditions</h2>
        <div className="relative bg-white rounded-lg md:px-4 md:w-[100%] w-[85%] h-[82vh] md:max-h-[82vh] overflow-auto">
          <p className="text-gray-700 mb-4 text-justify">
            <strong>Welcome to Rentoora.com,</strong> a platform providing room, house,
            and apartment rentals, booking for electricians, and the sale of old
            phones. By accessing and using our services, you agree to comply
            with the following terms and conditions. Please read these terms
            carefully before using our website.<br/><br/> 
            <strong>1.</strong> General Terms: By using our website, you confirm that you are at least 18 years old or have the
            permission of a legal guardian. You agree to provide accurate and
            current information while creating an account or making any
            bookings/purchases. We reserve the right to update or modify these
            Terms and Conditions at any time without prior notice. Please review
            them regularly to stay informed of any changes. All users are
            required to respect the rules of conduct while using our website and
            refrain from any fraudulent activity.<br/><br/> 
            <strong>2.</strong> <strong>Rental Services (Rooms, Houses, and Apartments):</strong> 
            Bookings are subject to availability. Clients must pay the required deposit or full payment
            as indicated on the listing page. Cancellations may incur fees based
            on the cancellation policy of each property. Property Condition: All
            properties are rented as-is. We strive to ensure that all rooms,
            houses, and apartments listed are properly maintained. Clients are
            responsible for inspecting the property upon check-in and reporting
            any issues within 24 hours. Security Deposits: A security deposit
            may be required for some rentals. The deposit will be refunded after
            the check-out inspection, provided no damages or violations of the
            rental agreement are found. Tenant Responsibilities: Tenants must
            maintain cleanliness and respect the property. Any damages caused by
            the tenant will be deducted from the security deposit, or additional
            charges may apply.<br/><br/> 
            <strong>3.</strong> <strong>Booking for Electricians:</strong> 
            Service Availability: Electrician services are available for pre-booking only, and
            appointment slots are subject to availability. Pricing and Payment:
            Prices for electrical services will vary based on the scope of work.
            Full payment is required after the service is completed. Liability:
            We are not liable for any damages caused by the electrician’s
            services. It is the responsibility of the electrician to perform
            work professionally and safely. However, we will work with clients
            to resolve any disputes. Cancellation: Clients may cancel or
            reschedule their booking within 24 hours before the scheduled
            service without incurring additional fees.<br/><br/> 
            <strong>4.</strong> <strong>Selling and Purchasing Old Phones:</strong> 
            Condition of Phones: All phones listed for sale on our
            platform must be accurately described by the seller. We do not
            guarantee the condition of the phones, and it is the buyer’s
            responsibility to inspect the item upon receipt. Payments: Payments
            for old phones must be made in full at the time of purchase. All
            sales are final unless otherwise stated. Refunds and Returns:
            Refunds are only provided if the phone is significantly different
            from the description or is defective. Buyers must report issues
            within 7 days of receiving the phone. Warranty: Phones sold through
            our platform may not come with any warranties unless explicitly
            mentioned by the seller.<br/><br/> 
            <strong>5.</strong> User Responsibilities: Users must not
            engage in fraudulent activities, including providing false
            information, using stolen payment methods, or attempting to mislead
            others. Users are responsible for maintaining the security of their
            account credentials. We are not liable for unauthorized access to
            your account. Any illegal activity conducted through our website
            will result in immediate termination of service and may be reported
            to law enforcement authorities.<br/><br/> 
            <strong>6.</strong> Privacy: We respect your privacy
            and are committed to protecting your personal data. By using our
            website, you agree to the collection and use of information as
            outlined in our Privacy Policy.<br/><br/> 
            <strong>7.</strong> Limitation of Liability: We are
            not responsible for any direct or indirect damages resulting from
            the use of our services, including but not limited to issues related
            to property rentals, electrician services, or phone purchases. Our
            website acts as a platform connecting clients with service providers
            and sellers. We do not guarantee the quality, safety, or legality of
            the services and products provided.<br/><br/> 
            <strong>8.</strong> Dispute Resolution: In the
            event of a dispute between clients and service providers or sellers,
            we encourage both parties to resolve the matter amicably. If
            necessary, we will facilitate communication between the parties to
            find a resolution.<br/><br/> 
            <strong>9.</strong> Governing Law: These Terms and Conditions are
            governed by the laws of Nepal. Any disputes arising
            from the use of our website will be subject to the exclusive
            jurisdiction of the courts in the district.<br/><br/> 
            <strong>10.</strong> Contact Information: For any questions or concerns regarding these Terms and
            Conditions, please contact us at bhishansah@gmail.com.
          </p>

          <div className="flex justify-end mt-4">
            <button
              onClick={onAccept}
              className="mr-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Accept
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-gray-500 text-white absolute top-0 right-0 w-8 h-8 rounded-tr z-20 hover:bg-red-600"
        >
          <strong>X</strong>
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;
