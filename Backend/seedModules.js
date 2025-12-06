import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Module from './models/Module.js';

dotenv.config();

const modules = [
    {
        title: 'Introduction to Waste Segregation',
        description: 'Learn the basics of separating wet and dry waste effectively.',
        content: `Waste segregation is the primary step in waste management. It involves separating waste into dry and wet categories. 
        
        **Why Segregate?**
        - It reduces the amount of waste that goes to landfills.
        - It makes recycling easier and more efficient.
        - It prevents the contamination of recyclable materials.
        
        **How to Segregate:**
        1. **Green Bin (Wet Waste):** Kitchen waste, vegetable peels, fruit skins, leftover food, etc.
        2. **Blue Bin (Dry Waste):** Paper, plastic, metal, glass, rubber, etc.
        3. **Red Bin (Hazardous Waste):** Batteries, medical waste, old medicines, syringes, etc.
        
        Start segregating today to make a cleaner tomorrow!`,
        points: 100
    },
    {
        title: 'Recycling 101: Plastics',
        description: 'Understand the different types of plastics and how to recycle them.',
        content: `Plastic recycling is crucial for reducing environmental pollution. However, not all plastics are the same.
        
        **Types of Plastics:**
        - **PET (Type 1):** Water bottles, beverage containers. Highly recyclable.
        - **HDPE (Type 2):** Milk jugs, detergent bottles. Recyclable.
        - **PVC (Type 3):** Pipes, wire jacketing. Difficult to recycle.
        - **LDPE (Type 4):** Plastic bags, wraps. Recyclable at specific centers.
        
        **Recycling Tips:**
        - Rinse containers before recycling to remove food residue.
        - Remove caps and lids unless stated otherwise.
        - Do not bag your recyclables; place them loose in the bin.`,
        points: 100
    },
    {
        title: 'Composting at Home',
        description: 'A guide to turning your kitchen waste into garden gold.',
        content: `Composting is nature's way of recycling. It turns organic waste into nutrient-rich soil called humus.
        
        **Benefits of Composting:**
        - Reduces the need for chemical fertilizers.
        - Enriches soil, helping retain moisture and suppress plant diseases.
        - Reduces methane emissions from landfills.
        
        **What to Compost (Greens & Browns):**
        - **Greens (Nitrogen):** Vegetable scraps, fruit peels, coffee grounds, grass clippings.
        - **Browns (Carbon):** Dry leaves, straw, paper, cardboard, sawdust.
        
        **What NOT to Compost:**
        - Meat, dairy, and oily foods (attract pests).
        - Diseased plants.
        - Pet waste.`,
        points: 100
    },
    {
        title: 'E-Waste Management',
        description: 'How to safely dispose of old electronics and batteries.',
        content: `Electronic waste (E-waste) covers discarded electrical or electronic devices. It is one of the fastest-growing waste streams.
        
        **Why is E-Waste Dangerous?**
        - Contains toxic substances like lead, mercury, and cadmium.
        - Improper disposal leads to soil and water contamination.
        
        **Proper Disposal:**
        - **Do NOT** throw e-waste in regular bins.
        - Look for certified e-waste recyclers or collection centers.
        - Many electronics manufacturers offer take-back programs.
        - Donate old but working devices to extend their life.`,
        points: 100
    }
];

const seedModules = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Module.deleteMany(); // Clear existing
        console.log('Cleared existing modules');

        await Module.insertMany(modules);
        console.log('Sample modules inserted');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedModules();
