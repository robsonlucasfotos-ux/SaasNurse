import re

data_gestantes = """BRENDA KAROLAYNY MARQUES ALCIDES	02/07/2007	(61) 9147-0984	10/09/2025	35	Alto	SIFILI E MIOMA	6/25/2025	4/1/2026
LUCIANA  DE PAIVA VIEIRA 	15/11/1985	(61)992408378	22/08/2025	18	Habitual		4/18/2025	1/23/2026
SUZANA KELLY SILVA SABINO	09/06/2016	(61)981063849	04/09/2025	15	Alto	SIFILI	5/23/2025	2/27/2026
MIKAELE DE JESUS VIEIRA	15/07/2002	(61)996552327	02/09/2025	23	Habitual		5/5/2025	2/9/2026
LILIAN CARVALHO NONATO DA SILVA	04/06/1998	(61)996228365	09/09/2025		Alto	DESCOLAMENTO DE PLACENTA	6/6/2025	3/13/2026
KAREN VITORIA RODRIGUES DE SOUSA	02/01/2004	(61)99100-1686	22/08/2025	21	Alto	SIFILIS	5/3/2025	2/7/2026
JULLYANA NUNES DA SILVA	21/03/2023	(61)996343410		22	Habitual		25/04/2025	1/30/2025
ALINE SILVA OLIVEIRA	11/12/2001	(61)99376-1099	04/07/2025	23	Habitual		6/1/2025	3/8/2026
DEBORA ANARDA PEREIRA DE ARAIUJO	13/04/1987	(61)992217754	22/08/2025		Habitual		6/13/2025	3/20/2026
SARAN DAYSE SILVA  DOS SANTOS	02/07/1997	(61)998374197	07/08/2025	28	Habitual		5/22/2025	2/20/2026
BRENDA RODRIGUES DE ARAUJO	03/11/2000	(61)99151-3684	13/08/2025	24	Habitual		6/18/2025	3/25/2025
RAFAELA SANTOS FARIAS	06/02/2025	61 98120-6236	02/10/2025	20	Habitual		5/29/2025	2/13/2026
BIANCA SOUZA DA SILVA	30/08/2004	61 98505 7982	03/10/2025	21	Habitual		6/16/2025	3/26/2026
ISABELA PEREIRA DA SILVA	10/02/2005	61099449-1695	29/10/2025	20	Habitual		8/25/2025	6/1/2026
PATRICIA OLIVEIRA LIMA	03/09/1986	(61) 98234-9334	13/11/2024	39	Habitual		9/22/2028	6/29/2026
VITORIA CONCEIÇÃO SOUZA	26/05/2001	61 99465-1011	01/07/2025	24	Habitual		5/25/2025	3/1/2026
Sophie Rafaelly Ribeiro Amorim	24/06/2011	(61) 99187-2626	29/12/2025	14	Habitual		10/12/2025	7/19/2026
MARIA EDUARDA MELO DA SILVA SOUSA	26/12/2002	(61) 99104-4458	05/01/2026	23	Intermediário	ABORTO	27/12/2002	02/06/2026
SABRINA ESTER DE LIMA BRITO	10/04/20009	(61) 992183732	09/12/2025	-17995	Habitual		16/10/2025	23/07/2026
LEANDRA BENILDA LIMA DE ALBURQUEQUE	13/07/1998	(61)999218929	30/12/2025	27	Habitual		22/10/2025	
Jaine Freire Pereira	30/07/1997	(61) 99545-9431	07/09/2025	28	Alto	SIFILIS		19/07/2025
Nicolly Vieira Amaral	28/04/2006	61 992794083	13/01/2026	19	Habitual		05/12/2025	11/09/2026
Amanda Costa Melo Alves	01/06/1996	(61) 99437-5550	15/01/2026	29	Alto	ABORTO	13/11/2025	20/08/2026"""

