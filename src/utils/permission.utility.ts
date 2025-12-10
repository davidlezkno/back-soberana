import { UserTypeEnum } from 'src/app/users/constants';
import { User } from 'src/app/users/entities/user.entity';

/**
 * PermissionUtility
 * @description This method is used to validate the permissions of the user
 * @param  {User} user
 */
export default function PermissionUtility(user: User) {
  const empty = false;
  const exists = false;
  return {
    user: {
      id: user.id,
      type: user.type,
      status: user.active,
    },
    empty,
    exists,
    isAdmin: user.type === UserTypeEnum.Admin,
  };
}

