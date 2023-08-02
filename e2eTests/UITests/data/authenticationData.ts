interface UserCredentials {
  username: string;
  password: string;
}

export const validUser: UserCredentials = {
  username: 'viikkobiitsi',
  password: 'v'
};

export const invalidUsers: UserCredentials[] = [
  {
    username: 'viikkobiitsi',
    password: 'wrong'
  },
  {
    username: '*',
    password: '*'
  },
];