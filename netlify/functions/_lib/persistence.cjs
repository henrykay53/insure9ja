const defaultTableNames = {
  applications: 'applications',
  documents: 'application_documents',
  events: 'application_events',
};

const buildNoopPersistence = () => ({
  name: 'noop',
  async createApplication(record) {
    return {
      id: record.publicRef,
      publicRef: record.publicRef,
    };
  },
  async addDocuments() {
    return [];
  },
  async addEvent() {
    return null;
  },
});

const buildSupabasePersistence = ({
  supabaseUrl,
  serviceRoleKey,
  tableNames = defaultTableNames,
}) => {
  const restBase = `${supabaseUrl.replace(/\/$/, '')}/rest/v1`;

  const insertOne = async (table, row) => {
    const response = await fetch(`${restBase}/${table}`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });

    const responseBody = await response.text();
    const data = responseBody ? JSON.parse(responseBody) : null;
    if (!response.ok) {
      const error = new Error(
        data?.message || `Supabase insert failed (${table}) with status ${response.status}`,
      );
      error.code = 'SUPABASE_INSERT_FAILED';
      error.context = { table, status: response.status, data };
      throw error;
    }

    if (!Array.isArray(data) || data.length === 0) {
      const error = new Error(`Supabase insert returned no rows for ${table}`);
      error.code = 'SUPABASE_EMPTY_INSERT_RESULT';
      throw error;
    }

    return data[0];
  };

  return {
    name: 'supabase',

    async createApplication(record) {
      const row = await insertOne(tableNames.applications, {
        public_ref: record.publicRef,
        applicant_full_name: record.applicantFullName,
        email: record.email,
        phone: record.phone,
        product_type: record.productType,
        payload_json: record.payloadJson,
        payment_reference: record.paymentReference || null,
        payment_amount: record.paymentAmount ?? null,
        status: record.status || 'submitted',
      });

      return {
        id: row.id,
        publicRef: row.public_ref,
      };
    },

    async addDocuments(applicationId, documents) {
      const rows = [];
      for (const doc of documents) {
        const row = await insertOne(tableNames.documents, {
          application_id: applicationId,
          doc_type: doc.docType,
          storage_bucket: doc.storageBucket || null,
          storage_path: doc.storagePath || null,
          original_filename: doc.filename,
          mime_type: doc.mimeType,
          size_bytes: doc.sizeBytes,
        });
        rows.push(row);
      }
      return rows;
    },

    async addEvent(applicationId, eventType, eventPayload) {
      return await insertOne(tableNames.events, {
        application_id: applicationId,
        event_type: eventType,
        event_payload: eventPayload || {},
      });
    },
  };
};

const createPersistenceProvider = (env = process.env) => {
  const provider = env.PERSISTENCE_PROVIDER || 'noop';

  if (provider === 'supabase') {
    const supabaseUrl = env.SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      const error = new Error(
        'Supabase persistence requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      );
      error.code = 'SUPABASE_CONFIG_MISSING';
      throw error;
    }

    return buildSupabasePersistence({
      supabaseUrl,
      serviceRoleKey,
      tableNames: {
        applications: env.SUPABASE_TABLE_APPLICATIONS || defaultTableNames.applications,
        documents: env.SUPABASE_TABLE_DOCUMENTS || defaultTableNames.documents,
        events: env.SUPABASE_TABLE_EVENTS || defaultTableNames.events,
      },
    });
  }

  return buildNoopPersistence();
};

module.exports = {
  createPersistenceProvider,
};

