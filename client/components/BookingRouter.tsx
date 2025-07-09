import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import ServiceSelection from "@/pages/booking/ServiceSelection";
import DateTimeSelection from "@/pages/booking/DateTimeSelection";
import CustomerForm from "@/pages/booking/CustomerForm";
import Confirmation from "@/pages/booking/Confirmation";

const BookingRouter = () => {
  const { currentBookingStep, bookingData } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Update URL based on current step
    switch (currentBookingStep) {
      case 1:
        navigate("/booking", { replace: true });
        break;
      case 2:
        navigate("/booking/step-2", { replace: true });
        break;
      case 3:
        navigate("/booking/step-3", { replace: true });
        break;
      case 4:
        navigate("/booking/confirmation", { replace: true });
        break;
      default:
        navigate("/booking", { replace: true });
    }
  }, [currentBookingStep, navigate]);

  // Render component based on step
  switch (currentBookingStep) {
    case 1:
      return <ServiceSelection />;
    case 2:
      return <DateTimeSelection />;
    case 3:
      return <CustomerForm />;
    case 4:
      return <Confirmation />;
    default:
      return <ServiceSelection />;
  }
};

export default BookingRouter;
