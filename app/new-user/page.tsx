import { prisma } from '@/utils/db';
import { auth, currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const createNewUser = async () => {
  const user = (await currentUser()) as User;
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  redirect('/journal');
};

const NewUser = async () => {
  await createNewUser();
  return <div>Welcome!</div>;
};

export default NewUser;
