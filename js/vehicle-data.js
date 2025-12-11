/**
 * VEHICLE DATA - Dados de veículos para o filtro de busca
 * Marcas e modelos populares no Brasil (2000-2025)
 */

window.vehicleData = {
    // ==================== CARROS ====================
    car: {
        'chevrolet': {
            name: 'Chevrolet',
            models: ['Onix', 'Onix Plus', 'Tracker', 'S10', 'Cruze', 'Spin', 'Montana', 'Equinox', 'Trailblazer', 'Cobalt', 'Prisma', 'Celta', 'Classic', 'Corsa', 'Astra', 'Vectra']
        },
        'fiat': {
            name: 'Fiat',
            models: ['Argo', 'Mobi', 'Toro', 'Strada', 'Cronos', 'Pulse', 'Fastback', 'Uno', 'Palio', 'Siena', 'Punto', 'Linea', 'Bravo', 'Ducato', 'Fiorino', 'Doblò']
        },
        'volkswagen': {
            name: 'Volkswagen',
            models: ['Gol', 'Polo', 'T-Cross', 'Amarok', 'Saveiro', 'Virtus', 'Nivus', 'Taos', 'Tiguan', 'Jetta', 'Golf', 'Voyage', 'Fox', 'Up!', 'Fusca', 'Kombi']
        },
        'ford': {
            name: 'Ford',
            models: ['Ka', 'Ka Sedan', 'Ranger', 'EcoSport', 'Fusion', 'Focus', 'Fiesta', 'Territory', 'Bronco', 'Maverick', 'Edge', 'Mustang']
        },
        'toyota': {
            name: 'Toyota',
            models: ['Corolla', 'Corolla Cross', 'Hilux', 'SW4', 'Yaris', 'Yaris Sedan', 'RAV4', 'Camry', 'Prius', 'Etios', 'Fielder']
        },
        'honda': {
            name: 'Honda',
            models: ['Civic', 'City', 'HR-V', 'Fit', 'CR-V', 'Accord', 'WR-V', 'ZR-V']
        },
        'hyundai': {
            name: 'Hyundai',
            models: ['HB20', 'HB20S', 'Creta', 'Tucson', 'Santa Fe', 'i30', 'Elantra', 'Azera', 'ix35', 'Veloster']
        },
        'renault': {
            name: 'Renault',
            models: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch', 'Stepway', 'Kardian', 'Clio', 'Megane', 'Fluence', 'Master']
        },
        'jeep': {
            name: 'Jeep',
            models: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Grand Cherokee', 'Cherokee', 'Gladiator']
        },
        'nissan': {
            name: 'Nissan',
            models: ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March', 'Altima', 'X-Trail', 'Leaf', 'Pathfinder']
        },
        'mitsubishi': {
            name: 'Mitsubishi',
            models: ['L200', 'Outlander', 'Eclipse Cross', 'Pajero', 'Pajero Sport', 'ASX', 'Lancer']
        },
        'peugeot': {
            name: 'Peugeot',
            models: ['208', '2008', '3008', '308', '408', '508', 'Partner', 'Expert', 'Boxer']
        },
        'citroen': {
            name: 'Citroën',
            models: ['C3', 'C4 Cactus', 'C4 Lounge', 'Aircross', 'Jumpy', 'Jumper', 'Berlingo']
        },
        'kia': {
            name: 'Kia',
            models: ['Sportage', 'Sorento', 'Cerato', 'Soul', 'Picanto', 'Stinger', 'Carnival', 'Seltos', 'EV6']
        },
        'bmw': {
            name: 'BMW',
            models: ['Série 1', 'Série 3', 'Série 5', 'X1', 'X3', 'X5', 'X6', 'Z4', 'i3', 'iX']
        },
        'mercedes': {
            name: 'Mercedes-Benz',
            models: ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLB', 'GLC', 'GLE', 'Sprinter', 'Vito']
        },
        'audi': {
            name: 'Audi',
            models: ['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'e-tron']
        }
    },

    // ==================== MOTOS ====================
    moto: {
        'honda': {
            name: 'Honda',
            models: ['Biz 110', 'Biz 125', 'Pop 110', 'CG 160', 'CG Titan', 'CG Fan', 'CG Start', 'Bros 160', 'XRE 190', 'XRE 300', 'CB 250', 'CB 300', 'CB 500', 'CB 650', 'CB 1000', 'PCX 150', 'Elite 125', 'ADV 150', 'Sahara 300', 'Transalp', 'Hornet', 'NC 750']
        },
        'yamaha': {
            name: 'Yamaha',
            models: ['Factor 125', 'Factor 150', 'Fazer 150', 'Fazer 250', 'Crosser 150', 'Crosser S', 'Lander 250', 'XTZ 250', 'MT-03', 'MT-07', 'MT-09', 'YZF-R3', 'Neo 125', 'NMAX 160', 'Fluo 125', 'XJ6', 'Ténéré 250', 'Ténéré 700']
        },
        'suzuki': {
            name: 'Suzuki',
            models: ['Intruder 125', 'Burgman 125', 'Address 110', 'DR 160', 'Haojue DK 150', 'V-Strom 650', 'V-Strom 1000', 'GSX-R 750', 'GSX-R 1000', 'GSX-S 750', 'GSX-S 1000', 'Hayabusa']
        },
        'kawasaki': {
            name: 'Kawasaki',
            models: ['Z400', 'Z650', 'Z900', 'Z1000', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Versys 650', 'Versys 1000', 'Vulcan S']
        },
        'bmw': {
            name: 'BMW Motorrad',
            models: ['G 310 R', 'G 310 GS', 'F 750 GS', 'F 850 GS', 'R 1250 GS', 'R 1250 RT', 'S 1000 R', 'S 1000 RR', 'S 1000 XR']
        },
        'ducati': {
            name: 'Ducati',
            models: ['Monster', 'Scrambler', 'Multistrada', 'Diavel', 'Panigale V2', 'Panigale V4', 'Streetfighter', 'Hypermotard', 'XDiavel']
        },
        'harley-davidson': {
            name: 'Harley-Davidson',
            models: ['Iron 883', 'Sportster S', 'Forty-Eight', 'Fat Bob', 'Low Rider', 'Street Glide', 'Road King', 'Heritage', 'Pan America', 'Nightster']
        },
        'triumph': {
            name: 'Triumph',
            models: ['Street Twin', 'Trident 660', 'Tiger 660', 'Tiger 900', 'Tiger 1200', 'Speed Twin', 'Bonneville', 'Scrambler', 'Rocket 3']
        },
        'royal-enfield': {
            name: 'Royal Enfield',
            models: ['Meteor 350', 'Classic 350', 'Hunter 350', 'Himalayan', 'Continental GT', 'Interceptor 650']
        },
        'dafra': {
            name: 'Dafra',
            models: ['Zig 50', 'Next 250', 'Apache 150', 'Apache 200', 'Citycom 300', 'Cruisym 150', 'Horizon 150']
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
