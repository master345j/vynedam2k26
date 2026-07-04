import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Application from '../models/Application.js';

// Pre-generated password hashes for simplicity
const DUMMY_HASH = '$2b$10$Ep7G51O3M2.K1LKsU8qOJe8vM0kH0N7k8Cj2J.2GZ4p3Z1pY7rQ0q'; // Hash of "password123"

const seedData = async () => {
  try {
    await connectDB();

    console.log('\n\x1b[33m[Seeding]\x1b[0m Clearing existing collection data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Portfolio.deleteMany({}),
      Project.deleteMany({}),
      Application.deleteMany({}),
    ]);
    console.log('\x1b[32m[Seeding]\x1b[0m All collections cleared.');

    // 1. Seed Categories
    console.log('\n\x1b[33m[Seeding]\x1b[0m Creating default creative categories...');
    const categoriesData = [
      { name: 'VFX & 3D Animation', slug: 'vfx-3d-animation', description: 'CGI, VFX composites, character modeling, and render showcases.', icon: 'video' },
      { name: 'Digital UI/UX Design', slug: 'digital-ui-ux-design', description: 'Product design, design systems, layouts, branding, and interfaces.', icon: 'palette' },
      { name: 'Game Development', slug: 'game-development', description: 'Gameplay programming, level design, game engines, and full games.', icon: 'cpu' },
      { name: 'Music & Sound Design', slug: 'music-sound-design', description: 'Soundtracks, Foley effects, voice acting, and ambient mixing.', icon: 'music' },
      { name: 'Tech & Interactive Art', slug: 'tech-interactive-art', description: 'Creative coding, VR/AR, generative art, and custom hardware installations.', icon: 'terminal' },
    ];
    const categories = await Category.insertMany(categoriesData);
    console.log(`\x1b[32m[Seeding]\x1b[0m Created ${categories.length} categories.`);

    // Helper to find category by slug
    const findCat = (slug) => categories.find((c) => c.slug === slug)._id;

    // 2. Seed Users (Creators)
    console.log('\n\x1b[33m[Seeding]\x1b[0m Creating creator profiles...');
    const creatorsData = [
      {
        username: 'aarav_vfx',
        email: 'aarav.sharma@earth.net',
        passwordHash: DUMMY_HASH,
        role: 'creator',
        profile: {
          fullName: 'Aarav Sharma',
          title: 'Lead VFX & 3D Environment Artist',
          bio: 'Specializing in photorealistic environmental builds, procedural modeling, and lighting for games and film. 6+ years experience in Blender, Houdini, and Unreal Engine 5.',
          location: 'Mumbai, India',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
          skills: ['Blender', 'Houdini', 'Unreal Engine 5', 'Substance Painter', 'Procedural Texturing', 'Lighting & Rendering'],
          socialLinks: {
            website: 'https://aaravsharma.art',
            linkedin: 'https://linkedin.com/in/aarav-vfx-earth',
            artstation: 'https://artstation.com/aarav_vfx',
          },
        },
        isVerified: true,
        availability: 'available',
      },
      {
        username: 'elena_gamedev',
        email: 'elena.rostova@earth.net',
        passwordHash: DUMMY_HASH,
        role: 'creator',
        profile: {
          fullName: 'Elena Rostova',
          title: 'Senior Unity & C# Developer',
          bio: 'Indie game developer and engine optimization geek. Love creating smooth physics, responsive mechanics, and custom shader systems for desktop and mobile.',
          location: 'Tokyo, Japan',
          profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
          skills: ['Unity Engine', 'C# Programming', 'Shader Graph', 'Mobile Optimization', 'Physics Systems', 'Git'],
          socialLinks: {
            github: 'https://github.com/elena-gamedev',
            linkedin: 'https://linkedin.com/in/elena-rostova-dev',
          },
        },
        isVerified: true,
        availability: 'busy',
      },
      {
        username: 'devon_design',
        email: 'devon.chen@earth.net',
        passwordHash: DUMMY_HASH,
        role: 'creator',
        profile: {
          fullName: 'Devon Chen',
          title: 'Product & Design Systems Architect',
          bio: 'Creating elegant design systems and interfaces for complex web apps. Passionate about user psychology, accessibility (WCAG), and responsive layouts.',
          location: 'Singapore',
          profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
          skills: ['Figma', 'Design Systems', 'UX Research', 'Tailwind CSS', 'Framer', 'Prototyping'],
          socialLinks: {
            website: 'https://devon-designs.space',
            behance: 'https://behance.net/devon_design',
            linkedin: 'https://linkedin.com/in/devonchen-ux',
          },
        },
        isVerified: false,
        availability: 'available',
      },
      {
        username: 'marcus_sound',
        email: 'marcus.vance@earth.net',
        passwordHash: DUMMY_HASH,
        role: 'creator',
        profile: {
          fullName: 'Marcus Vance',
          title: 'Foley Artist & Composer',
          bio: 'Creating soundtracks and custom sound design for video games, cinema trailers, and immersive experiences. Recording custom Foley and creating synthesized worlds.',
          location: 'London, UK',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80',
          skills: ['Ableton Live', 'Pro Tools', 'Synthesizers', 'Foley Recording', 'Orchestration', 'Game Audio integration'],
          socialLinks: {
            website: 'https://marcusvance.audio',
            linkedin: 'https://linkedin.com/in/marcus-vance-sound',
          },
        },
        isVerified: true,
        availability: 'available',
      },
    ];

    const creators = await User.insertMany(creatorsData);
    console.log(`\x1b[32m[Seeding]\x1b[0m Created ${creators.length} creator users.`);

    // Helper to find creator by username
    const findCreator = (username) => creators.find((u) => u.username === username);

    // 3. Seed Users (Recruiters)
    console.log('\n\x1b[33m[Seeding]\x1b[0m Creating recruiter profiles...');
    const recruitersData = [
      {
        username: 'sarah_cyberdyne',
        email: 'sarah.connor@cyberdynestudios.com',
        passwordHash: DUMMY_HASH,
        role: 'recruiter',
        profile: {
          fullName: 'Sarah Connor',
          title: 'Executive Creative Director at Cyberdyne Games',
          bio: 'Building the next generation of sci-fi action RPGs. Always on the lookout for talented VFX artists, composers, and game design specialists.',
          location: 'Austin, USA',
          profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80',
          socialLinks: {
            website: 'https://cyberdynestudios.com',
            linkedin: 'https://linkedin.com/company/cyberdyne-games',
          },
        },
        isVerified: true,
      },
      {
        username: 'raj_delta',
        email: 'raj.patel@deltamedia.com',
        passwordHash: DUMMY_HASH,
        role: 'recruiter',
        profile: {
          fullName: 'Raj Patel',
          title: 'Talent Acquisition Partner at Delta Media Agency',
          bio: 'Leading high-velocity recruitment campaigns for marketing, tech startups, and digital experiences across Asia.',
          location: 'Bangalore, India',
          profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80',
          socialLinks: {
            website: 'https://deltamedia.co',
            linkedin: 'https://linkedin.com/in/raj-patel-delta',
          },
        },
        isVerified: false,
      },
    ];

    const recruiters = await User.insertMany(recruitersData);
    console.log(`\x1b[32m[Seeding]\x1b[0m Created ${recruiters.length} recruiter users.`);

    const findRecruiter = (username) => recruiters.find((u) => u.username === username);

    // 4. Seed Portfolios
    console.log('\n\x1b[33m[Seeding]\x1b[0m Creating creative portfolio showcases...');
    const portfoliosData = [
      // Aarav Sharma Portfolios
      {
        creator: findCreator('aarav_vfx')._id,
        category: findCat('vfx-3d-animation'),
        title: 'Neo-Tokyo Neon Alley (Real-time UE5)',
        description: 'A fully optimized, modular environment set in a futuristic cyberpunk alley. Created custom assets in Blender, textured in Substance, and rendered real-time in Unreal Engine 5 using Lumen.',
        mediaUrl: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        skills: ['Unreal Engine 5', 'Modular Design', 'Substance Painter', 'Lumen Lighting'],
        toolsUsed: ['Blender', 'Substance Painter', 'UE5', 'Photoshop'],
        likesCount: 142,
        viewsCount: 1205,
      },
      {
        creator: findCreator('aarav_vfx')._id,
        category: findCat('vfx-3d-animation'),
        title: 'Procedural Ruined Temple Generator',
        description: 'A custom Houdini Digital Asset (HDA) that proceduralizes the breakdown and collapse of brick architecture. Perfect for creating varied historical ruins on the fly in Unity or Unreal.',
        mediaUrl: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        skills: ['Houdini', 'Procedural Generation', 'VEX Scripting'],
        toolsUsed: ['Houdini', 'Maya'],
        likesCount: 98,
        viewsCount: 654,
      },

      // Elena Rostova Portfolios
      {
        creator: findCreator('elena_gamedev')._id,
        category: findCat('game-development'),
        title: 'Aether Engine: Custom GPU Physics Module',
        description: 'A Unity module utilizing Compute Shaders to run millions of particle physics operations on the GPU simultaneously. Achieved 90 FPS on standard mobile chipsets.',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        skills: ['Compute Shaders', 'Unity Engine', 'GPU Programming', 'Performance Optimization'],
        toolsUsed: ['Unity', 'Visual Studio', 'HLSL'],
        likesCount: 210,
        viewsCount: 1890,
      },

      // Devon Chen Portfolios
      {
        creator: findCreator('devon_design')._id,
        category: findCat('digital-ui-ux-design'),
        title: 'Nebula - Design System for Cloud Data',
        description: 'A clean, highly accessible design system focused on data density and dashboard interfaces. Implemented over 50 responsive components with full light/dark support, complying with AAA accessibility criteria.',
        mediaUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        skills: ['Design Systems', 'Accessibility (WCAG)', 'Dashboard Layouts', 'Figma Libraries'],
        toolsUsed: ['Figma', 'Framer'],
        likesCount: 88,
        viewsCount: 712,
      },

      // Marcus Vance Portfolios
      {
        creator: findCreator('marcus_sound')._id,
        category: findCat('music-sound-design'),
        title: 'Deep Space Foley & Ambience Pack',
        description: 'An audio pack focusing on organic recordings of metal creaking, sub-harmonic synthesizers, and mechanical hums to replicate a decaying spaceship deck.',
        mediaUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'audio', // Simulates audio-file portfolio type
        skills: ['Foley Design', 'Synthesizer Patching', 'Ableton Mixing'],
        toolsUsed: ['Ableton Live', 'Modular Synth Rig', 'Zoom H6 Recorder'],
        likesCount: 75,
        viewsCount: 520,
      },
    ];

    const portfolios = await Portfolio.insertMany(portfoliosData);
    console.log(`\x1b[32m[Seeding]\x1b[0m Created ${portfolios.length} portfolio items.`);

    // 5. Seed Projects
    console.log('\n\x1b[33m[Seeding]\x1b[0m Creating project advertisements...');
    const projectsData = [
      {
        recruiter: findRecruiter('sarah_cyberdyne')._id,
        category: findCat('vfx-3d-animation'),
        title: '3D VFX Environment Lead (Sci-Fi Action RPG)',
        description: 'Cyberdyne Games is looking for a Lead VFX & Environment Artist to build procedural dystopian cityscapes. You will collaborate directly with our game designers in Unreal Engine 5. Experience with photorealistic structures and optimized mesh pipelines is critical.',
        skillsRequired: ['Unreal Engine 5', 'Blender', 'Substance Painter', 'Procedural Design'],
        budget: { min: 4500, max: 7000, currency: 'USD' },
        duration: '3 months contract',
        status: 'open',
      },
      {
        recruiter: findRecruiter('sarah_cyberdyne')._id,
        category: findCat('music-sound-design'),
        title: 'Atmospheric Composer for Cinematic Trailer',
        description: 'Seeking a musician to produce a 2-minute original score for an upcoming RPG trailer. The track must blend orchestral themes with dark industrial synthesizers.',
        skillsRequired: ['Orchestration', 'Ableton Live', 'Synthesizers'],
        budget: { min: 1500, max: 2500, currency: 'USD' },
        duration: '3 weeks',
        status: 'open',
      },
      {
        recruiter: findRecruiter('raj_delta')._id,
        category: findCat('digital-ui-ux-design'),
        title: 'Design System Consultant - FinTech Dashboard',
        description: 'Delta Media is looking for an expert UI designer to audit and streamline an existing dashboard product. You will establish a clean, scalable component library in Figma for our frontend developers.',
        skillsRequired: ['Figma', 'Design Systems', 'Dashboard Layouts'],
        budget: { min: 3000, max: 5000, currency: 'USD' },
        duration: '6 weeks',
        status: 'open',
      },
    ];

    const projects = await Project.insertMany(projectsData);
    console.log(`\x1b[32m[Seeding]\x1b[0m Created ${projects.length} projects.`);

    const findProject = (title) => projects.find((p) => p.title.includes(title));

    // 6. Seed Applications
    console.log('\n\x1b[33m[Seeding]\x1b[0m Submitting applicant job applications...');
    const applicationsData = [
      {
        project: findProject('VFX Environment Lead')._id,
        applicant: findCreator('aarav_vfx')._id,
        message: 'Hello Sarah! I watched your studio teaser and loved the art style. My work with procedural systems in Houdini and high-fidelity lighting inside Unreal Engine 5 fits perfectly with this project. See my Neo-Tokyo environment in my portfolio!',
        bidAmount: 6000,
        status: 'pending',
      },
      {
        project: findProject('Cinematic Trailer')._id,
        applicant: findCreator('marcus_sound')._id,
        message: 'Hey Sarah, composing industrial sci-fi synth scores is right up my alley. I run a custom modular synth rig that produces heavy, atmospheric sub-harmonics perfect for futuristic trailers. I have attached my Foley/Ambience deck.',
        bidAmount: 2000,
        status: 'reviewing',
      },
      {
        project: findProject('FinTech Dashboard')._id,
        applicant: findCreator('devon_design')._id,
        message: 'Hi Raj, I have extensive experience setting up robust component libraries for fintech and data-heavy products. My designs focus on WCAG readability and rapid developer handover. Let me audit your Figma system!',
        bidAmount: 4200,
        status: 'accepted',
      },
    ];

    const applications = await Application.insertMany(applicationsData);
    console.log(`\x1b[32m[Seeding]\x1b[0m Submitted ${applications.length} creator applications.`);

    console.log('\n\x1b[32m[Success]\x1b[0m Database seeding process finished successfully!');
  } catch (error) {
    console.error(`\x1b[31m[Error]\x1b[0m Seeding failed: ${error.message}`);
  } finally {
    await disconnectDB();
  }
};

// If executing directly, trigger seed
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('seed.js')) {
  seedData();
}

export default seedData;
