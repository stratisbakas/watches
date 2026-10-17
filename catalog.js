// Catalogue local de références courantes.
// Prix en euros, indicatifs : `retail` = prix neuf constaté, `market` = cote moyenne en occasion.
// `service` = intervalle de révision conseillé (années), `water` = contrôle d'étanchéité (années).
// Mouvements : auto | manuel | quartz | spring

const c = (brand, model, ref, caliber, movement, from, to, retail, market, opts = {}) =>
  ({ brand, model, ref, caliber, movement, from, to, retail, market, ...opts });

const DIVE = { water: 1 };

// Intervalles par défaut par marque (années), quand la référence n'en précise pas.
// `service` : révision complète du mouvement mécanique · `water` : contrôle d'étanchéité.
// `official` : chiffre publié par la marque (vérifié en octobre 2026) ; sinon usage courant chez les horlogers.
// Rolex et Tudor ne publient pas de fréquence d'étanchéité : 2 ans est l'usage courant.
export const BRANDS = {
  'rolex': { service: 10, water: 2, official: { service: true, water: false } },            // ~10 ans depuis 2015
  'tudor': { service: 10, water: 2, official: { service: true, water: false } },            // calibres manufacture MT
  'omega': { service: 8, water: 1, official: { service: true, water: true } },             // 5 à 8 ans, étanchéité annuelle
  'cartier': { service: 6, water: 2, official: { service: true, water: true } },
  'patek philippe': { service: 5, water: 1, official: { service: true, water: true } },
  'audemars piguet': { service: 5, water: 1, official: { service: false, water: true } },  // contrôle annuel offert, pas d'intervalle fixe
  'iwc': { service: 5, water: 1, official: { service: false, water: true } },              // « selon l'usage »
  'grand seiko': { service: 4, water: 2, official: { service: true, water: false } },       // 3 à 4 ans
  'seiko': { service: 3, water: 2, official: { service: true, water: false } },             // 2 à 4 ans selon calibre
  'breitling': { service: 5, water: 2, official: { service: true, water: true } },         // complète tous les 4 à 6 ans
  'tag heuer': { service: 5, water: 2, official: { service: true, water: true } },
  'heuer': { service: 4, water: 1, official: { service: false, water: false } },
  'jaeger-lecoultre': { service: 5, water: 2, official: { service: false, water: true } },
  'zenith': { service: 5, water: 2, official: { service: true, water: true } },
  'panerai': { service: 5, water: 2, official: { service: false, water: true } },
  'hamilton': { service: 5, water: 1, official: { service: false, water: true } },
  'longines': { service: 5, water: 1, official: { service: false, water: true } },
  'nomos': { service: 5, water: 1, official: { service: true, water: true } },
  'sinn': { service: 5, water: 2, official: { service: false, water: false } },
  'casio': { service: 5, water: 1.5, official: { service: false, water: true } },          // joint tous les 18 mois
};
export const DEFAULTS = { service: 5, water: 2, quartz: 3, vintageService: 4, vintageWater: 1 };

