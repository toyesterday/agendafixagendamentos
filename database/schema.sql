-- SISTEMA DE AGENDAMENTO - TABELAS DO SUPABASE
-- Execute este SQL no Editor SQL do Supabase após criar o projeto

-- 1. TABELA DE CLIENTES
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE SERVIÇOS
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- em minutos
    color VARCHAR(7) DEFAULT '#8B5CF6', -- cor do serviço
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE AGENDAMENTOS
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, completed, no_show
    notes TEXT,
    total_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE CONFIGURAÇÕES DO SITE
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE HORÁRIOS DE FUNCIONAMENTO
CREATE TABLE business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INTEGER NOT NULL, -- 0=domingo, 1=segunda, ..., 6=sábado
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INSERIR SERVIÇOS PADRÃO PARA SALÃO
INSERT INTO services (name, description, price, duration, color) VALUES
('Corte Feminino', 'Corte de cabelo feminino completo', 50.00, 60, '#8B5CF6'),
('Corte Masculino', 'Corte de cabelo masculino', 35.00, 30, '#3B82F6'),
('Escova', 'Escova modeladora', 40.00, 45, '#EC4899'),
('Manicure', 'Manicure completa', 25.00, 30, '#F59E0B'),
('Pedicure', 'Pedicure completa', 30.00, 45, '#10B981'),
('Sobrancelha', 'Design de sobrancelhas', 20.00, 20, '#6366F1');

-- INSERIR HORÁRIOS PADRÃO (Segunda a Sexta 8h-18h, Sábado 8h-14h)
INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES
(0, NULL, NULL, true), -- Domingo fechado
(1, '08:00', '18:00', false), -- Segunda
(2, '08:00', '18:00', false), -- Terça
(3, '08:00', '18:00', false), -- Quarta
(4, '08:00', '18:00', false), -- Quinta
(5, '08:00', '18:00', false), -- Sexta
(6, '08:00', '14:00', false); -- Sábado

-- INSERIR CONFIGURAÇÕES PADRÃO DO SITE
INSERT INTO site_settings (key, value) VALUES
('content_config', '{
  "header": {
    "companyName": "Seu Salão",
    "navigation": ["Início", "Serviços", "Sobre", "Contato"],
    "adminButton": "Admin"
  },
  "hero": {
    "title": {
      "main": "Transforme seu visual com",
      "highlight": "estilo e elegância"
    },
    "subtitle": "Agende seu horário e descubra o melhor cuidado para você",
    "buttons": {
      "primary": "Agendar Horário",
      "secondary": "Ver Serviços"
    }
  },
  "features": {
    "title": "Por que escolher nosso salão?",
    "subtitle": "Oferecemos a melhor experiência em beleza e bem-estar",
    "items": [
      {
        "title": "Profissionais Qualificados",
        "description": "Nossa equipe é formada por profissionais experientes e certificados"
      },
      {
        "title": "Produtos de Qualidade",
        "description": "Utilizamos apenas produtos das melhores marcas do mercado"
      },
      {
        "title": "Ambiente Acolhedor",
        "description": "Um espaço pensado para o seu conforto e relaxamento"
      }
    ]
  },
  "services": {
    "title": "Nossos Serviços",
    "subtitle": "Confira nossa variedade de serviços de beleza",
    "buttonText": "Agendar Serviço"
  },
  "testimonials": {
    "title": "O que nossos clientes dizem",
    "subtitle": "Depoimentos reais de quem confia no nosso trabalho"
  },
  "cta": {
    "title": "Pronto para se transformar?",
    "subtitle": "Agende seu horário agora e garante seu momento de cuidado pessoal",
    "buttonText": "Agendar Agora",
    "features": [
      "Agendamento rápido e fácil",
      "Profissionais qualificados",
      "Ambiente higienizado"
    ]
  },
  "footer": {
    "copyright": "Todos os direitos reservados."
  }
}'),
('theme_config', '{
  "theme": "salon",
  "primaryColor": "#8B5CF6",
  "secondaryColor": "#EC4899"
}');

-- HABILITAR RLS (Row Level Security) - IMPORTANTE PARA SEGURANÇA
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (permitir tudo por enquanto, pode ser refinado depois)
CREATE POLICY "Allow all operations" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON business_hours FOR ALL USING (true);