data_criancas = """Angelina Teixeira Araujo	02/02/2024	04/03/2024	1m e 2 d	Habitual
Arthur Gael Oliveira da Silva	29/04/2024	03/06/2024	1m e 5d	Habitual
Ayalla Helloysa Fernandes Ferreira de Queiroz	18/06/2023	NÃO FEZ		Habitual
Ayla Isabella de Araujo Alencar	30/07/2024	30/08/2024	1m e 0 d	Habitual
Benicio Cosmo da Silva	25/01/2024	26/02/2024	1m	Habitual
Benjamin Nascimento Lima Soares	03/11/2024	03/06/2024	1m e 5d	Habitual
Davi de Souza Ribeiro	10/06/2024	12/07/2024	30d	Habitual
Eloa de Paula dos Santos	12/11/2024	12/12/2024	30d	Habitual
HELENA EVANGELISA PARAGUAI	14/4/2025	24/04/2025	10 d	Alto
Eloah Moraes Silva	2/7/2024	12/12/2024	30d	Habitual
Evelyn Sofia Pinheiro de Sena	3/7/2024	06/08/2025	1m e 3d	Habitual
Helena Bezerra Oliveira	26/11/2022			
Helena Sousa Zaurisio	26/08/2024	26/09/2024	30d	Habitual
João Lucas Almeida Brandão	18/02/2024	08/03/2024	19D	Habitual
João Lucas da Silva Ferreira	20/12/2024	23/01/0205	1M E 3D	Habitual
Jose Bernado Ribeiro Rocha	18/9/2024	23/09/2024	5D	Habitual
Jose Vicente Campos Brandão	20/12/2023			
Maria Rodrigues da Rocha	17/05/2025			
ISABEL DOS SANTOS POMPEU	23/01/2023			
Maya Eloa Silva Furtado	30/10/2023			
Nicolas Santos de Lima	05/01/2025			
Noah Rodrigues Coelho	25/09/2023			
Paula Cecilia Oliveira Soares	22/04/2024			
Rhavi Luca Amorim da Silveira	24/09/2024			
Victor Hugo Balduino dos Santos	08/05/2023			Habitual
MARIA ALICE OLIVEIRA SOARRES	18/08/2025			Intermediário
Yan Arthur Palheta Rocha	08/10/2024			
Ysis Costas Gonçalves	11/06/2025	24/06/2025	13d	Habitual
Aysha Pereira Herculano	17/10/2025		15 d	Habitual
AGATA FELIX XAVIER	14/03/2025			
ARTHUR JESUS LIMA	09/02/2025			
AYALLA HELLOYSA FERNANDES FERREIRA DE QUEIROZ	18/06/2023			
AYLA CAMARGO MARTINS DE ANDRADE	28/03/2024			
CALEB GAEL OLIVEIRA SILVA	25/05/2024			
ELISA BERNARDES DE SOUSA DA SILVA	23/02/2024			
HENRIQUE SAMUEL VIEIRA LUNA	29/09/2024			
Wallace Torres de Macedo	08/10/2025	28/10/2025	15 dias	Habitual
Augusto Goncalves Lima 	15/05/2025	03/06/2025	07/dias	Habitual
Matteo Eduardo Santos Braganga	20/05/2025	06/06/2025	15 dias	Habitual
Ana Cecilia Villa Nova Vinhal	25/04/2025	08/05/2025	13 dias	Habitual
Hadassa Tereza Nogueira dos Santos	08/06/2025	08/07/2025	30 dias	Habitual
Ayla Sophia Santos Leonardo	06/10/2025	16/10/2025	10 DIAS	Alto
Serena Eustaquio Sousa	16/11/2025	13/11/2025	6 DIAS	Habitual
Eloá Alice de Morais Xavier	04/12/2023			
Bernardo de Sousa Reis	09/02/2025	18/02/2025	09 DIAS	Alto
Bento Antonio dos Santos Gonçalves	29/07/2025	14/08/2025	16 dias	Alto
Otto Gabriel Melo Silva	24/04/2025	08/05/2025	14DIAS	Alto
Ester Emilly Felix Silva	21/07/2025	28/10/;2025	1 MES E 15 D	Intermediário
Jose Heitor Bastos Calaço	28/08/2025	13/10/2025	1 MES E 15	Habitual
THALYSON RICARDO DA SILVA MAIA	12/07/2025	13/01/2025	6 MESES	Intermediário"""


