import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { createUserAccount, findUserByTenantAndEmail, findUserByEmail } from '../services/user.service.js';
import { createTenant, getTenantById, resolveExistingTenant } from '../services/tenant.service.js';

const getAuthSecret = () => process.env.JWT_SECRET || 'your-secret-key';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(String(password), saltRounds);
};

const verifyPassword = async (password, storedPassword) => {
  return await bcrypt.compare(String(password), String(storedPassword || ''));
};

const generateToken = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', getAuthSecret()).update(body).digest('base64url');
  return `${body}.${signature}`;
};

const buildUserResponse = (user, tenant) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  tenant,
  accountType: user.accountType,
  isAdmin: user.isAdmin,
  customerType: user.customerType,
  subscriptionLevel: user.subscriptionLevel,
});

export const businessSignup = async (req, res) => {
  try {
    const { name, email, password, tenantName, tenantSlug, settings } = req.body || {};

    if (!String(name || '').trim() || !String(email || '').trim() || !String(password || '').trim()) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    // tenantName is optional — fall back to the user's name
    const resolvedTenantName = String(tenantName || name || '').trim();

    const createdTenant = await createTenant({
      name: resolvedTenantName,
      slug: tenantSlug || resolvedTenantName,
      settings,
    });

    const existingUser = await findUserByTenantAndEmail(createdTenant._id, email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists for this tenant' });
    }

    const user = await createUserAccount({
      name,
      email: normalizeEmail(email),
      password: await hashPassword(password),
      tenant: createdTenant._id,
      accountType: 'business',
      isAdmin: true,
      customerType: 'regular',
      subscriptionLevel: 'basic',
    });

    return res.status(201).json({
      tenant: createdTenant,
      user: buildUserResponse(user, createdTenant),
      token: generateToken({
        id: user._id,
        tenantId: createdTenant._id,
        accountType: user.accountType,
      }),
    });
  } catch (error) {
    if (String(error.message || '').includes('Tenant slug already exists')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const customerSignup = async (req, res) => {
  try {
    const { name, email, password, tenantId, tenantSlug, customerType, subscriptionLevel } = req.body || {};

    if (!String(name || '').trim() || !String(email || '').trim() || !String(password || '').trim()) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    const tenant = await resolveExistingTenant({ tenantId, tenantSlug });
    if (!tenant) {
      return res.status(404).json({ message: 'Selected tenant not found' });
    }

    const existingUser = await findUserByTenantAndEmail(tenant._id, email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists for this tenant' });
    }

    const user = await createUserAccount({
      name,
      email: normalizeEmail(email),
      password: await hashPassword(password),
      tenant: tenant._id,
      accountType: 'customer',
      isAdmin: false,
      customerType: customerType || 'regular',
      subscriptionLevel: subscriptionLevel || 'basic',
    });

    return res.status(201).json({
      tenant,
      user: buildUserResponse(user, tenant),
      token: generateToken({
        id: user._id,
        tenantId: tenant._id,
        accountType: user.accountType,
      }),
    });
  } catch (error) {
    if (String(error.message || '').includes('Tenant slug already exists')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, tenantId, tenantSlug } = req.body || {};

    if (!String(email || '').trim() || !String(password || '').trim()) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    let user, tenant;

    // If tenantId/tenantSlug provided, scope the lookup to that tenant
    if (tenantId || tenantSlug) {
      tenant = await resolveExistingTenant({ tenantId, tenantSlug });
      if (!tenant) {
        return res.status(404).json({ message: 'Tenant not found' });
      }
      user = await findUserByTenantAndEmail(tenant._id, email);
    } else {
      // No tenant provided — find by email across all tenants
      user = await findUserByEmail(email);
      if (user) {
        tenant = await getTenantById(user.tenant);
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!tenant) {
      return res.status(400).json({ message: 'Associated tenant not found' });
    }

    if (!await verifyPassword(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    return res.json({
      user: buildUserResponse(user, tenant),
      tenant,
      token: generateToken({
        id: user._id,
        tenantId: tenant._id,
        accountType: user.accountType,
      }),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signup = businessSignup;
