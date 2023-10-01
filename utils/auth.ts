import { auth } from '@clerk/nextjs';
import { prisma } from './db';
import { Prisma, User } from '@prisma/client';

export const getUserByClerkID = async () => {
  const { userId } = await auth();

  const user: User = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId ?? '',
    },
  });
  return user;
};
