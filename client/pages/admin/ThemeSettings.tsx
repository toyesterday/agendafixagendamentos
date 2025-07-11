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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Configurações de Tema
          </h1>
          <p className="text-gray-600">
            Escolha o tema perfeito para seu negócio. As cores se aplicam tanto
            ao painel administrativo quanto ao site público.
          </p>
        </div>

        {/* Current Theme Display */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2 text-purple-600" />
              Tema Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-4xl">{getCurrentTheme().icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {getCurrentTheme().name}
                </h3>
                <p className="text-gray-600">{getCurrentTheme().description}</p>
                <Badge
                  variant="secondary"
                  className={
                    currentTheme === "salon"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {getCurrentTheme().businessType}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Escolher Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
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
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                          theme.id === "salon" ? "bg-purple-500" : "bg-blue-500"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Theme Preview Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-3xl">{theme.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {theme.name}
                          </h3>
                          <p className="text-sm text-gray-600">
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
                              className="w-8 h-8 rounded-full"
                              style={{
                                backgroundColor: theme.colors.primary.main,
                              }}
                            />
                            <div
                              className="w-8 h-8 rounded-full"
                              style={{
                                backgroundColor: theme.colors.secondary.main,
                              }}
                            />
                            <div
                              className="w-8 h-8 rounded-full"
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
                            className={`px-4 py-2 rounded-lg text-white text-sm font-medium bg-gradient-to-r ${
                              theme.id === "salon"
                                ? "from-purple-600 to-pink-500"
                                : "from-blue-800 to-slate-700"
                            }`}
                          >
                            Exemplo de Botão
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-4">
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
          <CardHeader>
            <CardTitle>Tipo de Negócio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant={businessType === "Salão" ? "default" : "outline"}
                className={`h-20 justify-start space-x-4 ${
                  businessType === "Salão"
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    : ""
                }`}
                onClick={() => handleBusinessTypeChange("Salão")}
              >
                <Sparkles className="h-8 w-8" />
                <div className="text-left">
                  <div className="font-bold">Salão</div>
                  <div className="text-sm opacity-90">
                    Para salões de beleza
                  </div>
                </div>
              </Button>

              <Button
                variant={businessType === "Barbearia" ? "default" : "outline"}
                className={`h-20 justify-start space-x-4 ${
                  businessType === "Barbearia"
                    ? "bg-gradient-to-r from-blue-800 to-slate-700 hover:from-blue-900 hover:to-slate-800"
                    : ""
                }`}
                onClick={() => handleBusinessTypeChange("Barbearia")}
              >
                <Scissors className="h-8 w-8" />
                <div className="text-left">
                  <div className="font-bold">Barbearia</div>
                  <div className="text-sm opacity-90">
                    Para barbearias masculinas
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">
                  Personalização Completa
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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
