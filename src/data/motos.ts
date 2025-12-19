// Images imports
import sport100Kls from '@/assets/motos/sport-100-kls.webp';
import sport100Els from '@/assets/motos/sport-100-els.webp';
import sport100ElsSpoke from '@/assets/motos/sport-100-els-spoke.webp';
import raider125 from '@/assets/motos/raider-125.webp';
import raider125Racing from '@/assets/motos/raider-125-racing.webp';
import raider125Fi from '@/assets/motos/raider-125-fi.webp';
import apache160Carb from '@/assets/motos/apache-160-carb.webp';
import apache1604v from '@/assets/motos/apache-160-4v.webp';
import apache160Fi from '@/assets/motos/apache-160-fi.webp';
import apache160FiRacing from '@/assets/motos/apache-160-fi-racing.webp';
import apache2004v from '@/assets/motos/apache-200-4v.webp';
import neoNx110 from '@/assets/motos/neo-nx-110.webp';
import dazz110 from '@/assets/motos/dazz-110.webp';
import ntorq125 from '@/assets/motos/ntorq-125.webp';
import kingGsFull from '@/assets/motos/king-gs-full.webp';
import agilityFusionNew from '@/assets/motos/agility-fusion-new.webp';
import twist from '@/assets/motos/agility-fusion.webp';
import oneMp from '@/assets/motos/one-mp.webp';
import oneMpTrakku from '@/assets/motos/one-mp-trakku-galeria-01.webp';
import advanceR125 from '@/assets/motos/advance-r-125.webp';
import x1Fi125 from '@/assets/motos/x1-fi-125.webp';
import newLife125 from '@/assets/motos/new-life-new.webp';
import mrx125Fox from '@/assets/motos/mrx-125-fox.webp';
import mrx125sFox from '@/assets/motos/mrx-125-s-fox.webp';
import mrx150 from '@/assets/motos/mrx-150.webp';
import mrx150Fox from '@/assets/motos/mrx-150-fox.webp';
import mrx200 from '@/assets/motos/mrx-200.webp';
import mrx200Fox from '@/assets/motos/mrx-200-fox.webp';
import mrxArizona from '@/assets/motos/mrx-arizona.webp';
import mrxArizonaFox from '@/assets/motos/mrx-arizona-fox.webp';
import mrxArizonaXplore from '@/assets/motos/mrx-arizona-xplore.webp';
import nitro125 from '@/assets/motos/nitro-125.webp';
import switch125 from '@/assets/motos/switch-125.webp';
import combat100 from '@/assets/motos/combat-100.webp';
import hunter150 from '@/assets/motos/hunter-150.webp';
import betAbs from '@/assets/motos/bet-abs.webp';
import venom18 from '@/assets/motos/venom-18.webp';
import tricargo200 from '@/assets/motos/tricargo-200.webp';
import tricargo300 from '@/assets/motos/tricargo-300.webp';
import zontes350R1 from '@/assets/motos/zontes-350-r1.webp';

export interface Moto {
  id: string;
  modelo: string;
  marca: 'TVS' | 'Victory' | 'Kymco' | 'Benelli' | 'Ceronte' | 'Zontes';
  categoria: 'sport' | 'trabajo' | 'automatica' | 'semi-automatica' | 'deportiva' | 'todo-terreno' | 'tricargo' | 'alta-gama';
  precio2026: number;
  cuotaInicial: number;
  precioContado: number;
  imagen: string;
  cilindrada?: string;
}

