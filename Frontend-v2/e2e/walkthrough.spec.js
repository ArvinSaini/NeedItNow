import { test, expect } from '@playwright/test';

// Scenarios build on each other (admin signs up first, changes password, then blocks/deletes a member).
test.describe.configure({ mode: 'serial' });

const admin = { name: 'Admin Person', email: 'admin@test.com', password: 'secret123', phone: '9876543210', hostel: 'H1', room: '101' };
const member = { name: 'Member Person', email: 'member@test.com', password: 'secret123', phone: '9876543211', hostel: 'H2', room: '202' };
const MEMBER_LISTING = 'Member kettle for lending';
const LONG_TITLE = 'x'.repeat(80);
const DETAILS_TITLE = 'Trekking backpack with full trail history';
const SHORT_TITLE = 'Cricket bat for weekend matches';
const SHORT_DESCRIPTION = 'Cricket bat, good grip';
const DETAILS_DESCRIPTION = [
  'This 50-litre trekking backpack has an adjustable aluminium frame, a detachable rain cover, and a built-in hydration sleeve for long treks.',
  'The zips are YKK grade and have survived three monsoon seasons on the trail without ever failing under load. It comes with a small detachable daypack, spare buckles, a curved needle, and heavy nylon thread for quick repairs far from any shop.',
  'Selling only because I upgraded to a lighter carbon frame model ahead of next season.',
].join('\n\n');

const tab = (page, name) => page.getByRole('button', { name, exact: true });
const fitsInBox = (locator) => locator.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
// Cards and tab panels fade in with framer-motion (inline opacity). Wait for every fade to finish
// so the evidence screenshots are not captured mid-animation.
async function snap(page, name, options = {}) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll('[style*="opacity"]')].every((el) => getComputedStyle(el).opacity === '1'),
  );
  await page.screenshot({ path: `test-results/${name}.png`, ...options });
}

async function signup(page, u) {
  await page.goto('/signup');
  await page.getByLabel('Full name').fill(u.name);
  await page.getByLabel('Email').fill(u.email);
  await page.getByLabel('Password').fill(u.password);
  await page.getByLabel('Phone (10 digits)').fill(u.phone);
  await page.getByLabel('Hostel').fill(u.hostel);
  await page.getByLabel('Room number').fill(u.room);
  await page.getByRole('button', { name: 'Create free account' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

async function login(page, u) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(u.email);
  await page.getByLabel('Password').fill(u.password);
  await page.getByRole('button', { name: 'Log in' }).click();
}

async function addListing(page, { title, description }) {
  await tab(page, 'Add listing').click();
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Description').fill(description);
  await page.getByRole('button', { name: 'Publish listing' }).click();
  await expect(page.getByRole('heading', { name: 'My listings' })).toBeVisible();
}

test('signup shows an inline error for an invalid email and blocks submit until it is fixed', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('Full name').fill('Invalid Email Person');
  const email = page.getByLabel('Email');
  await email.fill('a@b.c');
  await expect(page.getByText('Enter a valid email like name@gmail.com')).toBeVisible();

  await page.getByLabel('Password').fill('secret123');
  await page.getByLabel('Phone (10 digits)').fill('9999999999');
  await page.getByLabel('Hostel').fill('H9');
  await page.getByLabel('Room number').fill('909');
  await page.getByRole('button', { name: 'Create free account' }).click();
  await expect(page).toHaveURL(/\/signup/); // blocked: no navigation to /dashboard

  await email.fill('validcheck@test.com');
  await expect(page.getByText('Enter a valid email like name@gmail.com')).toBeHidden();
});

test('admin signs up and sees the admin panel and the account tab', async ({ page }) => {
  await signup(page, admin);
  await expect(tab(page, 'Manage users')).toBeVisible();
  await expect(tab(page, 'Account')).toBeVisible();
  await snap(page, '01-admin-dashboard', { fullPage: true });
});

test('long unbroken title and description are capped and stay inside the card', async ({ page }) => {
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);
  await tab(page, 'Add listing').click();

  const title = page.getByLabel('Title');
  await title.fill(LONG_TITLE);
  await title.pressSequentially('EXTRA'); // typing past maxLength must be refused
  await expect(title).toHaveValue(LONG_TITLE);
  await expect(page.getByText('80/80')).toBeVisible();

  const description = page.getByLabel('Description');
  await description.fill('y'.repeat(500));
  await description.pressSequentially('EXTRA');
  await expect(description).toHaveValue('y'.repeat(500));
  await expect(page.getByText('500/500')).toBeVisible();
  await snap(page, '02-counters-at-limit');

  await page.getByRole('button', { name: 'Publish listing' }).click();
  await expect(page.getByRole('heading', { name: 'My listings' })).toBeVisible();
  const card = page.locator('h3', { hasText: LONG_TITLE }).first();
  await expect(card).toBeVisible();
  expect(await fitsInBox(card)).toBe(true);
  expect(await fitsInBox(card.locator('xpath=following-sibling::p[1]'))).toBe(true);
  await snap(page, '03-long-text-my-listings', { fullPage: true });

  await tab(page, 'Manage listings').click();
  const adminCard = page.locator('h3', { hasText: LONG_TITLE }).first();
  await expect(adminCard).toBeVisible();
  expect(await fitsInBox(adminCard)).toBe(true);
  expect(await fitsInBox(adminCard.locator('xpath=following-sibling::p[1]'))).toBe(true);
  await snap(page, '04-long-text-admin-panel', { fullPage: true });
});

