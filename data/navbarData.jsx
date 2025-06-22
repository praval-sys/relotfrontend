// Menu data structure
export const menuData = [
  {
    id: "women",
    label: "Women",
    link: "/products/?category=women",
    submenu: [
      {
        label: "Handbags",
        link: "/products/?category=women&subCategory=handbags",
        image: "/images/relot front page img 13-6/1st setion women_s bag.png"
      },
      {
        label: "Wallets and Small Leather Goods",
        link: "/products/?category=women&subCategory=wallets-and-small-leather-goods",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Accessories",
        link: "/products/?category=women&subCategory=accessories",
        image: "/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Jewelry",
            link: "/products/?category=women&subCategory=accessories&childCategory=jewelry"
          },
          {
            label: "Scarves",
            link: "/products/?category=women&subCategory=accessories&childCategory=scarves"
          },
          {
            label: "Belts",
            link: "/products/?category=women&subCategory=accessories&childCategory=belts"
          }
        ]
      },
      {
        label: "Travel",
        link: "/products/?category=women&subCategory=travel",
        image: "/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Luggage",
            link: "/products/?category=women&subCategory=travel&childCategory=luggage"
          },
          {
            label: "Travel Accessories",
            link: "/products/?category=women&subCategory=travel&childCategory=travel-accessories"
          },
          {
            label: "Travel Bags",
            link: "/products/?category=women&subCategory=travel&childCategory=travel-bags"
          }
        ]
      }
    ]
  },
  {
    id: "men",
    label: "Men",
    link: "/products/?category=men",
    submenu: [
      {
        label: "Bags",
        link: "/products/?category=men&subCategory=handbags", // Changed to match filter structure
        image: "/images/relot front page img 13-6/1st sec men_s bag.avif"
      },
      {
        label: "Wallets and Small Leather Goods",
        link: "/products/?category=men&subCategory=wallets-and-small-leather-goods",
        image: "/images/relot front page img 13-6/Men_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Accessories",
        link: "/products/?category=men&subCategory=accessories",
        image: "/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Belts",
            link: "/products/?category=men&subCategory=accessories&childCategory=belts"
          },
          {
            label: "Card Holders",
            link: "/products/?category=men&subCategory=accessories&childCategory=cardholders"
          },
          {
            label: "Key Holders",
            link: "/products/?category=men&subCategory=accessories&childCategory=keyholders"
          }
        ]
      },
      {
        label: "Travel",
        link: "/products/?category=men&subCategory=travel",
        image: "/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Luggage",
            link: "/products/?category=men&subCategory=travel&childCategory=luggage",
            image: "/images/relot front page img 13-6/topbnr3.jpg"
          },
          {
            label: "Travel Accessories",
            link: "/products/?category=men&subCategory=travel&childCategory=travel-accessories",
            image: "/images/relot front page img 13-6/topbnr3.jpg"
          },
          {
            label: "Travel Bags",
            link: "/products/?category=men&subCategory=travel&childCategory=travel-bags",
            image: "/images/relot front page img 13-6/topbnr3.jpg"
          },
          {
            label: "Shaving Kit Bags",
            link: "/products/?category=men&subCategory=travel&childCategory=shaving-kit-bags",
            image: "/images/relot front page img 13-6/topbnr3.jpg"
          }
        ]
      }
    ]
  },
  {
    id: "fragrances",
    label: "FRAGRANCES",
    link: "/products/?category=fragrances",
    submenu: [
      {
        label: "Perfume",
        link: "/products/?category=fragrances&subCategory=perfume",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Body Mist",
        link: "/products/?category=fragrances&subCategory=body-mist",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Roll-on",
        link: "/products/?category=fragrances&subCategory=roll-on",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Fragrances of India",
        link: "/products/?category=fragrances&subCategory=fragrances-of-india",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      }
    ]
  },
  {
    id: "bags",
    label: "BAGS AND SMALL LEATHER GOODS",
    link: "/products/?category=bags",
    submenu: [
      {
        label: "Relot Colourmania",
        link: "/products/?category=bags&brand=relot&search=colourmania", // Using brand filter + search
        image: "/images/relot front page img 13-6/relot abt.jpg"
      },
      {
        label: "Men Bags",
        link: "/products/?category=bags&search=men", // Using search for specific targeting
        image: "/images/relot front page img 13-6/topbnr3.jpg"
      },
      {
        label: "Women Small Leather Goods",
        link: "/products/?category=bags&subCategory=wallets-and-small-leather-goods&search=women",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Men Small Leather Goods",
        link: "/products/?category=bags&subCategory=wallets-and-small-leather-goods&search=men",
        image: "/images/relot front page img 13-6/1st sec men_s bag.avif"
      }
    ]
  },
  {
    id: "services",
    label: "SERVICES",
    link: "/products/?category=services",
    submenu: [
      {
        label: "Personalisation",
        link: "/products/?search=personalisation&tags=service", // Using search + tags for services
        image: "/images/relot front page img 13-6/Personalization.avif"
      },
      {
        label: "Relot Repairs",
        link: "/products/?search=repairs&tags=service",
        image: "/images/relot front page img 13-6/Relot Repairs.avif"
      },
      {
        label: "Art of Gifting",
        link: "/products/?search=gifting&tags=service",
        image: "/images/relot front page img 13-6/art of gifting.avif"
      }
    ]
  }
];

// Language data
export const languages = [
  { code: "en", name: "English", flag: "/images/eng.jpg" },
  { code: "fr", name: "Français", flag: "/images/france.png" },
  { code: "de", name: "Deutsch", flag: "/images/german.avif" }
];
