import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Tractor, 
  ShieldCheck, 
  FileText, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  Wrench, 
  DollarSign, 
  Calendar, 
  Lock, 
  Activity, 
  Scale 
} from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const { user, acceptTerms } = useAuth();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  if (!user) {
    return null;
  }

  const role = user.role;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Check if user scrolled near the bottom (within 10px) to encourage reading
    const difference = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (difference <= 15) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (isChecked) {
      acceptTerms();
      navigate(role === 'farmer' ? '/farmer/dashboard' : '/owner/dashboard');
    }
  };

  // Farmer terms details
  const farmerTerms = [
    {
      id: 1,
      title: 'Equipment Rental',
      icon: <Calendar className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Equipment availability depends on the owner's schedule and approval.",
        "Rental charges are displayed for each equipment item.",
        "Bookings are confirmed only after successful payment (if applicable)."
      ]
    },
    {
      id: 2,
      title: 'Equipment Usage',
      icon: <Tractor className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Equipment must be used only for agricultural purposes.",
        "Farmers must operate equipment safely and responsibly.",
        "Unauthorized modifications or misuse are strictly prohibited."
      ]
    },
    {
      id: 3,
      title: 'Damage Responsibility',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bullets: [
        "Farmers are responsible for any damage, loss, or theft during the rental period.",
        "Repair or replacement costs may be charged based on the extent of damage."
      ]
    },
    {
      id: 4,
      title: 'Equipment Return',
      icon: <ArrowRight className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Equipment must be returned within the agreed rental period.",
        "Late returns may result in additional charges."
      ]
    },
    {
      id: 5,
      title: 'Cancellation Policy',
      icon: <Activity className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Farmers may cancel bookings before the rental start date.",
        "Cancellation fees may apply depending on the timing of cancellation."
      ]
    },
    {
      id: 6,
      title: 'Liability',
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      bullets: [
        "The platform is not responsible for crop loss, weather conditions, equipment breakdowns, or operational mistakes."
      ]
    },
    {
      id: 7,
      title: 'Privacy',
      icon: <Lock className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Personal information will be used only for account management, bookings, and communication."
      ]
    },
    {
      id: 8,
      title: 'Agreement',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bullets: [
        "By accepting these terms, you agree to use the platform responsibly and comply with all rental policies."
      ]
    }
  ];

  // Owner terms details
  const ownerTerms = [
    {
      id: 1,
      title: 'Equipment Listing',
      icon: <FileText className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Owners must provide accurate equipment details, pricing, images, and availability information.",
        "False or misleading information may result in account suspension."
      ]
    },
    {
      id: 2,
      title: 'Equipment Condition',
      icon: <Wrench className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Owners must ensure equipment is safe, functional, and properly maintained before rental.",
        "Equipment should be inspected before handing it over to a farmer."
      ]
    },
    {
      id: 3,
      title: 'Pricing',
      icon: <DollarSign className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Owners are responsible for setting fair and accurate rental prices.",
        "The platform may review listings that contain unrealistic pricing."
      ]
    },
    {
      id: 4,
      title: 'Availability Management',
      icon: <Calendar className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Owners must keep availability schedules updated.",
        "Repeated booking cancellations may affect account status."
      ]
    },
    {
      id: 5,
      title: 'Damage Reporting',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bullets: [
        "Any equipment damage must be reported promptly with supporting evidence when applicable."
      ]
    },
    {
      id: 6,
      title: 'Payments',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bullets: [
        "Owners agree to receive payments through the platform's approved payment process.",
        "Payment settlements will follow platform policies."
      ]
    },
    {
      id: 7,
      title: 'Liability',
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      bullets: [
        "Owners remain responsible for the maintenance and legal ownership of listed equipment.",
        "The platform acts only as a marketplace connecting owners and farmers."
      ]
    },
    {
      id: 8,
      title: 'Privacy',
      icon: <Lock className="w-5 h-5 text-primary-600" />,
      bullets: [
        "Owner information will be used only for platform operations and communication."
      ]
    },
    {
      id: 9,
      title: 'Agreement',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bullets: [
        "By accepting these terms, you agree to maintain accurate listings and provide equipment responsibly."
      ]
    }
  ];

  const currentTerms = role === 'farmer' ? farmerTerms : ownerTerms;
  const termsTitle = role === 'farmer' ? 'Farmer Terms & Conditions' : 'Owner Terms & Conditions';
  const welcomeMessage = role === 'farmer' ? 'Welcome Farmer' : 'Welcome Equipment Owner';
  const checkboxLabel = role === 'farmer' ? 'I have read and agree to the Farmer Terms & Conditions' : 'I have read and agree to the Owner Terms & Conditions';
  const buttonLabel = role === 'farmer' ? 'Continue to Farmer Dashboard' : 'Continue to Owner Dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-emerald-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Step Indicator Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary-200 shadow-sm text-xs font-semibold text-gray-500">
          <span className="text-primary-600">Step 1: Login</span>
          <span className="text-gray-300">→</span>
          <span className="text-primary-800 bg-primary-100 px-2.5 py-0.5 rounded-full">Step 2: Accept Terms</span>
          <span className="text-gray-300">→</span>
          <span>Step 3: Dashboard</span>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-white">
          
          {/* Header Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3 text-primary-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {termsTitle}
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-semibold">
              {welcomeMessage}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Before accessing the platform, please read and accept the following terms.
            </p>
          </div>

          {/* Scrollable Terms & Conditions Box */}
          <div 
            onScroll={handleScroll}
            className="mt-4 max-h-96 overflow-y-auto border border-gray-200 bg-gray-50/50 rounded-xl p-6 shadow-inner space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {currentTerms.map((term) => (
              <div 
                key={term.id} 
                className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-1.5 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                    {term.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">
                    {term.id}. {term.title}
                  </h3>
                </div>
                <ul className="list-none pl-1 space-y-1.5">
                  {term.bullets.map((bullet, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Hint to scroll */}
          {!hasScrolledToBottom && (
            <div className="text-center mt-2 text-xs text-amber-600 flex items-center justify-center space-x-1 animate-pulse">
              <InfoIcon className="w-3.5 h-3.5" />
              <span>Please scroll to the bottom of the terms to enable acceptance.</span>
            </div>
          )}

          {/* Terms Acceptance Checklist Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <button
                  type="button"
                  id="accept-terms-checkbox"
                  disabled={!hasScrolledToBottom}
                  onClick={() => setIsChecked(!isChecked)}
                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                    !hasScrolledToBottom 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                      : isChecked
                        ? 'bg-primary-600 border-primary-600 shadow-md shadow-primary-200 text-white'
                        : 'border-gray-300 hover:border-primary-500 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 stroke-[3px]" />}
                </button>
              </div>
              <div className="ml-3 text-sm">
                <label 
                  htmlFor="accept-terms-checkbox" 
                  className={`font-semibold select-none ${
                    !hasScrolledToBottom 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 cursor-pointer hover:text-gray-900'
                  }`}
                  onClick={() => hasScrolledToBottom && setIsChecked(!isChecked)}
                >
                  {checkboxLabel}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="mt-6">
            <button
              type="button"
              disabled={!isChecked}
              onClick={handleAccept}
              className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 ${
                isChecked
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 active:scale-[0.99] cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{buttonLabel}</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// Local component helper for Info Icon
const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default TermsAndConditions;
