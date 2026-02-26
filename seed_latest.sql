-- COLE ISSO NO SQL EDITOR DO SUPABASE E EXECUTE

-- Criar tabelas caso não existam no banco de dados!
CREATE TABLE IF NOT EXISTS children (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    birth_date DATE,
    gender TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    clinical_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chronic_patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    phone TEXT,
    condition TEXT NOT NULL,
    risk_level TEXT NOT NULL DEFAULT 'Baixo',
    clinical_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE pregnant_women ADD COLUMN IF NOT EXISTS dpp DATE;
ALTER TABLE pregnant_women ADD COLUMN IF NOT EXISTS dum DATE;
ALTER TABLE pregnant_women ALTER COLUMN dum DROP NOT NULL;

-- IMPORTANTE: Substitua '3627165a-d301-4384-83bf-8b0e2b8c42fa' pelo seu User ID do Supabase (Acesse Authentication -> Users)
DO $$
DECLARE
  v_user_id uuid := '3627165a-d301-4384-83bf-8b0e2b8c42fa';
BEGIN
  -- Limpar dados antigos
  DELETE FROM pregnant_women WHERE user_id = v_user_id;
  DELETE FROM children WHERE user_id = v_user_id;
  DELETE FROM chronic_patients WHERE user_id = v_user_id;

  -- Inserir Gestantes
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'BRENDA KAROLAYNY MARQUES ALCIDES', 35, '2007-07-02', '(61) 9147-0984', 'Alto', 'SIFILI E MIOMA', '2025-06-25', '2026-01-04');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'LUCIANA  DE PAIVA VIEIRA', 18, '1985-11-15', '(61)992408378', 'Habitual', NULL, '2025-04-18', '2026-01-23');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'SUZANA KELLY SILVA SABINO', 15, '2016-06-09', '(61)981063849', 'Alto', 'SIFILI', '2025-05-23', '2026-02-27');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'MIKAELE DE JESUS VIEIRA', 23, '2002-07-15', '(61)996552327', 'Habitual', NULL, '2025-05-05', '2026-09-02');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'LILIAN CARVALHO NONATO DA SILVA', NULL, '1998-06-04', '(61)996228365', 'Alto', 'DESCOLAMENTO DE PLACENTA', '2025-06-06', '2026-03-13');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'KAREN VITORIA RODRIGUES DE SOUSA', 21, '2004-01-02', '(61)99100-1686', 'Alto', 'SIFILIS', '2025-03-05', '2026-07-02');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'JULLYANA NUNES DA SILVA', 22, '2023-03-21', '(61)996343410', 'Habitual', NULL, '2025-04-25', '2025-01-30');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'ALINE SILVA OLIVEIRA', 23, '2001-12-11', '(61)99376-1099', 'Habitual', NULL, '2025-01-06', '2026-08-03');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'DEBORA ANARDA PEREIRA DE ARAIUJO', NULL, '1987-04-13', '(61)992217754', 'Habitual', NULL, '2025-06-13', '2026-03-20');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'SARAN DAYSE SILVA  DOS SANTOS', 28, '1997-07-02', '(61)998374197', 'Habitual', NULL, '2025-05-22', '2026-02-20');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'BRENDA RODRIGUES DE ARAUJO', 24, '2000-11-03', '(61)99151-3684', 'Habitual', NULL, '2025-06-18', '2025-03-25');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'RAFAELA SANTOS FARIAS', 20, '2025-02-06', '61 98120-6236', 'Habitual', NULL, '2025-05-29', '2026-02-13');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'BIANCA SOUZA DA SILVA', 21, '2004-08-30', '61 98505 7982', 'Habitual', NULL, '2025-06-16', '2026-03-26');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'ISABELA PEREIRA DA SILVA', 20, '2005-02-10', '61099449-1695', 'Habitual', NULL, '2025-08-25', '2026-01-06');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'PATRICIA OLIVEIRA LIMA', 39, '1986-09-03', '(61) 98234-9334', 'Habitual', NULL, '2028-09-22', '2026-06-29');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'VITORIA CONCEIÇÃO SOUZA', 24, '2001-05-26', '61 99465-1011', 'Habitual', NULL, '2025-05-25', '2026-01-03');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'Sophie Rafaelly Ribeiro Amorim', 14, '2011-06-24', '(61) 99187-2626', 'Habitual', NULL, '2025-12-10', '2026-07-19');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'MARIA EDUARDA MELO DA SILVA SOUSA', 23, '2002-12-26', '(61) 99104-4458', 'Intermediário', 'ABORTO', '2002-12-27', '2026-06-02');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'SABRINA ESTER DE LIMA BRITO', 17995, '2000-04-10', '(61) 992183732', 'Habitual', NULL, '2025-10-16', '2026-07-23');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'LEANDRA BENILDA LIMA DE ALBURQUEQUE', 27, '1998-07-13', '(61)999218929', 'Habitual', NULL, '2025-10-22', NULL);
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'Jaine Freire Pereira', 28, '1997-07-30', '(61) 99545-9431', 'Alto', 'SIFILIS', NULL, '2025-07-19');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'Nicolly Vieira Amaral', 19, '2006-04-28', '61 992794083', 'Habitual', NULL, '2025-12-05', '2026-09-11');
  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, 'Amanda Costa Melo Alves', 29, '1996-06-01', '(61) 99437-5550', 'Alto', 'ABORTO', '2025-11-13', '2026-08-20');

  -- Inserir Crianças
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Angelina Teixeira Araujo', '2024-02-02', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Arthur Gael Oliveira da Silva', '2024-04-29', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Ayalla Helloysa Fernandes Ferreira de Queiroz', '2023-06-18', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Ayla Isabella de Araujo Alencar', '2024-07-30', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Benicio Cosmo da Silva', '2024-01-25', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Benjamin Nascimento Lima Soares', '2024-11-03', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Davi de Souza Ribeiro', '2024-06-10', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Eloa de Paula dos Santos', '2024-11-12', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'HELENA EVANGELISA PARAGUAI', '2025-04-14', 'Não Informado', 'Alto');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Eloah Moraes Silva', '2024-07-02', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Evelyn Sofia Pinheiro de Sena', '2024-07-03', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Helena Bezerra Oliveira', '2022-11-26', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Helena Sousa Zaurisio', '2024-08-26', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'João Lucas Almeida Brandão', '2024-02-18', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'João Lucas da Silva Ferreira', '2024-12-20', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Jose Bernado Ribeiro Rocha', '2024-09-18', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Jose Vicente Campos Brandão', '2023-12-20', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Maria Rodrigues da Rocha', '2025-05-17', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'ISABEL DOS SANTOS POMPEU', '2023-01-23', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Maya Eloa Silva Furtado', '2023-10-30', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Nicolas Santos de Lima', '2025-01-05', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Noah Rodrigues Coelho', '2023-09-25', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Paula Cecilia Oliveira Soares', '2024-04-22', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Rhavi Luca Amorim da Silveira', '2024-09-24', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Victor Hugo Balduino dos Santos', '2023-05-08', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'MARIA ALICE OLIVEIRA SOARRES', '2025-08-18', 'Não Informado', 'Intermediário');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Yan Arthur Palheta Rocha', '2024-10-08', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Ysis Costas Gonçalves', '2025-06-11', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Aysha Pereira Herculano', '2025-10-17', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'AGATA FELIX XAVIER', '2025-03-14', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'ARTHUR JESUS LIMA', '2025-02-09', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'AYALLA HELLOYSA FERNANDES FERREIRA DE QUEIROZ', '2023-06-18', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'AYLA CAMARGO MARTINS DE ANDRADE', '2024-03-28', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'CALEB GAEL OLIVEIRA SILVA', '2024-05-25', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'ELISA BERNARDES DE SOUSA DA SILVA', '2024-02-23', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'HENRIQUE SAMUEL VIEIRA LUNA', '2024-09-29', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Wallace Torres de Macedo', '2025-10-08', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Augusto Goncalves Lima', '2025-05-15', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Matteo Eduardo Santos Braganga', '2025-05-20', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Ana Cecilia Villa Nova Vinhal', '2025-04-25', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Hadassa Tereza Nogueira dos Santos', '2025-06-08', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Ayla Sophia Santos Leonardo', '2025-10-06', 'Não Informado', 'Alto');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Serena Eustaquio Sousa', '2025-11-16', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Eloá Alice de Morais Xavier', '2023-12-04', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Bernardo de Sousa Reis', '2025-02-09', 'Não Informado', 'Alto');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Bento Antonio dos Santos Gonçalves', '2025-07-29', 'Não Informado', 'Alto');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Otto Gabriel Melo Silva', '2025-04-24', 'Não Informado', 'Alto');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Ester Emilly Felix Silva', '2025-07-21', 'Não Informado', 'Intermediário');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'Jose Heitor Bastos Calaço', '2025-08-28', 'Não Informado', 'Habitual');
  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, 'THALYSON RICARDO DA SILVA MAIA', '2025-07-12', 'Não Informado', 'Intermediário');

  -- Inserir Pacientes Crônicos
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Claudia Medrado De Almeida', 53, '61991634086', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Francisco De Oliveira Costa', 73, '61985573396', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Genir Batista Da Silva', 46, '61985925940', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Jose Aguinaldo Pereira', 58, '61992585431', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Leuda Gonçalves De Oliveira Viana', 68, '61999857875', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ana Luiza Lima De Morais', 65, '61985228578', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Cleonice Queiroz Viana De Castro', 58, '61986257777', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Edmilson Do Espirito Santo', 64, '61999663222', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Elenides Soares Da Silva Armonnes', 70, '61995187119', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Francisca Das Chagas Silva Madeira', 49, '61981547164', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Francisca Zelandia Paiva De Carvalho', 62, '61993582362', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Da Guia Lopes Ferraz', 53, '61995554263', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Do Rosario De Fatima Madeira De Almeida', 62, '61992152918', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Judite Nunes Da Cruz', 58, '61998746701', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Matheus Araujo Lustosa', 30, '61999663322', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Olimpio Siqueira Dantas', 63, '61995778326', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Paulo Ferreira De Brito', 86, '61999663222', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Rejane Gomes Dos Santos', 46, '61994192694', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Robson Robeiro Da Silva', 40, '61993855120', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Bento Araujo', 65, '6136381074', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Do Socorro De Castro Geremias', 59, '61981358890', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ronnie Von Ferreira Dos Santos', 56, '61998415151', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Gomes De Lima', 89, NULL, 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sebastiao De Santana Silva', 58, '61981527957', 'HAS e DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Antonia Gomes Mesquita', 72, '61995780756', 'HAS e DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Isabel Da Silva', 75, '61995845494', 'HAS e DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ivonete De Sousa Vasconcelos', 53, '61992088741', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Manoel Augusto Evangelista Dos Santos', 55, '61991399615', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria De Fatima Ribeiro', 67, '61992060265', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Odete De Oliveira Leite', 69, '61993264944', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ourivaldo Batista Da Rocha', 80, '61999897573', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Stefferson Nascimento Dos Santos', 38, '61985253569', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Vilmar De Castro Duarte', 59, '61991197518', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Das Dores De Oliveira Lima', 73, '(61) 98234-9334', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria De Fatima Pereira Dos Santos', 61, '(61) 99150-1179', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Do Socorro Tavares Querino', 65, '(61) 98118-9647', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Camila Neves Machado De Souza', 33, '(61) 99160-5843', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Jose Da Cruz Bezerra Santos', 70, '(61) 99180-7171', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Pedro Caleb Pompeu Silva', 27, '(61) 99959-0991', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Bruna Ribeiro Pinto Nouga', 38, '(61) 99222-8036', 'HAS e DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Idnei Batista De Godoi Rodrigues', 66, '(61) 98575-0365', 'HAS e DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Celia Tiago', 64, '(61) 9985-8555', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sandra Aparecida Carlos De Sousa', 52, '(61) 99251-2255', 'DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Juraci Santana Dos Santos', 68, '(61) 99968-7574', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Manoel Lima Ferreira', 68, '(61) 9968-5555', 'DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Nelson Rodrigues Cirqueira', NULL, '(61) 99113-9026', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Cardoso Da Silva', NULL, '(61) 9966-3322', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Aldina Ferreira Silva', NULL, '(61) 98582-2696', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Dejair De Castro Silva', NULL, NULL, 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Abisolon Oliveira Do Nascimento', NULL, '(61) 99149-0080', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Adriana Ferreira Rodrigues', NULL, '(61)993462140', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Adriana Gonçalves Viana', NULL, '(61) 991871076', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Aldaisa Monteiro Da Silva', NULL, '(61)994085197', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Anizia Josefa Da Silva', NULL, '(61) 36285761', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Antonio De Souza Sobrinho', NULL, '(61)992483232', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Antonio A. Cutrim De Macena', NULL, '(61)98134.-4318', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Antonio Augusto Cutrim De Macena', NULL, '(61) 98134-4318', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Antonio Carlos Alves Da Silva', NULL, '(61) 991000151', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Antonio Garcia Sobrinho', NULL, '(61) 36281077', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Adolis Almira Ramirez', NULL, '(62) 98478-9338', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Antonio Rodrigues Costa', NULL, '(61) 99618-7042', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Arinalda Cabral De Aguiar', NULL, '(61) 994000097', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Availde Rego Queiroz', NULL, '(61) 995217806', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ayrton Douglas Da Costa Oliveira', NULL, '(61) 99999-9910', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Benildes Antunes Romeiro', NULL, '(61) 99170978', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Carla Luiza Correia Da Silva', NULL, '(61) 994435869', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Carlito Martins Vieira', NULL, '(61) 991351007', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Celio Lopes Da Silva Mota', NULL, '(61) 98615-7098', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'José Marcos Dos Santos Dos Santos Silva', NULL, NULL, 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Cidalia Dos Santos', NULL, '(61) 99149-4812', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Cleide De Souza Firmino', NULL, '(61) 98221-5941', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Clenilda Oliveira De Araujo', NULL, '(61) 3628-6393', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Cleonice Maria Dos Santos', NULL, '(61)992204628', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Cleumildes Morais De Lima', NULL, '(63) 99971-5977', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Cleusa Batista Lopes', 69, '(61)98595-5170', 'DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Conceição De Maria Barbosa', 66, '(61)991762250', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Divina Alvez De Queiroz', NULL, '(61) 99301-7310', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Doralice Aparecida Dos Santos', 52, '(61)99655-1040', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Elenides Soares Da Silva Armonnes', 70, '(61) 99380-2774', 'HAS e DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Eliana Maria Alves', 64, '(61) 3628-1284', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Eliete Vidal Dos Santos Matheus', 58, '(61) 986556687', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Estevão Francisco Santana', 51, '( 61) 998364630', 'DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Eudenete Rodrigues De Freitas', 52, '(61) 993945239', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Francisca Alves De Castro', 73, '(61)995615681', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Francisca De Souza Dourado', 75, '(61)36285764', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Gilberto Alves Ferreira De Lima', 45, '(61)981303694', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Halinne Sousa Costa Neves', 38, '(61) 9 9234-0449', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Hercules Da Costa Neto', 58, '(61) 9501-5747', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Isaias Rodrigues Das Chagas', 68, '(61) 99293-9229', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ivanilda Araujo Amaral', 51, '(61) 98577-8357', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'João Dos Passos Marques', 69, '(62)996442105', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Joao Francisco Madeira De Almeida', 66, '(61) 99215-2918', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'João Luiz Da Silva', 83, '(61) 99313-3593', 'HAS e DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'José Marcos Dos Santos Silva', 54, '(61)982925600', 'DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Jose Ribamar Dos Santos', 69, '(61)994089194', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'José Simão De Moura', 85, '(61) 984839092', 'HAS', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Karlene Ubaldo Nascimento', 58, '(61) 993119083', 'DM', 'Alto');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Katia Martins Da Silva', 59, '(61) 99219-0521', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Lindinalva Maria Sousa Costa', 74, '(61 995865582', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Lindineide Barbosa Pereira', 59, '(61) 995276550', 'DM', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Loreli Terezinha Bratz', 69, '(61) 99113-3375', 'DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Lucinda Almeida Do Nascimento', 80, '(61) 3628-1077', 'HAS', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Luiz De Sousa Cavalcante', 61, '(61)3628-7738', 'DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Luzia Dornelas De Souza', 75, '(61) 995488556', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Manoel Augusto Evangelista Dos Santos', NULL, '(61) 991399615', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Manoel Lima Ferreira', NULL, '(61) 99197-4594', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Marcos Regis Madeira Rocha', NULL, '(61) 98564-6462', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Da Piedade Ribeiro Da Silva', NULL, '(61) 30601106', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria De Fátima Araujo', NULL, '(61)36082632', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria De Fátima De Almeida', NULL, '(61) 98561744', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria De Lurdes Da Nobrega Ferreira', NULL, '(61) 3628-1077', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Derlandia Da Silva Domingos', NULL, '(61)991844320', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Do Socorro Marques', NULL, '(61) 99290-1456', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Do Socorro Souza', NULL, '(61) 9852-3641', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Jose Alves Medeiros Dos Santos', NULL, '(61)996248780', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Neusa De Sousa Pereira', NULL, '(61)99384-7011', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Patricia Dos Santos', NULL, '(61)98185-0595', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Socorro Soares Lima', NULL, '(61)991844320', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Maria Vasco Da Silva', NULL, '(61) 984610461', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Marlene Vieira Barbosa', NULL, '(61) 98442-7210', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Matheus Araujo Lustosa', NULL, '(61) 994330427', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ortelina Rosario De Souza', NULL, '(61) 994262942', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Pablo Juan Soares', NULL, '(61) 9955-8548', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Paulo Rodrigues Da Silva', NULL, '(61) 99516-4528', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Paulo Rodrigues De Lima', NULL, '(61) 3628-3220', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Paumerio Felinto De Almeida', NULL, '(61) 98206-3056', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Raimundo Mesquita Cavalcante', NULL, '(61) 995158452', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ricardo José Barros De Sousa', NULL, '(61)992270190', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Rita Maria Morais De Souza', NULL, '(61) 3628-3531', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Ronie Von Ferreira Dos Santos', NULL, '(61) 99568-6284', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Rudney De Souza Gomes', NULL, '61 99449-8440', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sandra De Medeiros Barros', NULL, '(61)99170-7009', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sebastiana Da Nobrega Santos', NULL, '(61) 99068303', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sebastiana De Sousa Cunha', NULL, '(61) 991306060', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sebastiana Sousa Pereira', NULL, '(61)991702557', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Severina Ferreira De Lima Cavalcante', NULL, '(61) 99133-0208', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sulamita Alves Do Evangelho', NULL, '(61) 981915184', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Tatiana Nascimento De Moura', NULL, '(61)99280-1378', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Tereza De Oliveira Paz', NULL, '(61) 99284-2889', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Sonia Da Vitoria Meireles Marques', NULL, '61 99242-0510', 'HAS', 'Baixo');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Elaine Francisca do Amaral da Silva', 57, '(61) 99317-0855', 'HAS e DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'ALAIDE MARIA DA  CONCEIÇÃO GOMES DA COSTA', 62, '(61) 9985-7542', 'HAS e DM', 'Moderado');
  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, 'Rita De Cassia De Souza Ribeiro', NULL, '(61)99144-1702', 'HAS', 'Baixo');
END $$;
