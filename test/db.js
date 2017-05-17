module.exports = function(callback){
    var Sequelize = require('sequelize');
    var prequelize = require('../');
    var DataTypes = Sequelize.DataTypes;
    var testDbName = 'prequelizeTest';
    var sequelize = new Sequelize(testDbName, 'user', 'pass', {
        dialect: 'sqlite',
        storage: './dbs/' + testDbName + parseInt(Math.random() * 1e10) + '.sqlite',
        host: 'localhost',

        maxConcurrentQueries: 50,
        pool: {
            maxConnections: 10,
            maxIdleTime: 3000
        },
        define: {
            underscored: false
        },
        logging: function (message) {
            console.log('Sequelize: ', message);
        }
    });

    var models = {
        user: sequelize.define('user', {
            name: DataTypes.STRING,
            age: DataTypes.INTEGER(3)
        }),
        account: sequelize.define('account', {
            name: DataTypes.STRING
        })
    };

    models.user.hasOne(models.account);
    models.account.belongsTo(models.user);

    sequelize.sync({force: true})
    .then(function(){
        callback(null, prequelize(models));
    }, function(error){
        console.log('ERROR', error);
        callback('Borked');
    });
}