test('change password rejects a wrong current password and accepts the right one', async ({ page }) => {
  await login(page, admin);
  await tab(page, 'Account').click();

  await page.getByLabel('Current password').fill('definitely-wrong');
  await page.getByLabel('New password', { exact: true }).fill('newsecret456');
  await page.getByLabel('Confirm new password').fill('newsecret456');
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page.getByText('Current password is incorrect')).toBeVisible();
  await expect(page).toHaveURL(/\/dashboard/); // a wrong password must not log the user out

  await page.getByLabel('Current password').fill(admin.password);
  await page.getByLabel('New password', { exact: true }).fill('newsecret456');
  await page.getByLabel('Confirm new password').fill('newsecret456');
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page.getByText('Password updated')).toBeVisible();
  await snap(page, '05-password-updated');

  await tab(page, 'Log out').click();
  await login(page, admin); // old password
  await expect(page.getByText('Invalid email or password')).toBeVisible();
  admin.password = 'newsecret456';
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);
});

test('a blocked member is sent to the login page with a banner', async ({ browser, page, baseURL }) => {
  // A hand-made context does not reliably inherit use.baseURL, so pass it explicitly.
  const memberContext = await browser.newContext({ baseURL });
  const memberPage = await memberContext.newPage();
  await signup(memberPage, member);
  await addListing(memberPage, { title: MEMBER_LISTING, description: 'Electric kettle, works fine, borrow it for a few days.' });

  await login(page, admin);
  await tab(page, 'Manage users').click();
  const memberRow = page.locator('tr', { hasText: member.email });
  await memberRow.getByRole('button', { name: 'Block', exact: true }).click();
  await expect(memberRow.getByText('Blocked', { exact: true })).toBeVisible();

  await memberPage.reload(); // dashboard mount calls /user/me → 403 ACCOUNT_BLOCKED
  await expect(memberPage).toHaveURL(/\/login\?reason=blocked/);
  await expect(memberPage.getByText("blocked by the admin, so you've been logged out")).toBeVisible();
  await snap(memberPage, '06-blocked-banner');
  await memberContext.close();
});

test('blocking a member logs them out of every open tab within seconds, no reload needed', async ({ browser, page, baseURL }) => {
  const memberContext = await browser.newContext({ baseURL });
  const listingsPage = await memberContext.newPage();
  const requestsPage = await memberContext.newPage();

  // A fresh member for this scenario, logged in on two public pages (no dashboard, no reload).
  // Both tabs share the same context, so they share the same origin's localStorage session.
  const secondMember = { name: 'Second Member', email: 'member2@test.com', password: 'secret123', phone: '9876543212', hostel: 'H3', room: '303' };
  await signup(listingsPage, secondMember);
  await listingsPage.goto('/listings');
  await requestsPage.goto('/requests');

  await login(page, admin);
  await tab(page, 'Manage users').click();
  const secondMemberRow = page.locator('tr', { hasText: secondMember.email });
  await secondMemberRow.getByRole('button', { name: 'Block', exact: true }).click();
  await expect(secondMemberRow.getByText('Blocked', { exact: true })).toBeVisible();

  // Neither public tab is reloaded — the app-wide session watcher must catch the block. Only
  // the foreground tab's watcher actually polls every 15s (document.visibilityState); the
  // background tab is only caught by the `storage` event fired once the foreground tab's
  // endSession() writes `sessionEndReason`, so give both a wider margin than the poll interval.
  await expect(listingsPage).toHaveURL(/\/login\?reason=blocked/, { timeout: 30_000 });
  await expect(listingsPage.getByText("blocked by the admin, so you've been logged out")).toBeVisible();
  await expect(requestsPage).toHaveURL(/\/login\?reason=blocked/, { timeout: 30_000 });
  await expect(requestsPage.getByText("blocked by the admin, so you've been logged out")).toBeVisible();

  await login(listingsPage, secondMember);
  await expect(listingsPage.getByText('Your account has been blocked')).toBeVisible();
  await memberContext.close();
});

test('a dead token is sent to the login page with the expired banner', async ({ page }) => {
  // Let the dashboard's own /user/me call finish with the valid token first; otherwise that
  // mount-time call can pick up the bad token and redirect mid-way through the goto below.
  const meLoaded = page.waitForResponse((res) => res.url().endsWith('/user/me') && res.ok());
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);
  await meLoaded;
  await page.evaluate(() => localStorage.setItem('token', 'not-a-valid-token'));
  // /user/me → 401 TOKEN_INVALID → same path as an expired token. The app redirects to /login
  // before /dashboard fires "load", which would abort a default goto, so only wait for commit.
  await page.goto('/dashboard', { waitUntil: 'commit' });
  await expect(page).toHaveURL(/\/login\?reason=expired/);
  await expect(page.getByText('Your session has expired')).toBeVisible();
  await snap(page, '07-expired-banner');
});

