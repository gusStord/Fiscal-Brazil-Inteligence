// Brazil Fiscal Data - Extracted from CIG and Demonstrativos (2018-2023)
// All values in R$ Milhões (millions of reais) - current values

export interface YearlyData {
  year: number;
  receita_total: number;
  receita_federal: number;
  receita_estadual: number;
  receita_municipal: number;
  impostos_total: number;
  contrib_sociais: number;
  juros_receita: number;
  despesa_total: number;
  despesa_federal: number;
  despesa_estadual: number;
  despesa_municipal: number;
  consumo_capital_fixo: number;
  juros_despesa: number;
  subsidios: number;
  rob: number; // Resultado Operacional Bruto
  rol: number; // Resultado Operacional Líquido
  investimento_liquido: number;
  fbcf: number; // Formação Bruta de Capital Fixo
  remuneracao_empregados: number;
  salarios_vencimentos: number;
  uso_bens_servicos: number;
  beneficios_sociais: number;
  beneficios_seguridade: number;
  beneficios_assistencia: number;
  outras_despesas: number;
  // Per-sphere breakdowns (IBGE CIG)
  impostos_federal: number;
  impostos_estadual: number;
  impostos_municipal: number;
  contrib_sociais_federal: number;
  contrib_sociais_estadual: number;
  contrib_sociais_municipal: number;
  juros_receita_federal: number;
  juros_receita_estadual: number;
  juros_receita_municipal: number;
  remuneracao_federal: number;
  remuneracao_estadual: number;
  remuneracao_municipal: number;
  uso_bens_federal: number;
  uso_bens_estadual: number;
  uso_bens_municipal: number;
  consumo_capital_fixo_federal: number;
  consumo_capital_fixo_estadual: number;
  consumo_capital_fixo_municipal: number;
  juros_despesa_federal: number;
  juros_despesa_estadual: number;
  juros_despesa_municipal: number;
  subsidios_federal: number;
  subsidios_estadual: number;
  subsidios_municipal: number;
  beneficios_federal: number;
  beneficios_estadual: number;
  beneficios_municipal: number;
  fbcf_federal: number;
  fbcf_estadual: number;
  fbcf_municipal: number;
  investimento_liquido_federal: number;
  investimento_liquido_estadual: number;
  investimento_liquido_municipal: number;
  // CIG data
  producao: number;
  consumo_intermediario: number;
  vab_pib: number;
  excedente_operacional: number;
  renda_disponivel: number;
  despesa_consumo_final: number;
  poupanca_bruta: number;
  nec_financiamento: number;
}

