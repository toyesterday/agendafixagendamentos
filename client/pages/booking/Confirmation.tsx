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
  Share2,
  Download,
  MessageCircle,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

const Confirmation = () => {
  const {
    bookingData,
    submitBooking,
    resetBooking,
    services,
    businessConfig,
    isLoading,
  } = useAppStore();

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

  const shareAppointment = () => {
    const text = `🔮 Agendamento confirmado na AgendaFixa!\n\nID: ${appointmentId}\nData: ${bookingData.date && new Date(bookingData.date).toLocaleDateString("pt-BR")}\nHorário: ${bookingData.time}\nTotal: R$ ${(bookingData.totalPrice || 0).toFixed(2)}`;

    if (navigator.share) {
      navigator.share({
        title: "Agendamento AgendaFixa",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Informações copiadas para a área de transferência!");
    }
  };

  const sendWhatsApp = () => {
    const text = `Olá! Acabei de agendar um horário na AgendaFixa.\n\nID: ${appointmentId}\nData: ${bookingData.date && new Date(bookingData.date).toLocaleDateString("pt-BR")}\nHorário: ${bookingData.time}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Confirmando seu agendamento...
            </h3>
            <p className="text-gray-600">Aguarde um momento</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=')] opacity-20"></div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 text-white">
                <Scissors className="h-6 w-6" />
                <span className="text-xl font-bold">AgendaFixa</span>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4 text-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/50 text-white rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="ml-2 text-white/70">Serviço</span>
            </div>
            <div className="w-12 h-0.5 bg-white/50"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/50 text-white rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="ml-2 text-white/70">Data e Hora</span>
            </div>
            <div className="w-12 h-0.5 bg-white/50"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/50 text-white rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="ml-2 text-white/70">Dados</span>
            </div>
            <div className="w-12 h-0.5 bg-white/50"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="ml-2 font-medium">Confirmação</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-8">
              <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-2xl">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Agendamento Confirmado!
              </h1>
              <p className="text-xl text-white/90">
                Seu horário foi reservado com sucesso
              </p>
            </div>

            {/* Appointment Details */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Detalhes do Agendamento
                  </h2>
                  <div className="bg-purple-100 text-purple-800 rounded-lg p-3 inline-block">
                    <p className="font-bold">ID: {appointmentId}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Services */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Scissors className="h-5 w-5 mr-2" />
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
                            className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {service.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {service.duration} min
                                {selectedService.quantity > 1 &&
                                  ` × ${selectedService.quantity}`}
                              </p>
                            </div>
                            <p className="font-bold text-purple-600">
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
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Data e Horário
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium text-gray-800">
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Horário:</span>
                        <span className="font-medium text-gray-800">
                          {bookingData.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Duração:</span>
                        <span className="font-medium text-gray-800">
                          {bookingData.totalDuration} minutos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Seus Dados
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-3" />
                        <span>{bookingData.clientData?.name}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-3" />
                        <span>{bookingData.clientData?.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-3" />
                        <span>{bookingData.clientData?.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Local
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-800">
                        {businessConfig?.name}
                      </p>
                      <p className="text-gray-600">{businessConfig?.address}</p>
                      <p className="text-gray-600">{businessConfig?.phone}</p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        R$ {(bookingData.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={shareAppointment}
                  variant="outline"
                  className="bg-white/90 border-white text-gray-700 hover:bg-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button
                  onClick={sendWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar no WhatsApp
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/">
                  <Button
                    variant="outline"
                    className="w-full bg-white/90 border-white text-gray-700 hover:bg-white"
                  >
                    Voltar ao Início
                  </Button>
                </Link>
                <Button
                  onClick={handleNewBooking}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Novo Agendamento
                </Button>
              </div>
            </div>

            {/* Important Notes */}
            <Card className="mt-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-yellow-800 mb-3">
                  Informações Importantes:
                </h3>
                <ul className="space-y-2 text-yellow-700 text-sm">
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
