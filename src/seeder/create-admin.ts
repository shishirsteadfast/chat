// src/seeder/create-admin.ts
import { initModels } from '../models';
import { Admin } from '../models/Admin';
import { hashPassword } from '../utils/password';

async function main() {
  await initModels();
  const email = 'admin@example.com';
  const password = 'password';

  const password_hash = await hashPassword(password);

  const admin = await Admin.create({ email, password_hash });
  console.log('Admin created:', admin.email);
}

main().then(() => process.exit(0));