export const fiscalData: Record<number, YearlyData> = {
  2018: {
    year: 2018,
    receita_total: 2844818.55,
    receita_federal: 2003230.64,
    receita_estadual: 859830.84,
    receita_municipal: 629060.36,
    impostos_total: 1658565.30,
    contrib_sociais: 748827.58,
    juros_receita: 188745.43,
    despesa_total: 3339635.11,
    despesa_federal: 2481852.94,
    despesa_estadual: 899718.24,
    despesa_municipal: 605367.22,
    consumo_capital_fixo: 106711.0,
    juros_despesa: 613408.20,
    subsidios: 24829.31,
    rob: -388105.56,
    rol: -494816.56,
    investimento_liquido: -15976.07,
    fbcf: 92737.73,
    remuneracao_empregados: 911415.80,
    salarios_vencimentos: 685161.04,
    uso_bens_servicos: 376744.84,
    beneficios_sociais: 347791.08,
    beneficios_seguridade: 777769.66,
    beneficios_assistencia: 92105.24,
    outras_despesas: 85198.61,
    // Per-sphere data (IBGE CIG)
    impostos_federal: 976789, impostos_estadual: 551545, impostos_municipal: 130231,
    contrib_sociais_federal: 646877, contrib_sociais_estadual: 42947, contrib_sociais_municipal: 59004,
    juros_receita_federal: 598127, juros_receita_estadual: 60739, juros_receita_municipal: 5352,
    remuneracao_federal: 290953, remuneracao_estadual: 328430, remuneracao_municipal: 292032,
    uso_bens_federal: 72908, uso_bens_estadual: 117817, uso_bens_municipal: 186021,
    consumo_capital_fixo_federal: 34103, consumo_capital_fixo_estadual: 38305, consumo_capital_fixo_municipal: 34304,
    juros_despesa_federal: 598127, juros_despesa_estadual: 60739, juros_despesa_municipal: 5352,
    subsidios_federal: 23701, subsidios_estadual: 756, subsidios_municipal: 373,
    beneficios_federal: 994040, beneficios_estadual: 173141, beneficios_municipal: 50485,
    fbcf_federal: 25290, fbcf_estadual: 35248, fbcf_municipal: 32200,
    investimento_liquido_federal: -11211, investimento_liquido_estadual: -2923, investimento_liquido_municipal: -1842,
    producao: 1376343.01,
    consumo_intermediario: 359577.26,
    vab_pib: 1016765.75,
    excedente_operacional: 106711.0,
    renda_disponivel: 978099.87,
    despesa_consumo_final: 1358618.72,
    poupanca_bruta: 0,
    nec_financiamento: -471210.25,
  },
  2019: {
    year: 2019,
    receita_total: 3088472.79,
    receita_federal: 2157475.69,
    receita_estadual: 926662.45,
    receita_municipal: 688621.47,
    impostos_total: 1752738.01,
    contrib_sociais: 798087.28,
    juros_receita: 179272.64,
    despesa_total: 3484002.61,
    despesa_federal: 2572835.07,
    despesa_estadual: 938485.04,
    despesa_municipal: 656969.32,
    consumo_capital_fixo: 115040.0,
    juros_despesa: 526300.44,
    subsidios: 17471.27,
    rob: -280489.82,
    rol: -395529.82,
    investimento_liquido: -28609.38,
    fbcf: 92107.10,
    remuneracao_empregados: 960252.64,
    salarios_vencimentos: 716113.86,
    uso_bens_servicos: 385039.50,
    beneficios_sociais: 383493.93,
    beneficios_seguridade: 854499.43,
    beneficios_assistencia: 97804.57,
    outras_despesas: 141640.93,
    // Per-sphere data (IBGE CIG)
    impostos_federal: 1017879, impostos_estadual: 589425, impostos_municipal: 145434,
    contrib_sociais_federal: 686207, contrib_sociais_estadual: 48174, contrib_sociais_municipal: 63706,
    juros_receita_federal: 511687, juros_receita_estadual: 49108, juros_receita_municipal: 4859,
    remuneracao_federal: 305740, remuneracao_estadual: 341237, remuneracao_municipal: 313275,
    uso_bens_federal: 63040, uso_bens_estadual: 116790, uso_bens_municipal: 205210,
    consumo_capital_fixo_federal: 36873, consumo_capital_fixo_estadual: 40535, consumo_capital_fixo_municipal: 37632,
    juros_despesa_federal: 511687, juros_despesa_estadual: 49108, juros_despesa_municipal: 4859,
    subsidios_federal: 16433, subsidios_estadual: 667, subsidios_municipal: 371,
    beneficios_federal: 1086686, beneficios_estadual: 192846, beneficios_municipal: 56266,
    fbcf_federal: 24175, fbcf_estadual: 27360, fbcf_municipal: 40571,
    investimento_liquido_federal: -18837, investimento_liquido_estadual: -13168, investimento_liquido_municipal: 3396,
    producao: 1455868.13,
    consumo_intermediario: 386776.62,
    vab_pib: 1069091.50,
    excedente_operacional: 115040.0,
    renda_disponivel: 1159357.27,
    despesa_consumo_final: 1437546.17,
    poupanca_bruta: 0,
    nec_financiamento: -361221.0,
  },
  2020: {
    year: 2020,
    receita_total: 2895389.22,
    receita_federal: 1956272.59,
    receita_estadual: 975177.21,
    receita_municipal: 752850.30,
    impostos_total: 1716537.02,
    contrib_sociais: 797843.0,
    juros_receita: 128698.34,
    despesa_total: 3805282.82,
    despesa_federal: 2928261.28,
    despesa_estadual: 960131.68,
    despesa_municipal: 705800.74,
    consumo_capital_fixo: 121954.0,
    juros_despesa: 433894.01,
    subsidios: 13671.12,
    rob: -787939.60,
    rol: -909893.60,
    investimento_liquido: -16274.38,
    fbcf: 110894.46,
    remuneracao_empregados: 980055.66,
    salarios_vencimentos: 736029.86,
    uso_bens_servicos: 392054.36,
    beneficios_sociais: 405958.95,
    beneficios_seguridade: 918473.57,
    beneficios_assistencia: 415705.81,
    outras_despesas: 0,
    // Per-sphere data (IBGE CIG)
    impostos_federal: 967894, impostos_estadual: 602213, impostos_municipal: 146430,
    contrib_sociais_federal: 675389, contrib_sociais_estadual: 81601, contrib_sociais_municipal: 40853,
    juros_receita_federal: 423750, juros_receita_estadual: 36345, juros_receita_municipal: 5006,
    remuneracao_federal: 302045, remuneracao_estadual: 342499, remuneracao_municipal: 335512,
    uso_bens_federal: 62651, uso_bens_estadual: 118670, uso_bens_municipal: 210733,
    consumo_capital_fixo_federal: 37740, consumo_capital_fixo_estadual: 42391, consumo_capital_fixo_municipal: 41823,
    juros_despesa_federal: 423750, juros_despesa_estadual: 36345, juros_despesa_municipal: 5006,
    subsidios_federal: 11286, subsidios_estadual: 1457, subsidios_municipal: 929,
    beneficios_federal: 1470293, beneficios_estadual: 208558, beneficios_municipal: 61287,
    fbcf_federal: 23149, fbcf_estadual: 29087, fbcf_municipal: 58659,
    investimento_liquido_federal: -20685, investimento_liquido_estadual: -13124, investimento_liquido_municipal: 17535,
    producao: 1491789.75,
    consumo_intermediario: 393657.32,
    vab_pib: 1098132.44,
    excedente_operacional: 121954.0,
    renda_disponivel: 688882.94,
    despesa_consumo_final: 1482970.45,
    poupanca_bruta: 0,
    nec_financiamento: -898238.82,
  },
  2021: {
    year: 2021,
    receita_total: 3643725.97,
    receita_federal: 2463354.76,
    receita_estadual: 1167841.27,
    receita_municipal: 861554.47,
    impostos_total: 2201082.10,
    contrib_sociais: 894513.48,
    juros_receita: 198783.38,
    despesa_total: 3845189.27,
    despesa_federal: 2836572.65,
    despesa_estadual: 1084912.74,
    despesa_municipal: 772728.42,
    consumo_capital_fixo: 141869.0,
    juros_despesa: 601982.84,
    subsidios: 14546.38,
    rob: -89145.50,
    rol: -231014.50,
    investimento_liquido: -29551.20,
    fbcf: 118201.22,
    remuneracao_empregados: 1033552.67,
    salarios_vencimentos: 775125.09,
    uso_bens_servicos: 445723.36,
    beneficios_sociais: 410932.73,
    beneficios_seguridade: 885329.85,
    beneficios_assistencia: 170978.29,
    outras_despesas: 0,
    // Per-sphere data (Demonstrativos 2021 + CIG 2021)
    impostos_federal: 1274017, impostos_estadual: 748887, impostos_municipal: 178178,
    contrib_sociais_federal: 756515, contrib_sociais_estadual: 96353, contrib_sociais_municipal: 41646,
    juros_receita_federal: 245251, juros_receita_estadual: 5037, juros_receita_municipal: 12186,
    remuneracao_federal: 309990, remuneracao_estadual: 367605, remuneracao_municipal: 355957,
    uso_bens_federal: 66526, uso_bens_estadual: 146926, uso_bens_municipal: 232271,
    consumo_capital_fixo_federal: 42532, consumo_capital_fixo_estadual: 50437, consumo_capital_fixo_municipal: 48900,
    juros_despesa_federal: 245251, juros_despesa_estadual: 5037, juros_despesa_municipal: 12186,
    subsidios_federal: 12234, subsidios_estadual: 1105, subsidios_municipal: 1207,
    beneficios_federal: 1193407, beneficios_estadual: 207986, beneficios_municipal: 65848,
    fbcf_federal: 20371, fbcf_estadual: 50099, fbcf_municipal: 47731,
    investimento_liquido_federal: -28737, investimento_liquido_estadual: -220, investimento_liquido_municipal: -594,
    producao: 1619070.36,
    consumo_intermediario: 442609.71,
    vab_pib: 1176460.64,
    excedente_operacional: 141869.0,
    renda_disponivel: 1545031.28,
    despesa_consumo_final: 1634688.94,
    poupanca_bruta: 0,
    nec_financiamento: -200123.89,
  },
  2022: {
    year: 2022,
    receita_total: 4249607.34,
    receita_federal: 2986151.84,
    receita_estadual: 1345877.61,
    receita_municipal: 1047916.36,
    impostos_total: 2487125.12,
    contrib_sociais: 1017206.53,
    juros_receita: 284043.91,
    despesa_total: 4590506.68,
    despesa_federal: 3440643.30,
    despesa_estadual: 1334536.87,
    despesa_municipal: 945664.99,
    consumo_capital_fixo: 156144.0,
    juros_despesa: 798121.28,
    subsidios: 27140.10,
    rob: -184755.34,
    rol: -340899.34,
    investimento_liquido: 39930.79,
    fbcf: 198276.33,
    remuneracao_empregados: 1173678.20,
    salarios_vencimentos: 880176.96,
    uso_bens_servicos: 545633.31,
    beneficios_sociais: 452391.21,
    beneficios_seguridade: 1021549.33,
    beneficios_assistencia: 215601.38,
    outras_despesas: 0,
    // Per-sphere data (IBGE CIG)
    impostos_federal: 1484318, impostos_estadual: 803965, impostos_municipal: 198843,
    contrib_sociais_federal: 851952, contrib_sociais_estadual: 114841, contrib_sociais_municipal: 50413,
    juros_receita_federal: 772031, juros_receita_estadual: 94391, juros_receita_municipal: 8980,
    remuneracao_federal: 320344, remuneracao_estadual: 432232, remuneracao_municipal: 421103,
    uso_bens_federal: 71222, uso_bens_estadual: 180363, uso_bens_municipal: 294048,
    consumo_capital_fixo_federal: 43183, consumo_capital_fixo_estadual: 57060, consumo_capital_fixo_municipal: 55901,
    juros_despesa_federal: 772031, juros_despesa_estadual: 94391, juros_despesa_municipal: 8980,
    subsidios_federal: 17670, subsidios_estadual: 2057, subsidios_municipal: 7413,
    beneficios_federal: 1376092, beneficios_estadual: 237341, beneficios_municipal: 76109,
    fbcf_federal: 23722, fbcf_estadual: 92016, fbcf_municipal: 82538,
    investimento_liquido_federal: -23093, investimento_liquido_estadual: 35229, investimento_liquido_municipal: 27795,
    producao: 1836321.22,
    consumo_intermediario: 504971.66,
    vab_pib: 1331349.57,
    excedente_operacional: 156144.0,
    renda_disponivel: 1669129.62,
    despesa_consumo_final: 1862440.18,
    poupanca_bruta: 0,
    nec_financiamento: -383411.0,
  },
  2023: {
    year: 2023,
    receita_total: 4114353.21,
    receita_federal: 2778175.23,
    receita_estadual: 1359638.39,
    receita_municipal: 1132890.96,
    impostos_total: 2590111.18,
    contrib_sociais: 811360.87,
    juros_receita: 283575.92,
    despesa_total: 4912999.12,
    despesa_federal: 3549047.11,
    despesa_estadual: 1443028.10,
    despesa_municipal: 1077275.28,
    consumo_capital_fixo: 166781.0,
    juros_despesa: 890366.13,
    subsidios: 29221.83,
    rob: -631864.91,
    rol: -798645.91,
    investimento_liquido: 45352.94,
    fbcf: 214461.26,
    remuneracao_empregados: 1181208.30,
    salarios_vencimentos: 991102.95,
    uso_bens_servicos: 609123.78,
    beneficios_sociais: 502648.23,
    beneficios_seguridade: 975032.74,
    beneficios_assistencia: 277353.89,
    outras_despesas: 0,
    // Per-sphere data (IBGE CIG)
    impostos_federal: 1536649, impostos_estadual: 829515, impostos_municipal: 223947,
    contrib_sociais_federal: 644263, contrib_sociais_estadual: 107663, contrib_sociais_municipal: 59435,
    juros_receita_federal: 307226, juros_receita_estadual: 22382, juros_receita_municipal: 45408,
    remuneracao_federal: 233373, remuneracao_estadual: 469504, remuneracao_municipal: 478332,
    uso_bens_federal: 85488, uso_bens_estadual: 189419, uso_bens_municipal: 334217,
    consumo_capital_fixo_federal: 45390, consumo_capital_fixo_estadual: 60130, consumo_capital_fixo_municipal: 61261,
    juros_despesa_federal: 856764, juros_despesa_estadual: 116138, juros_despesa_municipal: 8905,
    subsidios_federal: 17282, subsidios_estadual: 3156, subsidios_municipal: 8784,
    beneficios_federal: 1401899, beneficios_estadual: 267581, beneficios_municipal: 85555,
    fbcf_federal: 30143, fbcf_estadual: 78082, fbcf_municipal: 106236,
    investimento_liquido_federal: -19207, investimento_liquido_estadual: 18169, investimento_liquido_municipal: 46391,
    producao: 2074228.47,
    consumo_intermediario: 600282.62,
    vab_pib: 1473945.85,
    excedente_operacional: 166781.0,
    renda_disponivel: 1447377.49,
    despesa_consumo_final: 2094319.95,
    poupanca_bruta: 0,
    nec_financiamento: -840930.57,
  },
};

