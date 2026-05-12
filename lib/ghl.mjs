/**
 * GHL API client for Eva
 * All calls use the client's own sub-account token — never the main Evolute token.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";

async function ghlRequest(method, endpoint, ghlApiKey, { body = null, version = "2021-07-28" } = {}) {
  const url = `${GHL_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      "Authorization": `Bearer ${ghlApiKey}`,
      "Version": version,
      "Content-Type": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL ${method} ${endpoint} → ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export async function searchContacts(locationId, ghlApiKey, query, limit = 50) {
  const endpoint = `/contacts/?locationId=${encodeURIComponent(locationId)}&query=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await ghlRequest("GET", endpoint, ghlApiKey);
  return res.contacts || [];
}

export async function getContact(contactId, ghlApiKey) {
  const res = await ghlRequest("GET", `/contacts/${contactId}`, ghlApiKey);
  return res.contact;
}

export async function updateContact(contactId, ghlApiKey, updates) {
  const allowed = [
    "firstName", "lastName", "name",
    "email", "phone",
    "address1", "city", "state", "postalCode", "country",
    "timezone", "dnd", "dateOfBirth",
    "assignedTo", "customFields", "source", "tags",
  ];
  const body = Object.fromEntries(
    Object.entries(updates).filter(([k, v]) => allowed.includes(k) && v !== undefined)
  );
  if (Object.keys(body).length === 0) throw new Error("No valid update fields provided");
  // WARNING: tags overwrites all existing tags — use addTag/removeTag for partial updates
  const res = await ghlRequest("PUT", `/contacts/${contactId}`, ghlApiKey, { body });
  return res.contact;
}

export async function addTag(contactId, ghlApiKey, tag) {
  const res = await ghlRequest("POST", `/contacts/${contactId}/tags`, ghlApiKey, {
    body: { tags: [tag] },
  });
  return res;
}

export async function removeTag(contactId, ghlApiKey, tag) {
  const res = await ghlRequest("DELETE", `/contacts/${contactId}/tags`, ghlApiKey, {
    body: { tags: [tag] },
  });
  return res;
}

// ── Pipelines & Opportunities ────────────────────────────────────────────────

export async function getPipelines(locationId, ghlApiKey) {
  const res = await ghlRequest("GET", `/opportunities/pipelines?locationId=${locationId}`, ghlApiKey);
  return res.pipelines || [];
}

export async function getOpportunities(locationId, ghlApiKey, { stageId = null, limit = 100 } = {}) {
  let endpoint = `/opportunities/search?location_id=${locationId}&limit=${limit}`;
  if (stageId) endpoint += `&pipeline_stage_id=${stageId}`;

  const all = [];
  let startAfterId = null;
  let startAfter = null;

  while (true) {
    let url = endpoint;
    if (startAfterId) url += `&startAfterId=${startAfterId}&startAfter=${startAfter}`;
    const res = await ghlRequest("GET", url, ghlApiKey);
    const batch = res.opportunities || [];
    all.push(...batch);
    if (batch.length < limit || !res.meta?.nextPageUrl) break;
    startAfterId = res.meta.startAfterId;
    startAfter = res.meta.startAfter;
  }
  return all;
}

export async function getOpportunitiesForContact(locationId, ghlApiKey, contactId) {
  const res = await ghlRequest("GET",
    `/opportunities/search?location_id=${locationId}&contact_id=${contactId}`,
    ghlApiKey
  );
  return res.opportunities || [];
}

export async function updateOpportunityStage(opportunityId, ghlApiKey, stageId) {
  const res = await ghlRequest("PUT", `/opportunities/${opportunityId}`, ghlApiKey, {
    body: { pipelineStageId: stageId },
  });
  return res.opportunity;
}

export async function updateOpportunityValue(opportunityId, ghlApiKey, value) {
  const res = await ghlRequest("PUT", `/opportunities/${opportunityId}`, ghlApiKey, {
    body: { monetaryValue: value },
  });
  return res.opportunity;
}

// ── Appointments ──────────────────────────────────────────────────────────────
//
// GHL has no "get all appointments for a location" endpoint.
// Must fetch calendars first, then fan out per calendar in 1-month chunks.

export async function getCalendars(locationId, ghlApiKey) {
  const res = await ghlRequest("GET", `/calendars/?locationId=${locationId}`, ghlApiKey);
  return res.calendars || [];
}

async function fetchCalendarAppts(calendarId, locationId, ghlApiKey, fromIso, toIso) {
  // GHL requires epoch ms for calendar events
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();

  const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
  const events = [];
  let cursor = from;

  while (cursor < to) {
    const chunkEnd = Math.min(cursor + MONTH_MS, to);
    const endpoint = `/calendars/events?locationId=${locationId}&calendarId=${calendarId}&startTime=${cursor}&endTime=${chunkEnd}`;
    const res = await ghlRequest("GET", endpoint, ghlApiKey, { version: "2021-04-15" });
    events.push(...(res.events || []));
    cursor = chunkEnd;
  }
  return events;
}

/**
 * Fetch all appointments for a sub-account within a date range.
 * Filters by scheduled time (when the appointment is).
 *
 * @param {string} locationId
 * @param {string} ghlApiKey
 * @param {string} fromIso - ISO date string e.g. "2026-05-01"
 * @param {string} toIso   - ISO date string e.g. "2026-05-31"
 * @returns {Promise<Array>} Deduplicated appointments sorted by startTime
 */