data_cronicos = """Claudia Medrado De Almeida	61991634086	12/11/1971	20/052025	53 anos 	HAS	Médio	Estável
Francisco De Oliveira Costa	61985573396	19/05/1952	04/11/2025	73 anos	HAS	Médio	Estável
Genir Batista Da Silva	61985925940	22/10/1979	29/07/2025	46 anos	HAS	Médio	Estável
Jose Aguinaldo Pereira	61992585431	10/10/1967	03/10/2025	58 anos	HAS	Alto	Estável
Leuda Gonçalves De Oliveira Viana	61999857875	01/03/1987	21/08/2025	68anos	Ambos	Muito Alto	Estável
Ana Luiza Lima De Morais	61985228578	10/01/1960	01/08/2025	65 anos	HAS	Médio	Estável
Cleonice Queiroz Viana De Castro	61986257777	12/12/1967	16/05/2025	58 anos	HAS	Médio	Estável
Edmilson Do Espirito Santo	61999663222	03/04/1961	23/09/2025	64 anos	HAS	Médio	Estável
Elenides Soares Da Silva Armonnes	61995187119	09/09/1955	02/09/2025	70 anos 	Ambos	Muito Alto	Instável
Francisca Das Chagas Silva Madeira	61981547164	18/06/1976	05/11/2025	49 anos	HAS	Médio	Estável
Francisca Zelandia Paiva De Carvalho	61993582362	12/01/1963	04/11/2025	62 anos	HAS	Médio	Estável
Maria Da Guia Lopes Ferraz	61995554263	26/04/1962	20/08/2025	53 anos	HAS	Baixo	Estável
Maria Do Rosario De Fatima Madeira De Almeida	61992152918	25/01/1963	07/07/2025	62 anos	HAS	Baixo	Estável
Maria Judite Nunes Da Cruz	61998746701	10/03/1967	02/10/2025	58 anos	HAS	Médio	Estável
Matheus Araujo Lustosa	61999663322	16/05/1995	11/12/2024	30 anos	HAS	Baixo	Estável
Olimpio Siqueira Dantas	61995778326	26/07/1962	15/10/2025	63 anos	HAS	Baixo	Estável
Paulo Ferreira De Brito	61999663222	13/06/1939	15/10/2025	86 anos	Ambos	Muito Alto	Instável
Rejane Gomes Dos Santos	61994192694	14/07/1970	02/10/2025	46 anos	HAS	Alto	Instável
Robson Robeiro Da Silva	61993855120	15/03/1985	04/11/2025	40 anos	HAS		
Maria Bento Araujo	6136381074	21/03/1960	2/7/2025	65 anos	HAS	Baixo	Estável
Maria Do Socorro De Castro Geremias	61981358890	23/05/1966	07/10/2025	59 anos	Ambos	Muito Alto	Instável
Ronnie Von Ferreira Dos Santos	61998415151	04/01/1969	28/07/2025	56 anos	HAS	Alto	Instável
Maria Gomes De Lima	ATUALIZAR	05/06/1936	02/10/2024	89 anos	HAS	Baixo	Estável
Sebastiao De Santana Silva	61981527957	04/10/1967	13/10/2025	58 anos	Ambos	Baixo	Estável
Antonia Gomes Mesquita	61995780756	28/08/1953	05/11/2025	72 anos	Ambos	Baixo	Estável
Isabel Da Silva	61995845494	01/10/1950	09/04/2025	75 anos	Ambos	Médio	Instável
Ivonete De Sousa Vasconcelos	61992088741	05/05/1972	06/11/2025	53 anos	Ambos	Muito Alto	Instável
Manoel Augusto Evangelista Dos Santos	61991399615	10/09/1970	23/06/2025	55 anos	Ambos	Muito Alto	Instável
Maria De Fatima Ribeiro	61992060265	04/12/1957	05/11/2025	67 anos	HAS		
Maria Odete De Oliveira Leite	61993264944	01/04/56	28/10/2025	69 anos	HAS		
Ourivaldo Batista Da Rocha	61999897573	05/05/1945	28/08/2025	80 anos	HAS	Alto	
Stefferson Nascimento Dos Santos	61985253569	25/08/1987	02/10/2025	38 anos	HAS		
Vilmar De Castro Duarte	61991197518	26/03/1966	03/11/2025	59 anos	HAS		
Maria Das Dores De Oliveira Lima	(61) 98234-9334	12/11/1971	13/11/2025	73 anos	Ambos	Alto	
Maria De Fatima Pereira Dos Santos	(61) 99150-1179	05/03/1964	10/11/2025	61 anos	Ambos	Alto	
Maria Do Socorro Tavares Querino	(61) 98118-9647	13/11/1960	07/11/2025	65 anos	Ambos	Alto	
Camila Neves Machado De Souza	(61) 99160-5843	13/11/1960	13/11/2025	33 ANOS	HAS	Baixo	
Jose Da Cruz Bezerra Santos	(61) 99180-7171	13/09/1955	10/11/2025	70 anos	Ambos	Alto	
Pedro Caleb Pompeu Silva	(61) 99959-0991	04/03/1998	14/11/2025	27 anos	HAS	Baixo	
Bruna Ribeiro Pinto Nouga	(61) 99222-8036	10/9/1987	14/10/2025	38 anos	Ambos	Médio	
Idnei Batista De Godoi Rodrigues	(61) 98575-0365	11/05/1959	18/11/2025	66 anos	Ambos	Médio	
Maria Celia Tiago	(61) 9985-8555	27/6/1961	07/07/2025	64 anos	DM	Baixo	Estável
Sandra Aparecida Carlos De Sousa	(61) 99251-2255	01/03/1957	14/10/2025	52 anos	DM	Médio	
Juraci Santana Dos Santos	(61) 99968-7574	10/01/1960		68 anos	HAS		
Manoel Lima Ferreira	(61) 9968-5555	12/02/1967	28/10/2025	68 anos	DM	Médio	
Nelson Rodrigues Cirqueira	(61) 99113-9026	03/04/1961			HAS		
Maria Cardoso Da Silva	(61) 9966-3322	09/09/1955			HAS		
Aldina Ferreira Silva	(61) 98582-2696	18/06/1976			HAS		
Dejair De Castro Silva	ATUALIZAR 	12/01/1963			HAS		
Abisolon Oliveira Do Nascimento	(61) 99149-0080	13/09/1955			HAS		
Adriana Ferreira Rodrigues	(61)993462140	26/04/1972			HAS		
Adriana Gonçalves Viana	(61) 991871076	25/01/1963			HAS		
Aldaisa Monteiro Da Silva	(61)994085197	10/03/1967			HAS		
Anizia Josefa Da Silva	(61) 36285761	16/05/1995			HAS		
Antonio De Souza Sobrinho	(61)992483232	26/07/1962			HAS		
Antonio A. Cutrim De Macena	(61)98134.-4318	13/06/1939			HAS		
Antonio Augusto Cutrim De Macena	(61) 98134-4318	04/03/1998			HAS		
Antonio Carlos Alves Da Silva	(61) 991000151	14/07/1979			HAS		
Antonio Garcia Sobrinho	(61) 36281077	16/03/1985			HAS		
Adolis Almira Ramirez	(62) 98478-9338	10/09/1987			DM		
Antonio Rodrigues Costa	(61) 99618-7042	11/05/1959			DM		
Arinalda Cabral De Aguiar	(61) 994000097	27/06/1961			DM		
Availde Rego Queiroz	(61) 995217806	03/09/1952			DM		
Ayrton Douglas Da Costa Oliveira	(61) 99999-9910	05/03/1964			DM		
Benildes Antunes Romeiro	(61) 99170978	13/11/1960			DM		
Carla Luiza Correia Da Silva	(61) 994435869	04/11/1973			DM		
Carlito Martins Vieira	(61) 991351007	05/05/1972			DM		
Celio Lopes Da Silva Mota	(61) 98615-7098	11/07/1957			DM		
José Marcos Dos Santos Dos Santos Silva	ATUALIZAR 	01/03/1957			DM		
Cidalia Dos Santos	(61) 99149-4812	10/07/1954			DM		
Cleide De Souza Firmino	(61) 98221-5941	13/01/1968			DM		
Clenilda Oliveira De Araujo	(61) 3628-6393	09/09/1955			DM		
Cleonice Maria Dos Santos	(61)992204628	01/06/1935			DM		
Cleumildes Morais De Lima	(63) 99971-5977	13/06/1939			DM		
Cleusa Batista Lopes	(61)98595-5170	15/03/1956	03/11/2025	69	DM	Muito Alto	Agudizada
Conceição De Maria Barbosa	(61)991762250	09/08/1959	11/02/2025	66 ano			
Divina Alvez De Queiroz	(61) 99301-7310						
Doralice Aparecida Dos Santos	(61)99655-1040	15/06/1973	11/11/2025	52 anos	HAS	Médio	
Elenides Soares Da Silva Armonnes	(61) 99380-2774	09/09/1955	13/11/2025	70 anos	Ambos	Médio	
Eliana Maria Alves	(61) 3628-1284	03/04/1961		64 anos	HAS	Alto	
Eliete Vidal Dos Santos Matheus	(61) 986556687	24/11/1966	06/06/2025	58 anos	Ambos	Alto	
Estevão Francisco Santana	( 61) 998364630	12/06/1974	21/05/2025	51 anos	DM	Alto	
Eudenete Rodrigues De Freitas	(61) 993945239	13/03/1973	19/09/2025	52 anos	HAS	Baixo	
Francisca Alves De Castro	(61)995615681	09/07/1952	07/08/2025	73 anos	HAS	Médio	
Francisca De Souza Dourado	(61)36285764	04/10/1950	21/11/2025	75 anos	HAS	Alto	
Gilberto Alves Ferreira De Lima	(61)981303694	06/03/1980	28/08/2025	45 anos	HAS	Médio	
Halinne Sousa Costa Neves	(61) 9 9234-0449	01/06/1987	17/11/2025	38 anos	HAS	Baixo	
Hercules Da Costa Neto	(61) 9501-5747	17/12/1966	14/10/2025	58 anos	Ambos	Alto	
Isaias Rodrigues Das Chagas	(61) 99293-9229	26/03/1957	01/08/2025	68 anos	HAS	Médio	
Ivanilda Araujo Amaral	(61) 98577-8357	23/08/1974	11/11/2025	51 anos	HAS	Baixo	
João Dos Passos Marques	(62)996442105	14/10/1956	30/10/2025	69 anos	HAS	Médio	
Joao Francisco Madeira De Almeida	(61) 99215-2918	30/11/1958	07/11/2024	66 anos			
João Luiz Da Silva	(61) 99313-3593	11/01/1942	15/07/2025	83 anos	Ambos	Alto	
José Marcos Dos Santos Silva	(61)982925600	24/05/1971	31/10/2025	54 anos	DM	Alto	
Jose Ribamar Dos Santos	(61)994089194	06/01/1956	01/10/2024	69 anos	HAS	Alto	
José Simão De Moura	(61) 984839092	20/08/1940	07/11/2025	85 anos	HAS	Alto	
Karlene Ubaldo Nascimento	(61) 993119083	17/10/1967	18/11/2025	58 anos	DM	Alto	
Katia Martins Da Silva	(61) 99219-0521	28/01/1966	18/12/2024	59 anos	HAS	Médio	
Lindinalva Maria Sousa Costa	(61 995865582	06/06/1951	24/09/2025	74 anos	HAS	Baixo	
Lindineide Barbosa Pereira	(61) 995276550	24/04/1966	18/03/2025	59 anos	DM	Baixo	
Loreli Terezinha Bratz	(61) 99113-3375	14/07/1956	03/11/2025	69 anos	DM	Médio	
Lucinda Almeida Do Nascimento	(61) 3628-1077	20/08/1945	17/02/2025	80 anos	HAS	Médio	
Luiz De Sousa Cavalcante	(61)3628-7738	10/02/1964	05/11/2025	61 anos	DM	Médio	
Luzia Dornelas De Souza	(61) 995488556	11/01/1950	27/05/2025	75 anos	HAS	Baixo	
Manoel Augusto Evangelista Dos Santos	(61) 991399615						
Manoel Lima Ferreira	(61) 99197-4594						
Marcos Regis Madeira Rocha	(61) 98564-6462						
Maria Da Piedade Ribeiro Da Silva	(61) 30601106						
Maria De Fátima Araujo	(61)36082632						
Maria De Fátima De Almeida	(61) 98561744						
Maria De Lurdes Da Nobrega Ferreira	(61) 3628-1077						
Maria Derlandia Da Silva Domingos	(61)991844320						
Maria Do Socorro Marques	(61) 99290-1456						
Maria Do Socorro Souza	(61) 9852-3641						
Maria Jose Alves Medeiros Dos Santos	(61)996248780						
Maria Neusa De Sousa Pereira	(61)99384-7011						
Maria Patricia Dos Santos	(61)98185-0595						
Maria Socorro Soares Lima	(61)991844320						
Maria Vasco Da Silva	(61) 984610461						
Marlene Vieira Barbosa	(61) 98442-7210						
Matheus Araujo Lustosa	(61) 994330427						
Ortelina Rosario De Souza	(61) 994262942						
Pablo Juan Soares	(61) 9955-8548						
Paulo Rodrigues Da Silva	(61) 99516-4528						
Paulo Rodrigues De Lima	(61) 3628-3220						
Paumerio Felinto De Almeida	(61) 98206-3056						
Raimundo Mesquita Cavalcante	(61) 995158452						
Ricardo José Barros De Sousa	(61)992270190						
Rita Maria Morais De Souza	(61) 3628-3531						
Ronie Von Ferreira Dos Santos	(61) 99568-6284						
Rudney De Souza Gomes	61 99449-8440						
Sandra De Medeiros Barros	(61)99170-7009						
Sebastiana Da Nobrega Santos	(61) 99068303						
Sebastiana De Sousa Cunha	(61) 991306060						
Sebastiana Sousa Pereira	(61)991702557						
Severina Ferreira De Lima Cavalcante	(61) 99133-0208						
Sulamita Alves Do Evangelho	(61) 981915184						
Tatiana Nascimento De Moura	(61)99280-1378						
Tereza De Oliveira Paz	(61) 99284-2889						
Sonia Da Vitoria Meireles Marques	61 99242-0510						
Elaine Francisca do Amaral da Silva	(61) 99317-0855	29/11/1968	21/01/2026	57	Ambos	Médio	Estável
ALAIDE MARIA DA  CONCEIÇÃO GOMES DA COSTA	(61) 9985-7542	02/08/1963	21/01/2026	62	Ambos	Médio	Estável
Rita De Cassia De Souza Ribeiro	(61)99144-1702	"""

