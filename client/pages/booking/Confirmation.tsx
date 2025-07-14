import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Scissors,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { getThemeClasses } from "@/types/themes";

const Confirmation = () => {
  const {
    bookingData,
    submitBooking,
    resetBooking,
    services,
    businessConfig,
    isLoading,
    currentTheme,
  } = useAppStore();

  const themeClasses = getThemeClasses(currentTheme);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string>("");

  const selectedServices = bookingData.services || [];

  useEffect(() => {
    const handleSubmit = async () => {
      if (!isSubmitted && bookingData.clientData) {
        const success = await submitBooking();
        if (success) {
          setIsSubmitted(true);
          const newAppointmentId = `AG${Date.now().toString().slice(-6)}`;
          setAppointmentId(newAppointmentId);

          // Send automatic WhatsApp notification
          await sendWhatsAppConfirmation();
        }
      }
    };

    handleSubmit();
  }, [submitBooking, isSubmitted, bookingData.clientData]);

  const sendWhatsAppConfirmation = async () => {
    try {
      if (!bookingData.clientData || !selectedServices.length) return;

      // Load WhatsApp configuration
      const whatsappConfig = JSON.parse(
        localStorage.getItem("whatsapp-config") || "{}",
      );

      // Get services names for the notification
      const serviceNames = selectedServices
        .map((selectedService) => {
          const service = services.find(
            (s) => s.id === selectedService.serviceId,
          );
          return service
            ? `${service.name}${selectedService.quantity > 1 ? ` (${selectedService.quantity}x)` : ""}`
            : "Serviço";
        })
        .join(", ");

      // Check if auto-send to client is enabled
      if (whatsappConfig.autoSendToClient !== false) {
        // Send notification to CLIENT
        const clientResponse = await fetch(
          "/api/whatsapp/booking/confirmation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientName: bookingData.clientData.name,
              phone: bookingData.clientData.phone,
              serviceName: serviceNames,
              date: bookingData.date,
              time: bookingData.time,
              totalPrice: (bookingData.totalPrice || 0).toFixed(2),
              type: "client",
              config: whatsappConfig, // Send config for template customization
            }),
          },
        );

        if (clientResponse.ok) {
          console.log("✅ WhatsApp confirmation sent to client");
        }
      }

      // Check if auto-send to salon is enabled
      if (whatsappConfig.autoSendToSalon !== false) {
        // Send notification to SALON using configured admin phone
        const adminPhone = whatsappConfig.adminPhone || "(11) 3333-4444";
        const salonResponse = await fetch(
          "/api/whatsapp/booking/confirmation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientName: bookingData.clientData.name,
              phone: adminPhone,
              serviceName: serviceNames,
              date: bookingData.date,
              time: bookingData.time,
              totalPrice: (bookingData.totalPrice || 0).toFixed(2),
              clientPhone: bookingData.clientData.phone,
              type: "salon",
              config: whatsappConfig, // Send config for template customization
            }),
          },
        );

        if (salonResponse.ok) {
          console.log("✅ WhatsApp notification sent to salon");
        }
      }
    } catch (error) {
      console.warn("WhatsApp service not available:", error);
      // Don't show error to user, as the booking was successful
    }
  };

  const handleNewBooking = () => {
    resetBooking();
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen ${themeClasses.backgroundGradient} flex items-center justify-center`}
      >
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-w-md w-full mx-4">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Confirmando seu agendamento...
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Aguarde um momento
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.backgroundGradient}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=')] opacity-20"></div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-white">
                <Scissors className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-lg sm:text-xl font-bold">AgendaFixa</span>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-white overflow-x-auto">
            <div className="flex items-center flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/50 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">
                ✓
              </div>
              <span className="ml-1 sm:ml-2 text-white/70 text-xs sm:text-sm hidden sm:inline">
                Serviço
              </span>
            </div>
            <div className="w-6 sm:w-12 h-0.5 bg-white/50 flex-shrink-0"></div>
            <div className="flex items-center flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/50 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">
                ✓
              </div>
              <span className="ml-1 sm:ml-2 text-white/70 text-xs sm:text-sm hidden sm:inline">
                Data e Hora
              </span>
            </div>
            <div className="w-6 sm:w-12 h-0.5 bg-white/50 flex-shrink-0"></div>
            <div className="flex items-center flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/50 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">
                ✓
              </div>
              <span className="ml-1 sm:ml-2 text-white/70 text-xs sm:text-sm hidden sm:inline">
                Dados
              </span>
            </div>
            <div className="w-6 sm:w-12 h-0.5 bg-white/50 flex-shrink-0"></div>
            <div className="flex items-center flex-shrink-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">
                ✓
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs sm:text-sm">
                Confirmação
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-2 sm:px-4 pb-8 sm:pb-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-white rounded-full p-3 sm:p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 shadow-2xl">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
                Agendamento Confirmado!
              </h1>
              <p className="text-lg sm:text-xl text-white/90 px-2">
                Seu horário foi reservado com sucesso
              </p>
            </div>

            {/* Appointment Details */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-4 sm:mb-6 mx-2 sm:mx-0">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Detalhes do Agendamento
                  </h2>
                  <div className="bg-purple-100 text-purple-800 rounded-lg p-2 sm:p-3 inline-block">
                    <p className="font-bold text-sm sm:text-base">
                      ID: {appointmentId}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Services */}
                  <div className="border-b pb-3 sm:pb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <Scissors className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Serviços
                    </h3>
                    <div className="space-y-2">
                      {selectedServices.map((selectedService) => {
                        const service = services.find(
                          (s) => s.id === selectedService.serviceId,
                        );
                        return service ? (
                          <div
                            key={selectedService.serviceId}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 rounded-lg p-3 gap-2 sm:gap-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm sm:text-base">
                                {service.name}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {service.duration} min
                                {selectedService.quantity > 1 &&
                                  ` × ${selectedService.quantity}`}
                              </p>
                            </div>
                            <p className="font-bold text-purple-600 text-sm sm:text-base text-right">
                              R${" "}
                              {(
                                service.price * selectedService.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="border-b pb-3 sm:pb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Data e Horário
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Data:
                        </span>
                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                          {bookingData.date &&
                            new Date(bookingData.date).toLocaleDateString(
                              "pt-BR",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Horário:
                        </span>
                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                          {bookingData.time}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Duração:
                        </span>
                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                          {bookingData.totalDuration} minutos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-b pb-3 sm:pb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Seus Dados
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 text-sm sm:text-base">
                        <User className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="break-words">
                          {bookingData.clientData?.name}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:text-base">
                        <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span className="break-all">
                          {bookingData.clientData?.email}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:text-base">
                        <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                        <span>{bookingData.clientData?.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border-b pb-3 sm:pb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Local
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {businessConfig?.name}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base break-words">
                        {businessConfig?.address}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {businessConfig?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-purple-600">
                        R$ {(bookingData.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3 px-2 sm:px-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to="/">
                  <Button
                    variant="outline"
                    className="w-full bg-white/90 border-white text-gray-700 hover:bg-white h-12 text-base"
                  >
                    Voltar ao Início
                  </Button>
                </Link>
                <Button
                  onClick={handleNewBooking}
                  className={`w-full ${themeClasses.primaryButton} text-white h-12 text-base`}
                >
                  Novo Agendamento
                </Button>
              </div>
            </div>

            {/* Important Notes */}
            <Card className="mt-4 sm:mt-6 bg-yellow-50 border-yellow-200 mx-2 sm:mx-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-800 mb-3 text-sm sm:text-base">
                  Informações Importantes:
                </h3>
                <ul className="space-y-2 text-yellow-700 text-xs sm:text-sm">
                  <li>• Chegue com 5 minutos de antecedência</li>
                  <li>• Você receberá lembretes por email e WhatsApp</li>
                  <li>• Para cancelar ou remarcar, entre em contato conosco</li>
                  <li>• Guarde o ID do agendamento: {appointmentId}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
