const DIAFLOW_BASE = 'https://api.diaflow.io/api/v1/builders';
const TEXT_BUILDER_ID = 'KSEvJWAKmC';
const IMAGE_BUILDER_ID = 'sMuymSs16q';

function getHeaders() {
  const apiKey = process.env.DIAFLOW_API_KEY;
  if (!apiKey) {
    throw new Error('DIAFLOW_API_KEY environment variable is not set');
  }
  return {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  };
}

export type ContentGenerationType = 'text' | 'image';

export interface ContentDiaflowResult {
  sessionId: string;
  status: 'processing' | 'completed' | 'failed';
  content: string | null;
  url: string | null;
  raw?: unknown;
}

function getBuilderId(type: ContentGenerationType): string {
  return type === 'text' ? TEXT_BUILDER_ID : IMAGE_BUILDER_ID;
}

/**
 * Build a full CDN URL from a Diaflow image path.
 * Uses env vars for the signed URL query params.
 */
function buildCdnUrl(path: string): string {
  const policy = process.env.DIAFLOW_CDN_POLICY ?? '';
  const signature = process.env.DIAFLOW_CDN_SIGNATURE ?? '';
  const keyPairId = process.env.DIAFLOW_CDN_KEY_PAIR_ID ?? '';
  return `https://cdn.diaflow.io/${path}?Policy=${policy}&Signature=${signature}&Key-Pair-Id=${keyPairId}`;
}

/**
 * Diaflow output node mapping by content generation type.
 *
 * Each builder has specific output nodes with keyed fields.
 * TODO: Fill in the actual node name and field key from the Diaflow builder config.
 */
interface ContentOutputNodeConfig {
  node: string;
  contentKey: string;  // Field key for text content OR image path
}

const TEXT_OUTPUT_NODES: ContentOutputNodeConfig[] = [
  { node: 'output', contentKey: '1770497874518' },
];

const IMAGE_OUTPUT_NODES: ContentOutputNodeConfig[] = [
  { node: 'output', contentKey: '1770475858951' },
];

const OUTPUT_NODES: Record<ContentGenerationType, ContentOutputNodeConfig[]> = {
  text: TEXT_OUTPUT_NODES,
  image: IMAGE_OUTPUT_NODES,
};

/**
 * Extract content or image path from a Diaflow result object
 * by trying each candidate output node for the given content type.
 */
function extractFromResult(
  result: Record<string, unknown>,
  type: ContentGenerationType,
): { content: string | null; url: string | null } {
  const candidates = OUTPUT_NODES[type];

  for (const { node, contentKey } of candidates) {
    const outputNode = result[node] as Record<string, unknown> | undefined;
    if (!outputNode) continue;

    const value = outputNode[contentKey];
    if (typeof value === 'string' && value.length > 0) {
      if (type === 'image') {
        return { content: null, url: buildCdnUrl(value) };
      }
      return { content: value, url: null };
    }
  }

  return { content: null, url: null };
}

export const contentDiaflowAgent = {
  /**
   * Start a content generation flow.
   * Sends a prompt to the appropriate Diaflow builder (text or image).
   */
  async startGeneration(
    type: ContentGenerationType,
    prompt: string,
  ): Promise<{ sessionId: string }> {
    const builderId = getBuilderId(type);
    const response = await fetch(`${DIAFLOW_BASE}/${builderId}/process`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Diaflow content API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { sessionId: data.sessionId || data.session_id || data.id };
  },

  /**
   * Check the status of a content generation flow.
   * Returns the generated content when completed.
   */
  async checkStatus(
    type: ContentGenerationType,
    sessionId: string,
  ): Promise<ContentDiaflowResult> {
    const builderId = getBuilderId(type);
    const response = await fetch(
      `${DIAFLOW_BASE}/${builderId}/process-checks/${sessionId}`,
      { method: 'GET', headers: getHeaders() },
    );

    if (!response.ok) {
      throw new Error(`Diaflow content status API error ${response.status}`);
    }

    const data = await response.json();
    const isDone = data.status === 'Done' || data.status === 'completed';
    const isFailed = data.status === 'failed' || data.status === 'Failed' || data.status === 'Error';

    if (isDone && data.result) {
      const resultObj = data.result as Record<string, unknown>;
      const { content, url } = extractFromResult(resultObj, type);
      return { sessionId, status: 'completed', content, url, raw: data };
    }

    return {
      sessionId,
      status: isFailed ? 'failed' : 'processing',
      content: null,
      url: null,
      raw: data,
    };
  },
};