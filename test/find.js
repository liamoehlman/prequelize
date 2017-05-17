var test = require('tape');
var righto = require('righto');
var nextError = require('./nextError');

test('find', function(t){

    t.plan(2);

    require('./db')(function(error, models){

        var bobData = {
            name: 'bob',
            age: 50
        };

        var bob = models.user.create(bobData);

        var foundBob = righto(models.user.find, {
            where: {
                name: 'bob'
            },
            include: {
                name: true,
                age: true
            }
        }, righto.after(bob));

        foundBob(function(error, data){
            t.notOk(error);

            delete data.id;
            t.deepEqual(data, bobData);
        });
    });
});

test('find $fields: ["*"]', function(t){

    t.plan(2);

    require('./db')(function(error, models){

        var bobData = {
            name: 'bob',
            age: 50
        };

        var bob = models.user.create(bobData);

        var foundBob = righto(models.user.find, {
            where: {
                name: 'bob'
            },
            include: {
                $fields: ['*']
            }
        }, righto.after(bob));

        foundBob(function(error, data){
            t.notOk(error);

            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
            t.deepEqual(data, bobData);
        });
    });
});

test('find $fields: "*"', function(t){

    t.plan(2);

    require('./db')(function(error, models){

        var bobData = {
            name: 'bob',
            age: 50
        };

        var bob = models.user.create(bobData);

        var foundBob = righto(models.user.find, {
            where: {
                name: 'bob'
            },
            include: {
                $fields: '*'
            }
        }, righto.after(bob));

        foundBob(function(error, data){
            t.notOk(error);

            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
            t.deepEqual(data, bobData);
        });
    });
});

test('find include: "*"', function(t){

    t.plan(2);

    require('./db')(function(error, models){

        var bobData = {
            name: 'bob',
            age: 50
        };

        var bob = models.user.create(bobData);

        var foundBob = righto(models.user.find, {
            where: {
                name: 'bob'
            },
            include: '*'
        }, righto.after(bob));

        foundBob(function(error, data){
            t.notOk(error);

            delete data.id;
            delete data.createdAt;
            delete data.updatedAt;
            t.deepEqual(data, bobData);
        });
    });
});

test('findOne', function(t){

    t.plan(2);

    require('./db')(function(error, models){

        var bobData = {
            name: 'bob',
            age: 50
        };

        var bob = models.user.create(bobData);

        var foundBob = righto(models.user.findOne, {
            where: {
                name: 'bob'
            },
            include: {
                name: true,
                age: true
            }
        }, righto.after(bob));

        foundBob(function(error, data){
            t.notOk(error);

            delete data.id;
            t.deepEqual(data, bobData);
        });
    });
});

test('findOne throw', function(t){

    t.plan(1);

    require('./db')(function(error, models){

        var bob = models.user.create({
            name: 'bob',
            age: 50
        });

        var bob2 = models.user.create({
            name: 'bob',
            age: 50
        });

        var foundBob = righto(models.user.findOne, {
            where: {
                name: 'bob'
            }
        }, righto.after(bob, bob2));

        nextError(function(){
            t.pass('threw on > 1 items');
        });

        foundBob();
    });
});

test('find with relation', function(t){

    t.plan(2);

    require('./db')(function(error, models){

        var bob = models.user.create({
                name: 'bob',
                age: 50
            });

        var bobsAccount = righto(models.account.create, righto.resolve({
                userId: bob.get('id'),
                name: 'bobington2000'
            }));

        var foundBob = righto(models.user.findOne, {
            where: {
                account: {
                    name: 'bobington2000'
                }
            },
            include: {
                name: true,
                age: true,
                account: {
                    name: true
                }
            }
        }, righto.after(bobsAccount));

        foundBob(function(error, data){
            t.notOk(error);

            delete data.id;
            delete data.account.id;
            t.deepEqual(data, {
                name: 'bob',
                age: 50,
                account:{
                    name: 'bobington2000'
                }
            });
        });
    });
});