export async function fetchSubAccountAppointments(locationId, ghlApiKey, fromIso, toIso) {
  const calendars = await getCalendars(locationId, ghlApiKey);
  const results = await Promise.all(
    calendars.map(cal => fetchCalendarAppts(cal.id, locationId, ghlApiKey, fromIso, toIso))
  );

  // Deduplicate by event ID
  const seen = new Set();
  const all = [];
  for (const batch of results) {
    for (const evt of batch) {
      if (!seen.has(evt.id)) {
        seen.add(evt.id);
        all.push(evt);
      }
    }
  }
  return all.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}

/**
 * Fetch appointments filtered by when they were booked (dateAdded), not scheduled time.
 * Fetches everything from 2025-01-01 forward and filters client-side.
 */
export async function fetchSubAccountAppointmentsByCreation(locationId, ghlApiKey, fromIso, toIso) {
  const today = new Date().toISOString().slice(0, 10);
  const all = await fetchSubAccountAppointments(locationId, ghlApiKey, "2025-01-01", today);
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  return all.filter(evt => {
    const added = new Date(evt.dateAdded || evt.createdAt || 0).getTime();
    return added >= from && added <= to;
  });
}

/**
 * Fetch appointments for a specific contact
 * @param {string} contactId Contact ID
 * @param {string} locationId Location ID
 * @param {string} ghlApiKey API key
 * @param {string} fromIso - ISO date string, defaults to 30 days ago
 * @param {string} toIso - ISO date string, defaults to 60 days from now
 * @returns {Promise<Array>} Appointments for this contact
 */
export async function getContactAppointments(contactId, locationId, ghlApiKey, fromIso = null, toIso = null) {
  if (!fromIso) {
    const d = new Date();
    fromIso = new Date(d.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }
  if (!toIso) {
    const d = new Date();
    toIso = new Date(d.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }

  try {
    const allAppts = await fetchSubAccountAppointments(locationId, ghlApiKey, fromIso, toIso);
    return allAppts.filter(appt => appt.contactId === contactId);
  } catch (err) {
    // Fallback: calendar permissions may be limited, return empty
    console.warn(`Could not fetch appointments for contact ${contactId}:`, err.message);
    return [];
  }
}

// ── Custom Fields ─────────────────────────────────────────────────────────────

export async function getCustomFieldSchema(locationId, ghlApiKey) {
  const res = await ghlRequest("GET", `/locations/${locationId}/customFields`, ghlApiKey);
  return res.customFields || [];
}
