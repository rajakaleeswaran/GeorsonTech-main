import pool from '../config/db.js';
import { handleDbError } from '../utils/logger.js';

export const exportSql = async (req, res) => {
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
      
      try {
        const [[showCreateTable]] = await pool.query(`SHOW CREATE TABLE \`${table}\``);
        sqlDump += `${showCreateTable['Create Table']};\n\n`;
      } catch (err) {
        sqlDump += `-- (Could not retrieve schema for ${table})\n\n`;
        continue;
      }

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

    res.setHeader('Content-disposition', `attachment; filename=georsontech_backup_${Date.now()}.sql`);
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    res.write(sqlDump);
    return res.end();
  } catch (error) {
    return handleDbError(error, 'Failed to generate database SQL export', res);
  }
};

export const restoreSql = async (req, res) => {
  const { sqlString } = req.body;

  if (!sqlString) {
    return res.status(400).json({ message: 'SQL script is required for restoration' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const statements = sqlString
      .split(/;\s*$/m)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      await connection.query(statement);
    }

    await connection.commit();
    return res.json({ message: 'Database restored successfully' });
  } catch (error) {
    if (connection) await connection.rollback();
    return handleDbError(error, 'Database restoration failed. Check script syntax.', res);
  } finally {
    if (connection) connection.release();
  }
};

export const exportCsv = async (req, res) => {
  const { table } = req.params;
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
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      csvString += csvRow.join(',') + '\n';
    });

    res.setHeader('Content-disposition', `attachment; filename=${table}_export_${Date.now()}.csv`);
    res.setHeader('Content-type', 'text/csv');
    res.charset = 'UTF-8';
    res.write(csvString);
    return res.end();
  } catch (error) {
    return handleDbError(error, `Failed to export table ${table} to CSV`, res);
  }
};
