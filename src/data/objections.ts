export type ObjectionCategoryId =
  | 'cost'
  | 'timing'
  | 'family'
  | 'alternatives'
  | 'beliefs'
  | 'confidence';

export interface ObjectionItem {
  id: string;
  category: ObjectionCategoryId;
  objection: string;
  response: string;
  ctaLabel: string;
  ctaTo: '/life-insurance' | '/annuity';
}

export const objectionCategoryLabels: Record<ObjectionCategoryId, string> = {
  cost: 'Cost & Affordability',
  timing: 'Timing & Readiness',
  family: 'Family & Spouse Concerns',
  alternatives: 'Other Financial Options',
  beliefs: 'Beliefs & Personal Views',
  confidence: 'Confidence & Planning',
};

export const objections: ObjectionItem[] = [
  {
    id: 'obj-1',
    category: 'cost',
    objection: "I can't afford life insurance right now.",
    response:
      'Starting early is usually the least expensive point to secure cover. A modest premium can still protect your family.',
    ctaLabel: 'See affordable life options',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-2',
    category: 'timing',
    objection: 'I want to clear debts first before taking insurance.',
    response:
      'Debt and family obligations can exist at the same time. Protection can help your family avoid financial strain if anything happens unexpectedly.',
    ctaLabel: 'Plan family protection now',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-3',
    category: 'confidence',
    objection: 'I already have enough insurance.',
    response:
      'It helps to review whether current cover can replace household income for several years, not just immediate expenses.',
    ctaLabel: 'Review my cover level',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-4',
    category: 'confidence',
    objection: 'I have all the insurance I want.',
    response:
      'Many people underestimate long-term income replacement needs. Rechecking your target can prevent under-insurance.',
    ctaLabel: 'Recalculate needed cover',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-5',
    category: 'family',
    objection: 'I want to discuss it with my wife first.',
    response:
      'That is valid. You can still start with a quote and share the plan summary so both of you review concrete numbers together.',
    ctaLabel: 'Start and share a quote',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-6',
    category: 'timing',
    objection: "I'm single, so I don't need life insurance.",
    response:
      'Protection can also support your future self and long-term goals. Early planning often gives better flexibility and pricing.',
    ctaLabel: 'Explore long-term options',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-7',
    category: 'timing',
    objection: "I'm not ready now. I'll take it later.",
    response:
      'Waiting can increase cost and reduce options as age changes. A quick quote today gives you clearer timing decisions.',
    ctaLabel: 'Check today’s estimate',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-8',
    category: 'timing',
    objection: 'I still want to think about it.',
    response:
      'Taking a quote does not force a purchase. It helps you compare now versus later with actual numbers.',
    ctaLabel: 'Generate a quote first',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-9',
    category: 'alternatives',
    objection: 'I can invest elsewhere for better returns.',
    response:
      'Investments and insurance serve different purposes. Insurance protects income risk while other investments target growth.',
    ctaLabel: 'Balance protection and growth',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-10',
    category: 'family',
    objection: 'My wife is against life insurance.',
    response:
      'Sometimes concerns reduce once the benefit structure is clear. A summary can make the purpose and payout plan easier to discuss.',
    ctaLabel: 'Prepare a clear summary',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-11',
    category: 'alternatives',
    objection: 'My cooperative or association will support my family.',
    response:
      'Community support is valuable, but often temporary. Insurance is designed for structured, longer-term financial protection.',
    ctaLabel: 'Add long-term protection',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-12',
    category: 'beliefs',
    objection: 'I think life insurance conflicts with my beliefs.',
    response:
      'Many families view it as a practical protection tool. You can review the terms carefully and decide what aligns with your values.',
    ctaLabel: 'Review policy options',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-13',
    category: 'alternatives',
    objection: 'I can just save my own money instead.',
    response:
      'Savings are useful, but may take time to build to full protection level. Insurance can provide immediate coverage while you continue saving.',
    ctaLabel: 'Combine savings + cover',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-14',
    category: 'alternatives',
    objection: 'I already have property, so I do not need cover.',
    response:
      'Property can help, but liquidity and timing matter. Insurance can provide faster access to support when needed.',
    ctaLabel: 'Add income continuity',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-15',
    category: 'cost',
    objection: "I can't pay for it now.",
    response:
      'Even smaller plans can create meaningful protection. Starting with an amount that fits your cash flow is usually better than delaying fully.',
    ctaLabel: 'Start with a smaller plan',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-16',
    category: 'beliefs',
    objection: "I don't believe in life insurance.",
    response:
      'It may help to treat it as income-risk management, not just a product. The goal is financial continuity for dependents.',
    ctaLabel: 'See practical use case',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-17',
    category: 'family',
    objection: 'My children will survive and figure things out.',
    response:
      'A stronger starting foundation often improves long-term outcomes. Cover can reduce avoidable disruption at critical times.',
    ctaLabel: 'Protect your children’s foundation',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-18',
    category: 'family',
    objection: "I don't want to leave money for another man to spend.",
    response:
      'You can structure beneficiaries and payout style to match your priorities and keep support focused on your intended dependents.',
    ctaLabel: 'Set controlled payout structure',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-19',
    category: 'family',
    objection: 'My wife can just return to work if needed.',
    response:
      'Transition periods can still be financially difficult. Cover helps bridge immediate obligations while long-term adjustments happen.',
    ctaLabel: 'Bridge family risk gaps',
    ctaTo: '/life-insurance',
  },
  {
    id: 'obj-20',
    category: 'family',
    objection: "Her family can take care of her and the children.",
    response:
      'External support is uncertain over time. A defined plan keeps your family’s financial stability less dependent on outside conditions.',
    ctaLabel: 'Create a direct protection plan',
    ctaTo: '/life-insurance',
  },
];
