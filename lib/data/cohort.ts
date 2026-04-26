export type CohortStartup = {
  category: string;
  company: string;
  website?: string;
  building: string;
  founders: string;
  mission?: string;
  accomplishments: {
    name?: string;
    items: string[];
  }[];
};

export const COHORT_1_STARTUPS: CohortStartup[] = [
  {
    category: "Bio ML",
    company: "Emergent",
    building: "AI model for protein mutation prediction.",
    founders: "Kay & Stanton",
    mission:
      "Emergent is decoding molecular design so effective treatments can move from research to patients faster.",
    accomplishments: [
      {
        name: "Stanton",
        items: [
          "Won the UCSB Datathon with Kay in winter 2026.",
          "Scored a 173 on the LSAT as a freshman.",
          "Ranked in the 99th percentile in Rapid on Chess.com."
        ]
      }
    ]
  },
  {
    category: "AI hardware / lumber",
    company: "Yavin Systems",
    website: "https://yavinsystems.com/",
    building: "Drones for forest mapping.",
    founders: "Arthur",
    accomplishments: [
      {
        name: "Arthur",
        items: [
          "Built 26 drones in the past three years.",
          "Demoed drone technology to the Pentagon.",
          "Selected for Founders Inc, Pre-Residency, and YC Startup School."
        ]
      }
    ]
  },
  {
    category: "AI B2B SaaS / legal",
    company: "LegalTime AI",
    website: "https://www.legaltime.ai/",
    building: "AI timekeeping for lawyers.",
    founders: "Joaquin & Quinn",
    mission:
      "LegalTime AI automates lawyer timekeeping and gives firms a clearer view of work as AI tools reshape legal pricing.",
    accomplishments: [
      {
        name: "Quinn",
        items: [
          "Won first place overall at a 500+ student hackathon in Santa Barbara.",
          "Reached the top 0.01% in League of Legends and won multiple tournaments.",
          "Led his water polo team in goals while winning city championships four years in a row."
        ]
      },
      {
        name: "Joaquin",
        items: [
          "Graduated high school valedictorian, ranked 1 out of 690 students."
        ]
      }
    ]
  },
  {
    category: "AI SMB",
    company: "cafX",
    website: "https://www.cafx.me/",
    building: "Shift manager AI for SMBs.",
    founders: "Nag",
    mission:
      "cafX amplifies cafe operators with AI shift management so a small independent cafe can run with the leverage of a national chain.",
    accomplishments: [
      {
        name: "Nag",
        items: [
          "Earned a granted Indian utility patent as a high school inventor.",
          "Won a category at HackTX, a hackathon with roughly 1,600 participants.",
          "Built AI grading software in 2023 that piloted across two computer science classes."
        ]
      }
    ]
  },
  {
    category: "Real estate",
    company: "Jevi",
    website: "https://heyjevi.com/",
    building: "Voice assistant for realtor CRMs.",
    founders: "Viktor & Yasen",
    mission:
      "Jevi helps high-touch real estate teams focus on the human side of the sale instead of CRM busywork.",
    accomplishments: [
      {
        name: "Viktor",
        items: [
          "Led iOS development of StudySync at Stanford's Snyder Lab; presented the project at PMWC 2026.",
          "Helped build a platform used in 3+ studies at top institutions across 10 countries.",
          "Led development of the Curiosity App at UCSB's META Lab, used by studies featured in Psychology Today, Santa Barbara Independent, and KCBX.",
          "Organized a UCSB ocean charity plunge with 300+ participants and $500+ raised for the Marine Conservation Network."
        ]
      },
      {
        name: "Yasen",
        items: [
          "Founded Mailbox AI, reaching 400 users and processing more than 2 million emails.",
          "Built Braille Reader & Writer, reaching 1,000+ users with vibration-based reading and a Braille keyboard.",
          "Refactored and helped drive new products for M2M Services' RControl app, which has 500K+ users."
        ]
      }
    ]
  },
  {
    category: "Sales tech",
    company: "Repclose",
    website: "https://repclose.com/",
    building: "Deep research agents for lead generation.",
    founders: "John Lins",
    mission:
      "Repclose replaces shallow lead databases with agents that research a company, understand its ICP, and surface prospects worth an AE's time.",
    accomplishments: [
      {
        name: "John",
        items: [
          "Published two first-author AI for physical science papers in affiliation with Lawrence Livermore National Laboratory.",
          "Built and pretrained a transformer-like foundation model from scratch.",
          "Built and scaled Coralflavor to 23K signed-in users and $900 MRR in three months."
        ]
      }
    ]
  }
];
