/**
 * VEHICLE DATA - Dados de veículos para o filtro de busca
 * Marcas e modelos populares no Brasil (2000-2025)
 */

window.vehicleData = {
    // ==================== CARROS ====================
    car: {
        'chevrolet': {
            name: 'Chevrolet',
            models: ['Onix', 'Onix Plus', 'Tracker', 'S10', 'Cruze', 'Spin', 'Montana', 'Equinox', 'Trailblazer', 'Cobalt', 'Prisma', 'Celta', 'Classic', 'Corsa', 'Astra', 'Vectra', 'Blazer', 'Zafira', 'Captiva', 'Camaro']
        },
        'fiat': {
            name: 'Fiat',
            models: ['Argo', 'Mobi', 'Toro', 'Strada', 'Cronos', 'Pulse', 'Fastback', 'Uno', 'Palio', 'Siena', 'Punto', 'Linea', 'Bravo', 'Ducato', 'Fiorino', 'Doblò', 'Grand Siena', 'Idea', '500', 'Toro Ranch']
        },
        'volkswagen': {
            name: 'Volkswagen',
            models: ['Gol', 'Polo', 'T-Cross', 'Amarok', 'Saveiro', 'Virtus', 'Nivus', 'Taos', 'Tiguan', 'Jetta', 'Golf', 'Voyage', 'Fox', 'Up!', 'Fusca', 'Kombi', 'Passat', 'Bora', 'SpaceFox', 'CrossFox']
        },
        'ford': {
            name: 'Ford',
            models: ['Ka', 'Ka Sedan', 'Ranger', 'EcoSport', 'Fusion', 'Focus', 'Fiesta', 'Territory', 'Bronco', 'Maverick', 'Edge', 'Mustang', 'F-250', 'Transit', 'Courier']
        },
        'toyota': {
            name: 'Toyota',
            models: ['Corolla', 'Corolla Cross', 'Hilux', 'SW4', 'Yaris', 'Yaris Sedan', 'RAV4', 'Camry', 'Prius', 'Etios', 'Fielder', 'Bandeirante', 'Land Cruiser']
        },
        'honda': {
            name: 'Honda',
            models: ['Civic', 'City', 'HR-V', 'Fit', 'CR-V', 'Accord', 'WR-V', 'ZR-V', 'City Hatch']
        },
        'hyundai': {
            name: 'Hyundai',
            models: ['HB20', 'HB20S', 'HB20X', 'Creta', 'Tucson', 'Santa Fe', 'i30', 'Elantra', 'Azera', 'ix35', 'Veloster', 'HB20 Sport']
        },
        'renault': {
            name: 'Renault',
            models: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch', 'Stepway', 'Kardian', 'Clio', 'Megane', 'Fluence', 'Master', 'Symbol', 'Scenic']
        },
        'jeep': {
            name: 'Jeep',
            models: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee', 'Cherokee', 'Gladiator']
        },
        'nissan': {
            name: 'Nissan',
            models: ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March', 'Altima', 'X-Trail', 'Leaf', 'Murano', 'Livina', 'Tiida']
        },
        'mitsubishi': {
            name: 'Mitsubishi',
            models: ['L200 Triton', 'Outlander', 'Eclipse Cross', 'Pajero', 'Pajero Sport', 'ASX', 'Lancer', 'Pajero Full', 'Pajero Dakar']
        },
        'peugeot': {
            name: 'Peugeot',
            models: ['208', '2008', '3008', '308', '408', '508', 'Partner', 'Expert', 'Boxer', '206', '207', '307']
        },
        'citroen': {
            name: 'Citroën',
            models: ['C3', 'C4 Cactus', 'C4 Lounge', 'Aircross', 'Jumpy', 'Jumper', 'Berlingo', 'C3 Picasso', 'C4', 'Xsara']
        },
        'kia': {
            name: 'Kia',
            models: ['Sportage', 'Sorento', 'Cerato', 'Soul', 'Picanto', 'Stinger', 'Carnival', 'Seltos', 'Bongo']
        }
    },

    // ==================== MOTOS ====================
    moto: {
        'honda': {
            name: 'Honda',
            models: [
                // Populares / Trabalho
                'CG 125', 'CG 150', 'CG 160 Titan', 'CG 160 Fan', 'CG 160 Start', 'CG 160 Cargo',
                'Biz 100', 'Biz 110', 'Biz 125',
                'Pop 100', 'Pop 110',
                'Bros 125', 'Bros 150', 'Bros 160',
                // Trail / Adventure
                'XRE 190', 'XRE 300', 'XRE 300 Rally', 'Sahara 300', 'Transalp 750',
                'XR 250 Tornado', 'NX 400i Falcon',
                // Street / Naked
                'CB 250 Twister', 'CB 300', 'CB 500F', 'CB 650R', 'CB 1000R', 'Hornet',
                // Scooter
                'PCX 150', 'PCX 160', 'Elite 125', 'ADV 150', 'SH 150',
                // Sport
                'CBR 250R', 'CBR 500R', 'CBR 650R', 'CBR 1000RR'
            ]
        },
        'yamaha': {
            name: 'Yamaha',
            models: [
                // Populares / Trabalho
                'YBR 125 Factor', 'YBR 150 Factor', 'Fazer 150', 'Fazer 250',
                'Crosser 150', 'Crosser 150 S', 'Crosser 150 Z',
                'Lander 250',
                // Trail / Adventure
                'XTZ 125', 'XTZ 150 Crosser', 'XTZ 250 Lander', 'XTZ 250 Ténéré',
                'Ténéré 700', 'XT 660R',
                // Street / Naked
                'MT-03', 'MT-07', 'MT-09', 'XJ6 N',
                'FZ25 Fazer', 'FZ 15', 'FZ 25',
                // Scooter
                'Neo 125', 'NMAX 160', 'XMAX 250', 'Fluo 125',
                // Sport
                'YZF-R3', 'YZF-R6', 'YZF-R1'
            ]
        },
        'suzuki': {
            name: 'Suzuki',
            models: [
                // Populares
                'Intruder 125', 'Yes 125', 'GSR 125', 'GSR 150',
                // Scooter
                'Burgman 125', 'Burgman 400', 'Address 110',
                // Trail
                'DR 160', 'DR-Z 400',
                // Street / Naked
                'GSX-S 750', 'GSX-S 1000', 'Bandit 650', 'Bandit 1250',
                // Sport
                'GSX-R 750', 'GSX-R 1000', 'GSX-R 1000R',
                // Adventure
                'V-Strom 650', 'V-Strom 1000', 'V-Strom 1050',
                // Custom
                'Boulevard M800', 'Boulevard M1500'
            ]
        },
        'kawasaki': {
            name: 'Kawasaki',
            models: [
                // Naked
                'Z300', 'Z400', 'Z650', 'Z900', 'Z1000',
                // Sport
                'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja H2',
                // Adventure
                'Versys 650', 'Versys 1000', 'Versys-X 300',
                // Custom
                'Vulcan S', 'Vulcan 900',
                // Off-road
                'KX 250', 'KX 450', 'KLX 110', 'KLX 300'
            ]
        },
        'bmw': {
            name: 'BMW Motorrad',
            models: [
                // Adventure
                'G 310 GS', 'F 750 GS', 'F 850 GS', 'F 850 GS Adventure',
                'R 1250 GS', 'R 1250 GS Adventure',
                // Street
                'G 310 R', 'S 1000 R',
                // Sport
                'S 1000 RR', 'S 1000 XR',
                // Touring
                'R 1250 RT', 'K 1600 GTL',
                // Heritage
                'R nineT', 'R 18'
            ]
        },
        'harley-davidson': {
            name: 'Harley-Davidson',
            models: [
                // Sportster
                'Iron 883', 'Sportster S', 'Forty-Eight', 'Nightster',
                // Softail
                'Fat Bob', 'Low Rider', 'Heritage Classic', 'Fat Boy', 'Breakout',
                // Touring
                'Street Glide', 'Road King', 'Road Glide', 'Ultra Limited', 'Electra Glide',
                // Adventure
                'Pan America'
            ]
        },
        'triumph': {
            name: 'Triumph',
            models: [
                // Modern Classics
                'Street Twin', 'Bonneville T100', 'Bonneville T120', 'Speed Twin', 'Scrambler 1200',
                // Roadster
                'Trident 660', 'Street Triple', 'Speed Triple 1200',
                // Adventure
                'Tiger 660', 'Tiger 900', 'Tiger 1200',
                // Cruiser
                'Rocket 3'
            ]
        },
        'royal-enfield': {
            name: 'Royal Enfield',
            models: [
                'Meteor 350', 'Classic 350', 'Hunter 350', 'Bullet 350',
                'Himalayan', 'Continental GT', 'Interceptor 650'
            ]
        },
        'dafra': {
            name: 'Dafra',
            models: [
                'Zig 50', 'Zig+ 50',
                'Next 250', 'Next 300',
                'Apache 150', 'Apache RTR 200',
                'Citycom 300', 'Cruisym 150', 'Cruisym 300',
                'Horizon 150', 'NH 190'
            ]
        },
        'shineray': {
            name: 'Shineray',
            models: [
                'XY 50Q', 'XY 125', 'XY 150',
                'Jet 49cc', 'Phoenix 50', 'Phoenix Gold',
                'Worker 125', 'Retro 50'
            ]
        }
    },

    // Anos disponíveis
    getYears: function () {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear + 1; year >= 2000; year--) {
            years.push(year);
        }
        return years;
    },

    // Obter marcas por tipo de veículo
    getBrands: function (vehicleType) {
        return this[vehicleType] || {};
    },

    // Obter modelos por tipo e marca
    getModels: function (vehicleType, brandKey) {
        return this[vehicleType]?.[brandKey]?.models || [];
    },

    // Obter nome da marca
    getBrandName: function (vehicleType, brandKey) {
        return this[vehicleType]?.[brandKey]?.name || brandKey;
    }
};

console.log('✅ vehicle-data.js carregado');
