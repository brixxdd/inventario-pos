const Database = require('better-sqlite3');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

const dbPath = isDev 
  ? path.join(__dirname, 'pos.db')
  : path.join(process.resourcesPath, 'pos.db');

const db = new Database(dbPath);

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    received_amount DECIMAL(10,2),
    change_amount DECIMAL(10,2)
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const dbOperations = {
  getProducts: () => {
    return db.prepare("SELECT * FROM products WHERE status = 'active'").all();
  },

  checkSkuExists: (sku) => {
    const result = db.prepare('SELECT COUNT(*) as count FROM products WHERE sku = ?').get(sku);
    return result.count > 0;
  },

  addProduct: (product) => {
    try {
      if (dbOperations.checkSkuExists(product.sku)) {
        throw new Error('SKU_EXISTS');
      }

      const stmt = db.prepare(`
        INSERT INTO products (name, sku, price, stock, category)
        VALUES (?, ?, ?, ?, ?)
      `);
      return stmt.run(product.name, product.sku, product.price, product.stock, product.category);
    } catch (error) {
      if (error.message === 'SKU_EXISTS') {
        throw new Error('Ya existe un producto con este SKU');
      }
      throw error;
    }
  },

  updateStock: (productId, quantity) => {
    const stmt = db.prepare(`
      UPDATE products 
      SET stock = stock - ? 
      WHERE id = ?
    `);
    return stmt.run(quantity, productId);
  },

  createSale: (saleData) => {
    const transaction = db.transaction((saleData) => {
      const saleStmt = db.prepare(`
        INSERT INTO sales (total, payment_method, received_amount, change_amount)
        VALUES (?, ?, ?, ?)
      `);

      const { lastInsertRowid: saleId } = saleStmt.run(
        saleData.total,
        saleData.paymentMethod,
        saleData.receivedAmount,
        saleData.change
      );

      const itemStmt = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      saleData.items.forEach(item => {
        itemStmt.run(saleId, item.id, item.quantity, item.price);
        dbOperations.updateStock(item.id, item.quantity);
      });

      return saleId;
    });

    return transaction(saleData);
  },

  getSales: () => {
    return db.prepare(`
      SELECT s.*, 
        GROUP_CONCAT(p.name) as products,
        GROUP_CONCAT(si.quantity) as quantities
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      LEFT JOIN products p ON si.product_id = p.id
      GROUP BY s.id
      ORDER BY s.date DESC
    `).all();
  }
};

module.exports = dbOperations; 