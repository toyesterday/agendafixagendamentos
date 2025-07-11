import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  ArrowLeft,
  Clock,
  Calendar as CalendarIcon,
  Scissors,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { getThemeClasses } from "@/types/themes";

const DateTimeSelection = () => {
  const {
    bookingData,
    updateBookingData,
    setBookingStep,
    getAvailableTimeSlots,
    services,
  } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    bookingData.date ? new Date(bookingData.date) : undefined,
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    bookingData.time || "",
  );

  const selectedServices = bookingData.services || [];
  const totalDuration = bookingData.totalDuration || 0;

  // Get available time slots for the selected date
  const availableSlots = selectedDate
    ? getAvailableTimeSlots(
        selectedDate.toISOString().split("T")[0],
        selectedServices[0]?.serviceId || "",
      )
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      updateBookingData({
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
      });
      setBookingStep(3);
    }
  };

  const handleBack = () => {
    setBookingStep(1);
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
                Voltar aos serviços
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
              <div className="w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 font-medium">Data e Hora</span>
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
              Escolha Data e Horário
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Selecione o dia e horário que melhor se adequa à sua agenda
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calendar Section */}
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Selecione a Data
                  </h3>

                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date < new Date() || date.getDay() === 0
                      } // Disable past dates and Sundays
                      className="rounded-md border-0"
                    />
                  </div>

                  {selectedDate && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 font-medium">
                        Data selecionada:{" "}
                        {selectedDate.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Time Selection Section */}
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Horários Disponíveis
                  </h3>

                  {!selectedDate ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Selecione uma data primeiro
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {timeSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        const isAvailable = true; // Simplified for demo

                        return (
                          <Button
                            key={time}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={`
                              ${
                                isSelected
                                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                                  : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                              }
                              ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                            onClick={() =>
                              isAvailable && handleTimeSelect(time)
                            }
                            disabled={!isAvailable}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  )}

                  {selectedTime && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-700 font-medium">
                        Horário selecionado: {selectedTime}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        Duração estimada: {totalDuration} minutos
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary and Continue */}
            {selectedDate && selectedTime && (
              <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Resumo do Agendamento
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Serviços Selecionados:
                    </h4>
                    <div className="space-y-2">
                      {selectedServices.map((selectedService) => {
                        const service = services.find(
                          (s) => s.id === selectedService.serviceId,
                        );
                        return service ? (
                          <div
                            key={selectedService.serviceId}
                            className="text-sm text-gray-600"
                          >
                            {service.name}{" "}
                            {selectedService.quantity > 1 &&
                              `(${selectedService.quantity}x)`}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Data e Horário:
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        {selectedDate.toLocaleDateString("pt-BR")} às{" "}
                        {selectedTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duração: {totalDuration} minutos
                      </p>
                      <p className="text-sm font-medium text-purple-600">
                        Total: R$ {(bookingData.totalPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                    onClick={handleContinue}
                  >
                    Continuar para Dados Pessoais
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

export default DateTimeSelection;
