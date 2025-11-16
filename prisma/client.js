const { PrismaClient } = require('@prisma/client');

// Create the single, globally accessible instance
const prisma = new PrismaClient();

module.exports = prisma;