def safe_int(val):
    v = re.sub(r'[^0-9]', '', val)
    return int(v) if v else 'NULL'

def format_date(val):
    if not val or val.strip().upper() == 'NÃO FEZ' or 'ATUALIZAR' in val.upper():
        return 'NULL'
    parts = val.split('/')
    if len(parts) == 3:
        if len(parts[2]) > 4:
            parts[2] = parts[2][:4]
        if int(parts[0]) <= 12 and int(parts[1]) > 12:
           return f"'{parts[2]}-{parts[0].zfill(2)}-{parts[1].zfill(2)}'"
        return f"'{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}'"
    return 'NULL'

def format_dum(val):
    if not val or not val.strip():
        return "NULL"
    
    val = val.strip()
    if val == "25/047/2025":
        val = "25/04/2025"
    if val == "16/10/2025 23/07/2026": # Fixing mixed columns
        return "'2025-10-16'"

    parts = val.split('/')
    if len(parts) == 3:
        if len(parts[2]) > 4:
            parts[2] = parts[2][:4]
        if int(parts[0]) <= 12 and int(parts[1]) > 12:
           return f"'{parts[2]}-{parts[0].zfill(2)}-{parts[1].zfill(2)}'"
        return f"'{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}'"
        
    return "NULL"

out_sql = []
out_sql.append("-- COLE ISSO NO SQL EDITOR DO SUPABASE E EXECUTE")
out_sql.append("")