export const motos: Moto[] = [
  // TVS - TRABAJO
  {
    id: 'sport-100-kls',
    modelo: 'SPORT 100 KLS',
    marca: 'TVS',
    categoria: 'trabajo',
    precio2026: 5499999,
    cuotaInicial: 1250000,
    precioContado: 6099499,
    imagen: sport100Kls,
    cilindrada: '100cc'
  },
  {
    id: 'sport-100-kls-tk',
    modelo: 'SPORT 100 KLS TK',
    marca: 'TVS',
    categoria: 'trabajo',
    precio2026: 5699999,
    cuotaInicial: 1270000,
    precioContado: 6299499,
    imagen: sport100Kls,
    cilindrada: '100cc'
  },
  {
    id: 'sport-100-els-al',
    modelo: 'SPORT 100 ELS AL',
    marca: 'TVS',
    categoria: 'trabajo',
    precio2026: 5699999,
    cuotaInicial: 1270000,
    precioContado: 6299499,
    imagen: sport100Els,
    cilindrada: '100cc'
  },
  {
    id: 'sport-100-els-cargo',
    modelo: 'SPORT 100 ELS CARGO',
    marca: 'TVS',
    categoria: 'trabajo',
    precio2026: 5899999,
    cuotaInicial: 1290000,
    precioContado: 6499499,
    imagen: sport100Els,
    cilindrada: '100cc'
  },
  {
    id: 'sport-100-els-spoke-tk',
    modelo: 'SPORT 100 ELS SPOKE TK',
    marca: 'TVS',
    categoria: 'trabajo',
    precio2026: 5699999,
    cuotaInicial: 1270000,
    precioContado: 6299999,
    imagen: sport100ElsSpoke,
    cilindrada: '100cc'
  },
  // TVS - SPORT / DEPORTIVAS
  {
    id: 'raider-125-acc',
    modelo: 'RAIDER 125 ACC',
    marca: 'TVS',
    categoria: 'sport',
    precio2026: 7749999,
    cuotaInicial: 1562500,
    precioContado: 8437499,
    imagen: raider125,
    cilindrada: '125cc'
  },
  {
    id: 'raider-125-acc-tk',
    modelo: 'RAIDER 125 ACC TK',
    marca: 'TVS',
    categoria: 'sport',
    precio2026: 7949999,
    cuotaInicial: 1582500,
    precioContado: 8637499,
    imagen: raider125,
    cilindrada: '125cc'
  },
  {
    id: 'raider-125-racing',
    modelo: 'RAIDER 125 RACING EDITION',
    marca: 'TVS',
    categoria: 'sport',
    precio2026: 7999999,
    cuotaInicial: 1587500,
    precioContado: 8687499,
    imagen: raider125Racing,
    cilindrada: '125cc'
  },
  {
    id: 'raider-125-fi',
    modelo: 'RAIDER 125 FI',
    marca: 'TVS',
    categoria: 'sport',
    precio2026: 8699999,
    cuotaInicial: 1657500,
    precioContado: 9387499,
    imagen: raider125Fi,
    cilindrada: '125cc'
  },
  /*{
    id: 'stryker-125-indo',
    modelo: 'STRYKER 125 INDO',
    marca: 'TVS',
    categoria: 'trabajo',
    precio2026: 7199999,
    cuotaInicial: 1507500,
    precioContado: 7887499,
    imagen: raider125,
    cilindrada: '125cc'
  },
  // TVS - APACHE 160*/
  {
    id: 'apache-rtr-160-carb',
    modelo: 'APACHE RTR 160 CARB ABS',
    marca: 'TVS',
    categoria: 'deportiva',
    precio2026: 9499999,
    cuotaInicial: 1886000,
    precioContado: 10335999,
    imagen: apache160Carb,
    cilindrada: '160cc'
  },
  {
    id: 'apache-rtr-160-4v-xc-racing',
    modelo: 'APACHE RTR 160 4V XC RACING',
    marca: 'TVS',
    categoria: 'deportiva',
    precio2026: 10099999,
    cuotaInicial: 1946000,
    precioContado: 10935999,
    imagen: apache1604v,
    cilindrada: '160cc'
  },
  {
    id: 'apache-rtr-160-4v-xc-fi',
    modelo: 'APACHE RTR 160 4V XC FI',
    marca: 'TVS',
    categoria: 'deportiva',
    precio2026: 10899999,
    cuotaInicial: 2026000,
    precioContado: 11735999,
    imagen: apache160Fi,
    cilindrada: '160cc'
  },
  {
    id: 'apache-rtr-160-4v-xc-fi-abs',
    modelo: 'APACHE RTR 160 4V XC FI ABS RACING',
    marca: 'TVS',
    categoria: 'deportiva',
    precio2026: 11149999,
    cuotaInicial: 2051000,
    precioContado: 11985999,
    imagen: apache160FiRacing,
    cilindrada: '160cc'
  },
  // ELIMINADO: APACHE RTR 160 4V XC FI ABS DUO TONO
  // TVS - AUTOMÁTICAS
    {
    id: 'neon-nx-110',
    modelo: 'NEON NX 110',
    marca: 'TVS',
    categoria: 'semi-automatica',
    precio2026: 6599999,
    cuotaInicial: 1447500,
    precioContado: 7287499,
    imagen: neoNx110,
    cilindrada: '110cc'
  },{
    id: 'dazz-110',
    modelo: 'DAZZ 110',
    marca: 'TVS',
    categoria: 'automatica',
    precio2026: 6999999,
    cuotaInicial: 1487500,
    precioContado: 7687499,
    imagen: dazz110,
    cilindrada: '110cc'
  },
  {
    id: 'ntorq-125-xc',
    modelo: 'NTORQ 125 XC',
    marca: 'TVS',
    categoria: 'automatica',
    precio2026: 7999999,
    cuotaInicial: 1587500,
    precioContado: 8687499,
    imagen: ntorq125,
    cilindrada: '125cc'
  },
  {
    id: 'ntorq-125-xconnect',
    modelo: 'NTORQ 125 XCONNECT FI',
    marca: 'TVS',
    categoria: 'automatica',
    precio2026: 9999999,
    cuotaInicial: 1787500,
    precioContado: 10687499,
    imagen: ntorq125,
    cilindrada: '125cc'
  },
  // TVS - APACHE 200
  {
    id: 'apache-rtr-200-carb',
    modelo: 'APACHE RTR 200 CARB ABS',
    marca: 'TVS',
    categoria: 'deportiva',
    precio2026: 11999999,
    cuotaInicial: 2185500,
    precioContado: 12885499,
    imagen: apache2004v,
    cilindrada: '200cc'
  },
  {
    id: 'apache-rtr-200-4v-racing',
    modelo: 'APACHE RTR 200 4V RACING',
    marca: 'TVS',
    categoria: 'deportiva',
    precio2026: 12299999,
    cuotaInicial: 2215500,
    precioContado: 13185499,
    imagen: apache2004v,
    cilindrada: '200cc'
  },
  {
    id: 'apache-rtr-200-4v-xc-fi',
    modelo: 'APACHE RTR 200 4V XC FI ABS',
    marca: 'TVS',
    categoria: 'deportiva',
    precio2026: 13699000,
    cuotaInicial: 2377400,
    precioContado: 14606500,
    imagen: apache2004v,
    cilindrada: '200cc'
  },
  // ELIMINADO: APACHE RTR 200 4V XC FI ABS DUO TONO
  // TVS - APACHE 310
  {
    id: 'apache-rtr-310',
    modelo: 'APACHE RTR 310',
    marca: 'TVS',
    categoria: 'alta-gama',
    precio2026: 27799999,
    cuotaInicial: 4277000,
    precioContado: 29196999,
    imagen: apache160Fi,
    cilindrada: '310cc'
  },
  // ELIMINADO: APACHE RTR 310 PRM
  // TVS - KING
  {
    id: 'king-gs-plus',
    modelo: 'KING GS+',
    marca: 'TVS',
    categoria: 'tricargo',
    precio2026: 17299999,
    cuotaInicial: 2875000,
    precioContado: 18344999,
    imagen: kingGsFull,
    cilindrada: '200cc'
  },
  {
    id: 'king-gs-plus-esp',
    modelo: 'KING GS+ ESPECIAL',
    marca: 'TVS',
    categoria: 'tricargo',
    precio2026: 18099999,
    cuotaInicial: 2955000,
    precioContado: 19144999,
    imagen: kingGsFull,
    cilindrada: '200cc'
  },
  {
    id: 'king-gs-plus-full',
    modelo: 'KING GS+ FULL',
    marca: 'TVS',
    categoria: 'tricargo',
    precio2026: 18899999,
    cuotaInicial: 3057000,
    precioContado: 19966999,
    imagen: kingGsFull,
    cilindrada: '200cc'
  },
  {
    id: 'king-deluxe-basico',
    modelo: 'KING DELUXE BÁSICO',
    marca: 'TVS',
    categoria: 'tricargo',
    precio2026: 17499000,
    cuotaInicial: 2894900,
    precioContado: 18544000,
    imagen: kingGsFull,
    cilindrada: '200cc'
  },
  // ELIMINADO: KING DELUXE ESPECIAL
  {
    id: 'king-deluxe-full',
    modelo: 'KING DELUXE FULL',
    marca: 'TVS',
    categoria: 'tricargo',
    precio2026: 19099000,
    cuotaInicial: 3054900,
    precioContado: 20144000,
    imagen: kingGsFull,
    cilindrada: '200cc'
  },
  // KYMCO
  {
    id: 'twist',
    modelo: 'TWIST',
    marca: 'Kymco',
    categoria: 'automatica',
    precio2026: 7399000,
    cuotaInicial: 1527400,
    precioContado: 8086500,
    imagen: twist,
    cilindrada: '125cc'
  },
  {
    id: 'agility-fusion',
    modelo: 'AGILITY FUSION',
    marca: 'Kymco',
    categoria: 'automatica',
    precio2026: 9399000,
    cuotaInicial: 1727400,
    precioContado: 10086500,
    imagen: agilityFusionNew,
    cilindrada: '125cc'
  },
  {
    id: 'agility-fusion-cbs',
    modelo: 'AGILITY FUSION CBS',
    marca: 'Kymco',
    categoria: 'automatica',
    precio2026: 9699000,
    cuotaInicial: 1757400,
    precioContado: 10386500,
    imagen: agilityFusionNew,
    cilindrada: '125cc'
  },
  {
    id: 'agility-fusion-tk',
    modelo: 'AGILITY FUSION TK',
    marca: 'Kymco',
    categoria: 'automatica',
    precio2026: 9599000,
    cuotaInicial: 1747400,
    precioContado: 10286500,
    imagen: agilityFusionNew,
    cilindrada: '125cc'
  },
  {
    id: 'agility-fusion-tk-cbs',
    modelo: 'AGILITY FUSION TK CBS',
    marca: 'Kymco',
    categoria: 'automatica',
    precio2026: 9899000,
    cuotaInicial: 1777400,
    precioContado: 10586500,
    imagen: agilityFusionNew,
    cilindrada: '125cc'
  },
      // VICTORY - SEMIAUTOMÁTICAS
  {
    id: 'one-mp',
    modelo: 'ONE MP',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 5549000,
    cuotaInicial: 1254400,
    precioContado: 6148500,
    imagen: oneMp,
    cilindrada: '100cc'
  },
  {
    id: 'one-mp-tk',
    modelo: 'ONE MP TK',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 5749000,
    cuotaInicial: 1274400,
    precioContado: 6348500,
    imagen: oneMpTrakku,
    cilindrada: '100cc'
  },
  {
    id: 'one-mp-tk-cbs',
    modelo: 'ONE MP TK CBS',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 5749000,
    cuotaInicial: 1274400,
    precioContado: 6348500,
    imagen: oneMpTrakku,
    cilindrada: '100cc'
  },
  {
    id: 'advance-r-125',
    modelo: 'ADVANCE R 125',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 6299000,
    cuotaInicial: 1417400,
    precioContado: 6986500,
    imagen: advanceR125,
    cilindrada: '125cc'
  },
  {
    id: 'advance-r-125-tk',
    modelo: 'ADVANCE R 125 TK',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 6499000,
    cuotaInicial: 1437400,
    precioContado: 7186500,
    imagen: advanceR125,
    cilindrada: '125cc'
  },
  {
    id: 'advance-r-125-cbs',
    modelo: 'ADVANCE R 125 CBS',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 6399000,
    cuotaInicial: 1427400,
    precioContado: 7086500,
    imagen: advanceR125,
    cilindrada: '125cc'
  },
  {
    id: 'advance-r-125-tk-cbs',
    modelo: 'ADVANCE R 125 TK CBS',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 6599000,
    cuotaInicial: 1447400,
    precioContado: 7286500,
    imagen: advanceR125,
    cilindrada: '125cc'
  },
  {
    id: 'x1-fi-tk',
    modelo: 'X1 FI TK',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 7699000,
    cuotaInicial: 1705900,
    precioContado: 8535000,
    imagen: x1Fi125,
    cilindrada: '125cc'
  },
  {
    id: 'x1-fi-tk-cbs',
    modelo: 'X1 FI TK CBS',
    marca: 'Victory',
    categoria: 'semi-automatica',
    precio2026: 7849000,
    cuotaInicial: 1720900,
    precioContado: 8685000,
    imagen: x1Fi125,
    cilindrada: '125cc'
  },
  // VICTORY - AUTOMÁTICAS
  {
    id: 'new-life-125',
    modelo: 'NEW LIFE 125',
    marca: 'Victory',
    categoria: 'automatica',
    precio2026: 7349000,
    cuotaInicial: 1522400,
    precioContado: 8036500,
    imagen: newLife125,
    cilindrada: '125cc'
  },
  {
    id: 'new-life-125-tk',
    modelo: 'NEW LIFE 125 TK',
    marca: 'Victory',
    categoria: 'automatica',
    precio2026: 7549000,
    cuotaInicial: 1542400,
    precioContado: 8236500,
    imagen: newLife125,
    cilindrada: '125cc'
  },
  {
    id: 'new-life-125-tk-cbs',
    modelo: 'NEW LIFE 125 TK CBS',
    marca: 'Victory',
    categoria: 'automatica',
    precio2026: 7749000,
    cuotaInicial: 1562400,
    precioContado: 8436500,
    imagen: newLife125,
    cilindrada: '125cc'
  },
  // VICTORY - TODO TERRENO (MRX)
  {
    id: 'mrx-125',
    modelo: 'MRX 125',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 8789000,
    cuotaInicial: 1666400,
    precioContado: 9476500,
    imagen: mrx125Fox,
    cilindrada: '125cc'
  },
  {
    id: 'mrx-125-s',
    modelo: 'MRX 125 S',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 8789000,
    cuotaInicial: 1666400,
    precioContado: 9476500,
    imagen: mrx125sFox,
    cilindrada: '125cc'
  },
  {
    id: 'mrx-125-s-tk',
    modelo: 'MRX 125 S TK',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 8989000,
    cuotaInicial: 1686400,
    precioContado: 9676500,
    imagen: mrx125sFox,
    cilindrada: '125cc'
  },
  {
    id: 'mrx-125-fox-tk',
    modelo: 'MRX 125 FOX TK',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 9389000,
    cuotaInicial: 1726400,
    precioContado: 10076500,
    imagen: mrx125Fox,
    cilindrada: '125cc'
  },
  {
    id: 'mrx-125-fox-tk-cbs',
    modelo: 'MRX 125 FOX TK CBS',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 9539000,
    cuotaInicial: 1741400,
    precioContado: 10226500,
    imagen: mrx125Fox,
    cilindrada: '125cc'
  },
  {
    id: 'mrx-150',
    modelo: 'MRX 150',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 9390000,
    cuotaInicial: 1897000,
    precioContado: 10248000,
    imagen: mrx150,
    cilindrada: '150cc'
  },
  {
    id: 'mrx-150-tk',
    modelo: 'MRX 150 TK',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 9590000,
    cuotaInicial: 1917000,
    precioContado: 10448000,
    imagen: mrx150,
    cilindrada: '150cc'
  },
  {
    id: 'mrx-150-fox-tk',
    modelo: 'MRX 150 FOX TK',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 9990000,
    cuotaInicial: 1957000,
    precioContado: 10848000,
    imagen: mrx150Fox,
    cilindrada: '150cc'
  },
  {
    id: 'mrx-150-fox-tk-cbs',
    modelo: 'MRX 150 FOX TK CBS',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 10140000,
    cuotaInicial: 1972000,
    precioContado: 10998000,
    imagen: mrx150Fox,
    cilindrada: '150cc'
  },
  {
    id: 'mrx-200',
    modelo: 'MRX 200',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 11490000,
    cuotaInicial: 2129000,
    precioContado: 12370000,
    imagen: mrx200,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-200-tk-abs',
    modelo: 'MRX 200 TK ABS',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 11490000,
    cuotaInicial: 2129000,
    precioContado: 12370000,
    imagen: mrx200,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-200-fox-tk',
    modelo: 'MRX 200 FOX TK',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 11690000,
    cuotaInicial: 2149000,
    precioContado: 12570000,
    imagen: mrx200Fox,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-200-fox-tk-abs',
    modelo: 'MRX 200 FOX TK ABS',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 11940000,
    cuotaInicial: 2174000,
    precioContado: 12820000,
    imagen: mrx200Fox,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-arizona',
    modelo: 'MRX ARIZONA',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 11790000,
    cuotaInicial: 2159000,
    precioContado: 12670000,
    imagen: mrxArizona,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-arizona-tk-abs',
    modelo: 'MRX ARIZONA TK ABS',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 11990000,
    cuotaInicial: 2179000,
    precioContado: 12870000,
    imagen: mrxArizona,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-arizona-fox-tk',
    modelo: 'MRX ARIZONA FOX TK',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 12190000,
    cuotaInicial: 2199000,
    precioContado: 13070000,
    imagen: mrxArizonaFox,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-arizona-fox-tk-abs',
    modelo: 'MRX ARIZONA FOX TK ABS',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 12390000,
    cuotaInicial: 2219000,
    precioContado: 13270000,
    imagen: mrxArizonaFox,
    cilindrada: '200cc'
  },
  {
    id: 'mrx-arizona-explore',
    modelo: 'MRX ARIZONA EXPLORE',
    marca: 'Victory',
    categoria: 'todo-terreno',
    precio2026: 12590000,
    cuotaInicial: 2239000,
    precioContado: 13470000,
    imagen: mrxArizonaXplore,
    cilindrada: '200cc'
  },
  // VICTORY - URBANAS
  {
    id: 'nitro-125',
    modelo: 'NITRO 125 FACELIFT',
    marca: 'Victory',
    categoria: 'sport',
    precio2026: 6599000,
    cuotaInicial: 1447400,
    precioContado: 7286500,
    imagen: nitro125,
    cilindrada: '125cc'
  },
  {
    id: 'nitro-125-tk',
    modelo: 'NITRO 125 FACELIFT TK',
    marca: 'Victory',
    categoria: 'sport',
    precio2026: 6799000,
    cuotaInicial: 1467400,
    precioContado: 7486500,
    imagen: nitro125,
    cilindrada: '125cc'
  },
  {
    id: 'nitro-125-tk-cbs',
    modelo: 'NITRO 125 FACELIFT TK CBS',
    marca: 'Victory',
    categoria: 'sport',
    precio2026: 7199000,
    cuotaInicial: 1507400,
    precioContado: 7886500,
    imagen: nitro125,
    cilindrada: '125cc'
  },
  {
    id: 'switch-125',
    modelo: 'SWITCH 125',
    marca: 'Victory',
    categoria: 'sport',
    precio2026: 7549000,
    cuotaInicial: 1542400,
    precioContado: 8236500,
    imagen: switch125,
    cilindrada: '125cc'
  },
  {
    id: 'switch-125-tk',
    modelo: 'SWITCH 125 TK',
    marca: 'Victory',
    categoria: 'sport',
    precio2026: 7799000,
    cuotaInicial: 1567400,
    precioContado: 8486500,
    imagen: switch125,
    cilindrada: '125cc'
  },
  {
    id: 'switch-125-tk-cbs',
    modelo: 'SWITCH 125 TK CBS',
    marca: 'Victory',
    categoria: 'sport',
    precio2026: 7799000,
    cuotaInicial: 1567400,
    precioContado: 8486500,
    imagen: switch125,
    cilindrada: '125cc'
  },
  {
    id: 'combat-100',
    modelo: 'COMBAT 100',
    marca: 'Victory',
    categoria: 'trabajo',
    precio2026: 4390000,
    cuotaInicial: 1138500,
    precioContado: 4989500,
    imagen: combat100,
    cilindrada: '100cc'
  },
  /*{
    id: 'bomber-125',
    modelo: 'BOMBER 125',
    marca: 'Victory',
    categoria: 'trabajo',
    precio2026: 5599000,
    cuotaInicial: 1347400,
    precioContado: 6286500,
    imagen: combat100,
    cilindrada: '125cc'
  },*/
  {
    id: 'bomber-125-tk',
    modelo: 'BOMBER 125 TK',
    marca: 'Victory',
    categoria: 'trabajo',
    precio2026: 5799000,
    cuotaInicial: 1367400,
    precioContado: 6486500,
    imagen: combat100,
    cilindrada: '125cc'
  },
  {
    id: 'bomber-125-tk-cbs',
    modelo: 'BOMBER 125 TK CBS',
    marca: 'Victory',
    categoria: 'trabajo',
    precio2026: 5899000,
    cuotaInicial: 1377400,
    precioContado: 6586500,
    imagen: combat100,
    cilindrada: '125cc'
  },
  // VICTORY - DEPORTIVAS
  {
    id: 'hunter-150-fi',
    modelo: 'HUNTER 150 FI',
    marca: 'Victory',
    categoria: 'automatica',
    precio2026: 8299000,
    cuotaInicial: 1799900,
    precioContado: 9169000,
    imagen: hunter150,
    cilindrada: '150cc'
  },
  {
    id: 'bet-abs-tk',
    modelo: 'BET ABS TK',
    marca: 'Victory',
    categoria: 'automatica',
    precio2026: 12999000,
    cuotaInicial: 2269900,
    precioContado: 13869000,
    imagen: betAbs,
    cilindrada: '150cc'
  },
  {
    id: 'venom-14',
    modelo: 'VENOM 14',
    marca: 'Victory',
    categoria: 'deportiva',
    precio2026: 8399000,
    cuotaInicial: 1775900,
    precioContado: 9235000,
    imagen: venom18,
    cilindrada: '150cc'
  },
  {
    id: 'venom-18',
    modelo: 'VENOM 18',
    marca: 'Victory',
    categoria: 'deportiva',
    precio2026: 9149000,
    cuotaInicial: 1900400,
    precioContado: 10034500,
    imagen: venom18,
    cilindrada: '200cc'
  },
  {
    id: 'venom-250s',
    modelo: 'VENOM 250S',
    marca: 'Victory',
    categoria: 'deportiva',
    precio2026: 8999000,
    cuotaInicial: 2407900,
    precioContado: 10407000,
    imagen: venom18,
    cilindrada: '250cc'
  },
  // BENELLI
  {
    id: 'tnt25n',
    modelo: 'TNT25N',
    marca: 'Benelli',
    categoria: 'deportiva',
    precio2026: 10490000,
    cuotaInicial: 2606500,
    precioContado: 13456500,
    imagen: venom18,
    cilindrada: '250cc'
  },
  // CERONTE
  {
    id: 'tricargo-200',
    modelo: 'TRICARGO 200 REFRIGERADO',
    marca: 'Ceronte',
    categoria: 'tricargo',
    precio2026: 15990000,
    cuotaInicial: 2644000,
    precioContado: 17035000,
    imagen: tricargo200,
    cilindrada: '200cc'
  },
  {
    id: 'tricargo-300',
    modelo: 'TRICARGO 300',
    marca: 'Ceronte',
    categoria: 'tricargo',
    precio2026: 24499000,
    cuotaInicial: 4055900,
    precioContado: 26105000,
    imagen: tricargo300,
    cilindrada: '300cc'
  },
  {
    id: 'tricargo-300-hidraulico',
    modelo: 'TRICARGO 300 HIDRAULICO',
    marca: 'Ceronte',
    categoria: 'tricargo',
    precio2026: 25499000,
    cuotaInicial: 4155900,
    precioContado: 27105000,
    imagen: tricargo300,
    cilindrada: '300cc'
  },
  // ZONTES
  {
    id: 'zontes-350-r1',
    modelo: '350 R1',
    marca: 'Zontes',
    categoria: 'alta-gama',
    precio2026: 20990000,
    cuotaInicial: 3705000,
    precioContado: 22676000,
    imagen: zontes350R1,
    cilindrada: '350cc'
  },
];

export const marcas = ['TVS', 'Victory', 'Kymco', 'Benelli', 'Ceronte', 'Zontes'] as const;
export const categorias = [
  { id: 'todas', nombre: 'Todas' },
  { id: 'trabajo', nombre: 'Trabajo' },
  { id: 'sport', nombre: 'Sport' },
  { id: 'automatica', nombre: 'Automáticas' },
  { id: 'semi-automatica', nombre: 'Semi Automáticas' },
  { id: 'deportiva', nombre: 'Deportivas' },
  { id: 'todo-terreno', nombre: 'Todo Terreno' },
  { id: 'tricargo', nombre: 'Tricargo' },
  { id: 'alta-gama', nombre: 'Alta Gama' },
] as const;








