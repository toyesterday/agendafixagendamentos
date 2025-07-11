import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Type,
  Home,
  Star,
  Scissors,
  MessageCircle,
  Megaphone,
  Save,
  RotateCcw,
  Eye,
  Plus,
  X,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import AdminLayout from "@/components/AdminLayout";
import { ContentConfig } from "@/types";
import { toast } from "sonner";

const ContentSettings = () => {
  const { businessConfig, updateBusinessConfig } = useAppStore();
  const [formData, setFormData] = useState<ContentConfig>({
    header: {
      companyName: "",
      navigation: {
        services: "",
        about: "",
        contact: "",
      },
      adminButton: "",
    },
    hero: {
      title: {
        main: "",
        highlight: "",
      },
      subtitle: "",
      buttons: {
        primary: "",
        secondary: "",
      },
    },
    features: {
      title: "",
      subtitle: "",
      items: [],
    },
    services: {
      title: "",
      subtitle: "",
      buttonText: "",
    },
    testimonials: {
      title: "",
      subtitle: "",
    },
    cta: {
      title: "",
      subtitle: "",
      buttonText: "",
      features: {
        scheduling: "",
        reminders: "",
        qualified: "",
      },
    },
    footer: {
      copyright: "",
    },
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (businessConfig?.content) {
      setFormData(businessConfig.content);
    }
  }, [businessConfig]);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ContentConfig] as any),
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (
    section: string,
    subsection: string,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ContentConfig] as any),
        [subsection]: {
          ...((prev[section as keyof ContentConfig] as any)[subsection] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      },
    }));
  };

  const addFeatureItem = () => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: [...prev.features.items, { title: "", description: "" }],
      },
    }));
  };

  const removeFeatureItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSave = () => {
    updateBusinessConfig({ content: formData });
    toast.success("Conteúdo salvo com sucesso!");
  };

  const handleReset = () => {
    if (businessConfig?.content) {
      setFormData(businessConfig.content);
      toast.info("Conteúdo resetado para os últimos valores salvos");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gerenciar Conteúdo do Site
            </h1>
            <p className="text-gray-600">
              Edite todos os textos que aparecem no seu site de forma manual
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

        {/* Preview Section */}
        {showPreview && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview dos Textos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 bg-white rounded-lg">
                <div>
                  <h3 className="font-bold">Header:</h3>
                  <p>"{formData.header.companyName || "Nome da Empresa"}"</p>
                </div>
                <div>
                  <h3 className="font-bold">Hero Title:</h3>
                  <p>
                    "{formData.hero.title.main || "Título Principal"}{" "}
                    <span className="text-orange-500">
                      {formData.hero.title.highlight || "Destaque"}
                    </span>
                    "
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">Botão Principal:</h3>
                  <p>"{formData.hero.buttons.primary || "Texto do Botão"}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header/Navigation Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-600" />
              Cabeçalho e Navegação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={formData.header.companyName}
                onChange={(e) =>
                  handleInputChange("header", "companyName", e.target.value)
                }
                placeholder="Ex: AgendaFixa"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="navServices">Menu: Serviços</Label>
                <Input
                  id="navServices"
                  value={formData.header.navigation.services}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "header",
                      "navigation",
                      "services",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Serviços"
                />
              </div>
              <div>
                <Label htmlFor="navAbout">Menu: Sobre</Label>
                <Input
                  id="navAbout"
                  value={formData.header.navigation.about}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "header",
                      "navigation",
                      "about",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Sobre"
                />
              </div>
              <div>
                <Label htmlFor="navContact">Menu: Contato</Label>
                <Input
                  id="navContact"
                  value={formData.header.navigation.contact}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "header",
                      "navigation",
                      "contact",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Contato"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="adminButton">Botão Admin</Label>
              <Input
                id="adminButton"
                value={formData.header.adminButton}
                onChange={(e) =>
                  handleInputChange("header", "adminButton", e.target.value)
                }
                placeholder="Ex: Área Admin"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="h-5 w-5 mr-2 text-purple-600" />
              Seção Principal (Hero)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heroMainTitle">Título Principal</Label>
                <Input
                  id="heroMainTitle"
                  value={formData.hero.title.main}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "hero",
                      "title",
                      "main",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Transforme seu visual com"
                />
              </div>
              <div>
                <Label htmlFor="heroHighlight">Texto em Destaque</Label>
                <Input
                  id="heroHighlight"
                  value={formData.hero.title.highlight}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "hero",
                      "title",
                      "highlight",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: estilo e praticidade"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Subtítulo</Label>
              <Textarea
                id="heroSubtitle"
                value={formData.hero.subtitle}
                onChange={(e) =>
                  handleInputChange("hero", "subtitle", e.target.value)
                }
                placeholder="Ex: Agende seu horário na melhor barbearia da região..."
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heroPrimaryBtn">Botão Principal</Label>
                <Input
                  id="heroPrimaryBtn"
                  value={formData.hero.buttons.primary}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "hero",
                      "buttons",
                      "primary",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Agendar Agora"
                />
              </div>
              <div>
                <Label htmlFor="heroSecondaryBtn">Botão Secundário</Label>
                <Input
                  id="heroSecondaryBtn"
                  value={formData.hero.buttons.secondary}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "hero",
                      "buttons",
                      "secondary",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Ver Serviços"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              Seção de Vantagens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="featuresTitle">Título da Seção</Label>
              <Input
                id="featuresTitle"
                value={formData.features.title}
                onChange={(e) =>
                  handleInputChange("features", "title", e.target.value)
                }
                placeholder="Ex: Por que escolher a AgendaFixa?"
              />
            </div>
            <div>
              <Label htmlFor="featuresSubtitle">Subtítulo da Seção</Label>
              <Textarea
                id="featuresSubtitle"
                value={formData.features.subtitle}
                onChange={(e) =>
                  handleInputChange("features", "subtitle", e.target.value)
                }
                placeholder="Ex: Oferecemos a melhor experiência..."
                rows={2}
              />
            </div>

            {/* Feature Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-base font-medium">
                  Itens de Vantagens
                </Label>
                <Button
                  onClick={addFeatureItem}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
              <div className="space-y-4">
                {formData.features.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        Item {index + 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeatureItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            handleFeatureChange(index, "title", e.target.value)
                          }
                          placeholder="Ex: Agendamento Online"
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            handleFeatureChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Ex: Agende seu horário 24/7..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scissors className="h-5 w-5 mr-2 text-green-600" />
              Seção de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="servicesTitle">Título da Seção</Label>
              <Input
                id="servicesTitle"
                value={formData.services.title}
                onChange={(e) =>
                  handleInputChange("services", "title", e.target.value)
                }
                placeholder="Ex: Nossos Serviços"
              />
            </div>
            <div>
              <Label htmlFor="servicesSubtitle">Subtítulo da Seção</Label>
              <Textarea
                id="servicesSubtitle"
                value={formData.services.subtitle}
                onChange={(e) =>
                  handleInputChange("services", "subtitle", e.target.value)
                }
                placeholder="Ex: Serviços especializados com produtos premium..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="servicesButton">Texto do Botão</Label>
              <Input
                id="servicesButton"
                value={formData.services.buttonText}
                onChange={(e) =>
                  handleInputChange("services", "buttonText", e.target.value)
                }
                placeholder="Ex: Agendar Serviço"
              />
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
              Seção de Depoimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testimonialsTitle">Título da Seção</Label>
              <Input
                id="testimonialsTitle"
                value={formData.testimonials.title}
                onChange={(e) =>
                  handleInputChange("testimonials", "title", e.target.value)
                }
                placeholder="Ex: O que nossos clientes dizem"
              />
            </div>
            <div>
              <Label htmlFor="testimonialsSubtitle">Subtítulo da Seção</Label>
              <Input
                id="testimonialsSubtitle"
                value={formData.testimonials.subtitle}
                onChange={(e) =>
                  handleInputChange("testimonials", "subtitle", e.target.value)
                }
                placeholder="Ex: Depoimentos reais de quem confia na AgendaFixa"
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Megaphone className="h-5 w-5 mr-2 text-orange-600" />
              Seção de Chamada para Ação (CTA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ctaTitle">Título</Label>
              <Input
                id="ctaTitle"
                value={formData.cta.title}
                onChange={(e) =>
                  handleInputChange("cta", "title", e.target.value)
                }
                placeholder="Ex: Pronto para sua transformação?"
              />
            </div>
            <div>
              <Label htmlFor="ctaSubtitle">Subtítulo</Label>
              <Textarea
                id="ctaSubtitle"
                value={formData.cta.subtitle}
                onChange={(e) =>
                  handleInputChange("cta", "subtitle", e.target.value)
                }
                placeholder="Ex: Agende agora seu horário..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="ctaButton">Texto do Botão</Label>
              <Input
                id="ctaButton"
                value={formData.cta.buttonText}
                onChange={(e) =>
                  handleInputChange("cta", "buttonText", e.target.value)
                }
                placeholder="Ex: Agendar Agora"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ctaFeature1">Característica 1</Label>
                <Input
                  id="ctaFeature1"
                  value={formData.cta.features.scheduling}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "cta",
                      "features",
                      "scheduling",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Agendamento Online 24/7"
                />
              </div>
              <div>
                <Label htmlFor="ctaFeature2">Característica 2</Label>
                <Input
                  id="ctaFeature2"
                  value={formData.cta.features.reminders}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "cta",
                      "features",
                      "reminders",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Lembretes Automáticos"
                />
              </div>
              <div>
                <Label htmlFor="ctaFeature3">Característica 3</Label>
                <Input
                  id="ctaFeature3"
                  value={formData.cta.features.qualified}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "cta",
                      "features",
                      "qualified",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Profissionais Qualificados"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Rodapé</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="footerCopyright">Texto de Copyright</Label>
              <Input
                id="footerCopyright"
                value={formData.footer.copyright}
                onChange={(e) =>
                  handleInputChange("footer", "copyright", e.target.value)
                }
                placeholder="Ex: Todos os direitos reservados"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
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
            Salvar Conteúdo
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentSettings;
