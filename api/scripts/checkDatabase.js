try {
    const { default: pool, checkDatabaseConnection } = await import('../config/database.js');
    try {
        await checkDatabaseConnection();
        console.log('Conexão com PostgreSQL confirmada com validação do certificado SSL.');
    } finally {
        await pool.end();
    }
} catch (error) {
    console.error('Falha na configuração ou conexão com o banco:', error.code || 'CONFIGURATION_ERROR');
    process.exitCode = 1;
}
