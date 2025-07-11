import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  Scissors,
  Star,
  ArrowRight,
  CheckCircle,
  Smartphone,
  HeadphonesIcon,
  ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { getThemeClasses } from "@/types/themes";

const LandingPage = () => {
  const { currentTheme, businessConfig } = useAppStore();
  const themeClasses = getThemeClasses(currentTheme);
  const footerConfig = businessConfig?.footer;
  const content = businessConfig?.content;

  const features = content?.features?.items?.length
    ? content.features.items.map((item, index) => ({
        icon: [Calendar, Clock, Users, Smartphone][index] || Calendar,
        title: item.title,
        description: item.description,
      }))
    : [
        {
          icon: Calendar,
          title: "Agendamento Online",
          description: "Agende seu horário 24/7 de forma rápida e prática",
        },
        {
          icon: Clock,
          title: "Sem Espera",
          description:
            "Chegue no horário certo, sem filas ou esperas desnecessárias",
        },
        {
          icon: Users,
          title: "Profissionais Qualificados",
          description: "Equipe experiente e comprometida com a qualidade",
        },
        {
          icon: Smartphone,
          title: "Notificações",
          description: "Receba lembretes por WhatsApp e email automaticamente",
        },
      ];

  const services = [
    {
      name: "Corte Masculino",
      price: "R$ 25,00",
      duration: "30 min",
      description: "Corte moderno e estiloso com acabamento profissional",
    },
    {
      name: "Barba",
      price: "R$ 20,00",
      duration: "20 min",
      description: "Aparar e modelar barba com produtos premium",
    },
    {
      name: "Combo Corte + Barba",
      price: "R$ 40,00",
      duration: "45 min",
      description: "Pacote completo com corte e barba",
    },
    {
      name: "Tratamento Capilar",
      price: "R$ 35,00",
      duration: "60 min",
      description: "Hidratação e tratamento para cabelos danificados",
    },
  ];

  const testimonials = [
    {
      name: "João Silva",
      text: "Melhor barbearia da região! Agendamento fácil e serviço impecável.",
      rating: 5,
    },
    {
      name: "Pedro Santos",
      text: "Profissionais qualificados e ambiente muito agradável. Recomendo!",
      rating: 5,
    },
    {
      name: "Carlos Oliveira",
      text: "Sistema de agendamento prático e lembretes no WhatsApp. Nota 10!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`${themeClasses.primaryButton} text-white`}>
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8" />
            <span className="text-2xl font-bold">
              {content?.header?.companyName || "AgendaFixa"}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#servicos"
              className={`${currentTheme === "salon" ? "hover:text-pink-200" : "hover:text-orange-200"} transition-colors`}
            >
              {content?.header?.navigation?.services || "Serviços"}
            </a>
            <a
              href="#sobre"
              className={`${currentTheme === "salon" ? "hover:text-pink-200" : "hover:text-orange-200"} transition-colors`}
            >
              {content?.header?.navigation?.about || "Sobre"}
            </a>
            <a
              href="#contato"
              className={`${currentTheme === "salon" ? "hover:text-pink-200" : "hover:text-orange-200"} transition-colors`}
            >
              {content?.header?.navigation?.contact || "Contato"}
            </a>
            <Link to="/login">
              <Button
                className={`bg-transparent text-white border-2 border-white hover:bg-white ${currentTheme === "salon" ? "hover:text-purple-600" : "hover:text-blue-800"} font-medium transition-all duration-200`}
              >
                {content?.header?.adminButton || "Área Admin"}
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className={`${themeClasses.backgroundGradient} text-white py-20`}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {content?.hero?.title?.main || "Transforme seu visual com"}
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {content?.hero?.title?.highlight || "estilo e praticidade"}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            {content?.hero?.subtitle ||
              "Agende seu horário na melhor barbearia da região de forma rápida e prática. Profissionais qualificados e ambiente moderno te esperam."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/booking">
              <Button
                size="lg"
                className={`bg-white ${currentTheme === "salon" ? "text-purple-600" : "text-blue-800"} hover:bg-gray-100 text-lg px-8 py-4 rounded-full`}
              >
                {content?.hero?.buttons?.primary || "Agendar Agora"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              className={`bg-transparent text-white border-2 border-white hover:bg-white ${currentTheme === "salon" ? "hover:text-purple-600" : "hover:text-blue-800"} text-lg px-8 py-4 rounded-full font-medium transition-all duration-200`}
            >
              {content?.hero?.buttons?.secondary || "Ver Serviços"}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {content?.features?.title || "Por que escolher a AgendaFixa?"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content?.features?.subtitle ||
                "Oferecemos a melhor experiência em cuidados masculinos com tecnologia e qualidade"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border-0 bg-white"
              >
                <CardContent className="p-8">
                  <div
                    className={`bg-gradient-to-br ${currentTheme === "salon" ? "from-purple-100 to-pink-100" : "from-blue-100 to-slate-100"} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <feature.icon
                      className={`h-8 w-8 ${currentTheme === "salon" ? "text-purple-600" : "text-blue-800"}`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {content?.services?.title || "Nossos Serviços"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content?.services?.subtitle ||
                "Serviços especializados com produtos premium e técnicas modernas"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {service.name}
                    </h3>
                    <span
                      className={`text-2xl font-bold ${currentTheme === "salon" ? "text-purple-600" : "text-blue-800"}`}
                    >
                      {service.price}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to="/booking">
                    <Button className={`w-full ${themeClasses.primaryButton}`}>
                      {content?.services?.buttonText || "Agendar Serviço"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Depoimentos reais de quem confia na AgendaFixa
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${themeClasses.primaryButton} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para sua transformação?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Agende agora seu horário e tenha a melhor experiência em cuidados
            masculinos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button
                size="lg"
                className={`bg-white ${currentTheme === "salon" ? "text-purple-600" : "text-blue-800"} hover:bg-gray-100 text-lg px-8 py-4 rounded-full`}
              >
                Agendar Agora
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Agendamento Online 24/7
            </div>
            <div className="flex items-center">
              <HeadphonesIcon className="h-4 w-4 mr-2" />
              Lembretes Automáticos
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Profissionais Qualificados
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scissors className="h-6 w-6" />
                <span className="text-xl font-bold">
                  {footerConfig?.companyName || "AgendaFixa"}
                </span>
              </div>
              <p className="text-gray-400">
                {footerConfig?.slogan ||
                  "Sistema completo de agendamento para barbearias modernas"}
              </p>
              {footerConfig?.additionalInfo?.yearEstablished && (
                <p className="text-gray-500 text-sm mt-2">
                  Fundada em {footerConfig.additionalInfo.yearEstablished}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-gray-400">
                {footerConfig?.services?.length ? (
                  footerConfig.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))
                ) : (
                  <>
                    <li>Corte Masculino</li>
                    <li>Barba</li>
                    <li>Combo Corte + Barba</li>
                    <li>Tratamento Capilar</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li>{footerConfig?.address?.street || "Rua Principal, 456"}</li>
                <li>
                  {footerConfig?.address?.neighborhood &&
                    `${footerConfig.address.neighborhood}, `}
                  {footerConfig?.address?.city || "São Paulo"}
                  {footerConfig?.address?.state &&
                    `/${footerConfig.address.state}`}
                </li>
                <li>{footerConfig?.contact?.phone || "(11) 3333-4444"}</li>
                <li>
                  {footerConfig?.contact?.email || "contato@moderncut.com.br"}
                </li>
                {footerConfig?.contact?.website && (
                  <li>
                    <a
                      href={`https://${footerConfig.contact.website.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {footerConfig.contact.website}
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horários</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  {footerConfig?.operatingHours?.weekdays ||
                    "Segunda à Sexta: 9h às 18h"}
                </li>
                <li>
                  {footerConfig?.operatingHours?.saturday ||
                    "Sábado: 8h às 17h"}
                </li>
                <li>
                  {footerConfig?.operatingHours?.sunday || "Domingo: Fechado"}
                </li>
              </ul>

              {/* Redes Sociais */}
              {(footerConfig?.socialMedia?.instagram ||
                footerConfig?.socialMedia?.facebook) && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2">Redes Sociais</h4>
                  <div className="flex space-x-3">
                    {footerConfig?.socialMedia?.instagram && (
                      <a
                        href={footerConfig.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {footerConfig?.socialMedia?.facebook && (
                      <a
                        href={footerConfig.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certificações e Prêmios */}
          {(footerConfig?.additionalInfo?.certifications?.length ||
            footerConfig?.additionalInfo?.awards?.length) && (
            <div className="border-t border-gray-700 mt-8 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {footerConfig?.additionalInfo?.certifications?.length && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">
                      Certificações
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {footerConfig.additionalInfo.certifications.map(
                        (cert, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                          >
                            {cert}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
                {footerConfig?.additionalInfo?.awards?.length && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">
                      Prêmios
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {footerConfig.additionalInfo.awards.map(
                        (award, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                          >
                            {award}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              {footerConfig?.companyName || "AgendaFixa"}. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
