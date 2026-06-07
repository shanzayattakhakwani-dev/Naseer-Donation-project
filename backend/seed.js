const mongoose = require('mongoose');
const Campaign = require('./models/Campaign');

mongoose.connect('mongodb+srv://khakwanihouse06_db_user:Avengers@cluster0.emjqmwz.mongodb.net/naseer?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

const seedCampaigns = async () => {
  try {
    await Campaign.deleteMany({});

    const campaignData = [
      {
        title: 'Emergency Food Aid',
        description: 'Provide urgent food supplies to families in need.',
        category: 'Emergency',
        targetAmount: 50000,
        isUrgent: true
      },
      {
        title: 'Ramzan Ration Drive',
        description: 'Help families during Ramzan with ration packs.',
        category: 'Zakat',
        targetAmount: 80000
      },
      {
        title: 'Medical Help Fund',
        description: 'Support patients who cannot afford treatment.',
        category: 'Sadaqah',
        targetAmount: 100000
      },
      {
        title: 'Clean Water Project',
        description: 'Install water wells in villages.',
        category: 'Lillah',
        targetAmount: 120000
      }
    ];

    const campaigns = [];

    for (let data of campaignData) {
      const campaign = await Campaign.create(data);
      campaigns.push(campaign);
    }

    console.log('Campaigns Seeded Successfully');
    console.log(campaigns);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCampaigns();