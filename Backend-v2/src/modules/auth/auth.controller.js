import * as authService from './auth.service.js';
import * as users from '../users/users.service.js';

export async function signup(req, res) {
  const { token, user } = await authService.signup(req.validated.body);
  res.status(201).json({ message: 'User created successfully', token, user });
}

export async function login(req, res) {
  const { token, user } = await authService.login(req.validated.body);
  res.json({ message: 'Login successful', token, user });
}

export async function me(req, res) {
  res.json({ user: await authService.me(req.user.id) });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.validated.body;
  await users.changePassword(req.user.id, currentPassword, newPassword);
  res.json({ message: 'Password updated successfully' });
}

export async function getUser(req, res) {
  res.json(await users.getPublicProfile(req.validated.params.id));
}
