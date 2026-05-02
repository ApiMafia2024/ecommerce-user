import { Product } from '@/types/product.types';
import { Category } from '@/types/category.types';
import { CategoryWithIcon } from '@/types/home.types';

// Dummy Products Data
const makeImage = (url: string) => ({
  original: url,
  thumbnail: url,
  small: url,
  medium: url,
  large: url,
});

export const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Logitech G502 Hero',
    description: 'High-performance gaming mouse with RGB lighting',
    code: 'SKU-G502-HERO',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAXtj5yycaxVki8lV1HFGzOSswUeRqB_8tn8m9cwazxBDRtcpd4MiN5M8ohLEpsQMG1OUoTxzzBU6_6-oF86caeONnUrggHYDe8WCHEFNq15cU_DgaLoBR5tEx2R9CgKAH7-H-sd8cu-Dx1u723VcbTFonGuUgJtCaLwFMrhBLjDSaOpn0zfDgsu9gZ7-T737i4OVHD6IhmNu_mAybkIc4XBzz1rdF3990Ic2AuctvjahM-GtBucbd_WhpRyiSjTZ2OC5Gs7kZ3Dw')],
    video: [],
    category: { id: 7, name: 'Peripherals' },
    vendor: 'API TECH',
    variations: [
      { id: 101, price: 49.99, stock: 120, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 2,
    name: 'Keychron Q1 Pro',
    description: 'Premium mechanical keyboard with hot-swappable switches',
    code: 'SKU-KQ1-PRO',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBsKfg4-6XgRreP6rfdi3I5WAmR6NCMbwZiMLAhitpNuZwFJxHtHfMqx2h_DO5mFB7l2IqSQ1AR5dXFt-Fdf1rzDF_c-JQk7-_6saQ0YuuqgZQbXdfe5Tgz-XSDjt0efUFlUCOAFQL3HSOCl6pUMrX1X_UW6Ho3t1E6UvkNrvgKDnycGVJJY2Q3SkGHxO1lbFCB7NfNu9xiKsX_IYOnprxQBzh4FHg5alS5VniPl74auQ-RXwic_nWTO6nJCOGUr1ynsJ5mrnk5UQ')],
    video: [],
    category: { id: 7, name: 'Peripherals' },
    vendor: 'API TECH',
    variations: [
      { id: 102, price: 169.0, stock: 60, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 3,
    name: 'Anker 7-in-1 Hub',
    description: 'USB-C multi-port hub adapter for laptops',
    code: 'SKU-ANK-HUB-7IN1',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBqt9y7oXSCuRf6WuuN1RqAgNRWAjxMo5swIvevllYiufrUe8T_S2gKWSpqLwWwNQYozV2Fhqzcx20OmhtjHPsuH41BSAlxaKJdUUlv4MTTyDc8XDgAsfTuuLGTMTzwpDpSqHolNSkjcZbVwTOVCsoB1WsI_vbuu5IqDszaCRMjQl2jrg9PnMBdfwOU68z-mg-V_GB8gZUlMJOgaho4jmhm3_zdCHUt4xcD0rf32aG2PnU6UHUBHvJsKBFxNSubkmfzHm-VualIww')],
    video: [],
    category: { id: 7, name: 'Peripherals' },
    vendor: 'API TECH',
    variations: [
      { id: 103, price: 29.99, stock: 200, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 4,
    name: 'Shargeek Storm 2',
    description: 'Portable fast charging power bank',
    code: 'SKU-SHARGE-STORM2',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCWzcVXIfObo1xrdkjdXlVBamuLP3er3lUk3_LIDDBLsn9PtxadATCnth_ZVi46qlBt8qqE_suWdqIiid5VGAl9me5p7Perb-59A55qMWgzdjI0MViBDsfp_Ok0FInv8y1CVPFV7xOGNmbHKB2yjTK2cEKKOYjwoJHC3sxyJvOYlVhChMFlMetSjMZqMzy_xEZ25UudqPAj--tyrwu3HvhcVeyUVlttDqTZhaGqcE94Fd1-qAa-luNw9ytKYzshcApmV2J8gA672w')],
    video: [],
    category: { id: 7, name: 'Peripherals' },
    vendor: 'API TECH',
    variations: [
      { id: 104, price: 199.0, stock: 40, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 5,
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with titanium design and A17 Pro chip',
    code: 'SKU-IP15PM',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuC15sJ7P2o5lM_Enzle8iM3cMbyHW1248o3ePGLAknCAAX5wS2p6koCb5Vf39el3mU4mOOWWuOCZxbtmWl-LNsqMdIBf4Gr4G3adza2iB6ZPM0V_7y508cBesjzrggTN0FK4gP-qLLReihEvjuvLcwTVkW6yV2w-cBP_25MI4xvrhrQdkfD0RwmNl1lxVq70RmfTZizOiplmmhre8Dhm-k9ezyTAtXqu4BOU8L0J2qiPw1vzCgsrQDE7_Ewe6Brzyd96DNQbWA9RA')],
    video: [],
    category: { id: 2, name: 'Phones' },
    vendor: 'API TECH',
    variations: [
      { id: 105, price: 1199.0, stock: 25, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 6,
    name: 'Samsung 990 Pro SSD 2TB',
    description: 'High-speed solid state drive for gaming and professional use',
    code: 'SKU-SAM-990PRO-2TB',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCJ7kcm1vWyFM7D92Hw91qhYWS6ckpdbA8e1bPYr7lUI_GP1rpiRX6fJSNbkMVGlo5e6Ewm51qngYuZX4_zZh2fuoHGNu6kuo9PE4ITxZzb9-G3LJTL6b8jo10aLoA5sHtMOHqRiXnD8HTLvk7KDGtdNEUx0UJdtjqO6K3PZcVwsSsvWpsGH8e_5-RaRpA5P9vPu_CFm1NXxBoaVogUqULqKA5YIR-k9KctCrj8z3fpzNaB0Qu2zdxAsJSe4R8_-Q0iQhbjtbJPgg')],
    video: [],
    category: { id: 5, name: 'Components' },
    vendor: 'API TECH',
    variations: [
      { id: 106, price: 179.0, stock: 80, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 7,
    name: 'LG UltraWide 38"',
    description: 'Widescreen curved gaming monitor with 4K resolution',
    code: 'SKU-LG-UW-38',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBOy3XeW3rLcm5o0kppiHNiJEKTqJWkB1oKRI7y5H2vZqxgJ1zGSijLgFbhzJp_OsPiyz8hswQ_N6cwQ8j5CPEGe_DRJSJbIdS97Z-V69a5aRzlkGl3FnuJByhy-Ofy-NN4gvJj4-npWJwyCd3s7klwGVo5YmgEvLyg_pB7oJoAIzYpr0mZ9JQcvK5dj1Lszc5nK74F2sHROthzQaxZU8iZx20Xf2A4G2zXipwtGSMHd7rJfcgCHOYwfIXpsIi4f2MWOGG_eOiRmw')],
    video: [],
    category: { id: 3, name: 'Gaming' },
    vendor: 'API TECH',
    variations: [
      { id: 107, price: 949.0, stock: 15, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 8,
    name: 'Apple Watch Ultra 2',
    description: 'Premium smart watch with titanium case',
    code: 'SKU-AWU2',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCepMGRNRiScSgSWhMygQsJR7yaboq0PQ7b7RSobUh0UAe8MgIHiJcFoOUvAHh6Y17QE5TrBaSpSVwKvaqmf76gdFf-wC0RP2vAF3Cg-kJz9ieKFwl_QxqnxDkIqa-YENT5eGdcrWOJhQwr4At0hD5iHlvm-MFAayd3NoCelwQfZPpLiGFbh6LOHn5OHrCEXwGo-kRhl7LQjj4972YwPuIEdHpVK4P8YOYoqbdHy3VoxXUG12NVSBYCqCi2rTT6IaELqy1KcS068w')],
    video: [],
    category: { id: 6, name: 'Wearables' },
    vendor: 'API TECH',
    variations: [
      { id: 108, price: 799.0, stock: 18, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 9,
    name: 'Sony Alpha A7 IV',
    description: 'Professional grade digital camera body',
    code: 'SKU-SONY-A7IV',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBvSVq6cNWQ5M-tG7zG3h5Wya3oz-IpUjMT66BYqcx53RcO_1_ojURVRMYyDNFfXS50wDC7PRhGZfGQ-io61x5y9glH2Bw1yQhdjgWDFS3gd0EmqIZHFty9_cvbJIHWdSl7-10V4gcwsoK0tJXWmGfCZdpTEHnmy7qUL6uIM8k1e1Gp2a_WSpdRGEhFqLrKFxBUt8TloOIPH1Jys4STsnaj8bvvkCI2AlizN_cd5hjd7Q3NC5k-qneZgni3YAiIQWaySaSe3GCZYw')],
    video: [],
    category: { id: 8, name: 'Cameras' },
    vendor: 'API TECH',
    variations: [
      { id: 109, price: 2399.0, stock: 10, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 10,
    name: 'Sonos Roam',
    description: 'Compact portable bluetooth speaker',
    code: 'SKU-SONOS-ROAM',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuDhjQgqbdVkdYkbkKKuizflxeI3pdqTBVGyATJGwhsTEXCR54_1IwlKlQKQx3nal-vaOGU7cTZ3Cn8XE3tr768giDfPZfThS9-Zu8OepQF9AW33eGeow8f7C5uqcK-y8iw7i9hjXbITTw7Q0wUb9TWKBFmPh1oOkz5JP_FOrruIlMlBHbfsYzqvVlSruaB4LjfC1fDMeBSHUrpbY-my1FhipH8gdPc_vpiPWPVQFzazBNlQP5MxYug371G9IjeRPiqPZhuVE2yUoA')],
    video: [],
    category: { id: 4, name: 'Audio' },
    vendor: 'API TECH',
    variations: [
      { id: 110, price: 179.0, stock: 45, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 11,
    name: 'TP-Link Deco XE75 Pro',
    description: 'Mesh wifi router system 3-pack',
    code: 'SKU-TP-DECO-XE75',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBH-ZB_QcblPyJXxLLxJOuex-dsPiTsrZsgq-OZTfsYvT6PqO0XQUv1gCQZNJ8GdhJqO7zTTbSWdzhJ2RfXLzRcp8x6jB8-625YXkg7Hx1rGD7VfKAXuGH8dNeKM3KtEq6x8whKqi2LHdby8vYhg3-_0sofdNf20ffGuhSeGJ6qaWUyC90awLrNbViFQQjZbKdFdHxW3mI47bHok6WCK38us4nR9kzRel95SDL_F_Ou7wFKkoq1I2MpYBIf9wjNYZgiwI7IRNKxXA')],
    video: [],
    category: { id: 5, name: 'Components' },
    vendor: 'API TECH',
    variations: [
      { id: 111, price: 399.0, stock: 22, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
  {
    id: 12,
    name: 'Insta360 Link 4K Webcam',
    description: 'High quality webcam for streaming',
    code: 'SKU-INSTA360-LINK',
    images: [makeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBuBBVT1CUOg0y8wBaRGNlTQbyLq1s5fiYdDWXJ1E2u4qkI9_DCg7ospSPnA8l6u6Ch1YYzCvzyfFB519ww9_CS2RmzMTA0y7f4cTNry1u4KiI3sptkWDXc_0TZUCKFAjLQ55nMLU0wsyrbjZP4Vw1pMPDNnM7CtRsNryWoL28Qxdvyr49eexBVEY8IsFyigDfcGNdupYVWnrK0tLhD13N5PA2wLqF89stPZB11r2O9uZRLqk0sNtmaNTJ9MLZdgoDM_So8fPrDOA')],
    video: [],
    category: { id: 8, name: 'Cameras' },
    vendor: 'API TECH',
    variations: [
      { id: 112, price: 299.0, stock: 30, notify_me: false, is_default: true, discount: 0, attributes: [] },
    ],
  },
];

// Dummy Categories Data
export const dummyCategories: Category[] = [
  {
    id: 1,
    name: 'Laptops',
    slug: 'laptops',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Phones',
    slug: 'phones',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Gaming',
    slug: 'gaming',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Audio',
    slug: 'audio',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Components',
    slug: 'components',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Wearables',
    slug: 'wearables',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'Peripherals',
    slug: 'peripherals',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'Cameras',
    slug: 'cameras',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Category icon mapping
const categoryIconMap: Record<string, string> = {
  laptops: 'laptop_mac',
  phones: 'smartphone',
  gaming: 'sports_esports',
  audio: 'headphones',
  components: 'memory',
  wearables: 'watch',
  peripherals: 'keyboard',
  cameras: 'camera',
};

// Helper function to get category icon
const getCategoryIcon = (categoryName: string, slug: string): string => {
  const key = categoryName.toLowerCase() || slug.toLowerCase();
  return categoryIconMap[key] || 'category';
};

// Dummy Categories with Icons
export const dummyCategoriesWithIcons: CategoryWithIcon[] = dummyCategories.map((cat) => ({
  ...cat,
  icon: getCategoryIcon(cat.name, cat.slug),
  subcategories: cat.slug === 'laptops' ? [
    { name: 'MacBooks', link: '/categories/laptops/macbooks' },
    { name: 'Gaming Laptops', link: '/categories/laptops/gaming' },
    { name: 'Business Ultrabooks', link: '/categories/laptops/ultrabooks' },
    { name: 'Workstations', link: '/categories/laptops/workstations' },
  ] : cat.slug === 'phones' ? [
    { name: 'iOS Devices', link: '/categories/phones/ios' },
    { name: 'Android Phones', link: '/categories/phones/android' },
    { name: 'Foldable Phones', link: '/categories/phones/foldable' },
  ] : undefined,
}));
