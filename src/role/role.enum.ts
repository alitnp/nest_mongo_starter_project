export enum RoleEnum {
  User = 'user',
  Admin = 'admin',
  Test = 'test',
}
export const RoleDescriptions: Record<RoleEnum, string> = {
  [RoleEnum.User]: 'A regular user with limited access',
  [RoleEnum.Admin]: 'An administrator with full access',
  [RoleEnum.Test]: 'A test role for experimentation',
};
