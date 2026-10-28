// backend/index.ts
import "dotenv/config";
import express12 from "express";
import cors from "cors";
import path3 from "path";
import fs3 from "fs";
import { fileURLToPath as fileURLToPath3 } from "url";

// backend/db.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function getSeedFilePath() {
  const possiblePaths = [
    path.join(__dirname, "data", "store.json"),
    path.join(__dirname, "../data", "store.json"),
    path.join(__dirname, "../../data", "store.json"),
    path.join(process.cwd(), "backend", "data", "store.json"),
    path.join(process.cwd(), "data", "store.json"),
    path.join(process.cwd(), "backend", "dist", "data", "store.json")
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
    }
  }
  return path.join(__dirname, "data", "store.json");
}
var DEFAULT_SEED_FILE = getSeedFilePath();
var DB_FILE = process.env.VERCEL ? path.join("/tmp", "store.json") : DEFAULT_SEED_FILE;
var Database = class {
  data = null;
  getDefaultData() {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@bbsbysalma.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Salma - Administratrice BBS";
    const defaultPasswordHash = bcrypt.hashSync(adminPassword, 10);
    const adminUsers = [
      {
        id: "admin_1",
        name: adminName,
        email: adminEmail,
        passwordHash: defaultPasswordHash,
        role: "superadmin",
        avatar: "/assets/teint_marron.jpg"
      }
    ];
    if (adminEmail !== "admin@najarosestore.sn") {
      adminUsers.push({
        id: "admin_2",
        name: "Administratrice BBS",
        email: "admin@najarosestore.sn",
        passwordHash: defaultPasswordHash,
        role: "superadmin",
        avatar: "/assets/teint_marron.jpg"
      });
    }
    if (adminEmail !== "admin@bbsbysalma.com") {
      adminUsers.push({
        id: "admin_3",
        name: "Salma - Administratrice BBS",
        email: "admin@bbsbysalma.com",
        passwordHash: defaultPasswordHash,
        role: "superadmin",
        avatar: "/assets/teint_marron.jpg"
      });
    }
    return {
      adminUsers,
      categories: [
        {
          id: "cat_laits",
          name: "Laits de corps",
          slug: "laits-de-corps",
          description: "Hydrate \u2022 Nourrit \u2022 Sublime",
          image: "/assets/cat_laits_corps.jpg",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "cat_savons",
          name: "Savons",
          slug: "savons-naturels",
          description: "Nettoie \u2022 Purifie \u2022 Adoucit",
          image: "/assets/cat_savons.jpg",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      collections: [
        {
          id: "col_karite",
          name: "Gamme Karit\xE9 Sublime",
          slug: "karite-sublime",
          categoryId: "cat_laits",
          shade: "Beurre de Karit\xE9 & Vanille",
          shortDescription: "Nutrition intense et fini soyeux",
          description: "Une gamme ultra-riche au beurre de karit\xE9 bio pour r\xE9parer les peaux s\xE8ches et illuminer le corps.",
          coverImage: "/assets/cat_laits_corps.jpg",
          images: ["/assets/cat_laits_corps.jpg", "/assets/prod_lait_karite.jpg"],
          status: "active",
          isFeatured: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "col_coco",
          name: "Gamme Coco Velours",
          slug: "coco-velours",
          categoryId: "cat_laits",
          shade: "Huile de Coco Vierge",
          shortDescription: "Hydratation gourmande et douceur",
          description: "Formule soyeuse et fondante enrichie en huile de coco pour une peau douce comme de la soie.",
          coverImage: "/assets/prod_lait_coco.jpg",
          images: ["/assets/prod_lait_coco.jpg"],
          status: "active",
          isFeatured: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "col_papaye",
          name: "Gamme Papaye \xC9clat",
          slug: "papaye-eclat",
          categoryId: "cat_savons",
          shade: "Enzymes de Papaye & Miel",
          shortDescription: "Teint unifi\xE9, net et lumineux",
          description: "Savons artisanaux aux enzymes de papaye pour exfolier d\xE9licatement et raviver la lumi\xE8re naturelle.",
          coverImage: "/assets/cat_savons.jpg",
          images: ["/assets/cat_savons.jpg", "/assets/prod_savon_papaye.jpg"],
          status: "active",
          isFeatured: true,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      products: [
        {
          id: "prod_lait_karite",
          name: "Lait de corps",
          slug: "lait-de-corps-karite",
          sku: "BBS-LC-001",
          brand: "BBS By Salma",
          categoryId: "cat_laits",
          collectionId: "col_karite",
          shortDescription: "Hydrate en profondeur, nourrit et laisse la peau soyeuse.",
          description: "Le lait corporel signature BBS By Salma au beurre de karit\xE9 et vanille pr\xE9cieuse apporte une hydratation 24h sans fini gras.",
          price: 18500,
          oldPrice: 22e3,
          promoPrice: 18500,
          stock: 25,
          alertThreshold: 5,
          shade: "Karit\xE9",
          skinType: "Peaux s\xE8ches \xE0 normales",
          ingredients: "Aqua, Butyrospermum Parkii Butter, Prunus Amygdalus Dulcis Oil, Glycerin, Vanilla Planifolia Extract, Tocopherol.",
          images: [
            { id: "img_lk1", url: "/assets/prod_lait_karite.jpg", isPrimary: true, position: 1 },
            { id: "img_lk2", url: "/assets/cat_laits_corps.jpg", isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          status: "published",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "prod_lait_coco",
          name: "Lait de corps",
          slug: "lait-de-corps-coco",
          sku: "BBS-LC-002",
          brand: "BBS By Salma",
          categoryId: "cat_laits",
          collectionId: "col_coco",
          shortDescription: "Formule fondante coco pour une peau velout\xE9e et d\xE9licatement parfum\xE9e.",
          description: "Enrichi en huile de coco bio de premi\xE8re pression \xE0 froid, ce lait r\xE9g\xE9n\xE8re l'\xE9piderme et adoucit intens\xE9ment.",
          price: 19e3,
          oldPrice: 24e3,
          promoPrice: 19e3,
          stock: 18,
          alertThreshold: 4,
          shade: "Coco",
          skinType: "Tous types de peau",
          ingredients: "Aqua, Cocos Nucifera Oil, Aloe Barbadensis Leaf Juice, Glyceryl Stearate, Squalane, Parfum Naturel.",
          images: [
            { id: "img_lc1", url: "/assets/prod_lait_coco.jpg", isPrimary: true, position: 1 },
            { id: "img_lc2", url: "/assets/cat_laits_corps.jpg", isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: true,
          isBestSeller: true,
          status: "published",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "prod_savon_papaye",
          name: "Savon",
          slug: "savon-artisanal-papaye",
          sku: "BBS-SV-001",
          brand: "BBS By Salma",
          categoryId: "cat_savons",
          collectionId: "col_papaye",
          shortDescription: "Nettoie en douceur, unifie le teint et purifie l'\xE9piderme.",
          description: "Pain de savon surgras saponifi\xE9 \xE0 froid aux extraits de papaye fra\xEEche et miel. \xC9limine les impuret\xE9s et ravive l'\xE9clat.",
          price: 6500,
          oldPrice: 8e3,
          promoPrice: 6500,
          stock: 40,
          alertThreshold: 8,
          shade: "Papaye",
          skinType: "Corps & Visage",
          ingredients: "Sodium Olivate, Sodium Cocoate, Carica Papaya Fruit Extract, Mel (Honey), Citrus Limon Peel Oil.",
          images: [
            { id: "img_sp1", url: "/assets/prod_savon_papaye.jpg", isPrimary: true, position: 1 },
            { id: "img_sp2", url: "/assets/cat_savons.jpg", isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          status: "published",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "prod_savon_curcuma",
          name: "Savon Curcuma & Miel",
          slug: "savon-curcuma-miel",
          sku: "BBS-SV-002",
          brand: "BBS By Salma",
          categoryId: "cat_savons",
          collectionId: "col_papaye",
          shortDescription: "Antioxydant puissant, purifie et apaise les imperfections.",
          description: "Savon artisanal combinant les vertus \xE9claircissantes du curcuma et le pouvoir apaisant du miel pur.",
          price: 6500,
          oldPrice: 8e3,
          promoPrice: 6500,
          stock: 30,
          alertThreshold: 6,
          shade: "Curcuma",
          skinType: "Peaux sensibles & mixtes",
          ingredients: "Sodium Olivate, Curcuma Longa Root Powder, Mel, Melaleuca Alternifolia Oil.",
          images: [
            { id: "img_sc1", url: "/assets/cat_savons.jpg", isPrimary: true, position: 1 },
            { id: "img_sc2", url: "/assets/prod_savon_papaye.jpg", isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: true,
          isBestSeller: false,
          status: "published",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          id: "prod_lait_hydratation",
          name: "Lait de corps Hydratation Intense",
          slug: "lait-hydratation-intense",
          sku: "BBS-LC-003",
          brand: "BBS By Salma",
          categoryId: "cat_laits",
          collectionId: "col_karite",
          shortDescription: "Complexe triple beurre (Karit\xE9, Mangue, Cacao) pour un confort absolu.",
          description: "Pour les peaux en qu\xEAte d'un soulagement imm\xE9diat apr\xE8s la douche. R\xE9pare et adoucit instantan\xE9ment.",
          price: 2e4,
          oldPrice: 25e3,
          promoPrice: 2e4,
          stock: 15,
          alertThreshold: 3,
          shade: "Karit\xE9 & Cacao",
          skinType: "Peaux tr\xE8s s\xE8ches",
          ingredients: "Aqua, Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Mangifera Indica Seed Butter.",
          images: [
            { id: "img_lhi1", url: "/assets/prod_lait_karite.jpg", isPrimary: true, position: 1 },
            { id: "img_lhi2", url: "/assets/cat_laits_corps.jpg", isPrimary: false, position: 2 }
          ],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          status: "published",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      orders: [
        {
          id: "ord_1001",
          orderNumber: "BBS-00125",
          customer: {
            name: "A\xEFcha Diallo",
            phone: "+221 77 452 89 12",
            email: "aicha.diallo@gmail.com",
            address: "Villa 45, Rue des Almadies",
            city: "Dakar",
            region: "Dakar",
            notes: "Appeler avant de livrer s'il vous pla\xEEt."
          },
          items: [
            {
              productId: "prod_fond_teint_luxe",
              name: "Fond de Teint BBS Radiance Glow",
              price: 22500,
              quantity: 1,
              shade: "Caramel Dor\xE9 (Shade 04)",
              image: "/assets/prod_fond_teint.jpg",
              sku: "BBS-FDT-001"
            },
            {
              productId: "prod_gloss_volumateur_nude",
              name: "Gloss Repulpant Brillance Miroir BBS",
              price: 12500,
              quantity: 1,
              shade: "Nude Miel & Caramel",
              image: "/assets/teint_marron.jpg",
              sku: "BBS-GLS-005"
            }
          ],
          subtotal: 35e3,
          deliveryFee: 2e3,
          discount: 0,
          total: 37e3,
          paymentMethod: "wave",
          paymentStatus: "paid",
          orderStatus: "new",
          history: [
            { status: "new", date: new Date(Date.now() - 15 * 60 * 1e3).toISOString(), note: "Commande pass\xE9e en ligne via Wave" }
          ],
          createdAt: new Date(Date.now() - 15 * 60 * 1e3).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60 * 1e3).toISOString()
        },
        {
          id: "ord_1002",
          orderNumber: "BBS-00124",
          customer: {
            name: "Fatou Bintou Ndiaye",
            phone: "+221 78 120 33 44",
            email: "fatou.ndiaye@yahoo.fr",
            address: "Immeuble Horizon, Apt 3B, Mermoz",
            city: "Dakar",
            region: "Dakar"
          },
          items: [
            {
              productId: "prod_poudre_compacte_soie",
              name: "Poudre Compacte Velout\xE9e BBS",
              price: 18e3,
              quantity: 1,
              shade: "\xC9b\xE8ne Royal (Shade 06)",
              image: "/assets/prod_poudre.jpg",
              sku: "BBS-PDR-002"
            }
          ],
          subtotal: 18e3,
          deliveryFee: 2e3,
          discount: 0,
          total: 2e4,
          paymentMethod: "orange_money",
          paymentStatus: "paid",
          orderStatus: "confirmed",
          history: [
            { status: "new", date: new Date(Date.now() - 2 * 3600 * 1e3).toISOString() },
            { status: "confirmed", date: new Date(Date.now() - 1.5 * 3600 * 1e3).toISOString(), note: "Paiement Orange Money v\xE9rifi\xE9" }
          ],
          createdAt: new Date(Date.now() - 2 * 3600 * 1e3).toISOString(),
          updatedAt: new Date(Date.now() - 1.5 * 3600 * 1e3).toISOString()
        },
        {
          id: "ord_1003",
          orderNumber: "BBS-00123",
          customer: {
            name: "Mariama Ba",
            phone: "+221 70 890 12 34",
            email: "mariama.ba@outlook.com",
            address: "Cit\xE9 Keur Gorgui, Immeuble B",
            city: "Dakar",
            region: "Dakar"
          },
          items: [
            {
              productId: "prod_kit_pinceaux_prestige",
              name: "Coffret Pinceaux Maquillage Prestige Rose Gold",
              price: 35e3,
              quantity: 1,
              shade: "Rose Gold & Beige",
              image: "/assets/hero_banner.jpg",
              sku: "BBS-PIN-004"
            },
            {
              productId: "prod_serum_elixir_eclat",
              name: "S\xE9rum \xC9clat \xC9ternel 24K BBS",
              price: 25e3,
              quantity: 1,
              shade: "Translucide Glow",
              image: "/assets/teint_clair.jpg",
              sku: "BBS-SRM-003"
            }
          ],
          subtotal: 6e4,
          deliveryFee: 0,
          discount: 0,
          total: 6e4,
          paymentMethod: "cash_on_delivery",
          paymentStatus: "pending",
          orderStatus: "processing",
          history: [
            { status: "new", date: new Date(Date.now() - 5 * 3600 * 1e3).toISOString() },
            { status: "confirmed", date: new Date(Date.now() - 4 * 3600 * 1e3).toISOString() },
            { status: "processing", date: new Date(Date.now() - 3 * 3600 * 1e3).toISOString(), note: "Colis en cours de pr\xE9paration au laboratoire BBS" }
          ],
          createdAt: new Date(Date.now() - 5 * 3600 * 1e3).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 3600 * 1e3).toISOString()
        },
        {
          id: "ord_1004",
          orderNumber: "BBS-00122",
          customer: {
            name: "Seynabou Fall",
            phone: "+221 76 555 78 90",
            email: "seynabou.fall@gmail.com",
            address: "Quartier Escale, Villa 12",
            city: "Saint-Louis",
            region: "R\xE9gions S\xE9n\xE9gal"
          },
          items: [
            {
              productId: "prod_fond_teint_luxe",
              name: "Fond de Teint BBS Radiance Glow",
              price: 22500,
              quantity: 2,
              shade: "Caramel Dor\xE9 (Shade 04)",
              image: "/assets/prod_fond_teint.jpg",
              sku: "BBS-FDT-001"
            }
          ],
          subtotal: 45e3,
          deliveryFee: 5e3,
          discount: 0,
          total: 5e4,
          paymentMethod: "wave",
          paymentStatus: "paid",
          orderStatus: "delivered",
          history: [
            { status: "new", date: new Date(Date.now() - 48 * 3600 * 1e3).toISOString() },
            { status: "confirmed", date: new Date(Date.now() - 47 * 3600 * 1e3).toISOString() },
            { status: "shipped", date: new Date(Date.now() - 24 * 3600 * 1e3).toISOString() },
            { status: "delivered", date: new Date(Date.now() - 6 * 3600 * 1e3).toISOString(), note: "Livr\xE9 au client avec succ\xE8s" }
          ],
          createdAt: new Date(Date.now() - 48 * 3600 * 1e3).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 3600 * 1e3).toISOString()
        }
      ],
      customers: [
        {
          id: "cust_1",
          name: "A\xEFcha Diallo",
          phone: "+221 77 452 89 12",
          email: "aicha.diallo@gmail.com",
          address: "Villa 45, Rue des Almadies",
          city: "Dakar",
          ordersCount: 3,
          totalSpent: 115e3,
          lastOrderDate: new Date(Date.now() - 15 * 60 * 1e3).toISOString(),
          createdAt: new Date(Date.now() - 30 * 86400 * 1e3).toISOString()
        },
        {
          id: "cust_2",
          name: "Fatou Bintou Ndiaye",
          phone: "+221 78 120 33 44",
          email: "fatou.ndiaye@yahoo.fr",
          address: "Immeuble Horizon, Apt 3B, Mermoz",
          city: "Dakar",
          ordersCount: 2,
          totalSpent: 42500,
          lastOrderDate: new Date(Date.now() - 2 * 3600 * 1e3).toISOString(),
          createdAt: new Date(Date.now() - 14 * 86400 * 1e3).toISOString()
        },
        {
          id: "cust_3",
          name: "Mariama Ba",
          phone: "+221 70 890 12 34",
          email: "mariama.ba@outlook.com",
          address: "Cit\xE9 Keur Gorgui, Immeuble B",
          city: "Dakar",
          ordersCount: 1,
          totalSpent: 6e4,
          lastOrderDate: new Date(Date.now() - 5 * 3600 * 1e3).toISOString(),
          createdAt: new Date(Date.now() - 5 * 3600 * 1e3).toISOString()
        },
        {
          id: "cust_4",
          name: "Seynabou Fall",
          phone: "+221 76 555 78 90",
          email: "seynabou.fall@gmail.com",
          address: "Quartier Escale, Villa 12",
          city: "Saint-Louis",
          ordersCount: 4,
          totalSpent: 185e3,
          lastOrderDate: new Date(Date.now() - 48 * 3600 * 1e3).toISOString(),
          createdAt: new Date(Date.now() - 60 * 86400 * 1e3).toISOString()
        }
      ],
      reviews: [
        {
          id: "rev_1",
          productId: "prod_fond_teint_luxe",
          productName: "Fond de Teint BBS Radiance Glow",
          customerName: "Khadija S.",
          rating: 5,
          title: "Une merveille absolue pour peau noire !",
          comment: "Je cherchais un fond de teint qui ne me donne pas un teint gris\xE2tre sous la chaleur de Dakar. Le r\xE9sultat est tout simplement \xE9clatant, naturel et il tient toute la journ\xE9e ! Merci Salma !",
          verified: true,
          status: "approved",
          createdAt: new Date(Date.now() - 2 * 86400 * 1e3).toISOString()
        },
        {
          id: "rev_2",
          productId: "prod_poudre_compacte_soie",
          productName: "Poudre Compacte Velout\xE9e BBS",
          customerName: "Ndeye Coumba D.",
          rating: 5,
          title: "Matit\xE9 parfaite sans effet pl\xE2tre",
          comment: "La finesse de la poudre est incroyable. Elle floute mes pores et fixe mon correcteur sans jamais marquer les ridules. Un must-have dans mon sac \xE0 main.",
          verified: true,
          status: "approved",
          createdAt: new Date(Date.now() - 5 * 86400 * 1e3).toISOString()
        },
        {
          id: "rev_3",
          productId: "prod_serum_elixir_eclat",
          productName: "S\xE9rum \xC9clat \xC9ternel 24K BBS",
          customerName: "Amina L.",
          rating: 5,
          title: "Un glow de r\xEAve au r\xE9veil",
          comment: "Ma peau est tellement plus hydrat\xE9e et lumineuse. Je l\u2019utilise matin et soir avant ma cr\xE8me. Bravo pour la qualit\xE9 des formulations BBS !",
          verified: true,
          status: "approved",
          createdAt: new Date(Date.now() - 7 * 86400 * 1e3).toISOString()
        }
      ],
      siteContent: {
        hero: {
          badge: "BBS BY SALMA",
          title: "Votre peau m\xE9rite le meilleur",
          subtitle: "Des laits de corps nourrissants et des savons naturels pour une peau douce, propre et \xE9clatante.",
          ctaText: "D\xE9couvrir la boutique",
          ctaLink: "/boutique",
          bgImage: "/assets/hero_bodycare.jpg"
        },
        promoBanner: {
          enabled: true,
          text: "\u{1F69A} Livraison offerte \xE0 Dakar d\xE8s 50 000 FCFA d'achat",
          linkText: "D\xE9couvrir",
          linkUrl: "/boutique"
        },
        about: {
          title: "L'excellence des soins corporels au naturel",
          subtitle: "Formul\xE9s pour nourrir, adoucir et sublimer l'\xE9clat de votre peau.",
          paragraph1: "Chez BBS by Salma, nous s\xE9lectionnons des beurres v\xE9g\xE9taux pr\xE9cieux et des extraits botaniques bienfaisants pour cr\xE9er des laits nourrissants et des savons artisanaux d'exception.",
          paragraph2: "Chaque formule est pens\xE9e pour respecter le film hydrolipidique, purifier sans ass\xE9cher et apporter un velout\xE9 incomparable jour apr\xE8s jour.",
          storyImage: "/assets/hero_bodycare.jpg",
          stat1Value: "100%",
          stat1Label: "Origine Naturelle",
          stat2Value: "2 Essentiels",
          stat2Label: "Laits de corps \u2022 Savons",
          stat3Value: "10 000+",
          stat3Label: "Peaux sublim\xE9es"
        },
        contact: {
          phone: "+221 77 000 00 00",
          whatsapp: "+221770000000",
          email: "contact@bbsbysalma.com",
          address: "Almadies, Route de la Corniche Ouest",
          city: "Dakar, S\xE9n\xE9gal",
          instagram: "https://instagram.com/bbs_by_salma",
          tiktok: "https://tiktok.com/@bbs_by_salma",
          facebook: "https://facebook.com/bbsbysalma",
          openingHours: "Lundi - Samedi : 09h00 - 20h00 | Dimanche : Sur rendez-vous"
        },
        guarantees: [
          {
            id: "g1",
            title: "Livraison express",
            description: "Partout au S\xE9n\xE9gal en 24h & International",
            icon: "Truck"
          },
          {
            id: "g2",
            title: "Produits 100% authentiques",
            description: "Formulations certifi\xE9es & test\xE9es",
            icon: "ShieldCheck"
          },
          {
            id: "g3",
            title: "Service client d\xE9di\xE9",
            description: "Conseils personnalis\xE9s 7j/7 sur WhatsApp",
            icon: "Headphones"
          },
          {
            id: "g4",
            title: "Paiement s\xE9curis\xE9 & flexible",
            description: "\xC0 la livraison, Wave ou Orange Money",
            icon: "CreditCard"
          }
        ]
      },
      settings: {
        storeName: "BBS By Salma",
        currency: "FCFA",
        currencySymbol: "FCFA",
        phone: "+221 77 000 00 00",
        whatsapp: "+221770000000",
        email: "contact@bbsbysalma.com",
        freeDeliveryThreshold: 5e4,
        deliveryFees: [
          { region: "Dakar (Centre, Almadies, Mermoz, Plateau)", fee: 2e3 },
          { region: "Banlieue Dakar (Pikine, Gu\xE9diawaye, Rufisque)", fee: 3e3 },
          { region: "R\xE9gions S\xE9n\xE9gal (Thi\xE8s, Saint-Louis, Mbour, etc.)", fee: 5e3 },
          { region: "International (Zone UEMOA & Europe)", fee: 15e3 }
        ],
        lowStockThreshold: 5,
        enableSoundNotifications: true,
        wavePaymentUrl: "https://pay.wave.com/m/M_sn_UoRxc-HJ7lK-/c/sn/"
      }
    };
  }
  init() {
    try {
      const dataDir = path.dirname(DB_FILE);
      try {
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
      } catch (err) {
        console.warn("[BBS DB] Warning: could not create data dir:", err);
      }
      if (!fs.existsSync(DB_FILE)) {
        if (fs.existsSync(DEFAULT_SEED_FILE)) {
          try {
            const raw = fs.readFileSync(DEFAULT_SEED_FILE, "utf-8");
            this.data = JSON.parse(raw);
            this.save();
            console.log("[BBS DB] Initialized database from seed file:", DEFAULT_SEED_FILE);
            return;
          } catch (e) {
            console.warn("[BBS DB] Failed to seed from file, using fallback default data");
          }
        }
        this.data = this.getDefaultData();
        this.save();
        console.log("[BBS DB] Initialized database with complete luxury seed data.");
      } else {
        try {
          const raw = fs.readFileSync(DB_FILE, "utf-8");
          this.data = JSON.parse(raw);
          console.log("[BBS DB] Loaded existing database.");
        } catch (err) {
          console.error("[BBS DB] Failed to parse store.json, re-initializing seed data.", err);
          this.data = this.getDefaultData();
          this.save();
        }
      }
    } catch (outerErr) {
      console.error("[BBS DB] Critical error in init, falling back to in-memory data:", outerErr);
      if (!this.data) {
        this.data = this.getDefaultData();
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
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("[BBS DB] Failed to save database:", err);
    }
  }
};
var db = new Database();

// backend/routes/auth.routes.ts
import express from "express";
import bcrypt2 from "bcryptjs";

// backend/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "bbs_by_salma_ultra_secure_jwt_secret_key_2026";
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acc\xE8s non autoris\xE9. Authentification requise." });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Session expir\xE9e ou jeton invalide. Veuillez vous reconnecter." });
  }
  const user = db.getData().adminUsers.find((u) => u.id === decoded.id);
  if (!user) {
    return res.status(401).json({ error: "Utilisateur administrateur introuvable." });
  }
  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  next();
}

// backend/routes/auth.routes.ts
var authRouter = express.Router();
authRouter.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const envEmail = (process.env.ADMIN_EMAIL || "admin@bbsbysalma.com").trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || "admin123";
    const envName = process.env.ADMIN_NAME || "Salma - Administratrice BBS";
    const isMasterEmail = normalizedEmail === envEmail || normalizedEmail === "admin@bbsbysalma.com" || normalizedEmail === "admin@najarosestore.sn";
    if (isMasterEmail && password === envPassword) {
      let user2 = db.getData().adminUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (!user2) {
        user2 = {
          id: `admin_${Date.now()}`,
          name: envName,
          email: normalizedEmail,
          passwordHash: bcrypt2.hashSync(envPassword, 10),
          role: "superadmin",
          avatar: "/assets/teint_marron.jpg"
        };
        db.getData().adminUsers.unshift(user2);
        db.save();
      } else {
        user2.passwordHash = bcrypt2.hashSync(envPassword, 10);
        db.save();
      }
      const token2 = generateToken({
        id: user2.id,
        email: user2.email,
        role: user2.role,
        name: user2.name
      });
      return res.json({
        success: true,
        token: token2,
        user: {
          id: user2.id,
          name: user2.name,
          email: user2.email,
          role: user2.role,
          avatar: user2.avatar
        }
      });
    }
    const user = db.getData().adminUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }
    const isMatch = bcrypt2.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erreur lors de la connexion." });
  }
});
authRouter.get("/me", requireAuth, (req, res) => {
  const user = db.getData().adminUsers.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
});
authRouter.put("/profile", requireAuth, (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, avatar } = req.body;
    const userIndex = db.getData().adminUsers.findIndex((u) => u.id === req.user?.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }
    const user = db.getData().adminUsers[userIndex];
    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (avatar) user.avatar = avatar;
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Veuillez saisir votre mot de passe actuel pour le modifier." });
      }
      const isMatch = bcrypt2.compareSync(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: "Le mot de passe actuel est incorrect." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Le nouveau mot de passe doit comporter au moins 6 caract\xE8res." });
      }
      user.passwordHash = bcrypt2.hashSync(newPassword, 10);
    }
    db.getData().adminUsers[userIndex] = user;
    db.save();
    return res.json({
      success: true,
      message: "Profil mis \xE0 jour avec succ\xE8s.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erreur lors de la mise \xE0 jour." });
  }
});

