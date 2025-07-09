import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  Check,
  Star,
  Scissors,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

const ServiceSelection = () => {
  const {
    getActiveServices,
    bookingData,
    addServiceToBooking,
    removeServiceFromBooking,
    setBookingStep,
  } = useAppStore();

  const services = getActiveServices();
  const selectedServices = bookingData.services || [];

  const getServiceQuantity = (serviceId: string) => {
    return (
      selectedServices.find((s) => s.serviceId === serviceId)?.quantity || 0
    );
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      setBookingStep(2);
    }
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
              <Link
                to="/"
                className="flex items-center text-white hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar ao início
              </Link>

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
              <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="ml-2 font-medium">Serviço</span>
            </div>
            <div className="w-12 h-0.5 bg-white/30"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/30 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <span className="ml-2 text-white/70">Data e Hora</span>
            </div>
            <div className="w-12 h-0.5 bg-white/30"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/30 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <span className="ml-2 text-white/70">Dados</span>
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
              Escolha seu Serviço
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Selecione o serviço desejado e dê o primeiro passo para sua
              transformação
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => {
                const quantity = getServiceQuantity(service.id);
                const isSelected = quantity > 0;

                return (
                  <Card
                    key={service.id}
                    className={`transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
                      isSelected
                        ? "border-purple-400 bg-white shadow-2xl ring-4 ring-purple-200"
                        : "border-transparent bg-white/95 backdrop-blur-sm hover:bg-white"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {service.name}
                            </h3>
                            {isSelected && (
                              <div className="bg-purple-600 text-white rounded-full px-2 py-1 text-sm font-bold">
                                {quantity}x
                              </div>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-700 hover:bg-purple-100"
                          >
                            {service.category}
                          </Badge>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-purple-600">
                            R$ {service.price.toFixed(2)}
                          </div>
                          {quantity > 0 && (
                            <div className="text-sm text-gray-600">
                              Total: R$ {(service.price * quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {service.duration} minutos
                          </span>
                        </div>

                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current mr-1" />
                          <span className="text-sm text-gray-600">4.9</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between gap-4">
                        {quantity === 0 ? (
                          <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            onClick={() => addServiceToBooking(service.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Serviço
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeServiceFromBooking(service.id)
                              }
                              className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="flex-1 text-center font-semibold text-gray-800">
                              {quantity}{" "}
                              {quantity === 1 ? "serviço" : "serviços"}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addServiceToBooking(service.id)}
                              className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Resumo da Seleção ({selectedServices.length}{" "}
                  {selectedServices.length === 1 ? "serviço" : "serviços"})
                </h3>

                <div className="space-y-3 mb-6">
                  {selectedServices.map((selectedService) => {
                    const service = services.find(
                      (s) => s.id === selectedService.serviceId,
                    );
                    if (!service) return null;

                    return (
                      <div
                        key={selectedService.serviceId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {service.duration} min × {selectedService.quantity}{" "}
                            = {service.duration * selectedService.quantity} min
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">
                            R${" "}
                            {(service.price * selectedService.quantity).toFixed(
                              2,
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            R$ {service.price.toFixed(2)} ×{" "}
                            {selectedService.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Tempo total estimado:
                    </p>
                    <p className="font-bold text-gray-800">
                      {bookingData.totalDuration || 0} minutos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total a pagar:</p>
                    <p className="text-2xl font-bold text-purple-600">
                      R$ {(bookingData.totalPrice || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                    onClick={handleContinue}
                  >
                    Continuar para Data e Hora
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;
