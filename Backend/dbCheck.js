const prisma = require('./src/config/db.js');
async function main() {
  const users = await prisma.user.findMany();
  console.log(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