test('admin cannot block or delete themselves, and deleting a member removes their listings', async ({ page }) => {
  await login(page, admin);
  await tab(page, 'Manage users').click();

  const ownRow = page.locator('tr', { hasText: admin.email });
  await expect(ownRow.getByRole('button', { name: 'Block', exact: true })).toBeDisabled();
  await expect(ownRow.getByRole('button', { name: 'Delete', exact: true })).toBeDisabled();

  const memberRow = page.locator('tr', { hasText: member.email });
  await memberRow.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(memberRow).toHaveCount(0);

  await tab(page, 'Manage listings').click();
  await expect(page.locator('h3', { hasText: LONG_TITLE })).toHaveCount(1); // admin's listing survives
  await expect(page.getByText(MEMBER_LISTING)).toHaveCount(0); // member's listing cascaded away
  await snap(page, '08-admin-panel-after-delete', { fullPage: true });
});

test('the details dialog shows the full description a clamped card hides', async ({ page }) => {
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);
  await addListing(page, { title: DETAILS_TITLE, description: DETAILS_DESCRIPTION });
  await addListing(page, { title: SHORT_TITLE, description: SHORT_DESCRIPTION });

  await page.goto('/listings');
  await page.getByPlaceholder('Search for textbooks, cycles, kettles…').fill(DETAILS_TITLE);
  const card = page.locator('h3', { hasText: DETAILS_TITLE }).first();
  await expect(card).toBeVisible();

  // The card clamps the description to 2 lines, so the tail of it is not in the DOM's
  // visible text — only "Full details" opens the dialog that carries the full copy.
  await page.getByRole('button', { name: 'Full details' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(DETAILS_TITLE)).toBeVisible();
  await expect(dialog.getByText('Selling only because I upgraded to a lighter carbon frame model ahead of next season.')).toBeVisible();
  await snap(page, '09-details-dialog');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Full details' }).click();
  await expect(dialog).toBeVisible();
  await snap(page, '10-details-dialog-mobile');

  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});

test('a card whose description fits fully has no "Full details" link', async ({ page }) => {
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto('/listings');
  await page.getByPlaceholder('Search for textbooks, cycles, kettles…').fill(SHORT_TITLE);
  const shortCard = page.locator('h3', { hasText: SHORT_TITLE }).first();
  await expect(shortCard).toBeVisible();
  await expect(page.getByText(SHORT_DESCRIPTION, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Full details' })).toHaveCount(0);
});

test('pasting text that exceeds the description limit shows a cut warning that clears on edit', async ({ page, context }) => {
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);
  await tab(page, 'Add listing').click();

  // Headless Chromium needs explicit clipboard permission before navigator.clipboard.writeText
  // (called with no user gesture from page.evaluate) is allowed to succeed.
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate((text) => navigator.clipboard.writeText(text), 'z'.repeat(600));

  const description = page.getByLabel('Description');
  await description.click();
  await page.keyboard.press('ControlOrMeta+V');

  // The browser's native maxLength truncation cuts the paste to 500 chars with no signal of
  // its own — the warning below is what tells the user it happened.
  await expect(description).toHaveValue('z'.repeat(500));
  await expect(page.getByText('Your text was cut to 500 characters.')).toBeVisible();
  await snap(page, '11-paste-truncated-warning');

  await page.keyboard.press('Backspace');
  await page.keyboard.type('z');
  await expect(description).toHaveValue('z'.repeat(500));
  await expect(page.getByText('Your text was cut to 500 characters.')).toBeHidden();
});

test('navbar shows Log out when logged in and updates instantly on logout, including other tabs', async ({ page, context }) => {
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);

  // Home also has a "Log in" link in its footer, so scope every assertion to the navbar itself.
  const nav = page.locator('nav');

  await page.goto('/listings');
  await expect(nav.getByRole('button', { name: 'Log out' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Log in', exact: true })).toHaveCount(0);

  // A second tab in the same context shares localStorage; it starts logged in too, and should
  // flip to logged-out the instant the first tab logs out — no reload needed.
  const secondPage = await context.newPage();
  const secondNav = secondPage.locator('nav');
  await secondPage.goto('/requests');
  await expect(secondNav.getByRole('button', { name: 'Log out' })).toBeVisible();

  await nav.getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(nav.getByRole('link', { name: 'Log in', exact: true })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Log out' })).toHaveCount(0);

  await expect(secondNav.getByRole('link', { name: 'Log in', exact: true })).toBeVisible();
  await expect(secondNav.getByRole('button', { name: 'Log out' })).toHaveCount(0);
  await secondPage.close();

  // Logging back in must still work after a plain logout.
  await login(page, admin);
  await expect(page).toHaveURL(/\/dashboard/);
});
