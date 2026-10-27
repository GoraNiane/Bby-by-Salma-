import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categoryId: string;
  collectionId?: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  promoPrice?: number;
  stock: number;
  alertThreshold: number;
  shade?: string;
  skinType?: string;
  ingredients?: string;
  images: ProductImage[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  status: 'published' | 'draft' | 'hidden';
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shade: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  images: string[];
  status: 'active' | 'inactive';
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  shade?: string;
  image: string;
  sku?: string;
}

export interface OrderHistoryEntry {
  status: string;
  date: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    region: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash_on_delivery' | 'wave' | 'orange_money' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  history: OrderHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    ctaText: string;
    ctaLink: string;
    bgImage: string;
  };
  promoBanner: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  about: {
    title: string;
    subtitle: string;
    paragraph1: string;
    paragraph2: string;
    storyImage: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    instagram: string;
    tiktok: string;
    facebook: string;
    openingHours: string;
  };
  guarantees: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  whatsapp: string;
  email: string;
  freeDeliveryThreshold: number;
  deliveryFees: Array<{
    region: string;
    fee: number;
  }>;
  lowStockThreshold: number;
  enableSoundNotifications: boolean;
  wavePaymentUrl?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin' | 'manager';
  avatar?: string;
}

export interface DatabaseSchema {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  siteContent: SiteContent;
  settings: StoreSettings;
  adminUsers: AdminUser[];
}

const DEFAULT_SEED_FILE = path.join(__dirname, 'data', 'store.json');
const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'store.json')
  : DEFAULT_SEED_FILE;

class Database {
  private data: DatabaseSchema | null = null;

