import pool from '../config/db.js';
import { logAudit } from '../utils/logger.js';

export const exportSql = async (req, res) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  try {
    const tables = [
      'roles', 'users', 'settings', 'slider_images', 'service_categories',
      'services', 'product_categories', 'products', 'clients', 'testimonials',
      'blog_categories', 'blogs', 'gallery', 'enquiries', 'career_applications',
      'office_locations', 'media_library', 'audit_logs', 'login_history', 'visitor_logs'
    ];

    let sqlDump = `-- ============================================================\n`;
    sqlDump += `-- GEORSON TECH DB BACKUP DUMP\n`;
    sqlDump += `-- Exported on: ${new Date().toISOString()}\n`;
    sqlDump += `-- ============================================================\n\n`;
    sqlDump += `CREATE DATABASE IF NOT EXISTS georsontech_db;\n`;
    sqlDump += `USE georsontech_db;\n\n`;

    for (const table of tables) {
      sqlDump += `-- ------------------------------------------------------------\n`;
      sqlDump += `-- Table structure and data for table: ${table}\n`;
      sqlDump += `-- ------------------------------------------------------------\n`;
      
      // Get Create Table
      try {
        const [[showCreateTable]] = await pool.query(`SHOW CREATE TABLE \`${table}\``);
        sqlDump += `${showCreateTable['Create Table']};\n\n`;
      } catch (err) {
        sqlDump += `-- (Could not retrieve schema for ${table})\n\n`;
        continue;
      }

      // Get Table Data
      const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
      if (rows.length > 0) {
        sqlDump += `INSERT INTO \`${table}\` VALUES \n`;
        const insertRows = rows.map(row => {
          const values = Object.values(row).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "\\'")}'`;
            return `'${String(val).replace(/'/g, "\\'")}'`;
          });
          return `(${values.join(', ')})`;
        });
        sqlDump += `${insertRows.join(',\n')};\n\n`;
      }
    }

    await logAudit(req.user?.id, 'EXPORT_DATABASE_SQL', 'database', 'Database SQL dump generated', ipAddress);

    res.setHeader('Content-disposition', `attachment; filename=georsontech_backup_${Date.now()}.sql`);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write(sqlDump);
    return res.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate database SQL export' });
  }
};

export const restoreSql = async (req, res) => {
  const { sqlString } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  if (!sqlString) {
    return res.status(400).json({ message: 'SQL script is required for restoration' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Split the script into separate statements (this is a simple parser)
      const statements = sqlString
        .split(/;\s*$/m)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        await connection.query(statement);
      }

      await connection.commit();
      await logAudit(req.user?.id, 'RESTORE_DATABASE_SQL', 'database', 'Database state restored from SQL script', ipAddress);

      return res.json({ message: 'Database restored successfully' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Database restoration failed. Check script syntax.' });
  }
};

export const exportCsv = async (req, res) => {
  const { table } = req.params;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const allowedTables = ['enquiries', 'career_applications', 'visitor_logs', 'audit_logs', 'login_history'];

  if (!allowedTables.includes(table)) {
    return res.status(400).json({ message: 'Table export not allowed' });
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${table}\` ORDER BY id DESC`);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No records to export' });
    }

    const headers = Object.keys(rows[0]);
    let csvString = headers.join(',') + '\n';

    rows.forEach(row => {
      const csvRow = headers.map(header => {
        let val = row[header];
        if (val === null) return '';
        if (typeof val === 'object') val = JSON.stringify(val);
        // Escape quotes
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      csvString += csvRow.join(',') + '\n';
    });

    await logAudit(req.user?.id, `EXPORT_TABLE_CSV`, table, `Exported ${table} table as CSV`, ipAddress);

    res.setHeader('Content-disposition', `attachment; filename=${table}_export_${Date.now()}.csv`);
    res.setHeader('Content-type', 'text/csv');
    res.charset = 'UTF-8';
    res.write(csvString);
    return res.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to export table ${table} to CSV` });
  }
};
