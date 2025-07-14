import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Check,
  Store,
  Scissors,
  Sparkles,
  Building2,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { themes, getTheme } from "@/types/themes";
import { ThemeType } from "@/types";
import AdminLayout from "@/components/AdminLayout";

const ThemeSettings = () => {
  const { currentTheme, businessType, setTheme, setBusinessType } =
    useAppStore();

  const handleThemeChange = (themeType: ThemeType) => {
    setTheme(themeType);
    setBusinessType(themeType === "salon" ? "Salão" : "Barbearia");
  };

  const handleBusinessTypeChange = (type: "Salão" | "Barbearia") => {
    setBusinessType(type);
    setTheme(type === "Salão" ? "salon" : "barbershop");
  };

  const getCurrentTheme = () => getTheme(currentTheme);

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="px-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Configurações de Tema
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Escolha o tema perfeito para seu negócio. As cores se aplicam tanto
            ao painel administrativo quanto ao site público.
          </p>
        </div>

        {/* Current Theme Display */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
              Tema Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl sm:text-3xl lg:text-4xl">
                {getCurrentTheme().icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {getCurrentTheme().name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 break-words">
                  {getCurrentTheme().description}
                </p>
                <Badge
                  variant="secondary"
                  className={`mt-2 text-xs sm:text-sm ${
                    currentTheme === "salon"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {getCurrentTheme().businessType}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">
              Escolher Tema
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {Object.values(themes).map((theme) => {
                const isSelected = currentTheme === theme.id;

                return (
                  <div
                    key={theme.id}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? theme.id === "salon"
                          ? "border-purple-500 bg-purple-50"
                          : "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    {isSelected && (
                      <div
                        className={`absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white ${
                          theme.id === "salon" ? "bg-purple-500" : "bg-blue-500"
                        }`}
                      >
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                    )}

                    <div className="p-4 sm:p-6">
                      {/* Theme Preview Header */}
                      <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                        <div className="text-2xl sm:text-3xl">{theme.icon}</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                            {theme.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {theme.businessType}
                          </p>
                        </div>
                      </div>

                      {/* Color Preview */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            CORES PRINCIPAIS
                          </p>
                          <div className="flex space-x-2">
                            <div
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                              style={{
                                backgroundColor: theme.colors.primary.main,
                              }}
                            />
                            <div
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                              style={{
                                backgroundColor: theme.colors.secondary.main,
                              }}
                            />
                            <div
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                              style={{
                                backgroundColor: theme.colors.accent.main,
                              }}
                            />
                          </div>
                        </div>

                        {/* Sample Button */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            PREVIEW DO BOTÃO
                          </p>
                          <div
                            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium bg-gradient-to-r ${
                              theme.id === "salon"
                                ? "from-purple-600 to-pink-500"
                                : "from-blue-800 to-slate-700"
                            }`}
                          >
                            Exemplo de Botão
                          </div>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 line-clamp-2">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Business Type Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">
              Tipo de Negócio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button
                variant={businessType === "Salão" ? "default" : "outline"}
                className={`h-16 sm:h-20 justify-start space-x-3 sm:space-x-4 p-3 sm:p-4 ${
                  businessType === "Salão"
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    : ""
                }`}
                onClick={() => handleBusinessTypeChange("Salão")}
              >
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-bold text-sm sm:text-base">Salão</div>
                  <div className="text-xs sm:text-sm opacity-90">
                    Para salões de beleza
                  </div>
                </div>
              </Button>

              <Button
                variant={businessType === "Barbearia" ? "default" : "outline"}
                className={`h-16 sm:h-20 justify-start space-x-3 sm:space-x-4 p-3 sm:p-4 ${
                  businessType === "Barbearia"
                    ? "bg-gradient-to-r from-blue-800 to-slate-700 hover:from-blue-900 hover:to-slate-800"
                    : ""
                }`}
                onClick={() => handleBusinessTypeChange("Barbearia")}
              >
                <Scissors className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-bold text-sm sm:text-base">
                    Barbearia
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">
                    Para barbearias masculinas
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">
                  Personalização Completa
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  As mudanças de tema se aplicam automaticamente em todo o
                  sistema - desde o painel administrativo até o site público de
                  agendamentos. Seus clientes verão as cores escolhidas quando
                  fizerem agendamentos online.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ThemeSettings;