out_sql.append("-- Criar tabelas caso não existam no banco de dados!")
out_sql.append("CREATE TABLE IF NOT EXISTS children (")
out_sql.append("    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,")
out_sql.append("    user_id UUID NOT NULL,")
out_sql.append("    name TEXT NOT NULL,")
out_sql.append("    birth_date DATE,")
out_sql.append("    gender TEXT NOT NULL,")
out_sql.append("    risk_level TEXT NOT NULL,")
out_sql.append("    clinical_data JSONB,")
out_sql.append("    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
out_sql.append(");")
out_sql.append("")
out_sql.append("CREATE TABLE IF NOT EXISTS chronic_patients (")
out_sql.append("    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,")
out_sql.append("    user_id UUID NOT NULL,")
out_sql.append("    name TEXT NOT NULL,")
out_sql.append("    age INTEGER,")
out_sql.append("    phone TEXT,")
out_sql.append("    condition TEXT NOT NULL,")
out_sql.append("    risk_level TEXT NOT NULL DEFAULT 'Baixo',")
out_sql.append("    clinical_data JSONB,")
out_sql.append("    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
out_sql.append(");")
out_sql.append("")

out_sql.append("ALTER TABLE pregnant_women ADD COLUMN IF NOT EXISTS dpp DATE;")
out_sql.append("ALTER TABLE pregnant_women ADD COLUMN IF NOT EXISTS dum DATE;")
out_sql.append("ALTER TABLE pregnant_women ALTER COLUMN dum DROP NOT NULL;")
out_sql.append("")
out_sql.append("-- Permitir valores customizados de risk_level na tabela children (remover restrição se existir)")
out_sql.append("ALTER TABLE children DROP CONSTRAINT IF EXISTS children_risk_level_check;")
out_sql.append("")
out_sql.append("-- IMPORTANTE: Substitua 'COLE-SEU-ID-AQUI' pelo seu User ID do Supabase (Acesse Authentication -> Users)")
out_sql.append("DO $$")
out_sql.append("DECLARE")
out_sql.append("  v_user_id uuid := 'COLE-SEU-ID-AQUI';")
out_sql.append("BEGIN")
out_sql.append("  -- Limpar dados antigos")
out_sql.append("  DELETE FROM pregnant_women WHERE user_id = v_user_id;")
out_sql.append("  DELETE FROM children WHERE user_id = v_user_id;")
out_sql.append("  DELETE FROM chronic_patients WHERE user_id = v_user_id;")
out_sql.append("")

out_sql.append("  -- Inserir Gestantes")
for line in data_gestantes.splitlines():
    cols = line.split('\t')
    if len(cols) >= 6:
        name = cols[0].strip().replace("'", "''")
        bdate = format_date(cols[1])
        phone = cols[2].strip()
        age = safe_int(cols[4])
        risk = cols[5].strip() if cols[5].strip() else 'Habitual'
        reason = cols[6].strip().replace("'", "''") if len(cols) > 6 else ''
        
        dum = format_dum(cols[7]) if len(cols) > 7 else "NULL"
        dpp = format_dum(cols[8]) if len(cols) > 8 else "NULL"
        
        reason_sql = f"'{reason}'" if reason else 'NULL'
        phone_sql = f"'{phone}'" if phone else 'NULL'
        
        out_sql.append(f"  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum, dpp) VALUES (v_user_id, '{name}', {age}, {bdate}, {phone_sql}, '{risk}', {reason_sql}, {dum}, {dpp});")

out_sql.append("")
out_sql.append("  -- Inserir Crianças")
for line in data_criancas.splitlines():
    cols = line.split('\t')
    if len(cols) >= 2:
        name = cols[0].strip().replace("'", "''")
        bdate = format_date(cols[1])
        risk = cols[4].strip() if len(cols) > 4 and cols[4].strip() else 'Habitual'
        if risk not in ['Habitual', 'Intermediário', 'Alto']:
            risk = 'Habitual'
            
        out_sql.append(f"  INSERT INTO children (user_id, name, birth_date, gender, risk_level) VALUES (v_user_id, '{name}', {bdate}, 'Não Informado', '{risk}');")

out_sql.append("")
out_sql.append("  -- Inserir Pacientes Crônicos")
for line in data_cronicos.splitlines():
    cols = line.split('\t')
    if len(cols) >= 2:
        name = cols[0].strip().replace("'", "''")
        phone = cols[1].strip() if 'ATUALIZAR' not in cols[1].upper() else ''
        phone_sql = f"'{phone}'" if phone else 'NULL'
        bdate = format_date(cols[2]) if len(cols) > 2 else 'NULL'
        age = safe_int(cols[4]) if len(cols) > 4 else 'NULL'
        
        cond = cols[5].strip() if len(cols) > 5 and cols[5].strip() else 'HAS'
        if cond == 'Ambos': cond = 'HAS e DM'
        if cond not in ['HAS', 'DM', 'HAS e DM']: cond = 'HAS'
            
        risk = cols[6].strip() if len(cols) > 6 and cols[6].strip() else 'Baixo'
        if risk == 'Médio': risk = 'Moderado'
        if risk == 'Muito Alto': risk = 'Alto'
        if risk not in ['Baixo', 'Moderado', 'Alto']: risk = 'Baixo'
            
        out_sql.append(f"  INSERT INTO chronic_patients (user_id, name, age, phone, condition, risk_level) VALUES (v_user_id, '{name}', {age}, {phone_sql}, '{cond}', '{risk}');")

out_sql.append("END $$;")

with open("seed_latest.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(out_sql))

print("SQL generator completed.")
