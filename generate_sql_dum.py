import re

data_gestantes = """BRENDA KAROLAYNY MARQUES ALCIDES	02/07/2007	(61) 9147-0984	10/09/2025	35	Alto	SIFILI E MIOMA	6/25/2025
LUCIANA  DE PAIVA VIEIRA 	15/11/1985	(61)992408378	22/08/2025	18	Habitual		4/18/2025
SUZANA KELLY SILVA SABINO	09/06/2016	(61)981063849	04/09/2025	15	Alto	SIFILI	5/23/2025
MIKAELE DE JESUS VIEIRA	15/07/2002	(61)996552327	02/09/2025	23	Habitual		5/5/2025
LILIAN CARVALHO NONATO DA SILVA	04/06/1998	(61)996228365	09/09/2025		Alto	DESCOLAMENTO DE PLACENTA	6/6/2025
KAREN VITORIA RODRIGUES DE SOUSA	02/01/2004	(61)99100-1686	22/08/2025	21	Alto	SIFILIS	5/3/2025
JULLYANA NUNES DA SILVA	21/03/2023	(61)996343410		22	Habitual		25/047/2025
ALINE SILVA OLIVEIRA	11/12/2001	(61)99376-1099	04/07/2025	23	Habitual		6/1/2025
DEBORA ANARDA PEREIRA DE ARAIUJO	13/04/1987	(61)992217754	22/08/2025		Habitual		6/13/2025
SARAN DAYSE SILVA  DOS SANTOS	02/07/1997	(61)998374197	07/08/2025	28	Habitual		5/22/2025
BRENDA RODRIGUES DE ARAUJO	03/11/2000	(61)99151-3684	13/08/2025	24	Habitual		6/18/2025
RAFAELA SANTOS FARIAS	06/02/2025	61 98120-6236	02/10/2025	20	Habitual		5/29/2025
BIANCA SOUZA DA SILVA	30/08/2004	61 98505 7982	03/10/2025	21	Habitual		6/16/2025
ISABELA PEREIRA DA SILVA	10/02/2005	61099449-1695	29/10/2025	20	Habitual		8/25/2025
PATRICIA OLIVEIRA LIMA	03/09/1986	(61) 98234-9334	13/11/2024	39	Habitual		9/22/2028
VITORIA CONCEIÇÃO SOUZA	26/05/2001	61 99465-1011	01/07/2025	24	Habitual		5/25/2025
Sophie Rafaelly Ribeiro Amorim	24/06/2011	(61) 99187-2626	29/12/2025	14	Habitual		10/12/2025
MARIA EDUARDA MELO DA SILVA SOUSA	26/12/2002	(61) 99104-4458	05/01/2026	23	Intermediário	ABORTO	27/12/2002
SABRINA ESTER DE LIMA BRITO	10/04/20009	(61) 992183732	09/12/2025	-17995	Habitual		16/10/2025
LEANDRA BENILDA LIMA DE ALBURQUEQUE	13/07/1998	(61)999218929	30/12/2025	27	Habitual		22/10/2025
Jaine Freire Pereira	30/07/1997	(61) 99545-9431	07/09/2025	28	Alto	SIFILIS	
Nicolly Vieira Amaral	28/04/2006	61 992794083	13/01/2026	19	Habitual		05/12/2025
Amanda Costa Melo Alves	01/06/1996	(61) 99437-5550	15/01/2026	29	Alto	ABORTO	13/11/2025"""

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
        # handle mm/dd/yyyy format that seems to be present for some DUMs (e.g. 6/25/2025)
        if int(parts[0]) <= 12 and int(parts[1]) > 12:
           return f"'{parts[2]}-{parts[0].zfill(2)}-{parts[1].zfill(2)}'"
        return f"'{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}'"
    return 'NULL'

def format_dum(val):
    if not val or not val.strip():
        return "''"
    
    val = val.strip()
    # Correcting typo in 25/047/2025 -> 25/04/2025
    if val == "25/047/2025":
        val = "25/04/2025"

    parts = val.split('/')
    if len(parts) == 3:
        if len(parts[2]) > 4:
            parts[2] = parts[2][:4]
        # Some are mm/dd/yyyy (6/25/2025), others are dd/mm/yyyy (27/12/2002)
        if int(parts[0]) <= 12 and int(parts[1]) > 12:
           return f"'{parts[2]}-{parts[0].zfill(2)}-{parts[1].zfill(2)}'"
        return f"'{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}'"
        
    return f"'{val}'"

out_sql = []
out_sql.append("-- COLE ISSO NO SQL EDITOR DO SUPABASE E EXECUTE")
out_sql.append("")
out_sql.append("-- IMPORTANTE: Substitua 'COLE-SEU-ID-AQUI' pelo seu User ID do Supabase (Acesse Authentication -> Users)")
out_sql.append("DO $$")
out_sql.append("DECLARE")
out_sql.append("  v_user_id uuid := 'COLE-SEU-ID-AQUI';")
out_sql.append("BEGIN")
out_sql.append("  -- Limpar apenas gestantes antigas")
out_sql.append("  DELETE FROM pregnant_women WHERE user_id = v_user_id;")
out_sql.append("")

out_sql.append("  -- Inserir Gestantes Com DUM")
for line in data_gestantes.splitlines():
    cols = line.split('\t')
    if len(cols) >= 6:
        name = cols[0].strip().replace("'", "''")
        bdate = format_date(cols[1])
        phone = cols[2].strip()
        age = safe_int(cols[4])
        risk = cols[5].strip() if cols[5].strip() else 'Habitual'
        reason = cols[6].strip().replace("'", "''") if len(cols) > 6 else ''
        
        dum = format_dum(cols[7]) if len(cols) > 7 else "''"
        
        reason_sql = f"'{reason}'" if reason else 'NULL'
        phone_sql = f"'{phone}'" if phone else 'NULL'
        
        out_sql.append(f"  INSERT INTO pregnant_women (user_id, name, age, birth_date, phone, risk_level, risk_reason, dum) VALUES (v_user_id, '{name}', {age}, {bdate}, {phone_sql}, '{risk}', {reason_sql}, {dum});")

out_sql.append("END $$;")

with open("C:\\\\Users\\\\robso\\\\.gemini\\\\antigravity\\\\brain\\\\5d9672a1-8262-4fde-8b7a-080357660b69\\\\seed_gestantes_dum.sql", "w", encoding="utf-8") as f:
    f.write("\\n".join(out_sql))

print("SQL generator completed.")
