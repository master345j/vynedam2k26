import { connectDB, disconnectDB } from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Portfolio from './models/Portfolio.js';
import Project from './models/Project.js';
import Application from './models/Application.js';

// Query demonstration function
const runDemoQueries = async () => {
  try {
    console.log('\n\x1b[35m===================================================\x1b[0m');
    console.log('\x1b[35m          EARTH DATABASE VERIFICATION DEMO         \x1b[0m');
    console.log('\x1b[35m===================================================\x1b[0m');

    // Query 1: Retrieve all Categories
    console.log('\n\x1b[36m[Query 1] Listing Categories:\x1b[0m');
    const categories = await Category.find();
    categories.forEach(cat => {
      console.log(` - ${cat.name} (${cat.slug}): ${cat.description}`);
    });

    // Query 2: Retrieve Creators and their skills
    console.log('\n\x1b[36m[Query 2] Listing Creators available for hire:\x1b[0m');
    const creators = await User.find({ role: 'creator', availability: 'available' });
    creators.forEach(creator => {
      console.log(` - \x1b[32m${creator.profile.fullName}\x1b[0m (${creator.profile.title})`);
      console.log(`   Location: ${creator.profile.location}`);
      console.log(`   Skills: ${creator.profile.skills.join(', ')}`);
    });

    // Query 3: Search Portfolios inside VFX & 3D Animation Category
    console.log('\n\x1b[36m[Query 3] Finding VFX portfolios with creator metadata:\x1b[0m');
    const vfxCat = await Category.findOne({ slug: 'vfx-3d-animation' });
    if (vfxCat) {
      const vfxPortfolios = await Portfolio.find({ category: vfxCat._id }).populate('creator');
      vfxPortfolios.forEach(portfolio => {
        console.log(` - \x1b[33m"${portfolio.title}"\x1b[0m`);
        console.log(`   Created by: ${portfolio.creator.profile.fullName}`);
        console.log(`   Tools Used: ${portfolio.toolsUsed.join(', ')}`);
        console.log(`   Likes: ${portfolio.likesCount} | Views: ${portfolio.viewsCount}`);
      });
    }

    // Query 4: Search Open Projects & Applicant count
    console.log('\n\x1b[36m[Query 4] Listing Open Projects posted by recruiters:\x1b[0m');
    const openProjects = await Project.find({ status: 'open' }).populate('recruiter').populate('category');
    openProjects.forEach(proj => {
      console.log(` - \x1b[35m"${proj.title}"\x1b[0m`);
      console.log(`   Posted by: ${proj.recruiter.profile.fullName} (${proj.recruiter.profile.title})`);
      console.log(`   Category: ${proj.category.name}`);
      console.log(`   Budget: ${proj.budget.currency} ${proj.budget.min} - ${proj.budget.max}`);
      console.log(`   Applicants count: ${proj.applicationsCount}`);
    });

    // Query 5: Full Application workflow (populated)
    console.log('\n\x1b[36m[Query 5] Listing Applications and details:\x1b[0m');
    const apps = await Application.find()
      .populate({
        path: 'project',
        populate: { path: 'recruiter' }
      })
      .populate('applicant');

    apps.forEach(app => {
      console.log(` - \x1b[32m${app.applicant.profile.fullName}\x1b[0m applied to \x1b[35m"${app.project.title}"\x1b[0m`);
      console.log(`   Bid: ${app.project.budget.currency} ${app.bidAmount} | Status: [${app.status.toUpperCase()}]`);
      console.log(`   Cover message: "${app.message}"`);
    });

    console.log('\n\x1b[35m===================================================\x1b[0m');
    console.log('\x1b[32m          VERIFICATION RUN COMPLETED               \x1b[0m');
    console.log('\x1b[35m===================================================\x1b[0m\n');
  } catch (err) {
    console.error(`\x1b[31m[Query Error]\x1b[0m Demo query execution failed: ${err.message}`);
  }
};

// Main runner execution
const main = async () => {
  try {
    await connectDB();
    await runDemoQueries();
  } catch (err) {
    console.error(`Runner failed: ${err.message}`);
  } finally {
    await disconnectDB();
  }
};

main();