// backend/routes/products.routes.ts
import express2 from "express";
var productsRouter = express2.Router();
function slugify(text) {
  return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
}
productsRouter.get("/", (req, res) => {
  try {
    let products = [...db.getData().products];
    const { category, collection, status, search, featured, bestSeller, isNew } = req.query;
    if (category) {
      products = products.filter((p) => p.categoryId === category);
    }
    if (collection) {
      products = products.filter((p) => p.collectionId === collection);
    }
    if (status) {
      products = products.filter((p) => p.status === status);
    }
    if (featured === "true") {
      products = products.filter((p) => p.isFeatured);
    }
    if (bestSeller === "true") {
      products = products.filter((p) => p.isBestSeller);
    }
    if (isNew === "true") {
      products = products.filter((p) => p.isNew);
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.shade && p.shade.toLowerCase().includes(q)
      );
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de la r\xE9cup\xE9ration des produits." });
  }
});
productsRouter.get("/:idOrSlug", (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = db.getData().products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur." });
  }
});
productsRouter.post("/", requireAuth, (req, res) => {
  try {
    const {
      name,
      sku,
      brand = "BBS By Salma",
      categoryId,
      collectionId,
      description = "",
      shortDescription = "",
      price,
      oldPrice,
      promoPrice,
      stock = 0,
      alertThreshold = 5,
      shade = "",
      skinType = "",
      ingredients = "",
      images = [],
      isFeatured = false,
      isNew = false,
      isBestSeller = false,
      status = "published"
    } = req.body;
    if (!name || price === void 0) {
      return res.status(400).json({ error: "Le nom du produit et le prix sont obligatoires." });
    }
    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (db.getData().products.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    const generatedSku = sku?.trim() || `BBS-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const formattedImages = Array.isArray(images) ? images.map((img, idx) => ({
      id: img.id || `img_${Date.now()}_${idx}`,
      url: typeof img === "string" ? img : img.url,
      isPrimary: img.isPrimary !== void 0 ? img.isPrimary : idx === 0,
      position: img.position !== void 0 ? img.position : idx + 1
    })) : [];
    const newProduct = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug: finalSlug,
      sku: generatedSku,
      brand: brand.trim(),
      categoryId: categoryId || "cat_teint",
      collectionId: collectionId || void 0,
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : void 0,
      promoPrice: promoPrice ? Number(promoPrice) : void 0,
      stock: Number(stock) || 0,
      alertThreshold: Number(alertThreshold) || 5,
      shade: shade?.trim(),
      skinType: skinType?.trim(),
      ingredients: ingredients?.trim(),
      images: formattedImages,
      isFeatured: Boolean(isFeatured),
      isNew: Boolean(isNew),
      isBestSeller: Boolean(isBestSeller),
      status: status || "published",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().products.unshift(newProduct);
    db.save();
    res.status(201).json({
      success: true,
      message: "Produit cr\xE9\xE9 avec succ\xE8s.",
      product: newProduct
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de la cr\xE9ation du produit." });
  }
});
productsRouter.put("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const index = db.getData().products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Produit introuvable." });
    }
    const currentProduct = db.getData().products[index];
    const updateData = req.body;
    let updatedSlug = currentProduct.slug;
    if (updateData.name && updateData.name !== currentProduct.name) {
      const baseSlug = slugify(updateData.name);
      updatedSlug = baseSlug;
      let counter = 1;
      while (db.getData().products.some((p) => p.slug === updatedSlug && p.id !== id)) {
        updatedSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    let formattedImages = currentProduct.images;
    if (Array.isArray(updateData.images)) {
      formattedImages = updateData.images.map((img, idx) => ({
        id: img.id || `img_${Date.now()}_${idx}`,
        url: typeof img === "string" ? img : img.url,
        isPrimary: img.isPrimary !== void 0 ? img.isPrimary : idx === 0,
        position: img.position !== void 0 ? img.position : idx + 1
      }));
    }
    const updatedProduct = {
      ...currentProduct,
      name: updateData.name !== void 0 ? updateData.name.trim() : currentProduct.name,
      slug: updatedSlug,
      sku: updateData.sku !== void 0 ? updateData.sku.trim() : currentProduct.sku,
      brand: updateData.brand !== void 0 ? updateData.brand.trim() : currentProduct.brand,
      categoryId: updateData.categoryId !== void 0 ? updateData.categoryId : currentProduct.categoryId,
      collectionId: updateData.collectionId !== void 0 ? updateData.collectionId || void 0 : currentProduct.collectionId,
      description: updateData.description !== void 0 ? updateData.description.trim() : currentProduct.description,
      shortDescription: updateData.shortDescription !== void 0 ? updateData.shortDescription.trim() : currentProduct.shortDescription,
      price: updateData.price !== void 0 ? Number(updateData.price) : currentProduct.price,
      oldPrice: updateData.oldPrice !== void 0 ? updateData.oldPrice ? Number(updateData.oldPrice) : void 0 : currentProduct.oldPrice,
      promoPrice: updateData.promoPrice !== void 0 ? updateData.promoPrice ? Number(updateData.promoPrice) : void 0 : currentProduct.promoPrice,
      stock: updateData.stock !== void 0 ? Number(updateData.stock) : currentProduct.stock,
      alertThreshold: updateData.alertThreshold !== void 0 ? Number(updateData.alertThreshold) : currentProduct.alertThreshold,
      shade: updateData.shade !== void 0 ? updateData.shade.trim() : currentProduct.shade,
      skinType: updateData.skinType !== void 0 ? updateData.skinType.trim() : currentProduct.skinType,
      ingredients: updateData.ingredients !== void 0 ? updateData.ingredients.trim() : currentProduct.ingredients,
      images: formattedImages,
      isFeatured: updateData.isFeatured !== void 0 ? Boolean(updateData.isFeatured) : currentProduct.isFeatured,
      isNew: updateData.isNew !== void 0 ? Boolean(updateData.isNew) : currentProduct.isNew,
      isBestSeller: updateData.isBestSeller !== void 0 ? Boolean(updateData.isBestSeller) : currentProduct.isBestSeller,
      status: updateData.status !== void 0 ? updateData.status : currentProduct.status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().products[index] = updatedProduct;
    db.save();
    res.json({
      success: true,
      message: "Produit mis \xE0 jour avec succ\xE8s.",
      product: updatedProduct
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de la mise \xE0 jour." });
  }
});
productsRouter.patch("/:id/stock", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const product = db.getData().products.find((p) => p.id === id);
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable." });
    }
    product.stock = Math.max(0, Number(stock));
    product.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.save();
    res.json({
      success: true,
      message: "Stock mis \xE0 jour avec succ\xE8s.",
      stock: product.stock
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur." });
  }
});
productsRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = db.getData().products.length;
    db.getData().products = db.getData().products.filter((p) => p.id !== id);
    if (db.getData().products.length === initialLen) {
      return res.status(404).json({ error: "Produit introuvable." });
    }
    db.save();
    res.json({ success: true, message: "Produit supprim\xE9 avec succ\xE8s." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de la suppression." });
  }
});

// backend/routes/collections.routes.ts
import express3 from "express";
var collectionsRouter = express3.Router();
function slugify2(text) {
  return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
}
collectionsRouter.get("/", (req, res) => {
  try {
    let collections = [...db.getData().collections];
    const { status, featured } = req.query;
    if (status) {
      collections = collections.filter((c) => c.status === status);
    }
    if (featured === "true") {
      collections = collections.filter((c) => c.isFeatured);
    }
    const enriched = collections.map((col) => {
      const productCount = db.getData().products.filter((p) => p.collectionId === col.id).length;
      return {
        ...col,
        productCount
      };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de la r\xE9cup\xE9ration des gammes." });
  }
});
collectionsRouter.get("/:idOrSlug", (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const collection = db.getData().collections.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
    if (!collection) {
      return res.status(404).json({ error: "Gamme introuvable." });
    }
    const products = db.getData().products.filter((p) => p.collectionId === collection.id);
    res.json({
      ...collection,
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur." });
  }
});
collectionsRouter.post("/", requireAuth, (req, res) => {
  try {
    const {
      name,
      categoryId = "cat_teint",
      shade = "",
      description = "",
      shortDescription = "",
      coverImage,
      images = [],
      status = "active",
      isFeatured = true
    } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Le nom de la gamme est obligatoire." });
    }
    let baseSlug = slugify2(name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (db.getData().collections.some((c) => c.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    const imageList = Array.isArray(images) && images.length > 0 ? images : coverImage ? [coverImage] : ["/assets/hero_banner.jpg"];
    const newCollection = {
      id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug: finalSlug,
      categoryId,
      shade: shade.trim(),
      description: description.trim(),
      shortDescription: shortDescription.trim(),
      coverImage: coverImage || imageList[0] || "/assets/hero_banner.jpg",
      images: imageList,
      status: status || "active",
      isFeatured: Boolean(isFeatured),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().collections.unshift(newCollection);
    db.save();
    res.status(201).json({
      success: true,
      message: "Gamme cr\xE9\xE9e avec succ\xE8s.",
      collection: newCollection
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de la cr\xE9ation de la gamme." });
  }
});
collectionsRouter.put("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const index = db.getData().collections.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Gamme introuvable." });
    }
    const currentCollection = db.getData().collections[index];
    const updateData = req.body;
    let updatedSlug = currentCollection.slug;
    if (updateData.name && updateData.name !== currentCollection.name) {
      const baseSlug = slugify2(updateData.name);
      updatedSlug = baseSlug;
      let counter = 1;
      while (db.getData().collections.some((c) => c.slug === updatedSlug && c.id !== id)) {
        updatedSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    const updatedCollection = {
      ...currentCollection,
      name: updateData.name !== void 0 ? updateData.name.trim() : currentCollection.name,
      slug: updatedSlug,
      categoryId: updateData.categoryId !== void 0 ? updateData.categoryId : currentCollection.categoryId,
      shade: updateData.shade !== void 0 ? updateData.shade.trim() : currentCollection.shade,
      description: updateData.description !== void 0 ? updateData.description.trim() : currentCollection.description,
      shortDescription: updateData.shortDescription !== void 0 ? updateData.shortDescription.trim() : currentCollection.shortDescription,
      coverImage: updateData.coverImage !== void 0 ? updateData.coverImage : currentCollection.coverImage,
      images: Array.isArray(updateData.images) ? updateData.images : currentCollection.images,
      status: updateData.status !== void 0 ? updateData.status : currentCollection.status,
      isFeatured: updateData.isFeatured !== void 0 ? Boolean(updateData.isFeatured) : currentCollection.isFeatured,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().collections[index] = updatedCollection;
    db.save();
    res.json({
      success: true,
      message: "Gamme mise \xE0 jour avec succ\xE8s.",
      collection: updatedCollection
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur." });
  }
});
collectionsRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const initialLen = db.getData().collections.length;
    db.getData().collections = db.getData().collections.filter((c) => c.id !== id);
    if (db.getData().collections.length === initialLen) {
      return res.status(404).json({ error: "Gamme introuvable." });
    }
    db.getData().products.forEach((p) => {
      if (p.collectionId === id) {
        delete p.collectionId;
      }
    });
    db.save();
    res.json({ success: true, message: "Gamme supprim\xE9e avec succ\xE8s." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur." });
  }
});

// backend/routes/categories.routes.ts
import express4 from "express";
var categoriesRouter = express4.Router();
function slugify3(text) {
  return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
}
categoriesRouter.get("/", (_req, res) => {
  try {
    const categories = db.getData().categories.map((cat) => {
      const productCount = db.getData().products.filter((p) => p.categoryId === cat.id).length;
      return {
        ...cat,
        productCount
      };
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
categoriesRouter.post("/", requireAuth, (req, res) => {
  try {
    const { name, description = "", image = "/assets/hero_banner.jpg" } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Le nom de la cat\xE9gorie est obligatoire." });
    }
    const slug = slugify3(name);
    const newCategory = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug,
      description: description.trim(),
      image,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().categories.push(newCategory);
    db.save();
    res.status(201).json({
      success: true,
      message: "Cat\xE9gorie cr\xE9\xE9e avec succ\xE8s.",
      category: newCategory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
categoriesRouter.put("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const index = db.getData().categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Cat\xE9gorie introuvable." });
    }
    const current = db.getData().categories[index];
    const { name, description, image } = req.body;
    const updated = {
      ...current,
      name: name !== void 0 ? name.trim() : current.name,
      slug: name !== void 0 ? slugify3(name) : current.slug,
      description: description !== void 0 ? description.trim() : current.description,
      image: image !== void 0 ? image : current.image
    };
    db.getData().categories[index] = updated;
    db.save();
    res.json({ success: true, message: "Cat\xE9gorie mise \xE0 jour.", category: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
categoriesRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.getData().categories = db.getData().categories.filter((c) => c.id !== id);
    db.save();
    res.json({ success: true, message: "Cat\xE9gorie supprim\xE9e." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/orders.routes.ts
import express5 from "express";
var ordersRouter = express5.Router();
ordersRouter.get("/track/:orderNumber", (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;
    const order = db.getData().orders.find(
      (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id.toLowerCase() === orderNumber.toLowerCase()
    );
    if (!order) {
      return res.status(404).json({ error: "Commande introuvable. V\xE9rifiez le num\xE9ro de commande." });
    }
    if (phone && typeof phone === "string") {
      const cleanInputPhone = phone.replace(/\D/g, "");
      const cleanOrderPhone = order.customer.phone.replace(/\D/g, "");
      if (!cleanOrderPhone.includes(cleanInputPhone) && !cleanInputPhone.includes(cleanOrderPhone)) {
        return res.status(403).json({ error: "Le num\xE9ro de t\xE9l\xE9phone ne correspond pas \xE0 cette commande." });
      }
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
ordersRouter.get("/", requireAuth, (req, res) => {
  try {
    let orders = [...db.getData().orders];
    const { status, search } = req.query;
    if (status && status !== "all") {
      orders = orders.filter((o) => o.orderStatus === status);
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.toLowerCase().includes(q) || o.customer.email && o.customer.email.toLowerCase().includes(q)
      );
    }
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
ordersRouter.get("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const order = db.getData().orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ error: "Commande introuvable." });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
ordersRouter.post("/", (req, res) => {
  try {
    const { customer, items, paymentMethod = "cash_on_delivery", deliveryFee = 2e3, discount = 0 } = req.body;
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ error: "Informations de livraison incompl\xE8tes (Nom, T\xE9l\xE9phone, Adresse requis)." });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Le panier est vide." });
    }
    const validatedItems = [];
    let calculatedSubtotal = 0;
    for (const item of items) {
      const product = db.getData().products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Produit non trouv\xE9 : ${item.name || item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour "${product.name}". Il ne reste que ${product.stock} pi\xE8ce(s).`
        });
      }
      product.stock -= item.quantity;
      product.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      const unitPrice = product.promoPrice || product.price;
      calculatedSubtotal += unitPrice * item.quantity;
      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: unitPrice,
        quantity: item.quantity,
        shade: item.shade || product.shade,
        image: product.images[0]?.url || "/assets/prod_fond_teint.jpg",
        sku: product.sku
      });
    }
    const nextOrderSeq = db.getData().orders.length + 126;
    const orderNumber = `BBS-${nextOrderSeq.toString().padStart(5, "0")}`;
    const total = Math.max(0, calculatedSubtotal + Number(deliveryFee) - Number(discount));
    const newOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : void 0,
        address: customer.address.trim(),
        city: customer.city ? customer.city.trim() : "Dakar",
        region: customer.region ? customer.region.trim() : "Dakar",
        notes: customer.notes ? customer.notes.trim() : void 0
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee: Number(deliveryFee),
      discount: Number(discount),
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "paid",
      orderStatus: "new",
      history: [
        {
          status: "new",
          date: (/* @__PURE__ */ new Date()).toISOString(),
          note: `Nouvelle commande enregistr\xE9e (${paymentMethod === "cash_on_delivery" ? "Paiement \xE0 la livraison" : paymentMethod.toUpperCase()})`
        }
      ],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().orders.unshift(newOrder);
    const existingCustomer = db.getData().customers.find(
      (c) => c.phone.replace(/\D/g, "") === customer.phone.replace(/\D/g, "")
    );
    if (existingCustomer) {
      existingCustomer.ordersCount += 1;
      existingCustomer.totalSpent += total;
      existingCustomer.lastOrderDate = (/* @__PURE__ */ new Date()).toISOString();
      if (customer.address) existingCustomer.address = customer.address;
      if (customer.email && !existingCustomer.email) existingCustomer.email = customer.email;
    } else {
      const newCustomer = {
        id: `cust_${Date.now()}`,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim(),
        address: customer.address.trim(),
        city: customer.city?.trim() || "Dakar",
        ordersCount: 1,
        totalSpent: total,
        lastOrderDate: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.getData().customers.unshift(newCustomer);
    }
    db.save();
    res.status(201).json({
      success: true,
      message: "Votre commande a \xE9t\xE9 enregistr\xE9e avec succ\xE8s !",
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de l\u2019enregistrement de la commande." });
  }
});
ordersRouter.put("/:id/status", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, paymentStatus } = req.body;
    const order = db.getData().orders.find((o) => o.id === id);
    if (!order) {
      return res.status(404).json({ error: "Commande introuvable." });
    }
    const previousStatus = order.orderStatus;
    if (status && status !== previousStatus) {
      if (status === "cancelled" && previousStatus !== "cancelled") {
        for (const item of order.items) {
          const product = db.getData().products.find((p) => p.id === item.productId);
          if (product) {
            product.stock += item.quantity;
            product.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          }
        }
      }
      order.orderStatus = status;
      order.history.push({
        status,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        note: note || `Statut pass\xE9 \xE0 : ${status}`
      });
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.save();
    res.json({
      success: true,
      message: "Statut de la commande mis \xE0 jour avec succ\xE8s.",
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/customers.routes.ts
import express6 from "express";
var customersRouter = express6.Router();
customersRouter.get("/", requireAuth, (req, res) => {
  try {
    let customers = [...db.getData().customers];
    const { search } = req.query;
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      customers = customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q) || c.email && c.email.toLowerCase().includes(q) || c.city && c.city.toLowerCase().includes(q)
      );
    }
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
customersRouter.get("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const customer = db.getData().customers.find((c) => c.id === id);
    if (!customer) {
      return res.status(404).json({ error: "Client introuvable." });
    }
    const cleanCustomerPhone = customer.phone.replace(/\D/g, "");
    const orders = db.getData().orders.filter(
      (o) => o.customer.phone.replace(/\D/g, "") === cleanCustomerPhone || customer.email && o.customer.email && o.customer.email.toLowerCase() === customer.email.toLowerCase()
    );
    res.json({
      ...customer,
      orders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
customersRouter.post("/", requireAuth, (req, res) => {
  try {
    const { name, phone, email, address, city } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Nom et t\xE9l\xE9phone sont obligatoires." });
    }
    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      address: address?.trim(),
      city: city?.trim() || "Dakar",
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: (/* @__PURE__ */ new Date()).toISOString(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().customers.unshift(newCustomer);
    db.save();
    res.status(201).json({ success: true, customer: newCustomer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/sales.routes.ts
import express7 from "express";
var salesRouter = express7.Router();
salesRouter.get("/", requireAuth, (req, res) => {
  try {
    const { period = "month", startDate, endDate } = req.query;
    const orders = db.getData().orders;
    const products = db.getData().products;
    const collections = db.getData().collections;
    const customers = db.getData().customers;
    const now = /* @__PURE__ */ new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
    const validOrders = orders.filter((o) => o.orderStatus !== "cancelled");
    let totalRevenue = 0;
    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;
    let todayOrdersCount = 0;
    let weekOrdersCount = 0;
    let monthOrdersCount = 0;
    let totalProductsSold = 0;
    const productSalesMap = {};
    const collectionSalesMap = {};
    validOrders.forEach((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      totalRevenue += order.total;
      if (orderTime >= startOfToday) {
        todayRevenue += order.total;
        todayOrdersCount++;
      }
      if (orderTime >= startOfWeek) {
        weekRevenue += order.total;
        weekOrdersCount++;
      }
      if (orderTime >= startOfMonth) {
        monthRevenue += order.total;
        monthOrdersCount++;
      }
      order.items.forEach((item) => {
        totalProductsSold += item.quantity;
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.name,
            sku: item.sku,
            count: 0,
            revenue: 0,
            image: item.image
          };
        }
        productSalesMap[item.productId].count += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
        const prod = products.find((p) => p.id === item.productId);
        if (prod && prod.collectionId) {
          const col = collections.find((c) => c.id === prod.collectionId);
          const colName = col ? col.name : "Gamme Inconnue";
          if (!collectionSalesMap[prod.collectionId]) {
            collectionSalesMap[prod.collectionId] = {
              name: colName,
              count: 0,
              revenue: 0
            };
          }
          collectionSalesMap[prod.collectionId].count += item.quantity;
          collectionSalesMap[prod.collectionId].revenue += item.price * item.quantity;
        }
      });
    });
    const averageCart = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
    const lowStockProducts = products.filter((p) => p.stock <= p.alertThreshold && p.stock > 0);
    const outOfStockProducts = products.filter((p) => p.stock === 0);
    const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const topCollections = Object.values(collectionSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    const last7DaysChart = [];
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400 * 1e3);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400 * 1e3;
      const dayOrders = validOrders.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      });
      const dayRev = dayOrders.reduce((sum, o) => sum + o.total, 0);
      last7DaysChart.push({
        label: dayNames[d.getDay()],
        date: d.toISOString().split("T")[0],
        revenue: dayRev,
        ordersCount: dayOrders.length
      });
    }
    const ordersByStatus = {
      new: orders.filter((o) => o.orderStatus === "new").length,
      confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
      processing: orders.filter((o) => o.orderStatus === "processing").length,
      shipped: orders.filter((o) => o.orderStatus === "shipped").length,
      delivered: orders.filter((o) => o.orderStatus === "delivered").length,
      cancelled: orders.filter((o) => o.orderStatus === "cancelled").length
    };
    res.json({
      summary: {
        totalRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        totalOrders: orders.length,
        validOrdersCount: validOrders.length,
        todayOrdersCount,
        weekOrdersCount,
        monthOrdersCount,
        totalProductsSold,
        totalProductsInCatalog: products.length,
        averageCart,
        customersCount: customers.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length
      },
      lowStockProducts,
      outOfStockProducts,
      topProducts,
      topCollections,
      last7DaysChart,
      ordersByStatus,
      recentOrders: orders.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/reviews.routes.ts
import express8 from "express";
var reviewsRouter = express8.Router();
reviewsRouter.get("/", (req, res) => {
  try {
    const { productId, status } = req.query;
    let reviews = [...db.getData().reviews];
    if (productId) {
      reviews = reviews.filter((r) => r.productId === productId);
    }
    if (status) {
      reviews = reviews.filter((r) => r.status === status);
    }
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
reviewsRouter.post("/", (req, res) => {
  try {
    const { productId, customerName, rating, title, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: "Tous les champs obligatoires doivent \xEAtre remplis." });
    }
    const product = db.getData().products.find((p) => p.id === productId);
    const newReview = {
      id: `rev_${Date.now()}`,
      productId,
      productName: product ? product.name : void 0,
      customerName: customerName.trim(),
      rating: Math.min(5, Math.max(1, Number(rating))),
      title: title ? title.trim() : "Avis client",
      comment: comment.trim(),
      verified: true,
      status: "approved",
      // Auto-approved or pending according to store preferences
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.getData().reviews.unshift(newReview);
    db.save();
    res.status(201).json({
      success: true,
      message: "Merci pour votre avis pr\xE9cieux !",
      review: newReview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
reviewsRouter.put("/:id/status", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const review = db.getData().reviews.find((r) => r.id === id);
    if (!review) {
      return res.status(404).json({ error: "Avis introuvable." });
    }
    review.status = status;
    db.save();
    res.json({ success: true, message: "Statut de l\u2019avis mis \xE0 jour.", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
reviewsRouter.delete("/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.getData().reviews = db.getData().reviews.filter((r) => r.id !== id);
    db.save();
    res.json({ success: true, message: "Avis supprim\xE9." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/content.routes.ts
import express9 from "express";
var contentRouter = express9.Router();
contentRouter.get("/", (_req, res) => {
  try {
    const content = db.getData().siteContent;
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
contentRouter.put("/", requireAuth, (req, res) => {
  try {
    const updatedContent = req.body;
    const current = db.getData().siteContent;
    db.getData().siteContent = {
      hero: { ...current.hero, ...updatedContent.hero || {} },
      promoBanner: { ...current.promoBanner, ...updatedContent.promoBanner || {} },
      about: { ...current.about, ...updatedContent.about || {} },
      contact: { ...current.contact, ...updatedContent.contact || {} },
      guarantees: updatedContent.guarantees || current.guarantees
    };
    db.save();
    res.json({
      success: true,
      message: "Contenu du site mis \xE0 jour avec succ\xE8s.",
      content: db.getData().siteContent
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/settings.routes.ts
import express10 from "express";
var settingsRouter = express10.Router();
settingsRouter.get("/", (_req, res) => {
  try {
    const settings = db.getData().settings;
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
settingsRouter.put("/", requireAuth, (req, res) => {
  try {
    const newSettings = req.body;
    db.getData().settings = {
      ...db.getData().settings,
      ...newSettings
    };
    db.save();
    res.json({
      success: true,
      message: "Param\xE8tres mis \xE0 jour avec succ\xE8s.",
      settings: db.getData().settings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// backend/routes/upload.routes.ts
import express11 from "express";
import multer from "multer";
import path2 from "path";
import fs2 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
import { v2 as cloudinary } from "cloudinary";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var uploadRouter = express11.Router();
var uploadDir = process.env.VERCEL ? path2.join("/tmp", "uploads") : path2.join(__dirname2, "../uploads");
try {
  if (!fs2.existsSync(uploadDir)) {
    fs2.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn("[Upload] Note: uploadDir could not be created:", e);
}
function isCloudinaryConfigured() {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
function initCloudinary() {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    return true;
  }
  return false;
}
async function processUploadedFile(file) {
  if (initCloudinary()) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: process.env.CLOUDINARY_FOLDER || "bbs-by-salma",
        resource_type: "image"
      });
      try {
        fs2.unlinkSync(file.path);
      } catch {
      }
      console.log(`[Cloudinary] Image upload\xE9e avec succ\xE8s : ${result.secure_url}`);
      return result.secure_url;
    } catch (err) {
      console.error("[Cloudinary] Erreur upload, fallback local :", err);
      return `/uploads/${file.filename}`;
    }
  }
  return `/uploads/${file.filename}`;
}
var storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path2.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `bbs_${uniqueSuffix}${ext}`);
  }
});
var fileFilter = (_req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif", "image/avif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format d\u2019image non support\xE9. Utilisez JPG, PNG, WEBP ou GIF."));
  }
};
var upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB
  fileFilter
});
uploadRouter.post("/multiple", requireAuth, upload.array("images", 5), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Aucun fichier s\xE9lectionn\xE9." });
    }
    const uploadedUrls = [];
    for (const file of files) {
      const url = await processUploadedFile(file);
      uploadedUrls.push(url);
    }
    return res.json({
      success: true,
      message: `${files.length} photo(s) import\xE9e(s) avec succ\xE8s.`,
      urls: uploadedUrls,
      provider: isCloudinaryConfigured() ? "cloudinary" : "local"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erreur lors de l\u2019upload des images." });
  }
});
uploadRouter.post("/single", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Aucun fichier s\xE9lectionn\xE9." });
    }
    const url = await processUploadedFile(file);
    return res.json({
      success: true,
      url,
      provider: isCloudinaryConfigured() ? "cloudinary" : "local"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erreur lors de l\u2019upload." });
  }
});
uploadRouter.post("/base64", requireAuth, async (req, res) => {
  try {
    const { base64Data, filename } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: "Donn\xE9es base64 manquantes." });
    }
    if (initCloudinary()) {
      try {
        const result = await cloudinary.uploader.upload(base64Data, {
          folder: process.env.CLOUDINARY_FOLDER || "bbs-by-salma",
          resource_type: "image"
        });
        console.log(`[Cloudinary Base64] Image upload\xE9e avec succ\xE8s : ${result.secure_url}`);
        return res.json({
          success: true,
          url: result.secure_url,
          provider: "cloudinary"
        });
      } catch (err) {
        console.error("[Cloudinary Base64] Erreur upload, fallback local :", err);
      }
    }
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let extension = ".webp";
    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes("jpeg") || mime.includes("jpg")) extension = ".jpg";
      else if (mime.includes("png")) extension = ".png";
      else if (mime.includes("webp")) extension = ".webp";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(base64Data, "base64");
    }
    const uniqueName = `bbs_${Date.now()}_${Math.round(Math.random() * 1e3)}${extension}`;
    const filePath = path2.join(uploadDir, uniqueName);
    fs2.writeFileSync(filePath, buffer);
    return res.json({
      success: true,
      url: `/uploads/${uniqueName}`,
      provider: "local"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erreur lors de l\u2019enregistrement de l\u2019image." });
  }
});

// backend/index.ts
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path3.dirname(__filename3);
var app = express12();
var PORT = process.env.PORT || 5e3;
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express12.json({ limit: "50mb" }));
app.use(express12.urlencoded({ extended: true, limit: "50mb" }));
var uploadsDir = process.env.VERCEL ? path3.join("/tmp", "uploads") : path3.join(__dirname3, "uploads");
try {
  if (!fs3.existsSync(uploadsDir)) {
    fs3.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn("[BBS Server] Note: uploadsDir could not be created:", e);
}
app.use("/uploads", express12.static(uploadsDir));
var frontendUploadsDir = path3.join(__dirname3, "../frontend/public/uploads");
if (fs3.existsSync(frontendUploadsDir)) {
  app.use("/uploads", express12.static(frontendUploadsDir));
}
db.init();
var apiRouter = express12.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/collections", collectionsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/customers", customersRouter);
apiRouter.use("/sales", salesRouter);
apiRouter.use("/dashboard", salesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/content", contentRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", store: "BBS By Salma API", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use("/api", apiRouter);
app.use("/", apiRouter);
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[BBS Server] API Server running on port ${PORT}`);
  });
}
var index_default = app;
export {
  app,
  index_default as default
};
