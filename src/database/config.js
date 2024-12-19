import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Función para probar la conexión
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
} 