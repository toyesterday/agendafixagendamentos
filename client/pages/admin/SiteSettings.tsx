import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Layout,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Settings,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import AdminLayout from "@/components/AdminLayout";
import { ContentConfig, FooterConfig } from "@/types";
import { toast } from "sonner";

const SiteSettings = () => {
  const { businessConfig, updateBusinessConfig } = useAppStore();

  // Content state
  const [contentData, setContentData] = useState<ContentConfig>({
    header: {
      companyName: "",
      navigation: { services: "", about: "", contact: "" },
      adminButton: "",
    },
    hero: {
      title: { main: "", highlight: "" },
      subtitle: "",
      buttons: { primary: "", secondary: "" },
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
      features: { scheduling: "", reminders: "", qualified: "" },
    },
    footer: { copyright: "" },
  });

  // Footer state
  const [footerData, setFooterData] = useState<FooterConfig>({
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

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [newService, setNewService] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newAward, setNewAward] = useState("");

  useEffect(() => {
    if (businessConfig?.content) {
      setContentData(businessConfig.content);
    }
    if (businessConfig?.footer) {
      setFooterData(businessConfig.footer);
    }
  }, [businessConfig]);

  // Content handlers
  const handleContentInputChange = (
    section: string,
    field: string,
    value: string,
  ) => {
    setContentData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ContentConfig] as any),
        [field]: value,
      },
    }));
  };

  const handleContentNestedInputChange = (
    section: string,
    subsection: string,
    field: string,
    value: string,
  ) => {
    setContentData((prev) => ({
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
    setContentData((prev) => ({
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
    setContentData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: [...prev.features.items, { title: "", description: "" }],
      },
    }));
  };

  const removeFeatureItem = (index: number) => {
    setContentData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.filter((_, i) => i !== index),
      },
    }));
  };

  // Footer handlers
  const handleFooterInputChange = (
    section: string,
    field: string,
    value: string,
  ) => {
    setFooterData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof FooterConfig] as any),
        [field]: value,
      },
    }));
  };

  const handleFooterAddItem = (
    field: "services" | "certifications" | "awards",
    value: string,
    setter: (value: string) => void,
  ) => {
    if (!value.trim()) return;

    if (field === "services") {
      setFooterData((prev) => ({
        ...prev,
        services: [...prev.services, value.trim()],
      }));
    } else {
      setFooterData((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          [field]: [...(prev.additionalInfo?.[field] || []), value.trim()],
        },
      }));
    }
    setter("");
  };

  const handleFooterRemoveItem = (
    field: "services" | "certifications" | "awards",
    index: number,
  ) => {
    if (field === "services") {
      setFooterData((prev) => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index),
      }));
    } else {
      setFooterData((prev) => ({
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
    console.log("Salvando dados:", {
      content: contentData,
      footer: footerData,
    });
    updateBusinessConfig({
      content: contentData,
      footer: footerData,
    });
    toast.success("Configurações do site salvas com sucesso!");
  };

  const handleReset = () => {
    if (businessConfig?.content) {
      setContentData(businessConfig.content);
    }
    if (businessConfig?.footer) {
      setFooterData(businessConfig.footer);
    }
    toast.info("Configurações resetadas para os últimos valores salvos");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Configurações do Site
            </h1>
            <p className="text-gray-600">
              Gerencie todo o conteúdo e aparência do seu site em um só lugar
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
                Preview das Configurações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 bg-white rounded-lg">
                  <h3 className="font-bold text-gray-800">Conteúdo</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Empresa:</span>{" "}
                      {contentData.header.companyName || "Nome da Empresa"}
                    </p>
                    <p>
                      <span className="font-medium">Título Hero:</span>{" "}
                      {contentData.hero.title.main || "Título Principal"}
                    </p>
                    <p>
                      <span className="font-medium">Título CTA:</span>{" "}
                      {contentData.cta.title ||
                        "Pronto para sua transformação?"}
                    </p>
                    <p>
                      <span className="font-medium">Subtítulo CTA:</span>{" "}
                      {contentData.cta.subtitle || "Subtítulo da CTA"}
                    </p>
                    <p>
                      <span className="font-medium">Botão CTA:</span>{" "}
                      {contentData.cta.buttonText || "Botão Principal"}
                    </p>
                    <p>
                      <span className="font-medium">Características:</span>{" "}
                      {contentData.cta.features.scheduling || "Agendamento"} |{" "}
                      {contentData.cta.features.reminders || "Lembretes"} |{" "}
                      {contentData.cta.features.qualified || "Qualificados"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-white rounded-lg">
                  <h3 className="font-bold text-gray-800">Rodapé</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Empresa:</span>{" "}
                      {footerData.companyName || "Nome da Empresa"}
                    </p>
                    <p>
                      <span className="font-medium">Telefone:</span>{" "}
                      {footerData.contact.phone || "Telefone"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {footerData.contact.email || "Email"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Conteúdo do Site
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Rodapé & Contato
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
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
                    value={contentData.header.companyName}
                    onChange={(e) =>
                      handleContentInputChange(
                        "header",
                        "companyName",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: AgendaFixa"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="navServices">Menu: Serviços</Label>
                    <Input
                      id="navServices"
                      value={contentData.header.navigation.services}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                      value={contentData.header.navigation.about}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                      value={contentData.header.navigation.contact}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                    value={contentData.header.adminButton}
                    onChange={(e) =>
                      handleContentInputChange(
                        "header",
                        "adminButton",
                        e.target.value,
                      )
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
                      value={contentData.hero.title.main}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                      value={contentData.hero.title.highlight}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                    value={contentData.hero.subtitle}
                    onChange={(e) =>
                      handleContentInputChange(
                        "hero",
                        "subtitle",
                        e.target.value,
                      )
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
                      value={contentData.hero.buttons.primary}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                      value={contentData.hero.buttons.secondary}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                    value={contentData.features.title}
                    onChange={(e) =>
                      handleContentInputChange(
                        "features",
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: Por que escolher a AgendaFixa?"
                  />
                </div>
                <div>
                  <Label htmlFor="featuresSubtitle">Subtítulo da Seção</Label>
                  <Textarea
                    id="featuresSubtitle"
                    value={contentData.features.subtitle}
                    onChange={(e) =>
                      handleContentInputChange(
                        "features",
                        "subtitle",
                        e.target.value,
                      )
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
                    {contentData.features.items.map((item, index) => (
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
                                handleFeatureChange(
                                  index,
                                  "title",
                                  e.target.value,
                                )
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
                    value={contentData.services.title}
                    onChange={(e) =>
                      handleContentInputChange(
                        "services",
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: Nossos Serviços"
                  />
                </div>
                <div>
                  <Label htmlFor="servicesSubtitle">Subtítulo da Seção</Label>
                  <Textarea
                    id="servicesSubtitle"
                    value={contentData.services.subtitle}
                    onChange={(e) =>
                      handleContentInputChange(
                        "services",
                        "subtitle",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: Serviços especializados com produtos premium..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="servicesButton">Texto do Botão</Label>
                  <Input
                    id="servicesButton"
                    value={contentData.services.buttonText}
                    onChange={(e) =>
                      handleContentInputChange(
                        "services",
                        "buttonText",
                        e.target.value,
                      )
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
                  <Label htmlFor="testimonialsTitle">Título da Se��ão</Label>
                  <Input
                    id="testimonialsTitle"
                    value={contentData.testimonials.title}
                    onChange={(e) =>
                      handleContentInputChange(
                        "testimonials",
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: O que nossos clientes dizem"
                  />
                </div>
                <div>
                  <Label htmlFor="testimonialsSubtitle">
                    Subtítulo da Seção
                  </Label>
                  <Input
                    id="testimonialsSubtitle"
                    value={contentData.testimonials.subtitle}
                    onChange={(e) =>
                      handleContentInputChange(
                        "testimonials",
                        "subtitle",
                        e.target.value,
                      )
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
                    value={contentData.cta.title}
                    onChange={(e) =>
                      handleContentInputChange("cta", "title", e.target.value)
                    }
                    placeholder="Ex: Pronto para sua transformação?"
                  />
                </div>
                <div>
                  <Label htmlFor="ctaSubtitle">Subtítulo</Label>
                  <Textarea
                    id="ctaSubtitle"
                    value={contentData.cta.subtitle}
                    onChange={(e) =>
                      handleContentInputChange(
                        "cta",
                        "subtitle",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: Agende agora seu horário..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="ctaButton">Texto do Botão</Label>
                  <Input
                    id="ctaButton"
                    value={contentData.cta.buttonText}
                    onChange={(e) =>
                      handleContentInputChange(
                        "cta",
                        "buttonText",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: Agendar Agora"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ctaFeature1">Característica 1</Label>
                    <Input
                      id="ctaFeature1"
                      value={contentData.cta.features.scheduling}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                      value={contentData.cta.features.reminders}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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
                      value={contentData.cta.features.qualified}
                      onChange={(e) =>
                        handleContentNestedInputChange(
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

            {/* Footer Copyright Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Copyright do Rodapé</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="footerCopyright">Texto de Copyright</Label>
                  <Input
                    id="footerCopyright"
                    value={contentData.footer.copyright}
                    onChange={(e) =>
                      handleContentInputChange(
                        "footer",
                        "copyright",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: Todos os direitos reservados"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer" className="space-y-6">
            {/* Company Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="footerCompanyName">Nome da Empresa</Label>
                    <Input
                      id="footerCompanyName"
                      value={footerData.companyName}
                      onChange={(e) =>
                        setFooterData((prev) => ({
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
                      value={footerData.additionalInfo?.yearEstablished || ""}
                      onChange={(e) =>
                        setFooterData((prev) => ({
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
                    value={footerData.slogan}
                    onChange={(e) =>
                      setFooterData((prev) => ({
                        ...prev,
                        slogan: e.target.value,
                      }))
                    }
                    placeholder="Ex: Sistema completo de agendamento para barbearias modernas"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-green-600" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={footerData.contact.phone}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "contact",
                          "phone",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: (11) 3333-4444"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={footerData.contact.whatsapp || ""}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "contact",
                          "whatsapp",
                          e.target.value,
                        )
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
                      value={footerData.contact.email}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "contact",
                          "email",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: contato@moderncut.com.br"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Site</Label>
                    <Input
                      id="website"
                      value={footerData.contact.website || ""}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "contact",
                          "website",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: www.moderncut.com.br"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
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
                      value={footerData.socialMedia.instagram || ""}
                      onChange={(e) =>
                        handleFooterInputChange(
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
                      value={footerData.socialMedia.facebook || ""}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "socialMedia",
                          "facebook",
                          e.target.value,
                        )
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
                      value={footerData.socialMedia.twitter || ""}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "socialMedia",
                          "twitter",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: https://twitter.com/moderncut"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={footerData.socialMedia.linkedin || ""}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "socialMedia",
                          "linkedin",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: https://linkedin.com/company/moderncut"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
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
                      value={footerData.address.street}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "address",
                          "street",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: Rua Principal, 456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={footerData.address.neighborhood}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "address",
                          "neighborhood",
                          e.target.value,
                        )
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
                      value={footerData.address.city}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "address",
                          "city",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={footerData.address.state}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "address",
                          "state",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: SP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={footerData.address.zipCode || ""}
                      onChange={(e) =>
                        handleFooterInputChange(
                          "address",
                          "zipCode",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: 01234-567"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services List */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Serviços para o Rodapé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Digite um serviço e pressione Enter"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleFooterAddItem("services", newService, setNewService)
                    }
                  />
                  <Button
                    onClick={() =>
                      handleFooterAddItem("services", newService, setNewService)
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {footerData.services.map((service, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      {service}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          handleFooterRemoveItem("services", index)
                        }
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
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
                    value={footerData.operatingHours.weekdays}
                    onChange={(e) =>
                      handleFooterInputChange(
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
                    value={footerData.operatingHours.saturday}
                    onChange={(e) =>
                      handleFooterInputChange(
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
                    value={footerData.operatingHours.sunday}
                    onChange={(e) =>
                      handleFooterInputChange(
                        "operatingHours",
                        "sunday",
                        e.target.value,
                      )
                    }
                    placeholder="Ex: Domingo: Fechado"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Informações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Certifications */}
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
                          handleFooterAddItem(
                            "certifications",
                            newCertification,
                            setNewCertification,
                          )
                        }
                      />
                      <Button
                        onClick={() =>
                          handleFooterAddItem(
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
                      {(footerData.additionalInfo?.certifications || []).map(
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
                                handleFooterRemoveItem("certifications", index)
                              }
                            />
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Awards */}
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
                          handleFooterAddItem("awards", newAward, setNewAward)
                        }
                      />
                      <Button
                        onClick={() =>
                          handleFooterAddItem("awards", newAward, setNewAward)
                        }
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(footerData.additionalInfo?.awards || []).map(
                        (award, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            {award}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() =>
                                handleFooterRemoveItem("awards", index)
                              }
                            />
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Resetar Tudo
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Save className="h-4 w-4" />
            Salvar Todas as Configurações
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;
