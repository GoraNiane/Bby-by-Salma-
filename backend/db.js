import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'data', 'store.json');

class Database {
  constructor() {
    this.data = null;
  }

  getDefaultData() {
    const defaultPasswordHash = bcrypt.hashSync('admin123', 10);

    return {
      adminUsers: [
        {
          id: 'admin_1',
          name: 'Salma - Administratrice BBS',
          email: 'admin@bbsbysalma.com',
          passwordHash: defaultPasswordHash,
          role: 'superadmin',
          avatar: '/assets/teint_marron.jpg'
        }
      ],
      categories: [
        {
          id: 'cat_teint',
          name: 'Teint & Carnation',
          slug: 'teint-carnation',
          description: 'Fonds de teint, correcteurs, poudres et illuminateurs adaptés à toutes les nuances.',
          image: '/assets/teint_noire.jpg',
          createdAt: new Date().toISOString()
        },
        {
          id: 'cat_soins',
          name: 'Soins Visage & Éclat',
          slug: 'soins-visage',
          description: 'Sérums ultra-hydratants, huiles de beauté et crèmes régénérantes.',
          image: '/assets/hero_banner.jpg',
          createdAt: new Date().toISOString()
        },
        {
          id: 'cat_levres',
          name: 'Lèvres & Brillance',
          slug: 'levres-brillance',
          description: 'Gloss repulpants, encres à lèvres et baumes nourrissants.',
          image: '/assets/teint_clair.jpg',
          createdAt: new Date().toISOString()
        },
        {
          id: 'cat_accessoires',
          name: 'Pinceaux & Accessoires',
          slug: 'pinceaux-accessoires',
          description: 'Sets de pinceaux professionnels en poils soyeux et éponges de précision.',
          image: '/assets/prod_poudre.jpg',
          createdAt: new Date().toISOString()
        }
      ],
      collections: [
        {
          id: 'col_teint_clair',
          name: 'Teint Clair',
          slug: 'teint-clair',
          categoryId: 'cat_teint',
          shade: 'Clair & Doré',
          shortDescription: 'Éclat, fraîcheur, naturel',
          description: 'Une gamme de produits spécialement sélectionnés pour sublimer les peaux claires avec des sous-tons chauds, rosés ou neutres.',
          coverImage: '/assets/teint_clair.jpg',
          images: ['/assets/teint_clair.jpg', '/assets/prod_fond_teint.jpg', '/assets/prod_poudre.jpg'],
          status: 'active',
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'col_teint_noire',
          name: 'Teint Noire',
          slug: 'teint-noire',
          categoryId: 'cat_teint',
          shade: 'Ébène & Chocolat Profond',
          shortDescription: 'Éclat, confiance, caractère',
          description: 'Des formules riches en pigments haute définition sans reflet grisâtre, sublimant la profondeur et la lumière des peaux noires.',
          coverImage: '/assets/teint_noire.jpg',
          images: ['/assets/teint_noire.jpg', '/assets/prod_fond_teint.jpg', '/assets/prod_poudre.jpg'],
          status: 'active',
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'col_teint_marron',
          name: 'Teint Marron',
          slug: 'teint-marron',
          categoryId: 'cat_teint',
          shade: 'Caramel & Canelle Dorée',
          shortDescription: 'Harmonie, douceur, élégance',
          description: 'La perfection pour les teints métissés, caramel et ambrés avec une fusion parfaite et un fini seconde peau satiné.',
          coverImage: '/assets/teint_marron.jpg',
          images: ['/assets/teint_marron.jpg', '/assets/prod_fond_teint.jpg', '/assets/hero_banner.jpg'],
          status: 'active',
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'col_teint_parfait',
          name: 'Collection Teint Parfait',
          slug: 'collection-teint-parfait',
          categoryId: 'cat_teint',
          shade: 'Toutes teintes',
          shortDescription: 'Le rituel beauté complet',
          description: 'Une collection signature réunissant fond de teint, correcteur, poudre fixatrice et pinceau applicateur haute précision.',
          coverImage: '/assets/hero_banner.jpg',
          images: ['/assets/hero_banner.jpg', '/assets/prod_fond_teint.jpg', '/assets/prod_poudre.jpg'],
          status: 'active',
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      products: [
        {
          id: 'prod_fond_teint_luxe',
          name: 'Fond de Teint BBS Radiance Glow',
          slug: 'fond-de-teint-bbs-radiance-glow',
          sku: 'BBS-FDT-001',
          brand: 'BBS By Salma',
          categoryId: 'cat_teint',
          collectionId: 'col_teint_marron',
          shortDescription: 'Couvrance modulable, fini lumineux seconde peau avec acide hyaluronique.',
          description: 'Le fond de teint iconique de BBS By Salma offre une couvrance moyenne à totale sans effet masque. Sa formule enrichie en niacinamide et huile de jojoba protège la peau tout au long de la journée tout en révélant son éclat naturel.',
          price: 22500,
          oldPrice: 28000,
          promoPrice: 22500,
          stock: 18,
          alertThreshold: 5,
          shade: 'Caramel Doré (Shade 04)',
          skinType: 'Tous types de peau',
          ingredients: 'Aqua, Isododecane, Dimethicone, Niacinamide, Simmondsia Chinensis Seed Oil, Hyaluronic Acid, Tocopherol (Vitamin E), Iron Oxides.',
          images: [
            { id: 'img_1', url: '/assets/prod_fond_teint.jpg', isPrimary: true, position: 1 },
            { id: 'img_2', url: '/assets/teint_marron.jpg', isPrimary: false, position: 2 },
            { id: 'img_3', url: '/assets/hero_banner.jpg', isPrimary: false, position: 3 }
          ],
          isFeatured: true,
          isNew: true,
          isBestSeller: true,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_poudre_compacte_soie',
          name: 'Poudre Compacte Veloutée BBS',
          slug: 'poudre-compacte-veloutee-bbs',
          sku: 'BBS-PDR-002',
          brand: 'BBS By Salma',
          categoryId: 'cat_teint',
          collectionId: 'col_teint_noire',
          shortDescription: 'Matifie sans assécher, floute les pores et fixe le maquillage 16h.',
          description: 'Une poudre ultra-fine compactée enrichie en micro-pigments sphériques. Elle absorbe l’excès de sébum sous les climats chauds et humides sans laisser de traces blanches ou grises.',
          price: 18000,
          oldPrice: 22000,
          promoPrice: 18000,
          stock: 14,
          alertThreshold: 5,
          shade: 'Ébène Royal (Shade 06)',
          skinType: 'Mixte à Grasse',
          ingredients: 'Mica, Talc, Silica, Zinc Stearate, Dimethicone, Butyrospermum Parkii (Shea) Butter, Phenoxyethanol.',
          images: [
            { id: 'img_p1', url: '/assets/prod_poudre.jpg', isPrimary: true, position: 1 },
            { id: 'img_p2', url: '/assets/teint_noire.jpg', isPrimary: false, position: 2 },
            { id: 'img_p3', url: '/assets/hero_banner.jpg', isPrimary: false, position: 3 }
          ],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_serum_elixir_eclat',
          name: 'Sérum Éclat Éternel 24K BBS',
          slug: 'serum-eclat-eternel-24k-bbs',
          sku: 'BBS-SRM-003',
          brand: 'BBS By Salma',
          categoryId: 'cat_soins',
          collectionId: 'col_teint_clair',
          shortDescription: 'Infusé à l’huile de rose musquée et vitamine C pure pour un glow irrésistible.',
          description: 'Sérum revitalisant concentré qui prépare la peau au maquillage, unifie le grain de peau et estompe les taches pigmentaires pour un teint frais et radieux dès la première application.',
          price: 25000,
          oldPrice: 30000,
          promoPrice: 25000,
          stock: 9,
          alertThreshold: 4,
          shade: 'Translucide Glow',
          skinType: 'Peaux ternes, déshydratées',
          ingredients: 'Rosa Canina Fruit Oil, Ascorbyl Tetraisopalmitate (Vitamin C), Squalane, Gold flakes 24k, Citrus Aurantium Dulcis Peel Oil.',
          images: [
            { id: 'img_s1', url: '/assets/teint_clair.jpg', isPrimary: true, position: 1 },
            { id: 'img_s2', url: '/assets/hero_banner.jpg', isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: true,
          isBestSeller: false,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_kit_pinceaux_prestige',
          name: 'Coffret Pinceaux Maquillage Prestige Rose Gold',
          slug: 'coffret-pinceaux-maquillage-prestige',
          sku: 'BBS-PIN-004',
          brand: 'BBS By Salma',
          categoryId: 'cat_accessoires',
          collectionId: 'col_teint_parfait',
          shortDescription: 'Ensemble de 8 pinceaux indispensables en fibres véganes ultra-douces.',
          description: 'Conçus pour une application sans traces : pinceau poudre, pinceau biseauté fond de teint, pinceau contouring, estompeur et pinceau lèvres avec pochette en similicuir nude.',
          price: 35000,
          oldPrice: 42000,
          promoPrice: 35000,
          stock: 4,
          alertThreshold: 5,
          shade: 'Rose Gold & Beige',
          skinType: 'Universel',
          ingredients: 'Fibres synthétiques antibactériennes haut de gamme, manche en bois noble et virole en aluminium doré.',
          images: [
            { id: 'img_k1', url: '/assets/hero_banner.jpg', isPrimary: true, position: 1 },
            { id: 'img_k2', url: '/assets/prod_poudre.jpg', isPrimary: false, position: 2 }
          ],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_gloss_volumateur_nude',
          name: 'Gloss Repulpant Brillance Miroir BBS',
          slug: 'gloss-repulpant-brillance-miroir',
          sku: 'BBS-GLS-005',
          brand: 'BBS By Salma',
          categoryId: 'cat_levres',
          collectionId: 'col_teint_marron',
          shortDescription: 'Lèvres sublimées, hydratation intense et effet repulpant sans coller.',
          description: 'Ce gloss luxueux apporte un fini vinyle ultra-brillant tout en nourrissant les lèvres avec du beurre de mangue et des peptides volumateurs.',
          price: 12500,
          oldPrice: 15000,
          promoPrice: 12500,
          stock: 22,
          alertThreshold: 6,
          shade: 'Nude Miel & Caramel',
          skinType: 'Toutes lèvres',
          ingredients: 'Polybutene, Octyldodecanol, Mangifera Indica Seed Butter, Palmitoyl Tripeptide-1, Aroma, CI 77491.',
          images: [
            { id: 'img_g1', url: '/assets/teint_marron.jpg', isPrimary: true, position: 1 },
            { id: 'img_g2', url: '/assets/prod_fond_teint.jpg', isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      orders: [
        {
          id: 'ord_1001',
          orderNumber: 'BBS-00125',
          customer: {
            name: 'Aïcha Diallo',
            phone: '+221 77 452 89 12',
            email: 'aicha.diallo@gmail.com',
            address: 'Villa 45, Rue des Almadies',
            city: 'Dakar',
            region: 'Dakar',
            notes: 'Appeler avant de livrer s\'il vous plaît.'
          },
          items: [
            {
              productId: 'prod_fond_teint_luxe',
              name: 'Fond de Teint BBS Radiance Glow',
              price: 22500,
              quantity: 1,
              shade: 'Caramel Doré (Shade 04)',
              image: '/assets/prod_fond_teint.jpg',
              sku: 'BBS-FDT-001'
            },
            {
              productId: 'prod_gloss_volumateur_nude',
              name: 'Gloss Repulpant Brillance Miroir BBS',
              price: 12500,
              quantity: 1,
              shade: 'Nude Miel & Caramel',
              image: '/assets/teint_marron.jpg',
              sku: 'BBS-GLS-005'
            }
          ],
          subtotal: 35000,
          deliveryFee: 2000,
          discount: 0,
          total: 37000,
          paymentMethod: 'wave',
          paymentStatus: 'paid',
          orderStatus: 'new',
          history: [
            { status: 'new', date: new Date(Date.now() - 15 * 60 * 1000).toISOString(), note: 'Commande passée en ligne via Wave' }
          ],
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: 'ord_1002',
          orderNumber: 'BBS-00124',
          customer: {
            name: 'Fatou Bintou Ndiaye',
            phone: '+221 78 120 33 44',
            email: 'fatou.ndiaye@yahoo.fr',
            address: 'Immeuble Horizon, Apt 3B, Mermoz',
            city: 'Dakar',
            region: 'Dakar'
          },
          items: [
            {
              productId: 'prod_poudre_compacte_soie',
              name: 'Poudre Compacte Veloutée BBS',
              price: 18000,
              quantity: 1,
              shade: 'Ébène Royal (Shade 06)',
              image: '/assets/prod_poudre.jpg',
              sku: 'BBS-PDR-002'
            }
          ],
          subtotal: 18000,
          deliveryFee: 2000,
          discount: 0,
          total: 20000,
          paymentMethod: 'orange_money',
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
          history: [
            { status: 'new', date: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
            { status: 'confirmed', date: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(), note: 'Paiement Orange Money vérifié' }
          ],
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString()
        },
        {
          id: 'ord_1003',
          orderNumber: 'BBS-00123',
          customer: {
            name: 'Mariama Ba',
            phone: '+221 70 890 12 34',
            email: 'mariama.ba@outlook.com',
            address: 'Cité Keur Gorgui, Immeuble B',
            city: 'Dakar',
            region: 'Dakar'
          },
          items: [
            {
              productId: 'prod_kit_pinceaux_prestige',
              name: 'Coffret Pinceaux Maquillage Prestige Rose Gold',
              price: 35000,
              quantity: 1,
              shade: 'Rose Gold & Beige',
              image: '/assets/hero_banner.jpg',
              sku: 'BBS-PIN-004'
            },
            {
              productId: 'prod_serum_elixir_eclat',
              name: 'Sérum Éclat Éternel 24K BBS',
              price: 25000,
              quantity: 1,
              shade: 'Translucide Glow',
              image: '/assets/teint_clair.jpg',
              sku: 'BBS-SRM-003'
            }
          ],
          subtotal: 60000,
          deliveryFee: 0,
          discount: 0,
          total: 60000,
          paymentMethod: 'cash_on_delivery',
          paymentStatus: 'pending',
          orderStatus: 'processing',
          history: [
            { status: 'new', date: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
            { status: 'confirmed', date: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
            { status: 'processing', date: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), note: 'Colis en cours de préparation au laboratoire BBS' }
          ],
          createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
        }
      ],
      customers: [
        {
          id: 'cust_1',
          name: 'Aïcha Diallo',
          phone: '+221 77 452 89 12',
          email: 'aicha.diallo@gmail.com',
          address: 'Villa 45, Rue des Almadies',
          city: 'Dakar',
          ordersCount: 3,
          totalSpent: 115000,
          lastOrderDate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 30 * 86400 * 1000).toISOString()
        },
        {
          id: 'cust_2',
          name: 'Fatou Bintou Ndiaye',
          phone: '+221 78 120 33 44',
          email: 'fatou.ndiaye@yahoo.fr',
          address: 'Immeuble Horizon, Apt 3B, Mermoz',
          city: 'Dakar',
          ordersCount: 2,
          totalSpent: 42500,
          lastOrderDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 14 * 86400 * 1000).toISOString()
        },
        {
          id: 'cust_3',
          name: 'Mariama Ba',
          phone: '+221 70 890 12 34',
          email: 'mariama.ba@outlook.com',
          address: 'Cité Keur Gorgui, Immeuble B',
          city: 'Dakar',
          ordersCount: 1,
          totalSpent: 60000,
          lastOrderDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
        }
      ],
      reviews: [
        {
          id: 'rev_1',
          productId: 'prod_fond_teint_luxe',
          productName: 'Fond de Teint BBS Radiance Glow',
          customerName: 'Khadija S.',
          rating: 5,
          title: 'Une merveille absolue pour peau noire !',
          comment: 'Je cherchais un fond de teint qui ne me donne pas un teint grisâtre sous la chaleur de Dakar. Le résultat est tout simplement éclatant, naturel et il tient toute la journée ! Merci Salma !',
          verified: true,
          status: 'approved',
          createdAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString()
        },
        {
          id: 'rev_2',
          productId: 'prod_poudre_compacte_soie',
          productName: 'Poudre Compacte Veloutée BBS',
          customerName: 'Ndeye Coumba D.',
          rating: 5,
          title: 'Matité parfaite sans effet plâtre',
          comment: 'La finesse de la poudre est incroyable. Elle floute mes pores et fixe mon correcteur sans jamais marquer les ridules. Un must-have dans mon sac à main.',
          verified: true,
          status: 'approved',
          createdAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString()
        },
        {
          id: 'rev_3',
          productId: 'prod_serum_elixir_eclat',
          productName: 'Sérum Éclat Éternel 24K BBS',
          customerName: 'Amina L.',
          rating: 5,
          title: 'Un glow de rêve au réveil',
          comment: 'Ma peau est tellement plus hydratée et lumineuse. Je l’utilise matin et soir avant ma crème. Bravo pour la qualité des formulations BBS !',
          verified: true,
          status: 'approved',
          createdAt: new Date(Date.now() - 7 * 86400 * 1000).toISOString()
        }
      ],
      siteContent: {
        hero: {
          badge: 'BBS BY SALMA • COSMÉTIQUES HAUT DE GAMME',
          title: 'Votre beauté en toutes teintes',
          subtitle: 'Des produits cosmétiques d’exception formulés pour révéler et sublimer la beauté unique de chaque carnation.',
          ctaText: 'Découvrir la boutique',
          ctaLink: '/boutique',
          bgImage: '/assets/hero_routine.jpg'
        },
        promoBanner: {
          enabled: true,
          text: '✨ LIVRAISON OFFERTE À DAKAR DÈS 50 000 FCFA D\'ACHAT • EXPÉDITION EXPRESS 24H ✨',
          linkText: 'Commander maintenant',
          linkUrl: '/boutique'
        },
        about: {
          title: 'Plus qu\'une boutique, une expérience beauté',
          subtitle: 'L\'excellence cosmétique conçue pour célébrer toutes les peaux.',
          paragraph1: 'Chez BBS by Salma, nous sélectionnons et concevons pour vous les meilleurs produits cosmétiques adaptés à chaque type et nuance de peau.',
          paragraph2: 'Notre mission : vous aider à vous sentir belle, confiante et pleinement vous-même, quel que soit votre teint : clair, marron ou noir.',
          storyImage: '/assets/teint_marron.jpg',
          stat1Value: '100%',
          stat1Label: 'Authenticité & Qualité',
          stat2Value: '3 Teintes',
          stat2Label: 'Clair • Marron • Noir',
          stat3Value: '5 000+',
          stat3Label: 'Femmes sublimées'
        },
        contact: {
          phone: '+221 77 000 00 00',
          whatsapp: '+221770000000',
          email: 'contact@bbsbysalma.com',
          address: 'Almadies, Route de la Corniche Ouest',
          city: 'Dakar, Sénégal',
          instagram: 'https://instagram.com/bbs_by_salma',
          tiktok: 'https://tiktok.com/@bbs_by_salma',
          facebook: 'https://facebook.com/bbsbysalma',
          openingHours: 'Lundi - Samedi : 09h00 - 20h00 | Dimanche : Sur rendez-vous'
        },
        guarantees: [
          {
            id: 'g1',
            title: 'Livraison express',
            description: 'Partout au Sénégal en 24h & International',
            icon: 'Truck'
          },
          {
            id: 'g2',
            title: 'Produits 100% authentiques',
            description: 'Formulations certifiées & testées',
            icon: 'ShieldCheck'
          },
          {
            id: 'g3',
            title: 'Service client dédié',
            description: 'Conseils personnalisés 7j/7 sur WhatsApp',
            icon: 'Headphones'
          },
          {
            id: 'g4',
            title: 'Paiement sécurisé & flexible',
            description: 'À la livraison, Wave ou Orange Money',
            icon: 'CreditCard'
          }
        ]
      },
      settings: {
        storeName: 'BBS By Salma',
        currency: 'FCFA',
        currencySymbol: 'FCFA',
        phone: '+221 77 000 00 00',
        whatsapp: '+221770000000',
        email: 'contact@bbsbysalma.com',
        freeDeliveryThreshold: 50000,
        deliveryFees: [
          { region: 'Dakar (Centre, Almadies, Mermoz, Plateau)', fee: 2000 },
          { region: 'Banlieue Dakar (Pikine, Guédiawaye, Rufisque)', fee: 3000 },
          { region: 'Régions Sénégal (Thiès, Saint-Louis, Mbour, etc.)', fee: 5000 },
          { region: 'International (Zone UEMOA & Europe)', fee: 15000 }
        ],
        lowStockThreshold: 5,
        enableSoundNotifications: true,
        wavePaymentUrl: 'https://pay.wave.com/m/M_sn_UoRxc-HJ7lK-/c/sn/'
      }
    };
  }

  init() {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      this.data = this.getDefaultData();
      this.save();
      console.log('[BBS DB] Initialized database with complete luxury seed data.');
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('[BBS DB] Loaded existing database.');
      } catch (err) {
        console.error('[BBS DB] Failed to parse store.json, re-initializing seed data.', err);
        this.data = this.getDefaultData();
        this.save();
      }
    }
  }

  getData() {
    if (!this.data) {
      this.init();
    }
    return this.data;
  }

  save() {
    if (!this.data) return;
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[BBS DB] Failed to save database:', err);
    }
  }
}

export const db = new Database();
