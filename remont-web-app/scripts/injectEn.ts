import fs from 'fs';
import path from 'path';

const translationsPath = path.join(__dirname, '../src/utils/translations.ts');
let content = fs.readFileSync(translationsPath, 'utf8');

// The replacement was failing because the file ends with `  },\n};` not `  }\n};`
const enBlock = `  en: {
    catalog: {
      title: "Product Catalog",
      search: "Search products...",
      categories: {
        all: "All",
        materials: "Materials",
        furniture: "Furniture",
        lighting: "Lighting",
        plumbing: "Plumbing",
        decor: "Decor"
      },
      details: {
        specs: "Specifications",
        desc: "Description",
        price: "Price"
      }
    },
    nav: {
      home: "Home",
      calc: "Calculator",
      works: "Works",
      catalog: "Catalog",
      profile: "Profile",
      portfolio: "Portfolio",
      dashboard: "Dashboard",
      services: "Services"
    },
    home: {
      stories: {
        process: "Process",
        reviews: "Reviews",
        team: "Team",
        promo: "Promo",
      },
      heroTitle: "The renovation\\nyou want to live in",
      heroSubtitle: "Premium quality. Delivered on time by contract.",
      cta: "Calculate Budget",
      videoTitle: "Video Reviews",
      recentTitle: "Recent Works",
      fab: "Ask a Question",
    },
    calc: {
      title: "Smart Calculator 2.0",
      step1: "Property & Rooms",
      step2: "Apartment Area",
      step3: "Current Condition",
      step4: "Select a Package",
      types: {
        new: "New Building",
        secondary: "Secondary Housing",
        house: "House",
      },
      rooms: {
        studio: "Studio",
        1: "1 room",
        2: "2 rooms",
        3: "3 rooms",
        4: "4+ rooms",
      },
      conditions: {
        rough: "Rough Finish",
        old: "Old Renovation (Demolition)",
        white: "White Box",
      },
      packages: {
        economy: "Economy",
        economy_desc: "Wallpaper, linoleum, stretch ceiling",
        comfort: "Comfort",
        comfort_desc: "Paint, laminate, drywall",
        premium: "Premium",
        premium_desc: "Decorative plaster, parquet, complex ceilings",
      },
      result: {
        title: "Preliminary Estimate",
        work: "Labor Cost",
        rough_mat: "Rough Materials",
        finish_mat: "Finishing Materials",
        total: "Turnkey Total:",
        range: "mln sum",
        download: "Download Estimate (PDF)",
        cta: "Call an Engineer",
      },
      next: "Next",
      back: "Back",
    },
    portfolio: {
      title: "Project Gallery",
      filters: {
        all: "All",
        kitchen: "Kitchen",
        living: "Living Room",
        bath: "Bathroom",
        bedroom: "Bedroom",
      },
      cta: "I want this too",
      location: "Location",
      area: "Area",
      term: "Duration",
    },
    project: {
      share: "Share",
      term_badge: "Term: 3.5 months",
      location: "Location",
      area: "Area",
      cost: "Labor Cost",
      term: "Implementation Period",
      what_was_done: "What was done",
      read_more: "Read full text",
      hide: "Hide",
      materials: "Materials Used",
      cta: "I want the exact same renovation",
    },
    dashboard: {
      title: "My Property",
      greeting: "Hello, Alisher!",
      address: "15 Nukus St., Apt 42",
      manager: "Your manager",
      call: "Call",
      finance: {
        title: "Finance",
        total: "Total Estimate",
        paid: "Paid",
        left: "Balance Due",
        history: "Payment History",
      },
      stage: {
        title: "Current Status",
        name: "Stage 3: Fine Finishing",
        status: "In Progress",
        forecast: "Forecasted Completion:",
      },
      timeline: {
        title: "Work Timeline",
        today: "Today",
        yesterday: "Yesterday",
        comment1: "Finished tiling in the kitchen",
        comment2: "Materials delivered",
      },
      docs: {
        title: "Documents",
        contract: "Contract #145",
        estimate: "Estimate (Version 2)",
        act: "Rough Works Acceptance Certificate",
      },
      auth: {
        placeholder: "Contract Number (e.g., 1234)",
        btn: "Log into Cabinet",
      },
      video: {
        btn: "Watch 24/7 Broadcast",
        offline: "Camera temporarily unavailable",
      },
    },
    booking: {
      title: "Sign up for Measurement",
      share_contact: "Share Telegram Contact",
      or: "Or enter manually",
      name: "Your Name",
      phone: "Phone Number",
      date: "Convenient Time",
      address: "Property Address",
      comment: "Wishes",
      submit: "Confirm Meeting",
      success: {
        title: "Request Accepted!",
        text: "An engineer will contact you to confirm the time.",
        home: "To Homepage",
      },
    },
    admin: {
      nav: {
        dashboard: "Dashboard",
        crm: "Leads (CRM)",
        projects: "Projects",
        portfolio: "Portfolio",
        services: "Services",
        stories: "Stories",
        catalog: "Shop",
        settings: "Settings",
        logout: "Logout",
      },
      dashboard: {
        new_leads: "New Leads",
        active_projects: "Active Projects",
        total_money: "Funds in Work",
        recent_activity: "Recent Activity",
      },
      crm: {
        title: "Lead Management",
        status: {
          new: "New",
          process: "In Progress",
          measure: "Measurement",
          contract: "Contract",
          reject: "Rejected",
        },
        convert: "Create Project",
      },
      project: {
        title: "Project Management",
        finance_title: "Finance",
        total_estimate: "Total Estimate",
        paid_amount: "Paid",
        timeline_title: "Event Timeline",
        add_event: "Add Event",
        event_placeholder: "What was done? (e.g., Laminate delivered)",
        upload_photo: "Upload Photo",
        upload_doc: "Upload Document (PDF)",
      },
      settings: {
        title: "Prices & Calculator",
        base_price: "Base price per m²",
      }
    }
  }
};
`;

if (!content.includes('en: {')) {
  // Use replace to strip off the last `}, };` sequence or strictly `};`
  content = content.replace(/},\s*};\s*$/, '},\n' + enBlock);
  fs.writeFileSync(translationsPath, content, 'utf8');
  console.log('Translations merged properly!');
} else {
  console.log('already merged');
}