export const CATALOG = [
  // Rolex
  c('Rolex', 'Submariner', '124060', '3230', 'auto', 2020, null, 9900, 10500, { service: 10, ...DIVE, nick: 'No Date' }),
  c('Rolex', 'Submariner Date', '126610LN', '3235', 'auto', 2020, null, 10900, 12500, { service: 10, ...DIVE }),
  c('Rolex', 'Submariner Date', '126610LV', '3235', 'auto', 2020, null, 11300, 14000, { service: 10, ...DIVE, nick: 'Starbucks Kermit' }),
  c('Rolex', 'Submariner', '114060', '3130', 'auto', 2012, 2020, null, 9500, { service: 10, ...DIVE }),
  c('Rolex', 'Submariner Date', '116610LN', '3135', 'auto', 2010, 2020, null, 11000, { service: 10, ...DIVE }),
  c('Rolex', 'Submariner Date', '116610LV', '3135', 'auto', 2010, 2020, null, 16500, { service: 10, ...DIVE, nick: 'Hulk' }),
  c('Rolex', 'Submariner Date', '16610', '3135', 'auto', 1988, 2010, null, 9000, { service: 10, ...DIVE }),
  c('Rolex', 'Submariner', '14060M', '3130', 'auto', 2000, 2012, null, 8500, { service: 10, ...DIVE }),
  c('Rolex', 'Submariner', '5513', '1520 / 1530', 'auto', 1962, 1989, null, 14000, { service: 5, ...DIVE }),
  c('Rolex', 'GMT-Master II', '126710BLRO', '3285', 'auto', 2018, null, 11600, 18500, { service: 10, nick: 'Pepsi' }),
  c('Rolex', 'GMT-Master II', '126710BLNR', '3285', 'auto', 2019, null, 11600, 16500, { service: 10, nick: 'Batman Batgirl' }),
  c('Rolex', 'GMT-Master II', '126720VTNR', '3285', 'auto', 2022, null, 11800, 15500, { service: 10, nick: 'Sprite Destro' }),
  c('Rolex', 'GMT-Master II', '116710LN', '3186', 'auto', 2007, 2019, null, 13000, { service: 10 }),
  c('Rolex', 'Datejust 41', '126300', '3235', 'auto', 2016, null, 9300, 10000, { service: 10 }),
  c('Rolex', 'Datejust 41', '126334', '3235', 'auto', 2016, null, 11300, 12000, { service: 10 }),
  c('Rolex', 'Datejust 36', '126234', '3235', 'auto', 2018, null, 9900, 10000, { service: 10 }),
  c('Rolex', 'Datejust 36', '16234', '3135', 'auto', 1988, 2004, null, 6000, { service: 10 }),
  c('Rolex', 'Datejust', '1601', '1570', 'auto', 1959, 1977, null, 6500, { service: 5 }),
  c('Rolex', 'Oyster Perpetual', '1002', '1560 / 1570', 'auto', 1959, 1989, null, 5000, { service: 5 }),
  c('Rolex', 'Explorer', '124270', '3230', 'auto', 2021, null, 7700, 8000, { service: 10 }),
  c('Rolex', 'Explorer', '214270', '3132', 'auto', 2010, 2021, null, 7000, { service: 10 }),
  c('Rolex', 'Explorer II', '226570', '3285', 'auto', 2021, null, 10300, 10000, { service: 10 }),
  c('Rolex', 'Explorer II', '216570', '3187', 'auto', 2011, 2021, null, 9000, { service: 10 }),
  c('Rolex', 'Cosmograph Daytona', '126500LN', '4131', 'auto', 2023, null, 16400, 28000, { service: 10 }),
  c('Rolex', 'Cosmograph Daytona', '116500LN', '4130', 'auto', 2016, 2023, null, 27000, { service: 10 }),
  c('Rolex', 'Oyster Perpetual 41', '124300', '3230', 'auto', 2020, null, 7000, 8000, { service: 10 }),
  c('Rolex', 'Oyster Perpetual 36', '126000', '3230', 'auto', 2020, null, 6600, 7000, { service: 10 }),
  c('Rolex', 'Sea-Dweller', '126600', '3235', 'auto', 2017, null, 13500, 13000, { service: 10, ...DIVE }),
  c('Rolex', 'Deepsea', '136660', '3235', 'auto', 2022, null, 14000, 13500, { service: 10, ...DIVE }),
  c('Rolex', 'Yacht-Master 40', '126622', '3235', 'auto', 2019, null, 13000, 13000, { service: 10 }),
  c('Rolex', 'Air-King', '126900', '3230', 'auto', 2022, null, 7900, 7800, { service: 10 }),
  c('Rolex', 'Sky-Dweller', '336934', '9002', 'auto', 2023, null, 16500, 17000, { service: 10 }),
  c('Rolex', 'Milgauss', '116400GV', '3131', 'auto', 2007, 2023, null, 10000, { service: 10 }),
  c('Rolex', 'Day-Date 40', '228238', '3255', 'auto', 2015, null, 44500, 38000, { service: 10 }),

  // Tudor
  c('Tudor', 'Black Bay 58', 'M79030N-0001', 'MT5402', 'auto', 2018, null, 4000, 3300, { service: 10, ...DIVE }),
  c('Tudor', 'Black Bay 58 Navy Blue', 'M79030B-0001', 'MT5402', 'auto', 2020, null, 4000, 3300, { service: 10, ...DIVE }),
  c('Tudor', 'Black Bay 41', 'M7941A1A0RU-0001', 'MT5602-U', 'auto', 2023, null, 4300, 3400, { service: 10, ...DIVE }),
  c('Tudor', 'Black Bay GMT', 'M79830RB-0001', 'MT5652', 'auto', 2018, null, 4600, 3600, { service: 10, nick: 'Pepsi' }),
  c('Tudor', 'Pelagos 39', 'M25407N-0001', 'MT5400', 'auto', 2022, null, 4900, 4200, { service: 10, ...DIVE }),
  c('Tudor', 'Pelagos', 'M25600TN-0001', 'MT5612', 'auto', 2015, null, 5300, 4000, { service: 10, ...DIVE }),
  c('Tudor', 'Ranger', 'M79950-0001', 'MT5402', 'auto', 2022, null, 3200, 2500, { service: 10 }),
  c('Tudor', 'Black Bay Chrono', 'M79360N-0001', 'MT5813', 'auto', 2021, null, 5800, 4600, { service: 10 }),
  c('Tudor', 'Royal', 'M28500-0003', 'T601', 'auto', 2020, null, 2400, 1600),

  // Omega
  c('Omega', 'Speedmaster Moonwatch Professional', '310.30.42.50.01.001', '3861', 'manuel', 2021, null, 7900, 6300, { service: 8, nick: 'Hesalite' }),
  c('Omega', 'Speedmaster Moonwatch Professional', '310.30.42.50.01.002', '3861', 'manuel', 2021, null, 8500, 6800, { service: 8, nick: 'Sapphire Sandwich' }),
  c('Omega', 'Speedmaster Professional', '311.30.42.30.01.005', '1861', 'manuel', 1997, 2021, null, 4800, { service: 5 }),
  c('Omega', 'Speedmaster Professional', '145.022', '861', 'manuel', 1969, 1996, null, 5500, { service: 5 }),
  c('Omega', 'Speedmaster Professional', '145.012', '321', 'manuel', 1967, 1968, null, 22000, { service: 5 }),
  c('Omega', 'Seamaster Diver 300M', '210.30.42.20.01.001', '8800', 'auto', 2018, null, 6400, 4300, { service: 8, ...DIVE, nick: 'Noir' }),
  c('Omega', 'Seamaster Diver 300M', '210.30.42.20.03.001', '8800', 'auto', 2018, null, 6400, 4300, { service: 8, ...DIVE, nick: 'Bleu' }),
  c('Omega', 'Seamaster Professional 300M', '2531.80', '1120', 'auto', 1993, 2006, null, 2700, { service: 5, ...DIVE, nick: 'James Bond' }),
  c('Omega', 'Seamaster Aqua Terra 150M', '220.10.41.21.01.001', '8900', 'auto', 2017, null, 6800, 4500, { service: 8 }),
  c('Omega', 'Seamaster Planet Ocean 600M', '215.30.44.21.01.001', '8900', 'auto', 2016, null, 7600, 5200, { service: 8, ...DIVE }),
  c('Omega', 'Seamaster 300 Heritage', '234.30.41.21.01.001', '8912', 'auto', 2021, null, 8000, 6200, { service: 8, ...DIVE }),
  c('Omega', 'Constellation', '131.10.39.20.02.001', '8800', 'auto', 2020, null, 6600, 4000, { service: 8 }),

  // Cartier
  c('Cartier', 'Santos de Cartier Moyen Modèle', 'WSSA0029', '1847 MC', 'auto', 2018, null, 7700, 6500),
  c('Cartier', 'Santos de Cartier Grand Modèle', 'WSSA0018', '1847 MC', 'auto', 2018, null, 8100, 6800),
  c('Cartier', 'Tank Must', 'WSTA0041', 'Quartz', 'quartz', 2021, null, 3200, 2600),
  c('Cartier', 'Tank Louis Cartier', 'WGTA0011', '8971 MC', 'manuel', 2020, null, 13500, 10000),
  c('Cartier', 'Tank Française', 'W51008Q3', 'Quartz', 'quartz', 1996, 2023, null, 2500),
  c('Cartier', 'Ballon Bleu 40', 'WSBB0040', '1847 MC', 'auto', 2019, null, 7700, 5000),

  // Patek Philippe
  c('Patek Philippe', 'Nautilus', '5711/1A-010', '26-330 S C', 'auto', 2006, 2021, null, 110000, { service: 5 }),
  c('Patek Philippe', 'Aquanaut', '5167A-001', '324 S C', 'auto', 2007, null, 26000, 65000, { service: 5 }),
  c('Patek Philippe', 'Calatrava', '6119G-001', '30-255 PS', 'manuel', 2021, null, 34000, 30000, { service: 5 }),

  // Audemars Piguet
  c('Audemars Piguet', 'Royal Oak', '15500ST.OO.1220ST.01', '4302', 'auto', 2019, 2022, null, 38000, { service: 5 }),
  c('Audemars Piguet', 'Royal Oak', '15510ST.OO.1320ST.01', '4302', 'auto', 2022, null, 31000, 42000, { service: 5 }),
  c('Audemars Piguet', 'Royal Oak Jumbo', '15202ST.OO.1240ST.01', '2121', 'auto', 2000, 2022, null, 85000, { service: 5 }),
  c('Audemars Piguet', 'Royal Oak Offshore', '26470ST.OO.A027CA.01', '3126/3840', 'auto', 2014, null, 33000, 30000, { service: 5 }),

  // IWC
  c('IWC', 'Portugieser Chronographe', 'IW371605', '69355', 'auto', 2020, null, 9100, 6500),
  c('IWC', "Pilot's Watch Mark XX", 'IW328201', '32111', 'auto', 2022, null, 5800, 4300),
  c('IWC', 'Big Pilot', 'IW501001', '52110', 'auto', 2016, 2021, null, 10000),

  // Grand Seiko / Seiko
  c('Grand Seiko', 'Snowflake', 'SBGA211', '9R65', 'spring', 2017, null, 6400, 4800),
  c('Grand Seiko', 'Elegance', 'SBGW231', '9S64', 'manuel', 2017, null, 5600, 4000),
  c('Grand Seiko', 'White Birch', 'SLGH005', '9SA5', 'auto', 2021, null, 10200, 7500),
  c('Seiko', 'SKX007', 'SKX007K', '7S26', 'auto', 1996, 2019, null, 350, { ...DIVE }),
  c('Seiko', 'Prospex 62MAS Reinterpretation', 'SPB143J1', '6R35', 'auto', 2020, null, 1250, 800, { ...DIVE }),
  c('Seiko', '5 Sports', 'SRPD55K1', '4R36', 'auto', 2019, null, 320, 220),
  c('Seiko', 'Alpinist', 'SARB017', '6R15', 'auto', 2006, 2019, null, 650),

  // Breitling
  c('Breitling', 'Navitimer B01 Chronograph 43', 'AB0138211B1P1', 'B01', 'auto', 2022, null, 9700, 6500),
  c('Breitling', 'Chronomat B01 42', 'AB0134101B1A1', 'B01', 'auto', 2020, null, 8900, 6000),
  c('Breitling', 'Superocean Heritage 42', 'AB2010121B1S1', 'B20', 'auto', 2017, null, 5200, 3300, { ...DIVE }),

  // TAG Heuer / Heuer
  c('TAG Heuer', 'Carrera Chronographe', 'CBN2A1B.BA0643', 'Heuer 02', 'auto', 2021, null, 6500, 4000),
  c('TAG Heuer', 'Monaco', 'CBL2111.FC6453', 'Heuer 02', 'auto', 2019, null, 7500, 5000),
  c('TAG Heuer', 'Aquaracer Professional 300', 'WBP201A.BA0632', 'Calibre 5', 'auto', 2021, null, 3400, 2000, { ...DIVE }),
  c('Heuer', 'Carrera', '2447', 'Valjoux 72', 'manuel', 1963, 1975, null, 20000),

  // Autres
  c('Jaeger-LeCoultre', 'Reverso Classic Large Small Seconds', 'Q3858520', '822/2', 'manuel', 2017, null, 9300, 6500),
  c('Zenith', 'Chronomaster Sport', '03.3100.3600/69.M3100', 'El Primero 3600', 'auto', 2021, null, 11400, 9500),
  c('Panerai', 'Luminor Marina', 'PAM01312', 'P.9010', 'auto', 2016, null, 8700, 5200),
  c('Hamilton', 'Khaki Field Mechanical', 'H69439931', 'H-50', 'manuel', 2017, null, 625, 400),
  c('Hamilton', 'Khaki Field Murph', 'H70605731', 'H-10', 'auto', 2019, null, 1050, 700),
  c('Longines', 'HydroConquest', 'L3.781.4.56.6', 'L888', 'auto', 2019, null, 1950, 1100, { ...DIVE }),
  c('Longines', 'Spirit', 'L3.810.4.73.6', 'L888.4', 'auto', 2020, null, 2650, 1800),
  c('Nomos', 'Tangente 38 Date', '130', 'DUW 4101', 'manuel', 2016, null, 2600, 1800),
  c('Sinn', '556 I', '556.010', 'SW 200-1', 'auto', 2012, null, 1650, 1100),
  c('Casio', 'G-Shock', 'DW-5600E-1V', 'Module 3229', 'quartz', 1996, null, 110, 70),
];
