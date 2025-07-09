import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageCircle,
  Scissors,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

const CustomerForm = () => {
  const { bookingData, updateBookingData, setBookingStep, services } =
    useAppStore();

  const [formData, setFormData] = useState({
    name: bookingData.clientData?.name || "",
    email: bookingData.clientData?.email || "",
    phone: bookingData.clientData?.phone || "",
    notes: bookingData.clientData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedServices = bookingData.services || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone deve ter pelo menos 10 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange("phone", formatted);
  };

  const handleContinue = () => {
    if (validateForm()) {
      updateBookingData({
        clientData: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          notes: formData.notes.trim(),
        },
      });
      setBookingStep(4);
    }
  };

  const handleBack = () => {
    setBookingStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=')] opacity-20"></div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center text-white hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar à data e hora
              </button>

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
              <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 font-medium">Dados</span>
            </div>
            <div className="w-12 h-0.5 bg-white/30"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/30 text-white rounded-full flex items-center justify-center">
                4
              </div>
              <span className="ml-2 text-white/70">Confirmação</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Seus Dados Pessoais
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Precisamos de algumas informações para confirmar seu agendamento
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8">
                <form className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nome Completo *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`pl-10 h-12 ${
                          errors.name
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-purple-500"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`pl-10 h-12 ${
                          errors.email
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-purple-500"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 font-medium"
                    >
                      Telefone *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`pl-10 h-12 ${
                          errors.phone
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-purple-500"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  {/* Notes Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="text-gray-700 font-medium"
                    >
                      Observações (Opcional)
                    </Label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Textarea
                        id="notes"
                        placeholder="Alguma preferência ou observação especial..."
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        className="pl-10 min-h-[100px] border-gray-300 focus:border-purple-500"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Importante:</strong> Você receberá uma confirmação
                      por email e WhatsApp. Chegue com 5 minutos de
                      antecedência.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="mt-6 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Resumo do Agendamento
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Serviços:
                    </p>
                    <div className="space-y-1">
                      {selectedServices.map((selectedService) => {
                        const service = services.find(
                          (s) => s.id === selectedService.serviceId,
                        );
                        return service ? (
                          <p
                            key={selectedService.serviceId}
                            className="text-sm text-gray-600"
                          >
                            {service.name}{" "}
                            {selectedService.quantity > 1 &&
                              `(${selectedService.quantity}x)`}{" "}
                            - R${" "}
                            {(service.price * selectedService.quantity).toFixed(
                              2,
                            )}
                          </p>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Data e Hora:
                    </p>
                    <p className="text-sm text-gray-600">
                      {bookingData.date &&
                        new Date(bookingData.date).toLocaleDateString(
                          "pt-BR",
                        )}{" "}
                      às {bookingData.time}
                    </p>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">Total:</p>
                      <p className="text-xl font-bold text-purple-600">
                        R$ {(bookingData.totalPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
                  onClick={handleContinue}
                >
                  Finalizar Agendamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