export const years = [2018, 2019, 2020, 2021, 2022, 2023];

// ─── Government Central (GC) Monthly Data 2024-2025 ─────────────────────────
// Source: STN - Resultado Fiscal do Governo Central
// Note: This is GOVERNMENT CENTRAL (Federal only), not Government General
export interface GCYearlyData {
  year: number;
  receita_liquida: number;  // R$ Milhões
  despesa_total: number;    // R$ Milhões
  resultado_primario: number;
  resultado_nominal: number;
  juros_nominais: number;
  investimento: number;     // Despesas de Custeio e Investimento
  months_available: number;
}

export const gcData: Record<number, GCYearlyData> = {
  2024: {
    year: 2024,
    receita_liquida: 2161787.60,
    despesa_total: 2204711.29,
    resultado_primario: -42923.69,
    resultado_nominal: -900570.68,
    juros_nominais: -855206.35,
    investimento: 147478.64,
    months_available: 12,
  },
  2025: {
    year: 2025,
    receita_liquida: 2332555.30,
    despesa_total: 2394249.61,
    resultado_primario: -61694.31,
    resultado_nominal: -950566.99,
    juros_nominais: -891879.89,
    investimento: 151571.56,
    months_available: 12,
  },
  2026: {
    year: 2026,
    receita_liquida: 0,
    despesa_total: 0,
    resultado_primario: -17046.68,
    resultado_nominal: -261236.74,
    juros_nominais: -244191.20,
    investimento: 0,
    months_available: 3,
  },
};

export interface GCMonthlyData {
  month: number;
  receita_liquida: number;
  despesa_total: number;
  resultado_primario: number;
  juros_nominais: number;
}

export const gcMonthlyData: Record<number, GCMonthlyData[]> = {
  2024: [
    { month: 1, receita_liquida: 237872.09, despesa_total: 158409.60, resultado_primario: 79462.48, juros_nominais: -71632.57 },
    { month: 2, receita_liquida: 132713.36, despesa_total: 190980.45, resultado_primario: -58267.09, juros_nominais: -56929.12 },
    { month: 3, receita_liquida: 164361.85, despesa_total: 165386.25, resultado_primario: -1024.40, juros_nominais: -55230.13 },
    { month: 4, receita_liquida: 191780.99, despesa_total: 180196.15, resultado_primario: 11584.84, juros_nominais: -68980.51 },
    { month: 5, receita_liquida: 165068.74, despesa_total: 225476.78, resultado_primario: -60408.04, juros_nominais: -66535.74 },
    { month: 6, receita_liquida: 160597.18, despesa_total: 199317.76, resultado_primario: -38720.59, juros_nominais: -86383.28 },
    { month: 7, receita_liquida: 183956.05, despesa_total: 192823.68, resultado_primario: -8867.63, juros_nominais: -72751.05 },
    { month: 8, receita_liquida: 149179.37, despesa_total: 171341.32, resultado_primario: -22161.96, juros_nominais: -62052.35 },
    { month: 9, receita_liquida: 162854.32, despesa_total: 168024.65, resultado_primario: -5170.33, juros_nominais: -38364.07 },
    { month: 10, receita_liquida: 209423.56, despesa_total: 168377.84, resultado_primario: 41045.72, juros_nominais: -104198.46 },
    { month: 11, receita_liquida: 167798.25, despesa_total: 172301.16, resultado_primario: -4502.91, juros_nominais: -84693.97 },
    { month: 12, receita_liquida: 236181.85, despesa_total: 212075.64, resultado_primario: 24106.20, juros_nominais: -87455.09 },
  ],
  2025: [
    { month: 1, receita_liquida: 258004.04, despesa_total: 172940.01, resultado_primario: 85064.04, juros_nominais: -33531.17 },
    { month: 2, receita_liquida: 143860.19, despesa_total: 175458.34, resultado_primario: -31598.14, juros_nominais: -70092.83 },
    { month: 3, receita_liquida: 175163.72, despesa_total: 173636.45, resultado_primario: 1527.27, juros_nominais: -66704.51 },
    { month: 4, receita_liquida: 213144.05, despesa_total: 194948.83, resultado_primario: 18195.22, juros_nominais: -60193.41 },
    { month: 5, receita_liquida: 179137.12, despesa_total: 219385.98, resultado_primario: -40248.86, juros_nominais: -83687.66 },
    { month: 6, receita_liquida: 169135.79, despesa_total: 213352.23, resultado_primario: -44216.44, juros_nominais: -51963.05 },
    { month: 7, receita_liquida: 201244.67, despesa_total: 260315.08, resultado_primario: -59070.42, juros_nominais: -99320.00 },
    { month: 8, receita_liquida: 174216.25, despesa_total: 189756.45, resultado_primario: -15540.20, juros_nominais: -64792.39 },
    { month: 9, receita_liquida: 172486.99, despesa_total: 186866.19, resultado_primario: -14379.20, juros_nominais: -73664.57 },
    { month: 10, receita_liquida: 229081.38, despesa_total: 192465.58, resultado_primario: 36615.80, juros_nominais: -103964.66 },
    { month: 11, receita_liquida: 166953.46, despesa_total: 187101.10, resultado_primario: -20147.64, juros_nominais: -76113.27 },
    { month: 12, receita_liquida: 250127.64, despesa_total: 228023.37, resultado_primario: 22104.27, juros_nominais: -107852.37 },
  ],
  2026: [
    { month: 1, receita_liquida: 0, despesa_total: 0, resultado_primario: 87274.32, juros_nominais: -53774.37 },
    { month: 2, receita_liquida: 0, despesa_total: 0, resultado_primario: -29506.63, juros_nominais: -78236.69 },
    { month: 3, receita_liquida: 0, despesa_total: 0, resultado_primario: -74813.37, juros_nominais: -112180.05 },
  ],
};

