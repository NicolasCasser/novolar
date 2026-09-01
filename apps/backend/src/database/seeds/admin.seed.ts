import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { User } from '../../modules/users/entities/user.entity';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.',
    );
  }

  await dataSource.initialize();

  try {
    const userRepository = dataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      console.log(`Admin user "${email}" already exists.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = userRepository.create({
      name: 'Administrador',
      email,
      password: hashedPassword,
    });

    await userRepository.save(admin);

    console.log(`Admin user "${email}" created successfully.`);
  } finally {
    await dataSource.destroy();
  }
}

seedAdmin().catch((error) => {
  console.error('Error while creating admin user:', error);
  process.exit(1);
});
