/**
 * @file logger.js
 * @description Central error logging helper to catch MySQL offline errors (ECONNREFUSED)
 * and prevent dumping full AggregateError stack traces into the Node.js terminal.
 */

export function handleDbError(error, contextMessage, res = null, statusCode = 500) {
  const isConnRefused = 
    error?.code === 'ECONNREFUSED' || 
    error?.message?.includes('ECONNREFUSED') || 
    error?.name === 'AggregateError' ||
    (Array.isArray(error?.errors) && error.errors.some(e => e?.code === 'ECONNREFUSED'));

  if (isConnRefused) {
    console.warn(`[MySQL Offline] ${contextMessage} (ECONNREFUSED 3306)`);
    if (res) {
      return res.status(503).json({ message: `${contextMessage}: Database connection refused` });
    }
  } else {
    console.error(`[Error] ${contextMessage}:`, error);
    if (res) {
      return res.status(statusCode).json({ message: contextMessage });
    }
  }
}