// ─── DBGG - Dívida Bruta do Governo Geral (% PIB) ───────────────────────────
// Source: BCB SGS 13762
export const dbggData: Record<number, number> = {
  2006: 55.48, 2007: 56.72, 2008: 55.98, 2009: 59.21, 2010: 51.77,
  2011: 51.27, 2012: 53.67, 2013: 51.54, 2014: 56.28, 2015: 65.50,
  2016: 69.84, 2017: 73.72, 2018: 75.27, 2019: 74.44, 2020: 86.94,
  2021: 77.31, 2022: 71.68, 2023: 73.83, 2024: 76.27, 2025: 78.64,
};

// ─── Data Freshness ──────────────────────────────────────────────────────────
export const dataFreshness = {
  lastUpdate: 'Mar/2026',
  govGeralCoverage: '2018–2023',
  govCentralCoverage: '2018–2026',
  dbggCoverage: '2006–2025',
  note: 'Dados de 2024-2025 referem-se ao Governo Central (Federal). Dados de 2026 (Jan-Mar) preliminares. Dados do Governo Geral (incluindo estados e municípios) disponíveis até 2023.',
};

// ─── Population Data (IBGE estimates) ────────────────────────────────────────
export const populationDataFull: Record<number, number> = {
  2018: 209_469_333,
  2019: 210_147_125,
  2020: 211_040_000,
  2021: 213_300_000,
  2022: 214_300_000,
  2023: 216_400_000,
  2024: 218_700_000,
  2025: 221_000_000,
};

