module.exports = {
    HOST: 'host.docker.internal',
    USER: 'root',
    PASSWORD: '1234',
    DB: 'toady',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};