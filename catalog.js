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

  // ===== rolex-tudor =====
  // Rolex — Submariner
  c('Rolex', 'Submariner Date', '126613LB', '3235', 'auto', 2020, null, 16300, 17500, { water: 1, nick: 'Bluesy' }),
  c('Rolex', 'Submariner Date', '126613LN', '3235', 'auto', 2020, null, 15600, 15500, { water: 1 }),
  c('Rolex', 'Submariner Date or jaune', '126618LB', '3235', 'auto', 2020, null, 41500, 33000, { water: 1 }),
  c('Rolex', 'Submariner Date or jaune', '126618LN', '3235', 'auto', 2020, null, 41500, 33000, { water: 1 }),
  c('Rolex', 'Submariner Date or gris', '126619LB', '3235', 'auto', 2020, null, 46500, 38000, { water: 1, nick: 'Smurf' }),
  c('Rolex', 'Submariner Date', '116613LB', '3135', 'auto', 2009, 2020, null, 14500, { water: 1, nick: 'Bluesy' }),
  c('Rolex', 'Submariner Date', '116613LN', '3135', 'auto', 2009, 2020, null, 12500, { water: 1 }),
  c('Rolex', 'Submariner Date or jaune', '116618LB', '3135', 'auto', 2009, 2020, null, 28000, { water: 1 }),
  c('Rolex', 'Submariner Date or jaune', '116618LN', '3135', 'auto', 2009, 2020, null, 27000, { water: 1 }),
  c('Rolex', 'Submariner Date or gris', '116619LB', '3135', 'auto', 2008, 2020, null, 33000, { water: 1, nick: 'Smurf' }),
  c('Rolex', 'Submariner Date', '16610LV', '3135', 'auto', 2003, 2010, null, 20000, { water: 1, nick: 'Kermit' }),
  c('Rolex', 'Submariner Date Rolesor', '16613', '3135', 'auto', 1988, 2009, null, 8500, { water: 1 }),
  c('Rolex', 'Submariner Date Rolesor', '16803', '3035', 'auto', 1979, 1988, null, 7500, { water: 1 }),
  c('Rolex', 'Submariner', '14060', '3000', 'auto', 1990, 2001, null, 9500, { water: 1 }),
  c('Rolex', 'Submariner Date', '16800', '3035', 'auto', 1979, 1988, null, 11000, { water: 1 }),
  c('Rolex', 'Submariner Date', '168000', '3035', 'auto', 1987, 1988, null, 12000, { water: 1 }),
  c('Rolex', 'Submariner Date', '1680', '1575', 'auto', 1967, 1979, null, 18000, { water: 1 }),
  c('Rolex', 'Submariner', '5512', '1570', 'auto', 1959, 1978, null, 25000, { water: 1 }),
  c('Rolex', 'Submariner', '6538', '1030', 'auto', 1956, 1959, null, 150000, { water: 1, nick: 'Big Crown' }),
  // Rolex — GMT-Master / GMT-Master II
  c('Rolex', 'GMT-Master II', '126711CHNR', '3285', 'auto', 2018, null, 16250, 16500, { nick: 'Root Beer' }),
  c('Rolex', 'GMT-Master II or Everose', '126715CHNR', '3285', 'auto', 2018, null, 37500, 29000, { nick: 'Root Beer' }),
  c('Rolex', 'GMT-Master II or blanc', '126719BLRO', '3285', 'auto', 2018, null, 44000, 36000, { nick: 'Pepsi' }),
  c('Rolex', 'GMT-Master II', '126710GRNR', '3285', 'auto', 2024, null, 12900, 15500, { nick: 'Bruce Wayne' }),
  c('Rolex', 'GMT-Master II Rolesor jaune', '126713GRNR', '3285', 'auto', 2023, null, 17400, 18000, {}),
  c('Rolex', 'GMT-Master II or jaune', '126718GRNR', '3285', 'auto', 2023, null, 40500, 36000, {}),
  c('Rolex', 'GMT-Master II', '116710BLNR', '3186', 'auto', 2013, 2019, null, 16500, { nick: 'Batman' }),
  c('Rolex', 'GMT-Master II Rolesor jaune', '116713LN', '3186', 'auto', 2014, 2018, null, 14500, {}),
  c('Rolex', 'GMT-Master II or jaune', '116718LN', '3186', 'auto', 2014, 2018, null, 28000, {}),
  c('Rolex', 'GMT-Master II', '16710', '3185', 'auto', 1989, 2007, null, 11500, { nick: 'Pepsi' }),
  c('Rolex', 'GMT-Master II Rolesor', '16713', '3185', 'auto', 1991, 2007, null, 9000, { nick: 'Root Beer' }),
  c('Rolex', 'GMT-Master', '16700', '3175', 'auto', 1988, 1999, null, 10500, { nick: 'Pepsi' }),
  c('Rolex', 'GMT-Master', '16750', '3075', 'auto', 1981, 1988, null, 12500, { nick: 'Pepsi' }),
  c('Rolex', 'GMT-Master', '16760', '3085', 'auto', 1983, 1988, null, 17000, { nick: 'Fat Lady' }),
  c('Rolex', 'GMT-Master', '1675', '1575', 'auto', 1959, 1980, null, 17500, { nick: 'Pepsi' }),
  c('Rolex', 'GMT-Master', '6542', '1036', 'auto', 1954, 1959, null, 90000, { nick: 'Pussy Galore' }),
  // Rolex — Cosmograph Daytona
  c('Rolex', 'Cosmograph Daytona or jaune', '126508', '4131', 'auto', 2023, null, 46000, 42000, {}),
  c('Rolex', 'Cosmograph Daytona Rolesor jaune', '126503', '4131', 'auto', 2023, null, 21500, 22000, {}),
  c('Rolex', 'Cosmograph Daytona or Everose', '126505', '4131', 'auto', 2023, null, 46500, 42000, {}),
  c('Rolex', 'Cosmograph Daytona or blanc', '126519LN', '4131', 'auto', 2023, null, 46500, 43000, {}),
  c('Rolex', 'Cosmograph Daytona platine', '126506', '4131', 'auto', 2023, null, 75000, 80000, {}),
  c('Rolex', 'Cosmograph Daytona or blanc', '116519LN', '4130', 'auto', 2017, 2023, null, 36000, {}),
  c('Rolex', 'Cosmograph Daytona or jaune', '116508', '4130', 'auto', 2016, 2023, null, 33000, { nick: 'John Mayer' }),
  c('Rolex', 'Cosmograph Daytona Rolesor jaune', '116503', '4130', 'auto', 2016, 2023, null, 17500, {}),
  c('Rolex', 'Cosmograph Daytona platine', '116506', '4130', 'auto', 2013, 2023, null, 70000, { nick: 'Ice Blue' }),
  c('Rolex', 'Cosmograph Daytona', '116520', '4130', 'auto', 2000, 2016, null, 16500, {}),
  c('Rolex', 'Cosmograph Daytona Rolesor', '116523', '4130', 'auto', 2000, 2016, null, 11500, {}),
  c('Rolex', 'Cosmograph Daytona', '16520', '4030', 'auto', 1988, 2000, null, 24000, { nick: 'Zenith' }),
  c('Rolex', 'Daytona', '6263', '727', 'manuel', 1971, 1988, null, 120000, {}),
  c('Rolex', 'Daytona', '6265', '727', 'manuel', 1971, 1988, null, 140000, {}),
  c('Rolex', 'Daytona', '6239', '722', 'manuel', 1963, 1969, null, 150000, { nick: 'Paul Newman' }),
  // Rolex — Datejust
  c('Rolex', 'Datejust 36', '126200', '3235', 'auto', 2018, null, 8400, 8500, {}),
  c('Rolex', 'Datejust 36 Rolesor Everose', '126201', '3235', 'auto', 2018, null, 12700, 12000, {}),
  c('Rolex', 'Datejust 36 Rolesor jaune', '126203', '3235', 'auto', 2018, null, 12700, 12000, {}),
  c('Rolex', 'Datejust 41 Rolesor Everose', '126331', '3235', 'auto', 2017, null, 14500, 13500, {}),
  c('Rolex', 'Datejust 31', '278240', '2236', 'auto', 2018, null, 8000, 7500, {}),
  c('Rolex', 'Datejust 31 Rolesor jaune', '278243', '2236', 'auto', 2018, null, 11700, 10500, {}),
  c('Rolex', 'Datejust II', '116300', '3136', 'auto', 2009, 2016, null, 8500, {}),
  c('Rolex', 'Datejust II', '116334', '3136', 'auto', 2009, 2016, null, 11000, {}),
  c('Rolex', 'Datejust 36', '116200', '3135', 'auto', 2004, 2019, null, 6500, {}),
  c('Rolex', 'Datejust 36 Rolesor jaune', '116233', '3135', 'auto', 2004, 2019, null, 8500, {}),
  c('Rolex', 'Datejust 36', '116234', '3135', 'auto', 2004, 2019, null, 7500, {}),
  c('Rolex', 'Datejust 36', '16200', '3135', 'auto', 1989, 2006, null, 5000, {}),
  c('Rolex', 'Datejust 36 Rolesor', '16233', '3135', 'auto', 1988, 2000, null, 5500, {}),
  c('Rolex', 'Datejust 36', '16014', '3035', 'auto', 1978, 1988, null, 4800, {}),
  c('Rolex', 'Datejust 36', '1603', '1570', 'auto', 1960, 1977, null, 3800, {}),
  c('Rolex', 'Datejust Turn-O-Graph', '1625', '1570', 'auto', 1960, 1977, null, 6500, { nick: 'Thunderbird' }),
  c('Rolex', 'Oysterquartz Datejust', '17000', '5035', 'quartz', 1977, 2001, null, 3500, {}),
  // Rolex — Day-Date
  c('Rolex', 'Day-Date 40 or Everose', '228235', '3255', 'auto', 2015, null, 40000, 36000, {}),
  c('Rolex', 'Day-Date 40 or blanc', '228239', '3255', 'auto', 2015, null, 41000, 36000, {}),
  c('Rolex', 'Day-Date 40 platine', '228206', '3255', 'auto', 2015, null, 66000, 58000, {}),
  c('Rolex', 'Day-Date 36 or jaune', '128238', '3255', 'auto', 2019, null, 38500, 34000, {}),
  c('Rolex', 'Day-Date 36 or Everose', '128235', '3255', 'auto', 2019, null, 38500, 34000, {}),
  c('Rolex', 'Day-Date 36 or blanc', '128239', '3255', 'auto', 2019, null, 39500, 34000, {}),
  c('Rolex', 'Day-Date 36 or jaune', '118238', '3155', 'auto', 1999, 2015, null, 21000, {}),
  c('Rolex', 'Day-Date 36 or Everose', '118235', '3155', 'auto', 2000, 2015, null, 21000, {}),
  c('Rolex', 'Day-Date 36 platine', '118206', '3155', 'auto', 2000, 2015, null, 40000, {}),
  c('Rolex', 'Day-Date II or jaune', '218238', '3156', 'auto', 2008, 2015, null, 25000, {}),
  c('Rolex', 'Day-Date 36 or jaune', '18238', '3155', 'auto', 1988, 2000, null, 15000, {}),
  c('Rolex', 'Day-Date 36 or blanc', '18239', '3155', 'auto', 1988, 2000, null, 15000, {}),
  c('Rolex', 'Day-Date 36 or jaune', '18038', '3055', 'auto', 1978, 1988, null, 13500, {}),
  c('Rolex', 'Day-Date 36 or jaune', '1803', '1556', 'auto', 1960, 1977, null, 12000, {}),
  // Rolex — Explorer / Explorer II
  c('Rolex', 'Explorer 40', '224270', '3230', 'auto', 2021, null, 8000, 8500, {}),
  c('Rolex', 'Explorer 36 Rolesor', '124273', '3230', 'auto', 2021, null, 12000, 11500, {}),
  c('Rolex', 'Explorer', '114270', '3130', 'auto', 2001, 2010, null, 5800, {}),
  c('Rolex', 'Explorer', '14270', '3000', 'auto', 1991, 2000, null, 6500, {}),
  c('Rolex', 'Explorer', '1016', '1570', 'auto', 1963, 1989, null, 17000, {}),
  c('Rolex', 'Explorer II', '16570', '3185', 'auto', 1989, 2011, null, 9500, { nick: 'Polar' }),
  c('Rolex', 'Explorer II', '16550', '3085', 'auto', 1985, 1989, null, 14000, { nick: 'Polar' }),
  c('Rolex', 'Explorer II', '1655', '1570', 'auto', 1971, 1985, null, 22000, { nick: 'Freccione' }),
  // Rolex — Sea-Dweller / Deepsea
  c('Rolex', 'Sea-Dweller', '116600', '3135', 'auto', 2014, 2017, null, 9500, { water: 1 }),
  c('Rolex', 'Sea-Dweller Rolesor', '126603', '3235', 'auto', 2017, null, 18000, 17500, { water: 1 }),
  c('Rolex', 'Sea-Dweller', '16600', '3135', 'auto', 1989, 2008, null, 8000, { water: 1 }),
  c('Rolex', 'Sea-Dweller', '16660', '3035', 'auto', 1978, 1989, null, 12000, { water: 1, nick: 'Triple Six' }),
  c('Rolex', 'Sea-Dweller', '1665', '1575', 'auto', 1967, 1978, null, 25000, { water: 1, nick: 'Great White' }),
  c('Rolex', 'Deepsea', '116660', '3135', 'auto', 2008, 2014, null, 9500, { water: 1 }),
  c('Rolex', 'Deepsea', '126660', '3235', 'auto', 2018, 2022, null, 12500, { water: 1, nick: 'D-Blue' }),
  // Rolex — Yacht-Master / Sky-Dweller / others
  c('Rolex', 'Yacht-Master 40 Rolesor Everose', '126621', '3235', 'auto', 2019, null, 17500, 16500, {}),
  c('Rolex', 'Yacht-Master 40 or Everose', '126655', '3235', 'auto', 2019, null, 29000, 26000, {}),
  c('Rolex', 'Yacht-Master 42 titane', '226627', '3235', 'auto', 2023, null, 15700, 15000, {}),
  c('Rolex', 'Yacht-Master 37 Rolesium', '268622', '2236', 'auto', 2019, null, 11500, 11000, {}),
  c('Rolex', 'Yacht-Master 40 Rolesor Everose', '116621', '3135', 'auto', 2010, 2019, null, 13500, {}),
  c('Rolex', 'Yacht-Master 40 Rolesium', '116622', '3135', 'auto', 2012, 2019, null, 13000, {}),
  c('Rolex', 'Yacht-Master 40', '16622', '3135', 'auto', 1999, 2012, null, 8500, {}),
  c('Rolex', 'Yacht-Master II', '116680', '4161', 'auto', 2010, 2019, null, 14500, {}),
  c('Rolex', 'Sky-Dweller Rolesor', '326934', '9001', 'auto', 2017, 2023, null, 15500, {}),
  c('Rolex', 'Sky-Dweller Rolesor jaune', '326933', '9001', 'auto', 2017, 2023, null, 15500, {}),
  c('Rolex', 'Sky-Dweller or jaune', '326938', '9001', 'auto', 2012, 2023, null, 33000, {}),
  c('Rolex', 'Sky-Dweller Rolesor Everose', '336935', '9002', 'auto', 2023, null, 20500, 19500, {}),
  c('Rolex', 'Sky-Dweller Rolesor jaune', '336933', '9002', 'auto', 2023, null, 20500, 19500, {}),
  c('Rolex', 'Sky-Dweller or jaune', '336238', '9002', 'auto', 2023, null, 40500, 36000, {}),
  c('Rolex', 'Air-King', '116900', '3131', 'auto', 2016, 2022, null, 6500, {}),
  c('Rolex', 'Air-King', '14000', '3000', 'auto', 1989, 1999, null, 3500, {}),
  c('Rolex', 'Air-King', '5500', '1520', 'auto', 1957, 1989, null, 3000, {}),
  c('Rolex', 'Milgauss', '116400', '3131', 'auto', 2007, 2023, null, 8500, {}),
  c('Rolex', 'Milgauss', '1019', '1580', 'auto', 1960, 1988, null, 18000, {}),
  c('Rolex', 'Milgauss', '6541', '1065', 'auto', 1956, 1960, null, 90000, {}),
  // Rolex — Oyster Perpetual / 1908 / Land-Dweller
  c('Rolex', 'Oyster Perpetual 34', '124200', '3230', 'auto', 2020, null, 6150, 6000, {}),
  c('Rolex', 'Oyster Perpetual 31', '277200', '2232', 'auto', 2020, null, 5750, 5500, {}),
  c('Rolex', 'Oyster Perpetual 28', '276200', '2232', 'auto', 2020, null, 5500, 5200, {}),
  c('Rolex', 'Oyster Perpetual 39', '114300', '3132', 'auto', 2015, 2020, null, 5500, {}),
  c('Rolex', 'Oyster Perpetual 36', '116000', '3130', 'auto', 2012, 2020, null, 5000, {}),
  c('Rolex', 'Oyster Perpetual 34', '114200', '3130', 'auto', 2007, 2019, null, 4000, {}),
  c('Rolex', 'Oyster Perpetual Date', '1500', '1570', 'auto', 1962, 1978, null, 2800, {}),
  c('Rolex', 'Oyster Royal', '6694', '1215', 'manuel', 1953, 1977, null, 2800, {}),
  c('Rolex', '1908 platine', '52506', '7140', 'auto', 2023, null, 21500, 19500, {}),
  c('Rolex', '1908 or jaune', '52508', '7140', 'auto', 2023, null, 21500, 19500, {}),
  c('Rolex', 'Land-Dweller 36', '127234', '7135', 'auto', 2025, null, 14400, 14500, {}),
  c('Rolex', 'Land-Dweller 40', '127334', '7135', 'auto', 2025, null, 14800, 15000, {}),
  // Tudor
  c('Tudor', 'Black Bay 58 925', 'M79010SG-0001', 'MT5400', 'auto', 2020, null, 4600, 4000, { water: 1 }),
  c('Tudor', 'Black Bay 58 18K', 'M79018V-0001', 'MT5400', 'auto', 2022, null, 13500, 11500, { water: 1 }),
  c('Tudor', 'Black Bay 54', 'M79000N-0001', 'MT5400', 'auto', 2023, null, 3800, 3500, { water: 1 }),
  c('Tudor', 'Black Bay Pro', 'M79470-0001', 'MT5652', 'auto', 2022, null, 4300, 3800, {}),
  c('Tudor', 'Black Bay 41', 'M79230N-0009', 'MT5602', 'auto', 2019, null, 4000, 3000, { water: 1 }),
  c('Tudor', 'Black Bay 41', 'M79230B-0008', 'MT5602', 'auto', 2019, null, 4000, 3000, { water: 1 }),
  c('Tudor', 'Black Bay', '79220R', '2824', 'auto', 2012, 2016, null, 2800, { water: 1, nick: 'Big Crown' }),
  c('Tudor', 'Black Bay', '79220B', '2824', 'auto', 2012, 2016, null, 2800, { water: 1 }),
  c('Tudor', 'Black Bay Bronze', 'M79250BM-0001', 'MT5601', 'auto', 2016, 2018, null, 3800, { water: 1 }),
  c('Tudor', 'Black Bay Bronze', 'M79250BA-0001', 'MT5601', 'auto', 2019, null, 4200, 3500, { water: 1 }),
  c('Tudor', 'Pelagos', '25500TN-0001', '2824', 'auto', 2012, 2015, null, 2800, { water: 1 }),
  c('Tudor', 'Pelagos', 'M25600TB-0001', 'MT5612', 'auto', 2015, null, 4800, 3800, { water: 1 }),
  c('Tudor', 'Pelagos LHD', 'M25610TNL-0001', 'MT5612', 'auto', 2015, null, 4800, 3800, { water: 1 }),
  c('Tudor', 'Heritage Chrono', '70330N-0001', '2892', 'auto', 2010, 2016, null, 2500, {}),
  c('Tudor', 'Heritage Chrono', '70330B-0001', '2892', 'auto', 2010, 2016, null, 2600, { nick: 'Blue' }),
  c('Tudor', 'Submariner', '7922', '390', 'auto', 1954, 1958, null, 9000, { water: 1, nick: 'Big Crown' }),
  c('Tudor', 'Submariner', '7928', '390', 'auto', 1959, 1969, null, 12000, { water: 1, nick: 'Big Crown' }),
  c('Tudor', 'Submariner Date', '7021/0', '2784', 'auto', 1969, 1975, null, 10000, { water: 1, nick: 'Snowflake' }),
  c('Tudor', 'Submariner', '9401/0', '2784', 'auto', 1975, 1989, null, 5500, { water: 1, nick: 'Snowflake' }),
  c('Tudor', 'Submariner', '79090', '2824', 'auto', 1989, 1999, null, 3200, { water: 1 }),
  c('Tudor', 'Submariner Date', '79190', '2824', 'auto', 1989, 1999, null, 3500, { water: 1 }),
  c('Tudor', 'Oysterdate Chrono', '9420/0', '234', 'manuel', 1971, 1976, null, 6000, { nick: 'Big Block' }),
  c('Tudor', 'Oysterdate Chrono', '94210', '7750', 'manuel', 1976, 1984, null, 5500, { nick: 'Big Block' }),

  // ===== omega-swatch =====
  // Omega — Speedmaster
  c('Omega', 'Speedmaster Professional Moonwatch Silver Snoopy Award 45th', '311.32.42.30.04.003', '1861', 'manuel', 2015, 2015, null, 9000, { service: 5, nick: 'Silver Snoopy' }),
  c('Omega', 'Speedmaster Moonwatch Professional Silver Snoopy Award 50th', '310.32.42.50.02.001', '3861', 'manuel', 2020, null, null, 16000, { nick: 'Snoopy' }),
  c('Omega', 'Speedmaster 57 Co-Axial Chronograph', '331.10.42.51.01.001', '9300', 'auto', 2013, 2016, null, 4500, { nick: "Speedmaster '57" }),
  c('Omega', 'Speedmaster Racing Co-Axial Chronograph 40', '326.30.40.50.01.001', '9300', 'auto', 2012, 2018, null, 3300, { nick: 'Racing' }),
  c('Omega', 'Speedmaster Dark Side of the Moon', '311.92.44.51.01.003', '9300', 'auto', 2013, 2017, null, 7500, { nick: 'Dark Side of the Moon' }),
  c('Omega', 'Speedmaster Reduced', '3510.50.00', '1140', 'auto', 1988, 2016, null, 2200, { service: 5, nick: 'Reduced' }),
  c('Omega', 'Speedmaster Date', '3513.50.00', '1152', 'auto', 1996, 2007, null, 2500, { service: 5 }),
  c('Omega', 'Speedmaster Professional 321 Ed White', '311.30.40.30.01.001', '321', 'manuel', 2019, 2021, null, 14000, { nick: 'Ed White' }),
  // Omega — Speedmaster vintage
  c('Omega', 'Speedmaster Professional', 'CK2998', '321', 'manuel', 1959, 1962, null, 55000, { service: 5, nick: 'CK2998' }),
  c('Omega', 'Speedmaster Professional', '105.003', '321', 'manuel', 1963, 1969, null, 50000, { service: 5, nick: 'Ed White' }),
  c('Omega', 'Speedmaster Professional', '105.012', '321', 'manuel', 1964, 1968, null, 25000, { service: 5, nick: 'Pre-Moon' }),
  c('Omega', 'Speedmaster Mark II', '145.014', '861', 'manuel', 1969, 1972, null, 3500, { service: 5, nick: 'Mark II' }),
  c('Omega', 'Speedmaster Professional', '3590.50.00', '861', 'manuel', 1988, 1997, null, 4500, { service: 5 }),
  c('Omega', 'Speedmaster Professional', '3570.50.00', '1861', 'manuel', 1997, 2014, null, 3800, { service: 5 }),
  // Omega — Seamaster
  c('Omega', 'Seamaster Diver 300M 42mm', '210.30.42.20.10.001', '8800', 'auto', 2021, null, null, 4500, { water: 1 }),
  c('Omega', 'Seamaster Diver 300M Chronograph', '210.30.44.51.01.001', '9900', 'auto', 2017, null, null, 5500, { water: 1 }),
  c('Omega', 'Seamaster Professional 300M Co-Axial Blue', '2220.80.00', '2500', 'auto', 1999, 2008, null, 2700, { water: 1, nick: 'Bond Casino Royale' }),
  c('Omega', 'Seamaster Professional 300M Co-Axial', '2254.50.00', '2500', 'auto', 2003, 2011, null, 2400, { water: 1 }),
  c('Omega', 'Seamaster Professional 300M Quartz', '2541.80.00', '1441', 'quartz', 1993, 2006, null, 1500, { water: 1, nick: 'Bond GoldenEye' }),
  c('Omega', 'Seamaster 300', '165.024', '552', 'auto', 1966, 1968, null, 5500, { service: 5, water: 1 }),
  c('Omega', 'Seamaster 300', '166.024', '565', 'auto', 1968, 1971, null, 4000, { service: 5, water: 1 }),
  c('Omega', 'Seamaster Planet Ocean 600M 39.5', '215.30.40.20.01.001', '8900', 'auto', 2016, 2022, null, 5000, { water: 1 }),
  c('Omega', 'Seamaster Planet Ocean 600M Co-Axial 42', '2200.50.00', '2500', 'auto', 2005, 2016, null, 2800, { water: 1 }),
  c('Omega', 'Seamaster Planet Ocean Ultra Deep', '215.30.46.21.01.001', '8912', 'auto', 2019, null, null, 9000, { water: 1 }),
  c('Omega', 'Seamaster Aqua Terra 150M 41 Blue', '220.10.41.21.03.001', '8900', 'auto', 2017, null, null, 4500, {}),
  c('Omega', 'Seamaster Aqua Terra 150M', '2503.50.00', '2500', 'auto', 2002, 2012, null, 2200, {}),
  c('Omega', 'Seamaster Ploprof 1200M', '224.30.55.21.01.001', '8912', 'auto', 2016, null, null, 9000, { water: 1 }),
  c('Omega', 'Railmaster Master Chronometer 40', '220.10.40.20.01.001', '8806', 'auto', 2017, null, null, 4000, {}),
  // Omega — Vintage other
  c('Omega', 'Railmaster', 'CK2914', '285', 'auto', 1957, 1963, null, 15000, { service: 5 }),
  c('Omega', 'Constellation Pie-Pan', '168.005', '564', 'auto', 1964, 1969, null, 2500, { service: 5 }),
  c('Omega', 'Flightmaster', '145.036', '910', 'manuel', 1969, 1979, null, 5000, { service: 5 }),
  // Longines
  c('Longines', 'Legend Diver 42mm', 'L3.774.4.50.2', 'L888.2', 'auto', 2020, null, 2500, 1500, { water: 1 }),
  c('Longines', 'HydroConquest 41mm Blue', 'L3.781.4.96.6', 'L888.5', 'auto', 2017, null, null, 1000, { water: 1 }),
  // Tissot
  c('Tissot', 'PRX Powermatic 80 Black', 'T137.407.11.051.00', 'Powermatic 80.111', 'auto', 2021, null, 725, 475, {}),
  c('Tissot', 'PRX 40 205', 'T137.410.11.041.00', 'F06.115', 'quartz', 2021, null, 395, 250, {}),
  c('Tissot', 'PRX 35mm Quartz', 'T137.210.11.041.00', 'F06.115', 'quartz', 2021, null, 395, 250, {}),
  c('Tissot', 'Seastar 1000 Quartz', 'T120.410.11.051.00', 'F06.412', 'quartz', 2019, null, 395, 250, { water: 1 }),
  c('Tissot', 'Gentleman Powermatic 80 Silicium', 'T127.407.11.041.00', 'Powermatic 80.111', 'auto', 2019, null, 745, 450, {}),
  c('Tissot', 'Le Locle Powermatic 80', 'T006.407.11.033.00', 'Powermatic 80.111', 'auto', 2014, null, 695, 400, {}),
  // Hamilton
  c('Hamilton', 'Khaki Field Automatic 38 Black Leather', 'H70455533', 'H-10', 'auto', 2018, null, null, 400, {}),
  c('Hamilton', 'Khaki Field Murph 38mm', 'H70405730', 'H-10', 'auto', 2022, null, null, 600, {}),
  // Mido
  c('Mido', 'Ocean Star 200 Blue', 'M026.430.11.041.00', 'Caliber 80', 'auto', 2018, null, null, 600, { water: 1 }),
  // Blancpain
  c('Blancpain', 'Fifty Fathoms Automatique 45mm', '5015-1130-52', '1315', 'auto', 2007, null, 15000, 9500, { water: 1 }),
  // Swatch — MoonSwatch
  c('Swatch', 'MoonSwatch Mission to the Moon', 'SO33M100', 'VD53', 'quartz', 2022, null, 260, 400, {}),
  c('Swatch', 'MoonSwatch Mission to Mars', 'SO33R100', 'VD53', 'quartz', 2022, null, 260, 450, {}),
  c('Swatch', 'MoonSwatch Mission to Mercury', 'SO33A100', 'VD53', 'quartz', 2022, null, 260, 400, {}),
  c('Swatch', 'MoonSwatch Mission to Venus', 'SO33P100', 'VD53', 'quartz', 2022, null, 260, 450, {}),
  c('Swatch', 'MoonSwatch Mission to Jupiter', 'SO33C100', 'VD53', 'quartz', 2022, null, 260, 400, {}),
  c('Swatch', 'MoonSwatch Mission to Saturn', 'SO33T100', 'VD53', 'quartz', 2022, null, 260, 400, {}),
  c('Swatch', 'MoonSwatch Mission to Uranus', 'SO33L100', 'VD53', 'quartz', 2022, null, 260, 400, {}),
  c('Swatch', 'MoonSwatch Mission to Neptune', 'SO33N100', 'VD53', 'quartz', 2022, null, 260, 400, {}),
  c('Swatch', 'MoonSwatch Mission to Earth', 'SO33G100', 'VD53', 'quartz', 2022, null, 260, 350, {}),
  c('Swatch', 'MoonSwatch Mission to the Sun', 'SO33J100', 'VD53', 'quartz', 2022, null, 260, 400, {}),
  c('Swatch', 'MoonSwatch Mission to Pluto', 'SO33M101', 'VD53', 'quartz', 2022, null, 260, 450, {}),
  // Swatch — Blancpain x Swatch Scuba Fifty Fathoms
  c('Swatch', 'Blancpain x Swatch Scuba Fifty Fathoms Pacific Ocean', 'SO35P100', 'Sistem51', 'auto', 2023, null, 400, 550, { water: 1 }),
  c('Swatch', 'Blancpain x Swatch Scuba Fifty Fathoms Atlantic Ocean', 'SO35A100', 'Sistem51', 'auto', 2023, null, 400, 550, { water: 1 }),
  c('Swatch', 'Blancpain x Swatch Scuba Fifty Fathoms Indian Ocean', 'SO35I100', 'Sistem51', 'auto', 2023, null, 400, 550, { water: 1 }),
  // Omega — additions (verified)
  c('Omega', 'Speedmaster Moonwatch Professional White Dial', '310.30.42.50.04.001', '3861', 'manuel', 2024, null, null, 7500, {}),
  c('Omega', 'Speedmaster Racing Master Chronometer 44', '329.30.44.51.01.001', '9900', 'auto', 2017, null, null, 5500, { nick: 'Racing' }),
  c('Omega', 'Speedmaster Super Racing', '329.30.44.51.01.003', '9920', 'auto', 2021, null, null, 8000, {}),
  c('Omega', 'Speedmaster Chronoscope Silver Dial', '329.30.43.51.02.001', '9908', 'auto', 2021, null, null, 6000, {}),
  c('Omega', 'Speedmaster Chronoscope Blue Dial', '329.30.43.51.03.001', '9908', 'auto', 2021, null, null, 6000, {}),
  c('Omega', 'Seamaster Diver 300M 42mm Grey', '210.30.42.20.06.001', '8800', 'auto', 2018, null, null, 4500, { water: 1 }),
  c('Omega', 'Seamaster Diver 300M 007 Edition Mesh', '210.90.42.20.01.001', '8806', 'auto', 2019, 2022, null, 7000, { water: 1, nick: 'Bond' }),
  c('Omega', 'Seamaster Diver 300M 007 Edition NATO', '210.92.42.20.01.001', '8806', 'auto', 2019, 2022, null, 7000, { water: 1, nick: 'Bond' }),
  c('Omega', 'Seamaster 300 Master Co-Axial 41', '233.30.41.21.01.001', '8400', 'auto', 2014, 2021, null, 4500, { water: 1 }),
  c('Omega', 'Seamaster Aqua Terra 150M 41 Silver', '220.10.41.21.02.001', '8900', 'auto', 2017, null, null, 4500, {}),
  c('Omega', 'Seamaster Aqua Terra 150M 38 Blue', '220.10.38.20.03.001', '8800', 'auto', 2018, null, null, 4500, {}),
  c('Omega', 'Seamaster Aqua Terra Shades 38 Summer Blue', '220.10.38.20.03.004', '8800', 'auto', 2022, null, null, 5000, {}),
  c('Omega', 'Seamaster Aqua Terra Shades 38 Turquoise', '220.10.38.20.03.005', '8800', 'auto', 2022, null, null, 5000, {}),
  c('Omega', 'Seamaster Aqua Terra Shades 38 Atlantic Blue', '220.10.38.20.03.003', '8800', 'auto', 2022, null, null, 5000, {}),
  c('Omega', 'Constellation Master Chronometer 39 Black', '131.10.39.20.01.001', '8800', 'auto', 2019, null, null, 4500, {}),
  c('Omega', 'Constellation Globemaster 39 Silver', '130.30.39.21.02.001', '8900', 'auto', 2015, null, 8600, 5000, {}),
  c('Omega', 'Constellation Globemaster 39 Blue', '130.30.39.21.03.001', '8900', 'auto', 2015, null, 8600, 5000, {}),
  // Longines — additions
  c('Longines', 'Spirit Zulu Time 42mm', 'L3.812.4.93.6', 'L844.4', 'auto', 2022, null, null, 2400, {}),
  c('Longines', 'Heritage Classic Sector Dial 38.5mm', 'L2.828.4.73.2', 'L893', 'auto', 2019, null, null, 1500, {}),
  c('Longines', 'Master Collection 40mm Chronograph Moonphase', 'L2.673.4.78.3', 'L678', 'auto', 2013, null, null, 2800, {}),
  // Tissot — additions
  c('Tissot', 'Seastar 1000 Powermatic 80 40mm', 'T120.807.11.051.00', 'Powermatic 80.111', 'auto', 2022, null, 695, 450, { water: 1 }),
  // Hamilton — additions
  c('Hamilton', 'Khaki Field Automatic 38 Black Steel', 'H70455733', 'H-10', 'auto', 2018, null, null, 450, {}),
  c('Hamilton', 'Khaki Navy Scuba Auto 40mm', 'H82335131', 'H-10', 'auto', 2020, null, null, 500, { water: 1 }),
  c('Hamilton', 'Khaki Aviation Pilot Day Date Auto 42 Black', 'H64615135', 'H-40', 'auto', 2018, null, null, 600, {}),
  c('Hamilton', 'Khaki Aviation Pilot Day Date Auto 42 Blue', 'H64615145', 'H-40', 'auto', 2018, null, null, 600, {}),
  // Blancpain — additions
  c('Blancpain', 'Fifty Fathoms Bathyscaphe 38mm Grey', '5100B-1110-B52A', '1150', 'auto', 2019, null, null, 10000, { water: 1 }),
  c('Blancpain', 'Fifty Fathoms Bathyscaphe 43mm', '5000-1110-B52A', '1315', 'auto', 2018, null, null, 11500, { water: 1 }),
  // Rado, Certina, Mido — additions
  c('Rado', 'HyperChrome Captain Cook 42 Black Ceramic', 'R32505153', 'C07.611', 'auto', 2019, null, null, 1100, { water: 1 }),
  c('Rado', 'HyperChrome Captain Cook 42 Steel Black', 'R32105153', 'C07.611', 'auto', 2020, null, null, 1000, { water: 1 }),
  c('Certina', 'DS Action Diver Powermatic 80 43mm', 'C032.407.11.051.00', 'Powermatic 80.111', 'auto', 2017, null, null, 500, { water: 1 }),
  c('Mido', 'Ocean Star 200 Black', 'M026.430.11.051.00', 'Caliber 80', 'auto', 2018, null, null, 600, { water: 1 }),
  c('Mido', 'Multifort Chronometer 1', 'M038.431.11.061.00', 'Caliber 80', 'auto', 2020, null, null, 650, {}),
  // Swatch — additions
  c('Swatch', 'Blancpain x Swatch Scuba Fifty Fathoms Antarctic Ocean', 'SO35S100', 'Sistem51', 'auto', 2023, null, 400, 550, { water: 1 }),
  c('Swatch', 'Blancpain x Swatch Scuba Fifty Fathoms Arctic Ocean', 'SO35N100', 'Sistem51', 'auto', 2023, null, 400, 550, { water: 1 }),
  c('Swatch', 'Sistem51 Irony Boreal', 'YIS401G', 'Sistem51', 'auto', 2016, null, null, 150, {}),

  // ===== luxury =====
  // Patek Philippe — Nautilus
  c('Patek Philippe', 'Nautilus', '5711/1A-001', '315 SC', 'auto', 2006, 2012, null, 140000),
  c('Patek Philippe', 'Nautilus', '5711/1A-014', '26-330 S C', 'auto', 2021, 2021, null, 220000, { nick: 'Olive' }),
  c('Patek Philippe', 'Nautilus', '5711/1A-018', '26-330 S C', 'auto', 2021, 2021, null, 4000000, { nick: 'Tiffany' }),
  c('Patek Philippe', 'Nautilus Phases de Lune', '5712/1A-001', '240 PS IRM C LU', 'auto', 2006, 2018, null, 100000),
  c('Patek Philippe', 'Nautilus Calendrier Annuel', '5726/1A-001', '324 S QA LU 24H/303', 'auto', 2010, 2019, null, 60000),
  c('Patek Philippe', 'Nautilus Chronographe', '5980/1A-001', 'CH 28-520 C', 'auto', 2006, 2014, null, 90000),
  c('Patek Philippe', 'Nautilus Dame', '7118/1A-001', '324 S C', 'auto', 2014, 2021, null, 75000),
  c('Patek Philippe', 'Nautilus Flyback Chronographe', '5811/1G-001', '26-330 S C', 'auto', 2022, null, 82000, 140000),
  c('Patek Philippe', 'Nautilus Jumbo', '3700/1A-001', '28-255 C', 'auto', 1976, 1990, null, 160000, { nick: 'Jumbo' }),
  c('Patek Philippe', 'Nautilus Moyen Modèle', '3800/1A-001', '335 SC', 'auto', 1981, 2006, null, 40000),
  // Patek Philippe — Aquanaut
  c('Patek Philippe', 'Aquanaut', '5168G-001', '324 S C', 'auto', 2017, null, 55000, 70000, { water: 1 }),
  c('Patek Philippe', 'Aquanaut Travel Time', '5164A-001', '324 S C FUS', 'auto', 2011, 2017, null, 70000, { water: 1 }),
  // Patek Philippe — Calatrava & Complications
  c('Patek Philippe', 'Calatrava', '5196J-001', '215 PS', 'manuel', 2006, null, 30000, 22000),
  c('Patek Philippe', 'Calatrava', '5227G-001', '324 S C', 'auto', 2013, null, 40000, 36000),
  c('Patek Philippe', 'Calatrava Clous de Paris', '6119R-001', '30-255 PS', 'manuel', 2017, null, 30000, 26000),
  c('Patek Philippe', 'Calendrier Annuel', '5205G-001', '324 S QA LU 24H/303', 'auto', 2010, 2019, null, 40000),
  c('Patek Philippe', 'Quantième Perpétuel', '5146J-001', '240 Q', 'auto', 2005, null, null, 38000),
  c('Patek Philippe', 'Chronographe Calendrier Annuel', '5905P-001', 'CH 28-520 QA 24H', 'auto', 2015, null, null, 90000),
  c('Patek Philippe', 'World Time', '5230P-001', '240 HU', 'auto', 2016, null, null, 80000),
  // Audemars Piguet — Royal Oak
  c('Audemars Piguet', 'Royal Oak Selfwinding 39', '15300ST.OO.1220ST.01', '3120', 'auto', 2005, 2012, null, 22000),
  c('Audemars Piguet', 'Royal Oak Selfwinding 37', '15450ST.OO.1256ST.01', '3120', 'auto', 2012, 2019, null, 25000),
  c('Audemars Piguet', 'Royal Oak Chronograph 41', '26331ST.OO.1220ST.01', '2385', 'auto', 2012, 2017, null, 32000),
  c('Audemars Piguet', 'Royal Oak Chronograph 41', '26240ST.OO.1320ST.01', '2385', 'auto', 2017, 2022, null, 42000),
  c('Audemars Piguet', 'Royal Oak Jumbo Extra-Plat', '5402ST', '2121', 'auto', 1972, 1997, null, 95000, { nick: 'Jumbo' }),
  c('Audemars Piguet', 'Royal Oak Offshore Diver', '15720ST.OO.A002CA.01', '3120', 'auto', 2019, null, 24500, 24000, { water: 1 }),
  // Vacheron Constantin
  c('Vacheron Constantin', 'Overseas', '4500V/110A-B126', '5100', 'auto', 2016, 2023, null, 24000, { water: 1 }),
  c('Vacheron Constantin', 'Overseas', '4500V/110A-B128', '5100', 'auto', 2016, 2023, null, 25000, { water: 1 }),
  c('Vacheron Constantin', 'Overseas', '4500V/110A-B483', '5100', 'auto', 2016, 2023, null, 25000, { water: 1 }),
  c('Vacheron Constantin', 'Overseas Chronographe', '5500V/110A-B148', '5200', 'auto', 2016, 2023, null, 28000, { water: 1 }),
  c('Vacheron Constantin', 'Historiques 222', '4200H/222A-B934', '2455/2', 'auto', 2022, null, 36000, 55000),
  c('Vacheron Constantin', 'Fiftysix', '4600E/000A-B442', '1326', 'auto', 2018, null, 14500, 11000),
  // A. Lange & Söhne
  c('A. Lange & Söhne', 'Lange 1', '191.032', 'L121.1', 'manuel', 2015, null, 43000, 36000),
  c('A. Lange & Söhne', 'Odysseus', '363.179', 'L155.1 DATOMATIC', 'auto', 2019, null, 33000, 38000, { water: 1 }),
  // Jaeger-LeCoultre
  c('Jaeger-LeCoultre', 'Master Ultra Thin Moon', 'Q1368420', '925/1', 'auto', 2013, null, 11700, 8500),
  c('Jaeger-LeCoultre', 'Polaris Memovox', 'Q9008180', '956', 'auto', 2017, null, 14000, 9500, { water: 1 }),
  // IWC
  c('IWC', 'Portugieser Chronograph', 'IW371491', '79350', 'auto', 2010, 2016, null, 5500),
  c('IWC', 'Big Pilot\'s Watch 43', 'IW329301', '82100', 'auto', 2021, null, 14000, 12000),
  c('IWC', 'Ingenieur Automatic 40', 'IW328901', '32111', 'auto', 2023, null, 11500, 9500),
  // Cartier
  c('Cartier', 'Santos-Dumont Grand Modèle', 'WSSA0032', '430 MC', 'manuel', 2019, null, 6100, 4800),
  c('Cartier', 'Pasha de Cartier 41', 'WSPA0009', '1847 MC', 'auto', 2020, null, 8150, 6500, { water: 1 }),
  c('Cartier', 'Drive de Cartier', 'WSNM0009', '1904-PS MC', 'auto', 2016, 2022, null, 4200),
  c('Cartier', 'Calibre de Cartier', 'W7100015', '1904-PS MC', 'auto', 2010, 2019, null, 3800, { water: 1 }),
  // Panerai
  c('Panerai', 'Luminor Marina', 'PAM00111', 'OP II', 'manuel', 2000, 2012, null, 8000, { water: 1 }),
  c('Panerai', 'Luminor Marina Automatic Acciaio', 'PAM00312', 'P.9000', 'auto', 2010, 2021, null, 5500, { water: 1 }),
  // Zenith
  c('Zenith', 'Chronomaster Revival A384', '03.A384.400/51.M384', 'El Primero 400 B', 'auto', 2019, 2020, null, 9000),
  c('Zenith', 'Defy Skyline', '03.9300.3620/51.I001', 'El Primero 3620', 'auto', 2022, null, 9500, 7500),
  // TAG Heuer and Heuer
  c('TAG Heuer', 'Monaco Calibre 11', 'CAW211P.FC6356', 'Calibre 11', 'auto', 2009, 2022, null, 3800, { nick: 'Steve McQueen' }),
  c('TAG Heuer', 'Formula 1 Quartz 41', 'WAZ1112.BA0875', 'Ronda 715', 'quartz', 2020, null, 1350, 450),
  c('Heuer', 'Monaco', '1133B', 'Cal. 11', 'auto', 1969, 1975, null, 30000, { nick: 'Steve McQueen' }),
  c('Heuer', 'Camaro', '7220', 'Valjoux 72', 'manuel', 1968, 1972, null, 7000),
  // Girard-Perregaux
  c('Girard-Perregaux', 'Laureato 42', '81010-11-431-11A', 'GP01800', 'auto', 2016, null, 12900, 10000),
  // Bvlgari
  c('Bvlgari', 'Octo Finissimo Automatic', '102713', 'BVL 138', 'auto', 2017, null, 13000, 9500),
  // Audemars Piguet — Royal Oak 15400 & Code 11.59
  c('Audemars Piguet', 'Royal Oak Selfwinding 41 Noir', '15400ST.OO.1220ST.01', '3120', 'auto', 2012, 2019, null, 45000),
  c('Audemars Piguet', 'Royal Oak Selfwinding 41 Bleu', '15400ST.OO.1220ST.03', '3120', 'auto', 2012, 2019, null, 48000),
  c('Audemars Piguet', 'Code 11.59 Selfwinding 41 Or blanc', '15210BC.OO.A002KB.01', '4302', 'auto', 2019, null, 41000, 30000),
  c('Audemars Piguet', 'Code 11.59 Selfwinding 41 Or rose', '15210OR.OO.A002KB.01', '4302', 'auto', 2019, null, 40000, 29000),
  c('Audemars Piguet', 'Code 11.59 Selfwinding 41 Or blanc/rose', '15210CR.OO.A002KB.01', '4302', 'auto', 2019, null, 40000, 28000),
  c('Audemars Piguet', 'Code 11.59 Selfwinding 41 Acier', '15210ST.OO.A348KB.01', '4302', 'auto', 2022, null, 25000, 24000),
  // Vacheron Constantin — Overseas & Patrimony
  c('Vacheron Constantin', 'Overseas Dual Time', '7900V/110A-B334', '5110 DT', 'auto', 2016, 2023, null, 24000, { water: 1 }),
  c('Vacheron Constantin', 'Patrimony Contemporaine Or blanc', '85180/000G-9230', '2450 Q6', 'auto', 2007, 2019, null, 14000),
  // A. Lange & Söhne
  c('A. Lange & Söhne', '1815 Up/Down Or blanc', '234.026', 'L051.2', 'manuel', 2013, 2022, null, 22000),
  c('A. Lange & Söhne', 'Saxonia Thin Or blanc', '211.026', 'L093.1', 'manuel', 2011, null, null, 14000),
  // Jaeger-LeCoultre
  c('Jaeger-LeCoultre', 'Polaris Date', 'Q9068670', '899A/1', 'auto', 2019, null, 10200, 7500, { water: 1 }),
  c('Jaeger-LeCoultre', 'Reverso Tribute Small Seconds Bleu', 'Q3978480', '822/2', 'manuel', 2018, null, 8500, 6500),
  c('Jaeger-LeCoultre', 'Reverso Tribute Small Seconds Vert', 'Q3978430', '822/2', 'manuel', 2021, null, 8500, 6800),
  // IWC
  c('IWC', 'Portugieser Automatic', 'IW500107', '51011', 'auto', 2004, 2015, null, 6000),
  c('IWC', 'Portugieser Automatic 42', 'IW500710', '52010', 'auto', 2017, 2023, null, 9000),
  c('IWC', 'Portugieser Automatic 40 Bleu', 'IW358305', '82200', 'auto', 2020, null, 10400, 8500),
  c('IWC', 'Pilot\'s Watch Chronograph Top Gun', 'IW389101', '69380', 'auto', 2018, null, 9300, 6500),
  c('IWC', 'Ingenieur Automatic 40 Bleu Aqua', 'IW328903', '32111', 'auto', 2023, null, 11500, 9500),
  // Cartier
  c('Cartier', 'Santos 100 Grand Modèle', 'W20073X8', '049', 'auto', 2004, 2017, null, 3500),
  c('Cartier', 'Santos de Cartier Grand Modèle', 'WSSA0009', '1847 MC', 'auto', 2018, 2021, null, 5800),
  // Panerai
  c('Panerai', 'Luminor Marina Logo', 'PAM00005', 'OP II', 'manuel', 2004, 2016, null, 5000, { water: 1 }),
  c('Panerai', 'Luminor Submersible 1950 3 Days 42', 'PAM00682', 'P.9010', 'auto', 2017, 2020, null, 8000, { water: 1 }),
  c('Panerai', 'Luminor 1950 3 Days Automatic 42', 'PAM01392', 'P.9010', 'auto', 2021, null, 8600, 6500, { water: 1 }),
  // TAG Heuer
  c('TAG Heuer', 'Carrera Date 39 Calibre 5', 'WBN2112.BA0639', 'Calibre 5', 'auto', 2021, null, 2950, 2200),
  // Breitling
  c('Breitling', 'Navitimer B01 Chronograph 41', 'AB0139211B1A1', 'B01', 'auto', 2022, null, 9400, 7500),
  c('Breitling', 'Superocean Automatic 42', 'A17375211B1S1', 'B17', 'auto', 2020, null, 4600, 3200, { water: 1 }),
  c('Breitling', 'Superocean Automatic 42 Bleu', 'A17375E71C1A1', 'B17', 'auto', 2022, null, 4900, 3600, { water: 1 }),
  c('Breitling', 'Superocean Heritage B01 Chronograph 44', 'AB0162121C1A1', 'B01', 'auto', 2019, null, 9500, 6800, { water: 1 }),
  c('Breitling', 'Super Chronomat B01 44', 'AB0136161C1S1', 'B01', 'auto', 2020, null, 9800, 7000, { water: 1 }),
  c('Breitling', 'Navitimer', '806', 'Venus 178', 'manuel', 1959, 1966, null, 6500),
  // Zenith
  c('Zenith', 'Chronomaster Original', '03.3200.3600/69.M3200', 'El Primero 3600', 'auto', 2021, null, 10200, 7500),
  // Hublot
  c('Hublot', 'Big Bang Unico 45 Titane', '411.NX.1170.RX', 'HUB1242', 'auto', 2013, null, 17000, 9500),
  c('Hublot', 'Big Bang Unico 45 Black Magic', '411.CI.1170.RX', 'HUB1242', 'auto', 2013, null, 17500, 10000),
  // Chopard
  c('Chopard', 'Alpine Eagle 41', '298600-3002', '01.01-C', 'auto', 2019, null, 16300, 15000),
  // Glashütte Original
  c('Glashütte Original', 'Seventies Chronograph Panorama Date', '1-37-02-03-02-70', '37-02', 'auto', 2021, null, 12900, 9500),
  // Ulysse Nardin
  c('Ulysse Nardin', 'Marine Torpilleur 42', '1183-310-3/43', 'UN-118', 'auto', 2017, null, 6900, 4500),
  // H. Moser & Cie
  c('H. Moser & Cie', 'Streamliner Centre Seconds', '6200-1200', 'HMC 200', 'auto', 2020, null, 23000, 19000),
  // Richard Mille
  c('Richard Mille', 'RM 011 Felipe Massa', 'RM 011', 'RMAC1', 'auto', 2007, null, null, 130000),

  // ===== japan-indep =====
  // Grand Seiko
  c('Grand Seiko', 'Heritage Spring Drive Snowflake', 'SLGA009', '9R65', 'spring', 2021, null, 9500, 7500, { nick: 'Snowflake' }),
  c('Grand Seiko', 'Spring Drive Shunbun', 'SBGA413', '9R65', 'spring', 2021, null, 8600, 6500, { nick: 'Shunbun' }),
  c('Grand Seiko', 'Hi-Beat 36000', 'SBGH201', '9S85', 'auto', 2017, null, 8300, 5000, {}),
  c('Grand Seiko', 'Spring Drive GMT', 'SBGE201', '9R66', 'spring', 2018, null, 8800, 5800, {}),
  c('Grand Seiko', 'Sport GMT 9S66', 'SBGM221', '9S66', 'auto', 2018, null, 6700, 4300, {}),
  c('Grand Seiko', 'Sport Quartz 9F', 'SBGX261', '9F61', 'quartz', 2017, null, 3200, 2000, {}),
  c('Grand Seiko', 'Elegance White Birch', 'SLGH002', '9SA5', 'auto', 2021, null, 9500, 7000, { nick: 'White Birch' }),
  // Seiko - Prospex
  c('Seiko', 'Prospex Turtle', 'SRPE93K1', '4R36', 'auto', 2020, null, 495, 330, { water: 1, nick: 'Turtle' }),
  c('Seiko', 'Prospex Turtle', 'SRP777K1', '4R36', 'auto', 2015, null, 495, 300, { water: 1, nick: 'Turtle' }),
  c('Seiko', 'Prospex 1968 Diver Re-creation', 'SLA017J1', '8L35', 'auto', 2017, null, 3800, 3000, { water: 1 }),
  // Seiko - Presage / 5 Sports / SKX
  c('Seiko', 'Presage Cocktail Time Blue', 'SRPB43J1', '4R35', 'auto', 2016, null, 450, 280, { nick: 'Cocktail Time' }),
  c('Seiko', 'Presage Cocktail Time Black', 'SRPB41J1', '4R35', 'auto', 2016, null, 450, 280, { nick: 'Cocktail Time' }),
  c('Seiko', '5 Sports Blue', 'SRPD51K1', '4R36', 'auto', 2019, null, 295, 190, {}),
  c('Seiko', '5 Sports SNK809', 'SNK809K2', '7S26', 'auto', 2000, null, 150, 90, {}),
  c('Seiko', 'Diver SKX009', 'SKX009K2', '7S26', 'auto', 1996, 2019, null, 350, { water: 1, nick: 'Pepsi' }),
  c('Seiko', 'Diver SKX013', 'SKX013K2', '7S26', 'auto', 1996, 2019, null, 280, { water: 1 }),
  // Seiko - Vintage
  c('Seiko', 'Chronograph 6139 Pogue', '6139-6002', '6139', 'auto', 1970, 1976, null, 1500, { nick: 'Pogue' }),
  c('Seiko', 'Diver 6105 Willard', '6105-8110', '6105', 'auto', 1968, 1977, null, 1200, { water: 1, nick: 'Captain Willard' }),
  c('Seiko', '62MAS Diver', '6217-8000', '6217', 'auto', 1965, 1968, null, 6000, { water: 1 }),
  // Citizen
  c('Citizen', 'Promaster Automatic Diver', 'NY0040-09E', '8203', 'auto', 2012, null, 300, 200, { water: 1 }),
  c('Citizen', 'Promaster Diver Eco-Drive', 'BN0150-28E', 'Eco-Drive E168', 'quartz', 2010, null, 270, 170, { water: 1 }),
  c('Citizen', 'Eco-Drive Military', 'BM8180-03E', 'Eco-Drive E100', 'quartz', 2010, null, 200, 120, {}),
  // Casio
  c('Casio', 'G-Shock GA-2100', 'GA-2100-1A1', 'Module 5611', 'quartz', 2019, null, 109, 80, { nick: 'CasiOak' }),
  c('Casio', 'G-Shock GA-B2100', 'GA-B2100-1A1', 'Module 5691', 'quartz', 2021, null, 169, 130, { nick: 'CasiOak' }),
  c('Casio', 'G-Shock GM-2100', 'GM-2100-1A', 'Module 5611', 'quartz', 2020, null, 249, 180, { nick: 'CasiOak' }),
  c('Casio', 'G-Shock GMW-B5000', 'GMW-B5000D-1', 'Module 3459', 'quartz', 2018, null, 549, 450, {}),
  c('Casio', 'G-Shock GW-M5610', 'GW-M5610U-1', 'Module 3159', 'quartz', 2012, null, 149, 110, {}),
  c('Casio', 'G-Shock DW-6900', 'DW-6900-1V', 'Module 3230', 'quartz', 1995, null, 109, 80, {}),
  c('Casio', 'Classic F-91W', 'F-91W-1', 'Module 593', 'quartz', 1991, null, 19, 15, {}),
  c('Casio', 'Vintage A168', 'A168WA-1', 'Module 593', 'quartz', 1990, null, 45, 35, {}),
  // Nomos
  c('Nomos', 'Tangente 35', '101', 'Alpha', 'manuel', 2005, null, 1700, 1200, {}),
  c('Nomos', 'Metro 38 Date Power Reserve', '1101', 'DUW 4401', 'manuel', 2013, null, 4000, 2900, {}),
  c('Nomos', 'Tangente neomatik 41 Update', '180', 'DUW 6101', 'auto', 2019, null, 3600, 2800, {}),
  c('Nomos', 'Ahoi neomatik', '560', 'DUW 6101', 'auto', 2017, null, 3500, 2700, { water: 1 }),
  // Sinn
  c('Sinn', '104 St Sa I', '104.010', 'SW 220-1', 'auto', 2008, null, 1980, 1500, {}),
  c('Sinn', '356 Sa Flieger', '356.012', 'SW 500', 'auto', 2006, null, 3200, 2400, {}),
  // Junghans
  c('Junghans', 'Max Bill Automatic', '027/3500.00', 'J800.1', 'auto', 2008, null, 1000, 700, {}),
  // Oris
  c('Oris', 'Aquis Date 41.5', '01 733 7730 4135-07 8 24 05PEB', 'Oris 733', 'auto', 2018, null, 2200, 1500, { water: 1 }),
  // Grand Seiko (verified additions)
  c('Grand Seiko', 'Spring Drive 5 Days', 'SLGA021', '9RA2', 'spring', 2022, null, 8500, 6500, {}),
  // Seiko (verified additions)
  c('Seiko', 'Prospex Alpinist Green', 'SPB121J1', '6R35', 'auto', 2020, null, 1000, 700, { nick: 'Alpinist' }),
  c('Seiko', 'Prospex Alpinist Gray-Green', 'SPB155J1', '6R35', 'auto', 2021, null, 1000, 700, { nick: 'Alpinist' }),
  c('Seiko', 'Presage Cocktail Time Ishigaki Shinobu', 'SARB065', '6R15', 'auto', 2013, null, null, 350, { nick: 'Cocktail Time' }),
  c('Seiko', 'Presage Automatic Black', 'SARB033', '6R15', 'auto', 2008, null, null, 400, {}),
  c('Seiko', 'Presage Automatic Ivory', 'SARB035', '6R15', 'auto', 2008, null, null, 400, {}),
  // Citizen (verified additions)
  c('Citizen', 'Tsuyosa Black', 'NJ0150-81E', '8210', 'auto', 2022, null, 399, 250, {}),
  c('Citizen', 'Tsuyosa Blue', 'NJ0150-81L', '8210', 'auto', 2022, null, 399, 250, {}),
  c('Citizen', 'Tsuyosa Green', 'NJ0150-81X', '8210', 'auto', 2022, null, 399, 250, {}),
  // Sinn (verified additions)
  c('Sinn', 'U1', '1010.010', 'SW 200-1', 'auto', 2005, null, 2400, 1900, { water: 1 }),
  c('Sinn', 'EZM 3', '603.010', 'ETA 2824-2', 'auto', 2008, null, 2300, 1600, { water: 1 }),
  // Oris (verified additions)
  c('Oris', 'Big Crown Pointer Date 40', '01 754 7741 4065-07 5 20 63', 'Oris 754', 'auto', 2014, null, 2000, 1400, {}),
  c('Oris', 'Big Crown ProPilot Big Date', '01 751 7761 4065-07 8 20 08P', 'Oris 751', 'auto', 2015, null, 2300, 1500, {}),
  // Doxa
  c('Doxa', 'SUB 300 Sharkhunter Bracelet', '821.10.101.10', 'ETA 2824-2', 'auto', 2019, null, 1850, 1300, { water: 1 }),
  // Squale
  c('Squale', '1521 Classic COSC', '1521COSCL.SQ20B', 'SW 200-1', 'auto', 2018, null, 1000, 700, { water: 1 }),
  c('Squale', '1521 Ocean Blue', '1521OCN.SQ20B', 'SW 200-1', 'auto', 2018, null, 600, 450, { water: 1 }),
  // Casio
  c('Casio', 'Edifice EFR-556DB', 'EFR-556DB-1AV', 'Module 5451', 'quartz', 2015, null, 150, 100, {}),
  c('Casio', 'Oceanus OCW-S5000', 'OCW-S5000E-1AJF', 'Module 5500', 'quartz', 2020, null, null, 500, { water: 1 }),
  // Nomos
  c('Nomos', 'Club Campus 38', '737', 'Alpha', 'manuel', 2016, null, 1500, 1100, {}),

  // ===== mine =====
  // 1. William L 1985 vintage diver
  c('William L. 1985', 'Automatic Vintage Diver', '', 'Seiko NH35A', 'auto', 2016, null, 349, 200, { wr: 100, size: 38.5 }),
  // 2. Baltic Aquascaphe (Classic black)
  c('Baltic', 'Aquascaphe Classic', '', 'Miyota 9039', 'auto', 2019, null, 580, 450, { wr: 200, size: 39, water: 1 }),
  // 2. Baltic Aquascaphe (Classic blue gilt)
  c('Baltic', 'Aquascaphe Classic Blue Gilt', '', 'Miyota 9039', 'auto', 2019, null, 580, 450, { wr: 200, size: 39, water: 1 }),
  // 2. Baltic Aquascaphe (GMT, first gen)
  c('Baltic', 'Aquascaphe GMT', '', 'Soprod C125', 'auto', 2020, 2025, 930, 750, { wr: 200, size: 39, water: 1 }),
  // 2. Baltic Aquascaphe (Bronze)
  c('Baltic', 'Aquascaphe Bronze', '', 'Miyota 9039', 'auto', 2020, null, 645, 500, { wr: 200, size: 39, water: 1 }),
  // 3. Seiko SRPD79K1
  c('Seiko', '5 Sports', 'SRPD79K1', '4R36', 'auto', 2019, null, 330, 200, { wr: 100, size: 42.5, nick: 'Street Style' }),
  // 4. Oris Big Pointer Date Anniversary
  c('Oris', 'Big Crown Pointer Date 80th Anniversary Edition', '01 754 7741 3167-07 5 20 58BR', 'Oris 754 (Sellita SW200-1)', 'auto', 2018, null, 2400, 1500, { wr: 50, size: 40 }),
  // 5. Casio G-Shock GA-2100-1AER
  c('Casio', 'G-Shock GA-2100', 'GA-2100-1AER', 'Module 5611', 'quartz', 2019, null, 99, 70, { wr: 200, size: 45.4, nick: 'CasiOak' }),
  // 6. Omega Genève (vintage) - automatic with date
  c('Omega', 'Genève', '166.041', 'Omega 565', 'auto', 1968, 1970, null, 900, { wr: 0, size: 34.5 }),
  // 6. Omega Genève (vintage) - manual, no date
  c('Omega', 'Genève', '135.041', 'Omega 601', 'manuel', 1968, 1970, null, 600, { wr: 0, size: 34.5 }),
  // 6. Omega Genève (vintage) - manual with date
  c('Omega', 'Genève', '136.041', 'Omega 613', 'manuel', 1969, 1971, null, 650, { wr: 0, size: 34.5 }),
  // 6. Omega Genève (vintage) - 1970s automatic with date
  c('Omega', 'Genève', '166.0163', 'Omega 1012', 'auto', 1972, 1977, null, 800, { wr: 0, size: 35 }),
  // 7. Serica 4512
  c('Serica', '4512 Field', '4512', 'STP1-11 / Soprod P024', 'manuel', 2020, 2022, 600, 550, { wr: 200, size: 37.7 }),
  // 8. Seiko SSC819P1
  c('Seiko', 'Prospex Speedtimer Solar Chronograph', 'SSC819P1', 'V192', 'quartz', 2021, null, 590, 400, { wr: 100, size: 39 }),
  // 9. Serica 5303-1
  c('Serica', '5303 Diver', '5303-1', 'Soprod Newton P092 / Soprod M100', 'auto', 2020, null, 1490, 1200, { wr: 300, size: 39, water: 1 }),
  // 11. Baltic Hermétique Tourer
  c('Baltic', 'Hermétique Tourer', '', 'Miyota 9039', 'auto', 2022, null, 550, 430, { wr: 150, size: 37 }),
  // 12. Traska Summiteer 36
  c('Traska', 'Summiteer 36', '', 'Miyota 9039', 'auto', 2023, null, 560, 400, { wr: 100, size: 36.5 }),
  // 14. Seiko SNK355K1
  c('Seiko', '5', 'SNK355K1', '7S26', 'auto', 2005, 2020, 90, 70, { wr: 30, size: 37 }),
  // 15. Tissot PRX 35 Powermatic 80
  c('Tissot', 'PRX Powermatic 80 35mm', 'T137.207', 'Powermatic 80.111', 'auto', 2022, null, 695, 500, { wr: 100, size: 35 }),
  // 16. Serica 5303-2
  c('Serica', '5303 Diver', '5303-2', 'Soprod Newton P092 / Soprod M100', 'auto', 2020, null, 1590, 1200, { wr: 300, size: 39, water: 1 }),
  // 17. Vasco Grand Large
  c('Vasco', 'Grand Large', '', 'TMI 4R34 (NH34 GMT)', 'auto', 2025, null, 499, 400, { wr: 200, size: 39, water: 1 }),
  // 18. Vasco Tout Terrain
  c('Vasco', 'Tout-Terrain', '', 'TMI 4R34 (NH34 GMT)', 'auto', 2024, null, 499, 400, { wr: 200, size: 39, water: 1 }),
  // 19. Casio G-Shock GMA-S2100BA-3A
  c('Casio', 'G-Shock GMA-S2100', 'GMA-S2100BA-3A', 'Module 5611', 'quartz', 2023, null, 109, 80, { wr: 200, size: 42.9 }),
  // 20. Furlan Marri Sabbia Rosa
  c('Furlan Marri', 'Mechaquartz Chronograph Sabbia Rosa', '20201', 'Seiko VK64', 'quartz', 2025, null, 625, 550, { wr: 50, size: 38 }),

  // ===== micro =====
  // Furlan Marri — Mechaquartz chronographs (Seiko VK64)
  c('Furlan Marri', 'Mechaquartz Chronograph Tasti Tondi', '1011-A', 'Seiko VK64', 'quartz', 2021, null, 500, 380, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Laccato Nero', '1022-A', 'Seiko VK64', 'quartz', 2021, null, 500, 380, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Mr. Grey', '1041-A', 'Seiko VK64', 'quartz', 2021, null, 500, 380, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Havana Salmon', '1031-A', 'Seiko VK64', 'quartz', 2021, null, 500, 380, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Farro', '1022-B', 'Seiko VK64', 'quartz', 2021, null, 500, 380, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Nero Sabbia', '', 'Seiko VK64', 'quartz', 2022, null, 590, 450, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Rosso Grigio', '', 'Seiko VK64', 'quartz', 2022, null, 590, 450, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Castagna', '', 'Seiko VK64', 'quartz', 2022, null, 590, 450, {}),
  c('Furlan Marri', 'Mechaquartz Chronograph Ardesia Blu', '', 'Seiko VK64', 'quartz', 2023, null, 620, 470, { size: 38 }),
  c('Furlan Marri', 'Mechaquartz Chronograph Meteorite', '', 'Seiko VK64', 'quartz', 2024, null, 650, 500, {}),
  // Furlan Marri — Disco Volante (hand-wound, not mecha-quartz)
  c('Furlan Marri', 'Disco Volante Havana', '', 'Peseux 7001', 'manuel', 2022, null, 2650, 1900, { wr: 50, size: 38 }),
  c('Furlan Marri', 'Disco Volante Celeste', '', 'Peseux 7001', 'manuel', 2022, null, 2650, 1900, { wr: 50, size: 38 }),
  c('Furlan Marri', 'Disco Volante Verde', '', 'Peseux 7001', 'manuel', 2022, null, 2650, 1900, { wr: 50, size: 38 }),
  // Serica — 7505 Field Chronometer (35 mm)
  c('Serica', 'Field Chronometer', '7505-1', 'Soprod M100', 'auto', 2025, null, 1090, 850, { wr: 200, size: 35, water: 1 }),
  c('Serica', 'Field Chronometer', '7505-2', 'Soprod M100', 'auto', 2025, null, 1090, 850, { wr: 200, size: 35, water: 1 }),
  // Serica — 6190 Field Chronometer
  c('Serica', 'Field Chronometer 6190-1 M.S.L.', '6190-1', 'Soprod M100', 'auto', 2024, null, 1190, 900, { wr: 200, size: 37.7, water: 1 }),
  c('Serica', 'Field Chronometer 6190-2 M.S.L.', '6190-2', 'Soprod M100', 'auto', 2024, null, 1190, 900, { wr: 200, size: 37.7, water: 1 }),
  c('Serica', 'Field Chronometer 6190-3 M.S.L.', '6190-3', 'Soprod M100', 'auto', 2024, null, 1190, 900, { wr: 200, size: 37.7, water: 1 }),
  c('Serica', 'Field Chronometer', '6190 Denali', 'Soprod M100', 'auto', 2023, null, 1090, 850, { wr: 200, size: 37.7, water: 1 }),
  c('Serica', 'Field Chronometer', '6190 California', 'Soprod M100', 'auto', 2023, null, 1090, 850, { wr: 200, size: 37.7, water: 1 }),
  c('Serica', 'Field Chronometer', '6190 Commando', 'Soprod M100', 'auto', 2023, null, 1090, 850, { wr: 200, size: 37.7, water: 1 }),
  // Serica — 5303 / 5330 Diving Chronometer
  c('Serica', 'Diving Chronometer', '5303-3', 'Soprod M100', 'auto', 2023, null, 1590, 1200, { wr: 300, size: 39, water: 1 }),
  c('Serica', 'Diving Chronometer 5330 Date', '5330', 'Soprod M100', 'auto', 2023, null, 1690, 1300, { wr: 300, size: 39, water: 1 }),
  // Serica — 8315 Travel Chronometer
  c('Serica', 'Travel Chronometer', '8315-1', 'Soprod C125', 'auto', 2023, null, 2090, 1550, { wr: 200, size: 39, water: 1 }),
  c('Serica', 'Travel Chronometer', '8315-2', 'Soprod C125', 'auto', 2023, null, 2090, 1550, { wr: 200, size: 39, water: 1 }),
  // Serica — 1174 Parade
  c('Serica', 'Parade', '1174-1', 'Soprod M100', 'auto', 2024, null, 1490, 1150, { size: 35 }),
  c('Serica', 'Parade', '1174-2', 'Soprod M100', 'auto', 2024, null, 1490, 1150, { size: 35 }),
  c('Serica', 'Parade Linen', '1174-3', 'Soprod M100', 'auto', 2025, null, 1490, 1150, { size: 35 }),
  c('Serica', 'Parade Linen', '1174-4', 'Soprod M100', 'auto', 2025, null, 1490, 1150, { size: 35 }),
  // Baltic — Aquascaphe
  c('Baltic', 'Aquascaphe Classic Black Gilt', '', 'Miyota 9039', 'auto', 2021, null, 600, 440, { wr: 200, size: 39, water: 1 }),
  c('Baltic', 'Aquascaphe MK2 39.5', '', 'Miyota 9039', 'auto', 2024, null, 630, 480, { size: 39.5 }),
  c('Baltic', 'Aquascaphe MK2 37', '', 'Miyota 9039', 'auto', 2024, null, 630, 480, { size: 37 }),
  c('Baltic', 'Aquascaphe GMT MK-II', '', 'Miyota 9075', 'auto', 2026, null, 850, 700, { wr: 200, size: 39.5, water: 1 }),
  c('Baltic', 'Aquascaphe Dual Crown', '', 'Miyota 9039', 'auto', 2022, null, 670, 520, { wr: 200, size: 39, water: 1 }),
  c('Baltic', 'Aquascaphe Titanium', '', 'Miyota 9039', 'auto', 2022, null, 730, 560, { wr: 300, size: 41, water: 1 }),
  // Baltic — Bicompax / HMS / MR / Prismic / Hermétique / Heures du Monde
  c('Baltic', 'Bicompax 002', '', 'Seagull ST1901', 'manuel', 2020, 2023, 540, 400, { size: 38 }),
  c('Baltic', 'Bicompax 003', '', 'Seagull ST1901', 'manuel', 2023, 2025, 540, 420, { size: 36.5 }),
  c('Baltic', 'HMS 002', '', 'Miyota 8315', 'auto', 2020, null, 385, 280, { wr: 50, size: 38 }),
  c('Baltic', 'HMS 003', '', 'Miyota 8315', 'auto', 2023, null, 385, 290, { wr: 50, size: 36.5 }),
  c('Baltic', 'MR Classic', '', 'Hangzhou CAL500a', 'auto', 2024, null, 545, 420, { size: 36 }),
  c('Baltic', 'MR Roulette', '', 'Hangzhou CAL5000a', 'auto', 2025, null, 545, 450, { size: 36 }),
  c('Baltic', 'Prismic', '', 'Peseux 7001', 'manuel', 2024, null, 990, 800, { size: 36 }),
  c('Baltic', 'Prismic Stone Dial', '', 'Peseux 7001', 'manuel', 2024, null, 1300, 1050, { size: 36 }),
  c('Baltic', 'Hermétique Tourer Bronze', '', 'Miyota 9039', 'auto', 2024, null, 600, 480, { wr: 150, size: 37 }),
  c('Baltic', 'Heures du Monde Worldtimer', '', 'Soprod C125 (modified)', 'auto', 2025, null, 1300, 1200, { size: 37 }),
  // Traska
  c('Traska', 'Freediver', '', 'Miyota 9039', 'auto', 2015, null, 625, 450, { wr: 200, size: 40.5, water: 1 }),
  c('Traska', 'Seafarer', '', 'Miyota 9039', 'auto', 2023, null, 520, 420, { wr: 150, size: 38.5 }),
  c('Traska', 'Summiteer 38', '', 'Miyota 9039', 'auto', 2023, null, 585, 450, { size: 38 }),
  c('Traska', 'Commuter', '', 'Miyota 9039', 'auto', 2022, null, 540, 430, { wr: 100, size: 36.5 }),
  c('Traska', 'Venturer GMT', '', 'Miyota 9075', 'auto', 2022, null, 630, 560, { size: 38 }),
  // Vasco
  c('Vasco', 'Grand Large Offshore Noir 2 (24h GMT)', '', 'TMI V2434-GMT', 'auto', 2026, null, 549, 400, { size: 39 }),
  // William L. 1985
  // Lorier
  c('Lorier', 'Neptune Series 2', '', 'Seiko NH35A', 'auto', 2020, 2022, 360, 280, { wr: 200, size: 39, water: 1 }),
  c('Lorier', 'Neptune Series 3', '', 'Miyota 90S5', 'auto', 2022, null, 450, 340, { wr: 200, size: 39, water: 1 }),
  c('Lorier', 'Falcon', '', 'Miyota 9039', 'auto', 2020, null, 600, 430, { size: 36 }),
  // Studio Underd0g
  c('Studio Underd0g', '01 Series Pepper0ni Pizza Party', '', 'Seagull ST1901', 'manuel', 2020, null, 495, 450, { size: 38.5 }),
  c('Studio Underd0g', 'Mint Ch0c Chip', '', 'Seagull ST1901', 'manuel', 2022, null, 510, 450, {}),
  c('Studio Underd0g', 'Goofy Panda', '', 'Seiko VK64', 'quartz', 2021, null, 360, 270, { size: 38.5 }),
  c('Studio Underd0g', 'Watermelon', '', 'Seiko VK64', 'quartz', 2020, null, 360, 300, {}),
  // Christopher Ward
  c('Christopher Ward', 'C60 Trident Pro 300', '', 'Sellita SW200-1', 'auto', 2015, 2023, 500, 380, { wr: 300, water: 1 }),
  c('Christopher Ward', 'C60 Trident Pro 600', '', 'Sellita SW200', 'auto', 2023, null, 750, 520, { wr: 600, size: 40, water: 1 }),
  c('Christopher Ward', 'C60 Trident GMT 600', '', 'Sellita SW330-2', 'auto', 2023, null, 960, 700, { wr: 600, water: 1 }),
  c('Christopher Ward', 'C63 Sealander', '', 'Sellita SW200-1', 'auto', 2023, null, 630, 480, { size: 39 }),
  c('Christopher Ward', 'C63 Sealander GMT', '', 'Sellita SW330-2', 'auto', 2023, null, 855, 700, { size: 39 }),
  c('Christopher Ward', 'The Twelve 40', '', 'Sellita SW200-2', 'auto', 2022, null, 700, 520, { size: 40 }),
  c('Christopher Ward', 'C1 Bel Canto', '', 'Sellita SW200-1 + FS01 module', 'auto', 2023, null, 3450, 3300, { size: 40 }),
  // Halios
  c('Halios', 'Seaforth (Series 1-3)', '', 'Miyota 90S5', 'auto', 2016, 2022, 610, 700, { wr: 200, water: 1 }),
  c('Halios', 'Seaforth IV', '', 'Sellita SW200-1', 'auto', 2023, null, 950, 800, { wr: 200, size: 38, water: 1 }),
  c('Halios', 'Universa Seaforth Dial', '', 'Sellita SW200-1', 'auto', 2025, null, 1000, 900, { wr: 200, water: 1 }),
  // Farer
  c('Farer', 'Stanhope 37', '', 'ETA 7001', 'manuel', 2018, null, 1060, 800, { size: 37 }),
  c('Farer', 'Hudson 37', '', 'ETA 7001', 'manuel', 2018, null, 1060, 800, { size: 37 }),
  c('Farer', 'Lansdell 37', '', 'ETA 7001', 'manuel', 2018, null, 1060, 800, { size: 37 }),
  c('Farer', 'Lander GMT', '', 'Sellita SW330-1', 'auto', 2018, null, 1285, 950, { wr: 100 }),
  // Nodus
  c('Nodus', 'Contrail', '', 'Miyota 9015', 'auto', 2018, null, 450, 380, { wr: 200, water: 1 }),
  c('Nodus', 'Sector Dive', '', 'Seiko NH35', 'auto', 2021, null, 360, 300, {}),
  c('Nodus', 'Avalon', '', 'Seiko NH35', 'auto', 2021, null, 560, 450, { wr: 300, size: 43.5, water: 1 }),
  // Formex
  c('Formex', 'Essence ThirtyNine Automatic Chronometer', '', 'Sellita SW200-1', 'auto', 2022, null, 1650, 1200, { size: 39 }),
  c('Formex', 'Reef 42 Automatic Chronometer', '', 'Sellita SW300-1', 'auto', 2018, null, 1900, 1300, { wr: 300, size: 42, water: 1 }),
  c('Formex', 'Reef 39.5 Automatic Chronometer', '', 'Sellita SW300-1', 'auto', 2022, null, 1900, 1300, { size: 39.5 }),
  // Brew
  c('Brew', 'Retromatic (Seiko)', '', 'Seiko NH35A', 'auto', 2018, null, 380, 280, { wr: 50, size: 36 }),
  c('Brew', 'Retromatic (Sellita)', '', 'Sellita SW200', 'auto', 2018, null, 445, 340, { wr: 50, size: 36 }),
  c('Brew', 'Metric Retro Dial Chronograph', '', 'Seiko VK68', 'quartz', 2021, null, 405, 320, { size: 36 }),
  c('Brew', 'Metric Automatic', '', 'Seiko NH35A', 'auto', 2025, null, 470, 400, { size: 36 }),
  // Yema
  c('Yema', 'Superman Bronze CMM.10', '', 'Yema CMM.10', 'auto', 2023, null, 1800, 1500, { wr: 300, size: 41, water: 1 }),
  c('Yema', 'Navygraf Marine Nationale CMM.10', '', 'Yema CMM.10', 'auto', 2023, null, 1690, 1300, { size: 39 }),
  c('Yema', 'Navygraf Marine Nationale Quartz', 'YMHFMN39-GM', 'Seiko VH31', 'quartz', 2022, null, 449, 330, { wr: 200, size: 39, water: 1 }),
  c('Yema', 'Navygraf Slim CMM.20', '', 'Yema CMM.20', 'auto', 2024, null, 1990, 1700, {}),
  // Zodiac
  c('Zodiac', 'Super Sea Wolf 53 Compression', 'ZO9275', 'STP 3-13', 'auto', 2019, null, 1250, 650, { wr: 200, size: 40, water: 1 }),
  // Monta
  c('Monta', 'Oceanking', '', 'Monta M-22 (Sellita SW300 base)', 'auto', 2016, null, 1500, 1200, { wr: 300, size: 40.5, water: 1 }),
  c('Monta', 'Noble', '', 'Sellita SW300-1', 'auto', 2020, null, 1050, 900, { wr: 150, size: 38.5 }),
  // Boldr
  c('Boldr', 'Journey Chronograph', '', 'Seiko VK64', 'quartz', 2017, null, 270, 180, {}),
  c('Boldr', 'Expedition', '', 'Sellita SW200-1', 'auto', 2019, null, 630, 450, {}),
  // Delma
  c('Delma', 'Oceanmaster Quartz', '41501.676.6.048', 'ETA F06.115', 'quartz', 2020, null, 610, 420, { water: 1 }),
  c('Delma', 'Oceanmaster Chronograph Quartz', '41701.678.6.038', 'Ronda 5030.D', 'quartz', 2020, null, 830, 560, {}),
  c('Delma', 'Oceanmaster Antarctica', '', 'ETA 2824-2', 'auto', 2020, null, 1300, 900, { water: 1 }),
  // Unimatic
  c('Unimatic', 'Modello Uno U1 Classic', 'UC1', 'Seiko NH35A', 'auto', 2015, null, 520, 600, { wr: 300, size: 41.5, water: 1 }),
  c('Unimatic', 'Modello Due U2 Classic', 'UC2', 'Seiko NH35A', 'auto', 2017, null, 365, 320, { size: 38 }),
  c('Unimatic', 'Modello Tre U3 Classic', 'UC3', 'Seiko VK64', 'quartz', 2019, null, 470, 400, { wr: 300, size: 40, water: 1 }),
  c('Unimatic', 'Modello Uno', 'U1-S', 'Sellita SW200-1', 'auto', 2021, null, 780, 650, { wr: 300, water: 1 }),
  // Mühle-Glashütte
  c('Mühle-Glashütte', 'Sea-Timer BlackMotion', 'M1-41-83-CB', 'Sellita SW200-1 (Mühle)', 'auto', 2020, null, 2600, 1900, { wr: 300, size: 44, water: 1 }),
  // Squale
  c('Squale', '2002 Professional', '', 'Sellita SW200-1', 'auto', 2019, null, 1700, 1200, { wr: 1000, water: 1 }),
  c('Squale', 'Sub-39', 'SUB-39MON', 'Sellita SW200-1', 'auto', 2023, null, 1200, 900, { wr: 300, size: 39, water: 1 }),
  // Doxa — SUB 200
  c('Doxa', 'SUB 200 Professional', '799.10.351.10', 'ETA 2824-2', 'auto', 2019, null, 1100, 800, { wr: 200, size: 42, water: 1 }),
  c('Doxa', 'SUB 200 Sharkhunter', '799.10.101.10', 'ETA 2824-2', 'auto', 2019, null, 1100, 800, { wr: 200, size: 42, water: 1 }),
  c('Doxa', 'SUB 200 Searambler', '799.10.021.10', 'ETA 2824-2', 'auto', 2019, null, 1100, 800, { wr: 200, size: 42, water: 1 }),
  c('Doxa', 'SUB 200 Caribbean', '799.10.201.10', 'ETA 2824-2', 'auto', 2019, null, 1100, 800, { wr: 200, size: 42, water: 1 }),
  c('Doxa', 'SUB 200 Aquamarine', '799.10.241.10', 'ETA 2824-2', 'auto', 2019, null, 1100, 800, { wr: 200, size: 42, water: 1 }),
  c('Doxa', 'SUB 200 Divingstar', '799.10.361.10', 'ETA 2824-2', 'auto', 2019, null, 1100, 800, { wr: 200, size: 42, water: 1 }),
  // Doxa — SUB 300T
  c('Doxa', 'SUB 300T Aquamarine', '840.10.241.10', 'ETA 2824-2', 'auto', 2019, null, 1650, 1200, { wr: 300, size: 42.5, water: 1 }),
  c('Doxa', 'SUB 300T Searambler', '840.10.021.10', 'ETA 2824-2', 'auto', 2019, null, 1650, 1200, { wr: 300, size: 42.5, water: 1 }),
  c('Doxa', 'SUB 300T Caribbean', '840.10.201.10', 'ETA 2824-2', 'auto', 2019, null, 1650, 1200, { wr: 300, size: 42.5, water: 1 }),
  c('Doxa', 'SUB 300T Whitepearl', '840.10.011.10', 'ETA 2824-2', 'auto', 2019, null, 1650, 1200, { wr: 300, size: 42.5, water: 1 }),
  // Doxa — Army
  c('Doxa', 'Army Steel', '785.10.031.10', 'ETA 2824-2', 'auto', 2022, null, 1900, 1500, { wr: 300, size: 42.5, water: 1 }),
];