// Helper functions
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toFixed(1)} tri`;
    }
    if (Math.abs(value) >= 1_000) {
      return `R$ ${(value / 1_000).toFixed(1)} bi`;
    }
    return `R$ ${value.toFixed(0)} mi`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value * 1_000_000); // Convert from millions to actual
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}T`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}B`;
  }
  return `${value.toFixed(0)}M`;
}

export function getVariation(year1: number, year2: number): number {
  if (year1 === 0) return 0;
  return ((year2 - year1) / Math.abs(year1)) * 100;
}

// Composite Indices
export function calculateIndices(data: YearlyData) {
  const totalRec = data.receita_total || 1;
  const totalDesp = data.despesa_total || 1;

  // Índice de Desenvolvimento Fiscal (0-100)
  // Based on: revenue diversification, investment capacity, fiscal balance
  const revenueDiversification = Math.min(100, (data.impostos_total / totalRec) * 120);
  const investmentCapacity = Math.min(100, Math.max(0, (data.fbcf / totalDesp) * 500));
  const fiscalBalance = Math.min(100, Math.max(0, 50 + (data.rol / totalDesp) * 100));
  const indiceDesenvolvimento = (revenueDiversification * 0.35 + investmentCapacity * 0.3 + fiscalBalance * 0.35);

  // Índice de Risco Econômico (0-100, higher = more risk)
  // Recalibrated: each sub-indicator normalized against realistic benchmarks
  // deficitRatio: 0–0.30 range → 0–100; debtServiceRatio: 0–0.30 → 0–100; volatility: 0–0.30 → 0–100
  const deficitRatio = Math.abs(data.rol) / totalDesp;
  const debtServiceRatio = data.juros_despesa / totalDesp;
  const revenueVolatility = Math.abs(data.receita_total - data.despesa_total) / totalDesp;
  const deficitScore = Math.min(100, (deficitRatio / 0.30) * 100);
  const debtServiceScore = Math.min(100, (debtServiceRatio / 0.30) * 100);
  const volatilityScore = Math.min(100, (revenueVolatility / 0.30) * 100);
  const indiceRisco = deficitScore * 0.35 + debtServiceScore * 0.40 + volatilityScore * 0.25;

  // Índice de Estabilidade (0-100, higher = more stable)
  const expenditureControl = Math.min(100, Math.max(0, 100 - (data.despesa_total / data.receita_total - 1) * 200));
  const revenueStability = Math.min(100, (data.contrib_sociais / totalRec) * 200);
  const indiceEstabilidade = (expenditureControl * 0.5 + revenueStability * 0.5);

  // Índice de Atratividade para Investimento (0-100)
  const marketSize = Math.min(100, (data.vab_pib / 1_500_000) * 100);
  const infrastructure = Math.min(100, (data.fbcf / 200_000) * 100);
  const socialInvestment = Math.min(100, (data.beneficios_sociais / totalDesp) * 300);
  const indiceAtratividade = (marketSize * 0.3 + infrastructure * 0.3 + socialInvestment * 0.15 + (100 - indiceRisco) * 0.25);

  return {
    indiceDesenvolvimento: Math.round(indiceDesenvolvimento * 10) / 10,
    indiceRisco: Math.round(indiceRisco * 10) / 10,
    indiceEstabilidade: Math.round(indiceEstabilidade * 10) / 10,
    indiceAtratividade: Math.round(indiceAtratividade * 10) / 10,
  };
}

// Quiz Questions
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'facil' | 'medio' | 'dificil';
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Em qual ano a receita total do Governo Geral foi mais alta no período analisado?',
    options: ['2018', '2020', '2022', '2023'],
    correctIndex: 2,
    explanation: 'Em 2022, a receita total atingiu R$ 4,25 trilhões, o maior valor do período, impulsionado pela alta da arrecadação de impostos e contribuições sociais.',
    difficulty: 'facil',
  },
  {
    id: 2,
    question: 'O que aconteceu com a receita total em 2020 comparada a 2019?',
    options: ['Aumentou 15%', 'Manteve-se estável', 'Caiu aproximadamente 6%', 'Caiu 20%'],
    correctIndex: 2,
    explanation: 'A receita caiu de R$ 3,09 tri (2019) para R$ 2,90 tri (2020), uma redução de ~6,2%, reflexo do impacto da pandemia de COVID-19 na economia.',
    difficulty: 'facil',
  },
  {
    id: 3,
    question: 'Qual é a principal fonte de receita do Governo Geral brasileiro?',
    options: ['Contribuições sociais', 'Juros', 'Impostos', 'Transferências'],
    correctIndex: 2,
    explanation: 'Os impostos representam consistentemente mais de 58% da receita total, sendo a principal fonte de recursos do governo.',
    difficulty: 'facil',
  },
  {
    id: 4,
    question: 'Em qual ano o Resultado Operacional Líquido (ROL) foi mais negativo?',
    options: ['2018', '2020', '2022', '2023'],
    correctIndex: 3,
    explanation: 'Em 2023, o ROL atingiu -R$ 798,6 bilhões, o pior resultado do período, indicando que as despesas superaram as receitas em montante recorde.',
    difficulty: 'medio',
  },
  {
    id: 5,
    question: 'Qual esfera de governo concentra a maior parcela da despesa total?',
    options: ['Estadual', 'Municipal', 'Federal', 'São equivalentes'],
    correctIndex: 2,
    explanation: 'O Governo Central (Federal) concentra cerca de 70-75% da despesa total, incluindo gastos com previdência, juros da dívida e benefícios sociais.',
    difficulty: 'medio',
  },
  {
    id: 6,
    question: 'Como evoluiu a despesa com juros entre 2019 e 2023?',
    options: ['Reduziu pela metade', 'Manteve-se estável', 'Quase dobrou', 'Triplicou'],
    correctIndex: 2,
    explanation: 'A despesa com juros passou de R$ 526 bi (2019) para R$ 890 bi (2023), um aumento de ~69%, reflexo do aumento da taxa Selic e do estoque da dívida.',
    difficulty: 'medio',
  },
  {
    id: 7,
    question: 'O que o VAB (Valor Adicionado Bruto) do CIG representa no contexto macroeconômico?',
    options: ['O PIB do setor público', 'A produção total do governo', 'O consumo intermediário', 'A arrecadação tributária'],
    correctIndex: 0,
    explanation: 'O VAB do CIG representa a contribuição do setor público para o PIB, calculado como a produção menos o consumo intermediário do governo.',
    difficulty: 'dificil',
  },
  {
    id: 8,
    question: 'Em termos percentuais, quanto os impostos sobre renda representaram do total de impostos em 2023?',
    options: ['~15%', '~36%', '~55%', '~72%'],
    correctIndex: 1,
    explanation: 'Em 2023, os impostos sobre renda (IRPJ, IRPF, CSLL etc.) somaram ~R$ 940 bi de um total de ~R$ 2,59 tri, representando cerca de 36% do total.',
    difficulty: 'dificil',
  },
  {
    id: 9,
    question: 'Qual foi o crescimento percentual do FBCF (investimento) entre 2018 e 2023?',
    options: ['~50%', '~131%', '~200%', '~30%'],
    correctIndex: 1,
    explanation: 'O FBCF passou de R$ 92,7 bi (2018) para R$ 214,5 bi (2023), um crescimento de aproximadamente 131%, indicando expansão dos investimentos públicos.',
    difficulty: 'dificil',
  },
  {
    id: 10,
    question: 'O que a Necessidade de Financiamento negativa indica sobre as contas públicas?',
    options: ['Superávit primário', 'Déficit que precisa ser financiado', 'Capacidade de pagamento', 'Equilíbrio fiscal'],
    correctIndex: 1,
    explanation: 'A Necessidade de Financiamento negativa indica que o governo precisa captar recursos (emitir dívida) para cobrir o déficit, ou seja, as despesas superaram as receitas.',
    difficulty: 'dificil',
  },
];

// Curiosities
export const curiosities = [
  {
    title: 'Impacto da Pandemia nas Contas Públicas',
    description: 'Em 2020, a pandemia de COVID-19 causou uma combinação rara: queda de receita (-6%) e explosão de despesas (+9%), resultando no pior ROL proporcional do período (-R$ 910 bilhões).',
    icon: '🏥',
  },
  {
    title: 'Juros: O Dragão Fiscal',
    description: 'A despesa com juros saltou de R$ 526 bi (2019) para R$ 890 bi (2023) — um aumento de 69% em 4 anos. Em 2023, os juros consumiram 18% de toda a despesa pública.',
    icon: '📈',
  },
  {
    title: 'Municípios Crescem Mais',
    description: 'A receita municipal cresceu 80% entre 2018 e 2023 (de R$ 629 bi para R$ 1,13 tri), percentual superior ao crescimento federal (39%) e estadual (58%).',
    icon: '🏙️',
  },
  {
    title: 'Investimento Público em Recuperação',
    description: 'Após anos de investimento líquido negativo (-R$ 16 bi em 2018, -R$ 29 bi em 2019), o Brasil voltou a investir positivamente em 2022 (+R$ 40 bi) e 2023 (+R$ 45 bi).',
    icon: '🏗️',
  },
  {
    title: 'Produção Pública Dobrou em 5 Anos',
    description: 'A produção do setor público (CIG) cresceu de R$ 1,38 tri (2018) para R$ 2,07 tri (2023) — um aumento de 50% em valores correntes.',
    icon: '🏭',
  },
  {
    title: 'Previdência: O Maior Gasto Social',
    description: 'Os benefícios de seguridade social são a maior despesa social: R$ 975 bi em 2023, superando a remuneração de todos os empregados públicos (R$ 1,18 tri) em proporção do gasto total.',
    icon: '👴',
  },
  {
    title: 'Transferências entre Entes',
    description: 'As transferências entre administrações públicas somaram R$ 803 bi em 2023 (do governo central para estados e municípios), mostrando a forte interdependência federativa brasileira.',
    icon: '🔄',
  },
  {
    title: '2022: O Ano de Recuperação Fiscal',
    description: 'Após o choque de 2020, 2022 trouxe a maior receita do período (R$ 4,25 tri) e o menor déficit operacional (ROL de -R$ 341 bi), apontando recuperação fiscal breve.',
    icon: '🌟',
  },
];

// Benchmark comparison data - EXPANDED (Feature 7)
// Sources: FMI WEO, OCDE, World Bank
export const benchmarkData = {
  countries: ['Brasil', 'Argentina', 'México', 'Chile', 'Colômbia', 'EUA', 'Alemanha', 'Japão', 'França'],
  taxBurden: [33.1, 28.5, 16.3, 21.1, 19.7, 27.1, 38.2, 31.4, 45.4], // % do PIB
  publicDebt: [78.6, 92.3, 50.2, 32.1, 55.8, 123.3, 64.8, 254.6, 111.8], // % do PIB (DBGG for Brazil)
  primaryBalance: [-0.3, -3.1, -0.5, 0.8, -1.8, -3.7, -1.3, -2.4, -4.0], // % do PIB
  gdpGrowth: [2.9, -1.6, 3.2, 0.2, 1.4, 2.5, 0.1, 1.9, 0.7], // %
  investmentGrade: ['BB-', 'CCC+', 'BBB', 'A-', 'BB+', 'AA+', 'AAA', 'A+', 'AA'],
  // New indicators for Feature 7
  interestOnExpense: [18.1, 12.5, 8.2, 4.1, 9.8, 7.3, 3.2, 5.1, 4.8], // Juros/Despesa %
  publicInvestmentGDP: [2.1, 1.5, 2.8, 2.9, 3.1, 3.4, 2.5, 3.8, 3.2], // Investimento Público/PIB %
};

// ─── Timeline Events (Feature 4) ────────────────────────────────────────────
export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  impact: string;
  icon: string;
  color: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: 2018,
    title: 'Greve dos Caminhoneiros + Debate Previdenciário',
    description: 'A greve dos caminhoneiros paralisou o país por 11 dias, causando perdas estimadas em R$ 1,5 bilhão/dia. O debate sobre a Reforma da Previdência dominou o cenário político.',
    impact: 'Queda de receita e aumento de subsídios. A insegurança jurídica reduziu investimentos.',
    icon: '🚛',
    color: '#E74C3C',
  },
  {
    year: 2019,
    title: 'Aprovação da Reforma da Previdência (EC 103)',
    description: 'A Emenda Constitucional 103/2019 estabeleceu regras mais rígidas para aposentadorias, elevando idade mínima e tempo de contribuição. Projeção de economia de R$ 800 bi em 10 anos.',
    impact: 'Projeção de economia de longo prazo, mas impacto gradual. Resultado primário melhorou em 2019.',
    icon: '📋',
    color: '#009C3B',
  },
  {
    year: 2020,
    title: 'Pandemia COVID-19',
    description: 'A pandemia gerou a maior crise sanitária e econômica em décadas. O governo implementou auxílio emergencial de R$ 600/mês para 67 milhões de brasileiros. PIB caiu 3,3%.',
    impact: 'ROL de -R$ 910 bi, o pior resultado do período. Receita caiu 6% enquanto despesas explodiram 9%.',
    icon: '🏥',
    color: '#E74C3C',
  },
  {
    year: 2021,
    title: 'Recuperação pós-pandemia + Pressão Inflacionária',
    description: 'A economia voltou a crescer (PIB +5%), mas a inflação acelerou para 10,06%. O Banco Central iniciou ciclo de alta da Selic que levaria a taxa a 13,75%.',
    impact: 'Receita sobe 26% com inflação, mas juros começam a escalar, pressionando o resultado nominal.',
    icon: '📈',
    color: '#FFDF00',
  },
  {
    year: 2022,
    title: 'Eleições + PEC dos Benefícios',
    description: 'Ano eleitoral marcado pela aprovação da PEC dos Benefícios (EC 126), que ampliou o Auxílio Brasil para R$ 600. Maior arrecadação da história: R$ 4,25 tri.',
    impact: 'Maior receita do período (R$ 4,25 tri) e menor déficit operacional (ROL de -R$ 341 bi), apontando recuperação fiscal.',
    icon: '🗳️',
    color: '#002776',
  },
  {
    year: 2023,
    title: 'Arcabouço Fiscal (LC 200/2023) + Juros em Alta',
    description: 'Novo arcabouço fiscal substituiu o teto de gastos. A Selic permaneceu em 13,75% até agosto, quando iniciou queda. Juros da dívida atingiram R$ 890 bi.',
    impact: 'ROL piora para -R$ 799 bi apesar da receita crescer. Juros consumiram 18% da despesa total.',
    icon: '⚖️',
    color: '#D4A017',
  },
  {
    year: 2024,
    title: 'Primário Negativo e Dívida em Alta',
    description: 'Resultado primário do GC foi -R$ 42,9 bi, rompendo a meta de superávit do arcabouço. DBGG subiu para 76,3% do PIB. Início do ciclo de queda da Selic.',
    impact: 'Dívida bruta volta a subir. Governo central falha na meta de resultado primário.',
    icon: '📉',
    color: '#E74C3C',
  },
  {
    year: 2025,
    title: 'Juros Elevados e Pressão Fiscal',
    description: 'Juros nominais do GC somaram R$ 892 bi. Resultado nominal de -R$ 951 bi. DBGG atingiu 78,6% do PIB, nível mais alto desde 2020.',
    impact: 'Crescimento da dívida acelera. Custo fiscal dos juros consome crescente parcela do orçamento.',
    icon: '🔥',
    color: '#E74C3C',
  },
  {
    year: 2026,
    title: 'Juros em Alta e Déficit Primário no 1º Trimestre',
    description: 'No 1º trimestre de 2026, o resultado primário do GC foi -R$ 17 bi (Jan: +R$ 87 bi, Fev: -R$ 30 bi, Mar: -R$ 75 bi). Juros nominais somaram R$ 244 bi no trimestre.',
    impact: 'Déficit primário no início do ano pressiona metas do arcabouço fiscal. Custo dos juros continua como principal desafio.',
    icon: '📉',
    color: '#E74C3C',
  },
];

// ─── Fiscal Simulator Parameters (Feature 3) ────────────────────────────────
export interface SimulatorParam {
  key: string;
  label: string;
  value2023: number;  // R$ Milhões
  min: number;       // % adjustment
  max: number;       // % adjustment
  step: number;
  color: string;
}

export const simulatorParams: SimulatorParam[] = [
  { key: 'juros', label: 'Juros da Dívida', value2023: 890366.13, min: -50, max: 50, step: 1, color: '#E74C3C' },
  { key: 'fbcf', label: 'Investimento (FBCF)', value2023: 214461.26, min: -30, max: 100, step: 1, color: '#009C3B' },
  { key: 'receita', label: 'Receita Total', value2023: 4114353.21, min: -20, max: 30, step: 1, color: '#002776' },
  { key: 'beneficios', label: 'Benefícios Previdenciários', value2023: 975032.74, min: -20, max: 30, step: 1, color: '#D4A017' },
  { key: 'remuneracao', label: 'Remuneração de Servidores', value2023: 1181208.30, min: -20, max: 20, step: 1, color: '#8B5CF6' },
];

// ─── Tax Calculator Tables (Feature 6) ───────────────────────────────────────
export const irrfTable2024 = [
  { min: 0, max: 2259.20, rate: 0, deduction: 0 },
  { min: 2259.21, max: 2826.65, rate: 7.5, deduction: 169.44 },
  { min: 2826.66, max: 3751.05, rate: 15, deduction: 381.44 },
  { min: 3751.06, max: 4664.68, rate: 22.5, deduction: 662.77 },
  { min: 4664.69, max: Infinity, rate: 27.5, deduction: 896.00 },
];

export const inssTable2024 = [
  { min: 0, max: 1412.00, rate: 7.5 },
  { min: 1412.01, max: 2666.68, rate: 9 },
  { min: 2666.69, max: 4000.03, rate: 12 },
  { min: 4000.04, max: 7786.02, rate: 14 },
];

export const inssMaxContribution = 908.85; // teto 2024
export const icmsAverageRate = 18; // average ICMS rate across states
export const estimatedConsumptionRate = 0.70; // % of disposable income spent on consumption

// ─── Arcabouço Fiscal Targets (LC 200/2023) ─────────────────────────────────
export const fiscalFrameworkTargets = {
  2024: { primaryResultMin: -0.25, primaryResultMax: 0.25 }, // % PIB
  2025: { primaryResultMin: 0.0, primaryResultMax: 0.5 },
  2026: { primaryResultMin: 0.25, primaryResultMax: 0.75 },
  2027: { primaryResultMin: 0.5, primaryResultMax: 1.0 },
  description: 'Meta de resultado primário conforme LC 200/2023 (Arcabouço Fiscal)',
};

// ─── Presentation Mode Slides (Feature 2) ────────────────────────────────────
export interface SlideDef {
  id: string;
  title: string;
  subtitle?: string;
  section: string;
}

export const presentationSlides: SlideDef[] = [
  { id: 'kpis', title: 'KPIs Principais', subtitle: 'Receita, Despesa, Déficit, Juros', section: 'kpi' },
  { id: 'receita-despesa', title: 'Receita vs Despesa', subtitle: 'Evolução temporal 2018-2023', section: 'charts' },
  { id: 'composicao', title: 'Composição da Despesa 2023', subtitle: 'Pizza/donut por categoria', section: 'charts' },
  { id: 'juros', title: 'Juros da Dívida ao Longo do Tempo', subtitle: 'O dragão fiscal', section: 'charts' },
  { id: 'investimento', title: 'Evolução do Investimento (FBCF)', subtitle: 'Consumo vs investimento', section: 'charts' },
  { id: 'comparacao', title: 'Comparação Internacional', subtitle: 'Brasil vs mundo', section: 'charts' },
  { id: 'indices', title: 'Índices Compostos', subtitle: 'Score fiscal', section: 'indices' },
  { id: 'timeline', title: 'Linha do Tempo Narrativa', subtitle: 'A história das contas públicas', section: 'timeline' },
];

// ─── Population Data (IBGE estimates) ──────────────────────────────────────
export const populationData: Record<number, number> = {
  2018: 209_469_333,
  2019: 210_147_125,
  2020: 211_040_000,
  2021: 213_300_000,
  2022: 214_300_000,
  2023: 216_400_000,
  2024: 218_700_000,
  2025: 221_000_000,
};

// ─── Per Capita Calculation ────────────────────────────────────────────────
export function toPerCapita(valueInMillions: number, year: number): number {
  const pop = populationData[year] || 214_300_000;
  return (valueInMillions * 1_000_000) / pop; // R$ per person
}

export function formatPerCapita(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)} mil`;
  }
  return `R$ ${value.toFixed(0)}`;
}

