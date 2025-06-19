// Menu data structure
export const menuData = [
  {
    id: "women",
    label: "Women",
    link: "/products/?category=women",
    submenu: [
      {
        label: "Handbags",
        link: "/products/?category=women&search=handbags",
        image:"/images/relot front page img 13-6/1st setion women_s bag.png"
      },
      {
        label: "Wallets and Small Leather Goods",
        link: "/products/?category=women&search=wallets-and-small-leather-goods",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Accessories",
        link: "/products/?category=women&search=accessories",
        image:"/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Jewelry",
            link: "/products/?category=women&search=jewelry",
          },
          {
            label: "Scarves",
            link: "/products/?category=women&search=scarves"
          },
          {
            label: "Belts",
            link: "/products/?category=women&search=belts"
          }
        ]
      },
      {
        label: "Travel",
        link: "/products/?category=women&search=travel",
        image:"/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Luggage",
            link: "/products/?category=women&search=luggage"
          },
          {
            label: "Travel Accessories",
            link: "/products/?category=women&search=travel-accessories"
          },
          {
            label: "Travel Bags",
            link: "/products/?category=women&search=travel-bags"
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
        link: "/products/?category=men&search=bags",
        image: "/images/relot front page img 13-6/1st sec men_s bag.avif"
      },
      {
        label: "Wallets and Small Leather Goods",
        link: "/products/?category=men&search=wallets-and-small-leather-goods",
        image: "/images/relot front page img 13-6/Men_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Accessories",
        link: "/products/?category=men&search=accessories",
        image:"/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Belts",
            link: "/products/?category=men&search=belts"
          },
          {
            label: "Card Holders",
            link: "/products/?category=men&search=cardholders"
          },
          {
            label: "Key Holders",
            link: "/products/?category=men&search=keyholders"
          }
        ]
      },
      {
        label: "Travel",
        link: "/products/?category=men&search=travel",
        image:"/images/relot front page img 13-6/topbnr3.jpg",
        submenu: [
          {
            label: "Luggage",
            link: "/products/?category=men&search=luggage",
            image:"/images/relot front page img 13-6/topbnr3.jpg"
          },
          {
            label: "Travel Accessories",
            link: "/products/?category=men&search=travel-accessories",
            image:"/images/relot front page img 13-6/topbnr3.jpg"
          },
          {
            label: "Travel Bags",
            link: "/products/?category=men&search=travel-bags",
            image:"/images/relot front page img 13-6/topbnr3.jpg"
          },
          {
            label: "Shaving Kit Bags",
            link: "/products/?category=men&search=shaving-kit-bags",
            image:"/images/relot front page img 13-6/topbnr3.jpg"
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
        link: "/products/?category=fragrances&search=perfume",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Body Mist",
        link: "/products/?category=fragrances&search=body-mist",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Roll-on",
        link: "/products/?category=fragrances&search=roll-on",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Fragrances of India",
        link: "/products/?category=fragrances&search=fragrances-of-india",
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
        link: "/products/?category=bags&search=relotcolourmania",
        image: "/images/relot front page img 13-6/relot abt.jpg"
      },
      {
        label: "Men Bags",
        link: "/products/?category=bags&search=men-bags",
        image:"/images/relot front page img 13-6/topbnr3.jpg"
      },
      {
        label: "Women small Leather Goods",
        link: "/products/?category=bags&search=women-small-leather-bags",
        image: "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif"
      },
      {
        label: "Men small Leather Goods",
        link: "/products/?category=bags&search=men-small-leather-bags",
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
        link: "/products/?category=services&search=personalisation",
        image: "/images/relot front page img 13-6/Personalization.avif"
      },
      {
        label: "Relot Repairs",
        link: "/products/?category=services&search=relot-repairs",
        image: "/images/relot front page img 13-6/Relot Repairs.avif"
      },
      {
        label: "Art of Gifting",
        link: "/products/?category=services&search=art-of-gifting",
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
