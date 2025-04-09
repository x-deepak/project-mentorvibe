

const Mentor = require("../models/Mentor")


// const insertMultipleMentors = async () => {
//     await Mentor.insertMany([
//       {
//         name: "CMR Johnson",
//         email: "cm@example.com",
//         password: "hashedpassword789",
//         skills: ["C++", "Machine Learning"],
//         bio: "AI expert with a passion for teaching.",
//         location: { type: "Point", coordinates: [13.006138005499665, 77.65040222852075] }, // cmr ombr
//       },
//       {
//         name: "Amitesh Sinha",
//         email: "am@example.com",
//         password: "hashedpassword101",
//         skills: ["Django", "PostgreSQL"],
//         bio: "Backend engineer specializing in scalable systems.",
//         location: { type: "Point", coordinates: [13.006744903156342, 77.64406938835415] }, // amitesh
//       },
//       {
//         name: "Faraz Khan",
//         email: "fa@example.com",
//         password: "hashedpassword101",
//         skills: ["Django", "PostgreSQL"],
//         bio: "Backend engineer specializing in scalable systems.",
//         location: { type: "Point", coordinates: [13.012249340506118, 77.63078526404979] }, // faraz
//       },
//       {
//         name: "Deepak Kumar",
//         email: "dee@example.com",
//         password: "hashedpassword101",
//         skills: ["Django", "PostgreSQL"],
//         bio: "Backend engineer specializing in scalable systems.",
//         location: { type: "Point", coordinates: [12.978083053993767, 77.66804424880097] }, // deepak
//       }
//     ]);
  
//     console.log("Multiple mentors inserted successfully!");
//   };
  
// insertMultipleMentors();
const insertData =  function (){


const mentors = [
  // 🏙️ Bangalore Mentors
  {
    name: "Amit Sharma",
    email: "amit@example.com",
    password: "hashedpassword1",
    skills: ["JavaScript", "Node.js", "React"],
    teachingMode: "Online",
    bio: "Experienced JavaScript developer and mentor.",
    fee: 1500,
    classDetails: "Teaches full-stack development",
    ratings: [],
    averageRating: 4.8,
    city: "Bangalore",
    location: { type: "Point", coordinates: [12.9716, 77.5946] }
  },
  {
    name: "Riya Mehta",
    email: "riya@example.com",
    password: "hashedpassword2",
    skills: ["Python", "Machine Learning", "Data Science"],
    teachingMode: "Hybrid",
    bio: "Data Science expert with 5+ years of experience.",
    fee: 2500,
    classDetails: "AI & ML online and offline classes",
    ratings: [],
    averageRating: 4.9,
    city: "Bangalore",
    location: { type: "Point", coordinates: [12.9718, 77.5937] }
  },
  {
    name: "Vikram Singh",
    email: "vikram@example.com",
    password: "hashedpassword3",
    skills: ["Swimming", "Fitness Training"],
    teachingMode: "Offline",
    bio: "National-level swimming coach.",
    fee: 1200,
    classDetails: "Personal training at local pools",
    ratings: [],
    averageRating: 4.7,
    city: "Bangalore",
    location: { type: "Point", coordinates: [12.9665, 77.6101] }
  },
  {
    name: "Ananya Patel",
    email: "ananya@example.com",
    password: "hashedpassword4",
    skills: ["Mathematics", "Physics"],
    teachingMode: "Hybrid",
    bio: "Passionate about teaching STEM subjects.",
    fee: 1800,
    classDetails: "Online and in-person physics classes",
    ratings: [],
    averageRating: 4.5,
    city: "Bangalore",
    location: { type: "Point", coordinates: [12.9713, 77.5857] }
  },
  {
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: "hashedpassword5",
    skills: ["Guitar", "Music Theory"],
    teachingMode: "Online",
    bio: "Professional guitarist with 10 years of experience.",
    fee: 2000,
    classDetails: "Teaches beginner to advanced guitar",
    ratings: [],
    averageRating: 4.6,
    city: "Bangalore",
    location: { type: "Point", coordinates: [12.9754, 77.5992] }
  },

  // 🏙️ Hyderabad Mentors
  {
    name: "Kiran Reddy",
    email: "kiran@example.com",
    password: "hashedpassword6",
    skills: ["Java", "Spring Boot", "Microservices"],
    teachingMode: "Offline",
    bio: "Backend developer specializing in Java & Microservices.",
    fee: 2200,
    classDetails: "In-person Java and backend development classes",
    ratings: [],
    averageRating: 4.8,
    city: "Hyderabad",
    location: { type: "Point", coordinates: [17.3850, 78.4867] }
  },
  {
    name: "Sanya Kapoor",
    email: "sanya@example.com",
    password: "hashedpassword7",
    skills: ["Yoga", "Meditation"],
    teachingMode: "Hybrid",
    bio: "Certified yoga instructor specializing in Vinyasa and Hatha Yoga.",
    fee: 1000,
    classDetails: "Online and in-person yoga classes",
    ratings: [],
    averageRating: 4.9,
    city: "Hyderabad",
    location: { type: "Point", coordinates: [17.3826, 78.4752] }
  },
  {
    name: "Rohit Joshi",
    email: "rohit@example.com",
    password: "hashedpassword8",
    skills: ["Digital Marketing", "SEO", "Content Writing"],
    teachingMode: "Online",
    bio: "SEO expert with 8+ years of experience.",
    fee: 1500,
    classDetails: "Teaches SEO & digital marketing strategies",
    ratings: [],
    averageRating: 4.7,
    city: "Hyderabad",
    location: { type: "Point", coordinates: [17.3772, 78.4897] }
  },
  {
    name: "Neha Gupta",
    email: "neha@example.com",
    password: "hashedpassword9",
    skills: ["Cooking", "Baking"],
    teachingMode: "Offline",
    bio: "Professional chef with expertise in international cuisine.",
    fee: 1300,
    classDetails: "Hands-on cooking workshops",
    ratings: [],
    averageRating: 4.6,
    city: "Hyderabad",
    location: { type: "Point", coordinates: [17.3758, 78.4982] }
  },
  {
    name: "Siddharth Menon",
    email: "siddharth@example.com",
    password: "hashedpassword10",
    skills: ["Blockchain", "Cryptocurrency", "Smart Contracts"],
    teachingMode: "Hybrid",
    bio: "Blockchain developer and consultant.",
    fee: 3000,
    classDetails: "Advanced blockchain and smart contracts courses",
    ratings: [],
    averageRating: 4.8,
    city: "Hyderabad",
    location: { type: "Point", coordinates: [17.3845, 78.4766] }
  }
];

// Insert data into MongoDB
Mentor.insertMany(mentors)
  .then(() => console.log("Mentors inserted successfully"))
  .catch((err) => console.error("Error inserting mentors:", err));



}

module.exports = insertData;