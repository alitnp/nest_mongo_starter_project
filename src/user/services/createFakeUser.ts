import { Model } from 'mongoose';
import { getHash } from 'src/common/utils/bcrypt';
import { User } from 'src/user/user.entity';

export const createFakeUser = async (userModel: Model<User>) => {
  const passwordHash = await getHash('1234');

  const fakeUser = new userModel({
    firstName: 'John',
    lastName: 'Doe',
    username: 'user',
    password: passwordHash,
    roles: [],
  });
  await fakeUser.save();
  return fakeUser;
};