  private getDefaultData(): DatabaseSchema {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@bbsbysalma.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Salma - Administratrice BBS';
    const defaultPasswordHash = bcrypt.hashSync(adminPassword, 10);

    return {
      adminUsers: [
        {
          id: 'admin_1',
          name: adminName,
          email: adminEmail,
          passwordHash: defaultPasswordHash,
          role: 'superadmin',
          avatar: '/assets/teint_marron.jpg'
        }
      ],
      categories: [
        {
          id: 'cat_laits',
          name: 'Laits de corps',
          slug: 'laits-de-corps',
          description: 'Hydrate • Nourrit • Sublime',
          image: '/assets/cat_laits_corps.jpg',
          createdAt: new Date().toISOString()
        },
        {
          id: 'cat_savons',
          name: 'Savons',
          slug: 'savons-naturels',
          description: 'Nettoie • Purifie • Adoucit',
          image: '/assets/cat_savons.jpg',
          createdAt: new Date().toISOString()
        }
      ],
      collections: [
        {
          id: 'col_karite',
          name: 'Gamme Karité Sublime',
          slug: 'karite-sublime',
          categoryId: 'cat_laits',
          shade: 'Beurre de Karité & Vanille',
          shortDescription: 'Nutrition intense et fini soyeux',
          description: 'Une gamme ultra-riche au beurre de karité bio pour réparer les peaux sèches et illuminer le corps.',
          coverImage: '/assets/cat_laits_corps.jpg',
          images: ['/assets/cat_laits_corps.jpg', '/assets/prod_lait_karite.jpg'],
          status: 'active',
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'col_coco',
          name: 'Gamme Coco Velours',
          slug: 'coco-velours',
          categoryId: 'cat_laits',
          shade: 'Huile de Coco Vierge',
          shortDescription: 'Hydratation gourmande et douceur',
          description: 'Formule soyeuse et fondante enrichie en huile de coco pour une peau douce comme de la soie.',
          coverImage: '/assets/prod_lait_coco.jpg',
          images: ['/assets/prod_lait_coco.jpg'],
          status: 'active',
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'col_papaye',
          name: 'Gamme Papaye Éclat',
          slug: 'papaye-eclat',
          categoryId: 'cat_savons',
          shade: 'Enzymes de Papaye & Miel',
          shortDescription: 'Teint unifié, net et lumineux',
          description: 'Savons artisanaux aux enzymes de papaye pour exfolier délicatement et raviver la lumière naturelle.',
          coverImage: '/assets/cat_savons.jpg',
          images: ['/assets/cat_savons.jpg', '/assets/prod_savon_papaye.jpg'],
          status: 'active',
          isFeatured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      products: [
        {
          id: 'prod_lait_karite',
          name: 'Lait de corps',
          slug: 'lait-de-corps-karite',
          sku: 'BBS-LC-001',
          brand: 'BBS By Salma',
          categoryId: 'cat_laits',
          collectionId: 'col_karite',
          shortDescription: 'Hydrate en profondeur, nourrit et laisse la peau soyeuse.',
          description: 'Le lait corporel signature BBS By Salma au beurre de karité et vanille précieuse apporte une hydratation 24h sans fini gras.',
          price: 18500,
          oldPrice: 22000,
          promoPrice: 18500,
          stock: 25,
          alertThreshold: 5,
          shade: 'Karité',
          skinType: 'Peaux sèches à normales',
          ingredients: 'Aqua, Butyrospermum Parkii Butter, Prunus Amygdalus Dulcis Oil, Glycerin, Vanilla Planifolia Extract, Tocopherol.',
          images: [
            { id: 'img_lk1', url: '/assets/prod_lait_karite.jpg', isPrimary: true, position: 1 },
            { id: 'img_lk2', url: '/assets/cat_laits_corps.jpg', isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_lait_coco',
          name: 'Lait de corps',
          slug: 'lait-de-corps-coco',
          sku: 'BBS-LC-002',
          brand: 'BBS By Salma',
          categoryId: 'cat_laits',
          collectionId: 'col_coco',
          shortDescription: 'Formule fondante coco pour une peau veloutée et délicatement parfumée.',
          description: 'Enrichi en huile de coco bio de première pression à froid, ce lait régénère l\'épiderme et adoucit intensément.',
          price: 19000,
          oldPrice: 24000,
          promoPrice: 19000,
          stock: 18,
          alertThreshold: 4,
          shade: 'Coco',
          skinType: 'Tous types de peau',
          ingredients: 'Aqua, Cocos Nucifera Oil, Aloe Barbadensis Leaf Juice, Glyceryl Stearate, Squalane, Parfum Naturel.',
          images: [
            { id: 'img_lc1', url: '/assets/prod_lait_coco.jpg', isPrimary: true, position: 1 },
            { id: 'img_lc2', url: '/assets/cat_laits_corps.jpg', isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: true,
          isBestSeller: true,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_savon_papaye',
          name: 'Savon',
          slug: 'savon-artisanal-papaye',
          sku: 'BBS-SV-001',
          brand: 'BBS By Salma',
          categoryId: 'cat_savons',
          collectionId: 'col_papaye',
          shortDescription: 'Nettoie en douceur, unifie le teint et purifie l\'épiderme.',
          description: 'Pain de savon surgras saponifié à froid aux extraits de papaye fraîche et miel. Élimine les impuretés et ravive l\'éclat.',
          price: 6500,
          oldPrice: 8000,
          promoPrice: 6500,
          stock: 40,
          alertThreshold: 8,
          shade: 'Papaye',
          skinType: 'Corps & Visage',
          ingredients: 'Sodium Olivate, Sodium Cocoate, Carica Papaya Fruit Extract, Mel (Honey), Citrus Limon Peel Oil.',
          images: [
            { id: 'img_sp1', url: '/assets/prod_savon_papaye.jpg', isPrimary: true, position: 1 },
            { id: 'img_sp2', url: '/assets/cat_savons.jpg', isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_savon_curcuma',
          name: 'Savon Curcuma & Miel',
          slug: 'savon-curcuma-miel',
          sku: 'BBS-SV-002',
          brand: 'BBS By Salma',
          categoryId: 'cat_savons',
          collectionId: 'col_papaye',
          shortDescription: 'Antioxydant puissant, purifie et apaise les imperfections.',
          description: 'Savon artisanal combinant les vertus éclaircissantes du curcuma et le pouvoir apaisant du miel pur.',
          price: 6500,
          oldPrice: 8000,
          promoPrice: 6500,
          stock: 30,
          alertThreshold: 6,
          shade: 'Curcuma',
          skinType: 'Peaux sensibles & mixtes',
          ingredients: 'Sodium Olivate, Curcuma Longa Root Powder, Mel, Melaleuca Alternifolia Oil.',
          images: [
            { id: 'img_sc1', url: '/assets/cat_savons.jpg', isPrimary: true, position: 1 },
            { id: 'img_sc2', url: '/assets/prod_savon_papaye.jpg', isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: true,
          isBestSeller: false,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'prod_lait_hydratation',
          name: 'Lait de corps Hydratation Intense',
          slug: 'lait-hydratation-intense',
          sku: 'BBS-LC-003',
          brand: 'BBS By Salma',
          categoryId: 'cat_laits',
          collectionId: 'col_karite',
          shortDescription: 'Complexe triple beurre (Karité, Mangue, Cacao) pour un confort absolu.',
          description: 'Pour les peaux en quête d\'un soulagement immédiat après la douche. Répare et adoucit instantanément.',
          price: 20000,
          oldPrice: 25000,
          promoPrice: 20000,
          stock: 15,
          alertThreshold: 3,
          shade: 'Karité & Cacao',
          skinType: 'Peaux très sèches',
          ingredients: 'Aqua, Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Mangifera Indica Seed Butter.',
          images: [
            { id: 'img_lhi1', url: '/assets/prod_lait_karite.jpg', isPrimary: true, position: 1 },
            { id: 'img_lhi2', url: '/assets/cat_laits_corps.jpg', isPrimary: false, position: 2 }
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
        },
        {
          id: 'ord_1004',
          orderNumber: 'BBS-00122',
          customer: {
            name: 'Seynabou Fall',
            phone: '+221 76 555 78 90',
            email: 'seynabou.fall@gmail.com',
            address: 'Quartier Escale, Villa 12',
            city: 'Saint-Louis',
            region: 'Régions Sénégal'
          },
          items: [
            {
              productId: 'prod_fond_teint_luxe',
              name: 'Fond de Teint BBS Radiance Glow',
              price: 22500,
              quantity: 2,
              shade: 'Caramel Doré (Shade 04)',
              image: '/assets/prod_fond_teint.jpg',
              sku: 'BBS-FDT-001'
            }
          ],
          subtotal: 45000,
          deliveryFee: 5000,
          discount: 0,
          total: 50000,
          paymentMethod: 'wave',
          paymentStatus: 'paid',
          orderStatus: 'delivered',
          history: [
            { status: 'new', date: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
            { status: 'confirmed', date: new Date(Date.now() - 47 * 3600 * 1000).toISOString() },
            { status: 'shipped', date: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
            { status: 'delivered', date: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), note: 'Livré au client avec succès' }
          ],
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
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
        },
        {
          id: 'cust_4',
          name: 'Seynabou Fall',
          phone: '+221 76 555 78 90',
          email: 'seynabou.fall@gmail.com',
          address: 'Quartier Escale, Villa 12',
          city: 'Saint-Louis',
          ordersCount: 4,
          totalSpent: 185000,
          lastOrderDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 60 * 86400 * 1000).toISOString()
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
          badge: 'BBS BY SALMA',
          title: 'Votre peau mérite le meilleur',
          subtitle: 'Des laits de corps nourrissants et des savons naturels pour une peau douce, propre et éclatante.',
          ctaText: 'Découvrir la boutique',
          ctaLink: '/boutique',
          bgImage: '/assets/hero_bodycare.jpg'
        },
        promoBanner: {
          enabled: true,
          text: '🚚 Livraison offerte à Dakar dès 50 000 FCFA d\'achat',
          linkText: 'Découvrir',
          linkUrl: '/boutique'
        },
        about: {
          title: 'L\'excellence des soins corporels au naturel',
          subtitle: 'Formulés pour nourrir, adoucir et sublimer l\'éclat de votre peau.',
          paragraph1: 'Chez BBS by Salma, nous sélectionnons des beurres végétaux précieux et des extraits botaniques bienfaisants pour créer des laits nourrissants et des savons artisanaux d\'exception.',
          paragraph2: 'Chaque formule est pensée pour respecter le film hydrolipidique, purifier sans assécher et apporter un velouté incomparable jour après jour.',
          storyImage: '/assets/hero_bodycare.jpg',
          stat1Value: '100%',
          stat1Label: 'Origine Naturelle',
          stat2Value: '2 Essentiels',
          stat2Label: 'Laits de corps • Savons',
          stat3Value: '10 000+',
          stat3Label: 'Peaux sublimées'
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

  public init(): void {
    const dataDir = path.dirname(DB_FILE);
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch {}

    if (!fs.existsSync(DB_FILE)) {
      if (process.env.VERCEL && fs.existsSync(DEFAULT_SEED_FILE)) {
        try {
          const raw = fs.readFileSync(DEFAULT_SEED_FILE, 'utf-8');
          this.data = JSON.parse(raw);
          this.save();
          console.log('[BBS DB] Initialized /tmp/store.json from bundled store.json');
          return;
        } catch (e) {
          console.warn('[BBS DB] Failed to seed from file, using fallback default data');
        }
      }
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

  public getData(): DatabaseSchema {
    if (!this.data) {
      this.init();
    }
    return this.data!;
  }

  public save(): void {
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
