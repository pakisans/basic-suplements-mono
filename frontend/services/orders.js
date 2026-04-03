import { PAYLOAD_URL } from '@/constants';

const API = `${PAYLOAD_URL}/api/orders`;

export async function createOrder({ items, contact, delivery, userId, token }) {
  const body = {
    items: items.map((item) => ({
      product: item.productId,
      ...(item.variantId ? { variant: item.variantId } : {}),
      quantity: item.quantity,
    })),
    customerEmail: contact.email,
    ...(userId ? { customer: userId } : {}),
    shippingAddress: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      addressLine1: delivery.street,
      city: delivery.city,
      postalCode: delivery.zip,
      country: delivery.country,
      phone: contact.phone,
    },
    status: 'processing',
  };

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `JWT ${token}`;

  const res = await fetch(API, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.errors?.[0]?.message ||
        data.message ||
        'Greška pri kreiranju porudžbine',
    );
  }
  return data.doc;
}

export async function getMyOrders(token) {
  if (!token) return [];
  const res = await fetch(`${API}?depth=2&sort=-createdAt&limit=50`, {
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.docs ?? [];
}

export async function getOrderById(id, { token, accessToken } = {}) {
  const url = new URL(`${API}/${id}`);
  if (accessToken) url.searchParams.set('accessToken', accessToken);

  const headers = {};
  if (token) headers['Authorization'] = `JWT ${token}`;

  const res = await fetch(url.toString(), { headers, cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}
