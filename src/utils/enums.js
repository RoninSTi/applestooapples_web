export const ADDRESS_TYPES = [
  {
    label: 'Mailing address',
    value: 'mailing',
  }, {
    label: 'Material shipping address',
    value: 'material',
  }, {
    label: 'Project address',
    value: 'project',
  }
]

export const COLLABORATOR_ROLES = [
  {
    label: 'Architect',
    value: 'architect',
  }, {
    label: 'Civil Engineer',
    value: 'civil',
  }, {
    label: 'Contractor',
    value: 'contractor',
  }, {
    label: 'Designer',
    value: 'designer',
  }, {
    label: 'Geotech',
    value: 'geotech',
  }, {
    label: 'Homeowner',
    value: 'homeowner',
  }, {
    label: 'Landscape Designer',
    value: 'landscape',
  }, {
    label: 'Lighting Designer',
    value: 'lighting',
  }, {
    label: 'Structural Engineer',
    value: 'structural'
  }
]

export const CURRENCY = ["USD", "CAD", "GBP", "EUR"];

export const INVITATION_STATUS = [
  {
    label: 'Accepted',
    value: 'accepted'
  }, {
    label: 'Draft',
    value: 'draft'
  }, {
    label: 'Pending',
    value: 'pending'
  }, {
    label: 'Reminded',
    value: 'reminded'
  }, {
    label: 'Not yet invited',
    value: 'unasked'
  }
];

export const CATEGORIES = [
  { label: "Plumbing", value: "plumbing" },
  { label: "Lighting", value: "lighting" },
  { label: "Finishes", value: "finishes" },
  { label: "Tile and Stone", value: "stone" },
  { label: "Appliances", value: "appliances" },
  { label: "Accessories", value: "accessories" },
  { label: "Upholstery", value: "upholstery" },
  { label: "Furnishings", value: "furnishings" },
  { label: "Hardware", value: "hardware" },
  { label: "Millwork", value: "millwork"}
];

export const PROJECT_STATUS = [
  {
    label: 'Pre-Construction',
    value: 'pre'
  }, {
    label: 'Under Construction',
    value: 'under'
  }, {
    label: 'Finish Stage',
    value: 'finish'
  }, {
    label: 'Completed',
    value: 'complete'
  }
]

export const PROJECT_TYPES = [
  {
    label: 'New',
    value: 'new'
  }, {
    label: 'Remodel',
    value: 'remodel'
  }
];

export const PHASES = [
  { label: "Pre-construction", value: "pre" },
  { label: "Demo", value: "demo" },
  { label: "Sitwork/Foundation/Grading", value: "site" },
  { label: "Rough Framing", value: "framing" },
  { label: "Rough Plumbing/Electrical/Mechanical", value: "mechanical" },
  { label: "Trim-out", value: "trim" },
  { label: "Finish", value: "finish" },
];

export const PROVIDED = [
  { label: "Contractor", value: "contractor" },
  { label: "Designer", value: "designer" },
  { label: "Owner", value: "owner" },
];

export const ROOM_SPECIFICATIONS = [
  { label: 'Barn', value: 'barn'},
  { label: 'Basement', value: 'basement'},
  { label: 'Bathroom 1', value: 'bathroom1'},
  { label: 'Bathroom 2', value: 'bathroom2'},
  { label: 'Bathroom 3', value: 'bathroom3'},
  { label: 'Bathroom 4', value: 'bathroom4'},
  { label: 'Bathroom 5', value: 'bathroom5'},
  { label: 'Bathroom 6', value: 'bathroom6'},
  { label: 'Bedroom 1', value: 'bedroom1'},
  { label: 'Bedroom 2', value: 'bedroom2'},
  { label: 'Bedroom 3', value: 'bedroom3'},
  { label: 'Bedroom 4', value: 'bedroom4'},
  { label: 'Bedroom 5', value: 'bedroom5'},
  { label: 'Bedroom 6', value: 'bedroom6'},
  { label: 'Bedroom 7', value: 'bedroom7'},
  { label: 'Bunk', value: 'bunk'},
  { label: 'Butler Pantry', value: 'butler'},
  { label: 'Craft Room', value: 'craft'},
  { label: 'Den', value: 'den'},
  { label: 'Dining Room', value: 'dining'},
  { label: 'Entry', value: 'entry'},
  { label: 'Game Room', value: 'gameroom'},
  { label: 'Garage', value: 'garage'},
  { label: 'Guest House Bathroom 1', value: 'ghbathr1'},
  { label: 'Guest House Bathroom 2', value: 'ghbathr2'},
  { label: 'Guest House Bedroom 1', value: 'ghbedr1'},
  { label: 'Guest House Bedroom 2', value: 'ghbedr2'},
  { label: 'Guest House Kitchen', value: 'ghkitchen'},
  { label: 'Guest House Laundry', value: 'ghlaundry'},
  { label: 'Guest House Living', value: 'ghliving'},
  { label: 'Guest House Patio', value: 'ghpatio'},
  { label: 'Home Gym', value: 'homegym'},
  { label: 'Kitchen', value: 'kitchen'},
  { label: 'Laundry', value: 'laundry'},
  { label: 'Library', value: 'library'},
  { label: 'Living Room', value: 'living'},
  { label: 'Loft', value: 'loft'},
  { label: 'Master Bedroom 1', value: 'masterbedroom1'},
  { label: 'Master Bedroom 2', value: 'masterbedroom2'},
  { label: 'Master Bedroom Closet 1', value: 'masterbedroomcloset1'},
  { label: 'Master Bedroom Closet 2', value: 'masterbedroomcloset2'},
  { label: 'Media', value: 'media'},
  { label: 'Mud Room', value: 'mud'},
  { label: 'Office 1', value: 'office1'},
  { label: 'Office 2', value: 'office2'},
  { label: 'Pantry', value: 'pantry'},
  { label: 'Patio 1', value: 'patio1'},
  { label: 'Patio 2', value: 'patio2'},
  { label: 'Play Room', value: 'playroom'},
  { label: 'Pool House Bathroom', value: 'phbathroom'},
  { label: 'Pool House Bedroom', value: 'phbedroom'},
  { label: 'Pool House Kitchen', vsalue: 'phkitchen'},
  { label: 'Pool House Laundry', value: 'phlaundry'},
  { label: 'Pool House Living', value: 'phliving'},
  { label: 'Pool Housee Outdoor Shower', value: 'phoutdoorshower'},
  { label: 'Pool House Patio', value: 'phpatio'},
  { label: 'Porch', value: 'porch'},
  { label: 'Powder Room', value: 'powder'},
  { label: 'Relaxation', value: 'relaxation'},
  { label: 'Studio', value: 'studio'},
  { label: 'Sun Room', value: 'sun'},
  { label: 'Wine Cellar', value: 'wine'},
  { label: 'Other', value: 'other'}
]

export const ROOM_SPECIFICATION_SOURCES = [
  { label: 'Existing projects', value: 'project' },
]

export const ROOM_SPECIFICATION_COPY_DEPTHS = [
  { label: 'Categories only', value: 'shallow' },
  { label: 'Categories and items', value: 'full' }
]