// ─── Sphere Color System ───────────────────────────────────────────────────
export const sphereColors = {
  federal: { primary: '#002776', light: '#1e3a6d', bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a5f' },
  estadual: { primary: '#009C3B', light: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', text: '#166534' },
  municipal: { primary: '#D4A017', light: '#ca8a04', bg: '#fefce8', border: '#fef08a', text: '#854d0e' },
  total: { primary: '#6b7280', light: '#9ca3af', bg: '#f3f4f6', border: '#e5e7eb', text: '#374151' },
} as const;

export type SphereKey = keyof typeof sphereColors;

// ─── Navigation Links ──────────────────────────────────────────────────────
export interface NavLink {
  href: string;
  label: string;
  icon: string; // lucide icon name
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/receitas', label: 'Receitas', icon: 'DollarSign' },
  { href: '/despesas', label: 'Despesas', icon: 'CreditCard' },
  { href: '/investimentos', label: 'Investimentos', icon: 'TrendingUp' },
  { href: '/municipios', label: 'Municípios', icon: 'MapPin' },
  { href: '/simulador', label: 'Simulador', icon: 'Calculator' },
  { href: '/calculadora', label: 'Calculadora', icon: 'Wallet' },
  { href: '/glossario', label: 'Glossário', icon: 'BookOpen' },
];

// ─── Glossary Terms ────────────────────────────────────────────────────────
export interface GlossaryTerm {
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  formula?: string;
  example?: string;
  category: 'receita' | 'despesa' | 'investimento' | 'indicador' | 'cig';
  ibgeReference?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Valor Adicionado Bruto (VAB)',
    shortDefinition: 'A contribuição do setor público para o PIB nacional.',
    fullDefinition: 'O Valor Adicionado Bruto (VAB) é a diferença entre o valor da produção (bens e serviços produzidos) e o consumo intermediário (bens e serviços consumidos no processo produtivo). No contexto das Contas Integradas de Governo (CIG), representa a contribuição do setor público para o Produto Interno Bruto (PIB) do país.',
    formula: 'VAB = Produção − Consumo Intermediário',
    example: 'Em 2023, o VAB do setor público foi de R$ 1,47 tri, resultante de uma produção de R$ 2,07 tri menos um consumo intermediário de R$ 600 bi.',
    category: 'cig',
    ibgeReference: 'Sistema de Contas Nacionais do Brasil — Tabela de Recursos e Usos (TRU)',
  },
  {
    term: 'Consumo Intermediário',
    shortDefinition: 'Bens e serviços consumidos na produção do setor público.',
    fullDefinition: 'O Consumo Intermediário compreende os bens e serviços utilizados como insumos no processo produtivo do governo. Inclui materiais de escritório, energia elétrica, serviços de TI, manutenção de equipamentos, entre outros. É deduzido da produção para calcular o VAB, pois não representa valor novo agregado.',
    example: 'Em 2023, o consumo intermediário do Governo Geral foi de R$ 600 bi, representando 29% da produção total do setor público.',
    category: 'cig',
    ibgeReference: 'IBGE — Contas Nacionais Integradas de Governo (CIG)',
  },
  {
    term: 'Formação Bruta de Capital Fixo (FBCF)',
    shortDefinition: 'O investimento público em ativos fixos (infraestrutura, equipamentos).',
    fullDefinition: 'A FBCF mede os gastos do governo com aquisição de ativos fixos novos — como construção de estradas, hospitais, escolas, compra de equipamentos e máquinas — deduzidos das vendas de ativos fixos de segunda mão. É o indicador principal do esforço de investimento do setor público e difere do "investimento líquido" porque não desconta a depreciação (consumo de capital fixo).',
    formula: 'FBCF = Aquisição de ativos fixos novos − Vendas de ativos fixos usados',
    example: 'Em 2023, a FBCF atingiu R$ 214,5 bi, o maior valor do período, mas representando apenas 4,4% da despesa total — bem abaixo do recomendado para países em desenvolvimento.',
    category: 'investimento',
    ibgeReference: 'IBGE — CIG, Demonstrativos Fiscais do Governo Geral',
  },
  {
    term: 'Resultado Operacional Líquido (ROL)',
    shortDefinition: 'O saldo entre receitas e despesas do governo após juros e depreciação.',
    fullDefinition: 'O Resultado Operacional Líquido (ROL) é a diferença entre a receita total e a despesa total do governo, incluindo despesas com juros e consumo de capital fixo (depreciação). Um ROL negativo indica déficit operacional — ou seja, o governo gasta mais do que arrecada, necessitando financiar a diferença com endividamento.',
    formula: 'ROL = Receita Total − Despesa Total (incluindo juros e depreciação)',
    example: 'Em 2023, o ROL foi de -R$ 798,6 bi, o pior resultado do período, indicando que o governo precisou financiar esse montante através de emissão de dívida.',
    category: 'indicador',
    ibgeReference: 'IBGE — Demonstrativos Fiscais do Governo Geral',
  },
  {
    term: 'Resultado Operacional Bruto (ROB)',
    shortDefinition: 'O saldo entre receitas e despesas antes da depreciação.',
    fullDefinition: 'O Resultado Operacional Bruto (ROB) é similar ao ROL, mas não desconta o consumo de capital fixo (depreciação). É calculado como a receita total menos a despesa total (excluindo o consumo de capital fixo). O ROB fornece uma visão do equilíbrio fiscal sem considerar o desgaste dos ativos públicos.',
    formula: 'ROB = Receita Total − Despesa Total (sem consumo de capital fixo)',
    example: 'Em 2023, o ROB foi de -R$ 631,9 bi, menos negativo que o ROL (-R$ 798,6 bi) porque não inclui a depreciação de R$ 166,8 bi.',
    category: 'indicador',
    ibgeReference: 'IBGE — Demonstrativos Fiscais do Governo Geral',
  },
  {
    term: 'Consumo de Capital Fixo',
    shortDefinition: 'A depreciação dos ativos fixos do setor público ao longo do tempo.',
    fullDefinition: 'O Consumo de Capital Fixo representa a diminuição do valor dos ativos fixos do governo devido ao desgaste físico, obsolescência ou danos acidentais durante o período contábil. É equivalente à depreciação na contabilidade empresarial. No governo, inclui a depreciação de infraestrutura, edifícios, equipamentos e outros bens de capital.',
    example: 'Em 2023, o consumo de capital fixo foi de R$ 166,8 bi, representando a perda de valor dos ativos públicos no período.',
    category: 'cig',
    ibgeReference: 'IBGE — Sistema de Contas Nacionais',
  },
  {
    term: 'Necessidade de Financiamento',
    shortDefinition: 'O montante que o governo precisa captar para cobrir seu déficit.',
    fullDefinition: 'A Necessidade de Financiamento indica o volume de recursos que o setor público precisa obter junto ao mercado financeiro (emissão de títulos, empréstimos) para cobrir a diferença entre despesas e receitas. Um valor negativo indica necessidade de captação (déficit), enquanto positivo indicaria capacidade de pagamento (superávit).',
    formula: 'Nec. Financiamento = Poupança Bruta − FBCF',
    example: 'Em 2023, a necessidade de financiamento foi de -R$ 840,9 bi, indicando que o governo precisou captar esse montante no mercado para fechar suas contas.',
    category: 'indicador',
    ibgeReference: 'IBGE — Demonstrativos Fiscais do Governo Geral',
  },
  {
    term: 'Carga Tributária',
    shortDefinition: 'A relação entre a arrecadação de impostos e o tamanho da economia (PIB).',
    fullDefinition: 'A Carga Tributária é o indicador que mede a parcela do Produto Interno Bruto (PIB) que é apropriada pelo governo através de tributos (impostos, taxas e contribuições). No Brasil, historicamente fica entre 32-34% do PIB, sendo uma das mais altas entre países em desenvolvimento. É calculada dividindo a arrecadação tributária total pelo PIB nominal.',
    formula: 'Carga Tributária = (Impostos + Contribuições Sociais) / PIB × 100',
    example: 'Em 2023, a carga tributária foi de aproximadamente 33% do PIB, com impostos somando R$ 2,59 tri e contribuições sociais R$ 811 bi.',
    category: 'receita',
    ibgeReference: 'IBGE — Contas Nacionais, Receitas do Governo Geral',
  },
  {
    term: 'Despesa de Consumo Final',
    shortDefinition: 'O gasto do governo com bens e serviços consumidos diretamente pela sociedade.',
    fullDefinition: 'A Despesa de Consumo Final do governo inclui os gastos com bens e serviços que são consumidos diretamente pela sociedade — como saúde pública, educação, segurança, defesa e administração pública. É composta pela remuneração dos empregados públicos, consumo intermediário e consumo de capital fixo (depreciação).',
    formula: 'Despesa Consumo Final = Remuneração Empregados + Consumo Intermediário + Consumo Capital Fixo',
    example: 'Em 2023, a despesa de consumo final do governo foi de R$ 2,09 tri, englobando salários de servidores, insumos operacionais e depreciação de ativos.',
    category: 'despesa',
    ibgeReference: 'IBGE — Contas Integradas de Governo (CIG)',
  },
  {
    term: 'Excedente Operacional',
    shortDefinition: 'O excedente gerado pelas operações do setor público após deduzir custos.',
    fullDefinition: 'O Excedente Operacional é o saldo remanescente após deduzir da produção os custos de consumo intermediário e a remuneração dos empregados. No setor público, corresponde ao Consumo de Capital Fixo (depreciação), pois o governo não gera lucro. Na contabilidade nacional, é um componente do VAB.',
    example: 'Em 2023, o excedente operacional foi de R$ 166,8 bi, equivalente ao consumo de capital fixo do período.',
    category: 'cig',
    ibgeReference: 'IBGE — Sistema de Contas Nacionais',
  },
  {
    term: 'Renda Disponível',
    shortDefinition: 'A renda que o setor público tem disponível após transferências correntes.',
    fullDefinition: 'A Renda Disponível do governo é o montante de recursos que o setor público efetivamente dispõe após receber transferências correntes e pagar transferências a outros setores. É calculada a partir do VAB, adicionando receitas de propriedade e transferências recebidas, e deduzindo transferências pagas e impostos sobre a renda.',
    example: 'Em 2023, a renda disponível do governo foi de R$ 1,45 tri, montante utilizado para financiar a despesa de consumo final e investimentos.',
    category: 'cig',
    ibgeReference: 'IBGE — Contas Integradas de Governo (CIG)',
  },
  {
    term: 'Investimento Líquido',
    shortDefinition: 'O investimento real após descontar a depreciação dos ativos existentes.',
    fullDefinition: 'O Investimento Líquido é a diferença entre a Formação Bruta de Capital Fixo (FBCF) e o Consumo de Capital Fixo (depreciação). Representa o acréscimo real ao estoque de capital do setor público. Valores negativos indicam que o país está "desinvestindo" — a depreciação supera os novos investimentos.',
    formula: 'Investimento Líquido = FBCF − Consumo de Capital Fixo',
    example: 'Após anos negativos (-R$ 16 bi em 2018), o investimento líquido voltou ao positivo em 2022 (+R$ 40 bi) e 2023 (+R$ 45 bi), indicando que o país volta a expandir seu estoque de capital público.',
    category: 'investimento',
    ibgeReference: 'IBGE — CIG e Demonstrativos Fiscais',
  },
  {
    term: 'Benefícios de Seguridade Social',
    shortDefinition: 'Pensões, aposentadorias e auxílios pagos pelo governo.',
    fullDefinition: 'Os Benefícios de Seguridade Social compreendem as transferências pagas pelo governo a famílias e indivíduos no âmbito da previdência social (aposentadorias, pensões), assistência social (BPC, Bolsa Família) e seguridade social (auxílio-doença, auxílio-acidente). Constituem a maior despesa social do governo e são a principal pressão estrutural sobre as contas públicas.',
    example: 'Em 2023, os benefícios de seguridade social somaram R$ 975 bi, representando ~20% da despesa total do governo.',
    category: 'despesa',
    ibgeReference: 'IBGE — Demonstrativos Fiscais do Governo Geral',
  },
  {
    term: 'Subsídios',
    shortDefinition: 'Transferências do governo a produtores para reduzir custos de produção.',
    fullDefinition: 'Os Subsídios são transferências correntes que o governo paga a empresas ou produtores para reduzir os custos de produção, manter preços abaixo dos níveis de mercado ou incentivar determinadas atividades econômicas. Incluem subsídios à agricultura, energia, transporte e crédito subsidiado.',
    example: 'Em 2023, os subsídios totalizaram R$ 29,2 bi, valor relativamente baixo frente à despesa total, mas importante para setores estratégicos.',
    category: 'despesa',
    ibgeReference: 'IBGE — Demonstrativos Fiscais do Governo Geral',
  },
  {
    term: 'Remuneração de Empregados',
    shortDefinition: 'Salários, benefícios e encargos sociais dos servidores públicos.',
    fullDefinition: 'A Remuneração de Empregados inclui todos os pagamentos feitos pelo governo a seus funcionários — salários base, adicional de férias, 13º salário, aposentadorias do RPPS, e encargos sociais patronais. É uma das maiores despesas do setor público e representa o custo da força de trabalho necessária para a prestação de serviços públicos.',
    example: 'Em 2023, a remuneração de empregados totalizou R$ 1,18 tri (~24% da despesa total), sendo a segunda maior despesa após benefícios sociais.',
    category: 'despesa',
    ibgeReference: 'IBGE — CIG e Demonstrativos Fiscais',
  },
  {
    term: 'Contas Integradas de Governo (CIG)',
    shortDefinition: 'Sistema contábil do IBGE que consolida as contas do setor público.',
    fullDefinition: 'As Contas Integradas de Governo (CIG) são um sistema de contas econômicas elaborado pelo IBGE que apresenta a posição econômico-financeira do setor público brasileiro de forma integrada. Incluem a conta de produção, conta de geração de renda, conta de alocação da renda primária, conta de distribuição secundária da renda, conta de uso da renda e conta de capital. Permitem analisar a contribuição do governo para o PIB e o fluxo de renda entre os setores institucionais.',
    category: 'cig',
    ibgeReference: 'IBGE — Sistema de Contas Nacionais, Contas Integradas de Governo',
  },
];

// ─── Methodology & Sources ─────────────────────────────────────────────────
export const methodologyInfo = {
  title: 'Metodologia e Fontes de Dados',
  description: 'Os dados apresentados neste dashboard são extraídos de fontes oficiais do Governo Federal e do IBGE, seguindo a metodologia do Sistema de Contas Nacionais (SCN) e das Contas Integradas de Governo (CIG).',
  sources: [
    {
      name: 'Contas Integradas de Governo (CIG)',
      institution: 'IBGE',
      url: 'https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais.html',
      description: 'Sistema de contas que apresenta a posição econômico-financeira do setor público, incluindo produção, consumo intermediário, VAB e conta de capital.',
      periodicity: 'Anual',
      coverage: '2018-2023',
    },
    {
      name: 'Demonstrativos Fiscais do Governo Geral',
      institution: 'Secretaria do Tesouro Nacional (STN)',
      url: 'https://www.tesourotransparente.gov.br/',
      description: 'Demonstrativos consolidados das receitas e despesas do Governo Geral (União, Estados e Municípios), incluindo resultado primário, juros e investimentos.',
      periodicity: 'Anual',
      coverage: '2018-2023',
    },
    {
      name: 'Sistema de Contas Nacionais do Brasil',
      institution: 'IBGE',
      url: 'https://www.ibge.gov.br/estatisticas/economicas/contas-nacionais.html',
      description: 'Referência metodológica para os conceitos de VAB, consumo intermediário, FBCF e demais agregados macroeconômicos utilizados.',
      periodicity: 'Anual/Trimestral',
      coverage: '2000-2023',
    },
    {
      name: 'Projeções Populacionais',
      institution: 'IBGE',
      url: 'https://www.ibge.gov.br/estatisticas/sociais/populacao.html',
      description: 'Estimativas populacionais utilizadas para o cálculo de valores per capita.',
      periodicity: 'Anual',
      coverage: '2018-2023',
    },
  ],
  notes: [
    'Todos os valores estão em reais correntes (nominais) do ano de referência, não sendo ajustados pela inflação.',
    'Os dados de 2021 foram extraídos dos Demonstrativos Fiscais 2021 e da CIG 2021, publicados pelo STN/IBGE.',
    'Os valores "per capita" utilizam as estimativas populacionais do IBGE para cada ano.',
    'A esfera "Federal" inclui o Governo Central (União, INSS e autarquias federais).',
    'A esfera "Estadual" inclui os 26 estados e o Distrito Federal.',
    'A esfera "Municipal" inclui os 5.570 municípios brasileiros.',
    'Os índices compostos são construções analíticas baseadas nos dados oficiais, com metodologia descrita na seção de Índices.',
  ],
};
