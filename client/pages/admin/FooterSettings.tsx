import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Layout,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Plus,
  X,
  Eye,
  Save,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import AdminLayout from "@/components/AdminLayout";
import { FooterConfig } from "@/types";
import { toast } from "sonner";

const FooterSettings = () => {
  const { businessConfig, updateBusinessConfig } = useAppStore();
  const [formData, setFormData] = useState<FooterConfig>({
    companyName: "",
    slogan: "",
    address: {
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
    contact: {
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    services: [],
    operatingHours: {
      weekdays: "",
      saturday: "",
      sunday: "",
    },
    additionalInfo: {
      certifications: [],
      awards: [],
      yearEstablished: undefined,
    },
  });

  const [newService, setNewService] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newAward, setNewAward] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (businessConfig?.footer) {
      setFormData(businessConfig.footer);
    }
  }, [businessConfig]);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof FooterConfig] as any),
        [field]: value,
      },
    }));
  };

  const handleAddItem = (
    field: "services" | "certifications" | "awards",
    value: string,
    setter: (value: string) => void,
  ) => {
    if (!value.trim()) return;

    if (field === "services") {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, value.trim()],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          [field]: [...(prev.additionalInfo?.[field] || []), value.trim()],
        },
      }));
    }
    setter("");
  };

  const handleRemoveItem = (
    field: "services" | "certifications" | "awards",
    index: number,
  ) => {
    if (field === "services") {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          [field]:
            prev.additionalInfo?.[field]?.filter((_, i) => i !== index) || [],
        },
      }));
    }
  };

  const handleSave = () => {
    updateBusinessConfig({ footer: formData });
    toast.success("Configurações do rodapé salvas com sucesso!");
  };

  const handleReset = () => {
    if (businessConfig?.footer) {
      setFormData(businessConfig.footer);
      toast.info("Configurações resetadas para os últimos valores salvos");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Configurações do Rodapé
            </h1>
            <p className="text-gray-600">
              Personalize todas as informações que aparecem no rodapé do seu
              site
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Ocultar" : "Preview"}
            </Button>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview do Rodapé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 text-white p-8 rounded-lg">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Layout className="h-6 w-6" />
                      <span className="text-xl font-bold">
                        {formData.companyName || "Nome da Empresa"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {formData.slogan || "Slogan da empresa"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Serviços</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      {formData.services.length > 0 ? (
                        formData.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))
                      ) : (
                        <li>Serviços serão listados aqui</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contato</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>{formData.address.street || "Endereço"}</li>
                      <li>
                        {formData.address.city || "Cidade"},{" "}
                        {formData.address.state || "Estado"}
                      </li>
                      <li>{formData.contact.phone || "Telefone"}</li>
                      <li>{formData.contact.email || "Email"}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Horários</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li>
                        {formData.operatingHours.weekdays || "Seg-Sex: Horário"}
                      </li>
                      <li>
                        {formData.operatingHours.saturday || "Sábado: Horário"}
                      </li>
                      <li>
                        {formData.operatingHours.sunday || "Domingo: Horário"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações Básicas */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layout className="h-5 w-5 mr-2 text-blue-600" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                    }))
                  }
                  placeholder="Ex: Barbearia ModernCut"
                />
              </div>
              <div>
                <Label htmlFor="yearEstablished">Ano de Fundação</Label>
                <Input
                  id="yearEstablished"
                  type="number"
                  value={formData.additionalInfo?.yearEstablished || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      additionalInfo: {
                        ...prev.additionalInfo,
                        yearEstablished: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      },
                    }))
                  }
                  placeholder="Ex: 2020"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="slogan">Slogan/Descrição</Label>
              <Textarea
                id="slogan"
                value={formData.slogan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slogan: e.target.value }))
                }
                placeholder="Ex: Sistema completo de agendamento para barbearias modernas"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Rua e Número</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleInputChange("address", "street", e.target.value)
                  }
                  placeholder="Ex: Rua Principal, 456"
                />
              </div>
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.address.neighborhood}
                  onChange={(e) =>
                    handleInputChange("address", "neighborhood", e.target.value)
                  }
                  placeholder="Ex: Centro"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) =>
                    handleInputChange("address", "city", e.target.value)
                  }
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) =>
                    handleInputChange("address", "state", e.target.value)
                  }
                  placeholder="Ex: SP"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode || ""}
                  onChange={(e) =>
                    handleInputChange("address", "zipCode", e.target.value)
                  }
                  placeholder="Ex: 01234-567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-green-600" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    handleInputChange("contact", "phone", e.target.value)
                  }
                  placeholder="Ex: (11) 3333-4444"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.contact.whatsapp || ""}
                  onChange={(e) =>
                    handleInputChange("contact", "whatsapp", e.target.value)
                  }
                  placeholder="Ex: (11) 99999-5555"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    handleInputChange("contact", "email", e.target.value)
                  }
                  placeholder="Ex: contato@moderncut.com.br"
                />
              </div>
              <div>
                <Label htmlFor="website">Site</Label>
                <Input
                  id="website"
                  value={formData.contact.website || ""}
                  onChange={(e) =>
                    handleInputChange("contact", "website", e.target.value)
                  }
                  placeholder="Ex: www.moderncut.com.br"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia.instagram || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "socialMedia",
                      "instagram",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: https://instagram.com/moderncut"
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia.facebook || ""}
                  onChange={(e) =>
                    handleInputChange("socialMedia", "facebook", e.target.value)
                  }
                  placeholder="Ex: https://facebook.com/moderncut"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia.twitter || ""}
                  onChange={(e) =>
                    handleInputChange("socialMedia", "twitter", e.target.value)
                  }
                  placeholder="Ex: https://twitter.com/moderncut"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socialMedia.linkedin || ""}
                  onChange={(e) =>
                    handleInputChange("socialMedia", "linkedin", e.target.value)
                  }
                  placeholder="Ex: https://linkedin.com/company/moderncut"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Serviços */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Serviços Oferecidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Digite um serviço e pressione Enter"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  handleAddItem("services", newService, setNewService)
                }
              />
              <Button
                onClick={() =>
                  handleAddItem("services", newService, setNewService)
                }
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  {service}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveItem("services", index)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horários de Funcionamento */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-600" />
              Horários de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="weekdays">Segunda à Sexta</Label>
              <Input
                id="weekdays"
                value={formData.operatingHours.weekdays}
                onChange={(e) =>
                  handleInputChange(
                    "operatingHours",
                    "weekdays",
                    e.target.value,
                  )
                }
                placeholder="Ex: Segunda à Sexta: 9h às 18h"
              />
            </div>
            <div>
              <Label htmlFor="saturday">Sábado</Label>
              <Input
                id="saturday"
                value={formData.operatingHours.saturday}
                onChange={(e) =>
                  handleInputChange(
                    "operatingHours",
                    "saturday",
                    e.target.value,
                  )
                }
                placeholder="Ex: Sábado: 8h às 17h"
              />
            </div>
            <div>
              <Label htmlFor="sunday">Domingo</Label>
              <Input
                id="sunday"
                value={formData.operatingHours.sunday}
                onChange={(e) =>
                  handleInputChange("operatingHours", "sunday", e.target.value)
                }
                placeholder="Ex: Domingo: Fechado"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Certificações */}
            <div>
              <Label className="text-base font-medium">Certificações</Label>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Ex: Certificado de Qualidade"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddItem(
                        "certifications",
                        newCertification,
                        setNewCertification,
                      )
                    }
                  />
                  <Button
                    onClick={() =>
                      handleAddItem(
                        "certifications",
                        newCertification,
                        setNewCertification,
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.additionalInfo?.certifications || []).map(
                    (cert, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {cert}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() =>
                            handleRemoveItem("certifications", index)
                          }
                        />
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Prêmios */}
            <div>
              <Label className="text-base font-medium">
                Prêmios e Reconhecimentos
              </Label>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newAward}
                    onChange={(e) => setNewAward(e.target.value)}
                    placeholder="Ex: Melhor Barbearia 2023"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddItem("awards", newAward, setNewAward)
                    }
                  />
                  <Button
                    onClick={() =>
                      handleAddItem("awards", newAward, setNewAward)
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.additionalInfo?.awards || []).map(
                    (award, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {award}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveItem("awards", index)}
                        />
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Resetar
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FooterSettings;
