// Menu data structure
export const menuData = [
  {
    id: "women",
    label: "Women",
    link: "/products/?category=women",
    submenu: [
      {
        label: "Handbags",
        link: "/products/?category=women&search=handbags"
      },
      {
        label: "Wallets and Small Leather Goods",
        link: "/products/?category=women&search=wallets-and-small-leather-goods"
      },
      {
        label: "Accessories",
        link: "/products/?category=women&search=accessories",
        submenu: [
          {
            label: "Jewelry",
            link: "/products/?category=women&search=jewelry"
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
        link: "/products/?category=men&search=bags"
      },
      {
        label: "Wallets and Small Leather Goods",
        link: "/products/?category=men&search=wallets-and-small-leather-goods"
      },
      {
        label: "Accessories",
        link: "/products/?category=men&search=accessories",
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
        submenu: [
          {
            label: "Luggage",
            link: "/products/?category=men&search=luggage"
          },
          {
            label: "Travel Accessories",
            link: "/products/?category=men&search=travel-accessories"
          },
          {
            label: "Travel Bags",
            link: "/products/?category=men&search=travel-bags"
          },
          {
            label: "Shaving Kit Bags",
            link: "/products/?category=men&search=shaving-kit-bags"
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
        link: "/products/?category=fragrances&search=perfume"
      },
      {
        label: "Body Mist",
        link: "/products/?category=fragrances&search=body-mist"
      },
      {
        label: "Roll-on",
        link: "/products/?category=fragrances&search=roll-on"
      },
      {
        label: "Fragrances of India",
        link: "/products/?category=fragrances&search=fragrances-of-india"
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
        link: "/products/?category=bags&search=relotcolourmania"
      },
      {
        label: "Men Bags",
        link: "/products/?category=bags&search=men-bags"
      },
      {
        label: "Women small Leather Goods",
        link: "/products/?category=bags&search=women-small-leather-bags"
      },
      {
        label: "Men small Leather Goods",
        link: "/products/?category=bags&search=men-small-leather-bags"
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
        link: "/products/?category=services&search=personalisation"
      },
      {
        label: "Relot Repairs",
        link: "/products/?category=services&search=relot-repairs"
      },
      {
        label: "Art of Gifting",
        link: "/products/?category=services&search=art-of-gifting"
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
