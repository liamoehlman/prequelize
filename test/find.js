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

test('find $fields: ["name"] without an id', function(t){

    t.plan(3);

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
                $fields: ['name']
            },
            excludePrimaryKey: true
        }, righto.after(bob));

        foundBob(function(error, data){
            t.notOk(error);
            t.notOk(data.id);
            delete data.createdAt;
            delete data.updatedAt;
            t.deepEqual(data, {name: bobData.name});
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
            name: 'bob2',
            age: 50
        });

        var foundBob = righto(models.user.findOne, {
            where: {
                name: {
                    $like: '%bob%'
                }
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

test('find with relation include *', function(t){

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
                account: '*'
            }
        }, righto.after(bobsAccount));

        foundBob(function(error, data){
            t.notOk(error);

            delete data.id;
            delete data.account.id;
            delete data.account.createdAt;
            delete data.account.updatedAt;
            delete data.account.userId;
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

test('find with count', function(t){

    t.plan(2);

    require('./db')(function(error, models){

        var bob = models.user.create({
                name: 'bob',
                age: 50
            });

        var jen = models.user.create({
                name: 'jen',
                age: 25
            });

        var count = righto(models.user.find, {
            where: {
                age: {
                    $gte: 10
                }
            },
            include: {
                count: {
                    $fn: 'count(col("id"))'
                }
            }
        }, righto.after(bob, jen));

        count(function(error, data){
            t.notOk(error);
            t.equal(data.count, 2);
        });
    });
});

test('find with count and group', function(t){
    t.plan(3);

    require('./db')(function(error, models){
        var data = [
                {
                    name: 'bob',
                    age: 50
                },
                {
                    name: 'fred',
                    age: 50
                },
                {
                    name: 'bob2',
                    age: 40
                }
            ];

        var users = righto(models.user.bulkCreate, data);

        var group = righto(models.user.findAll,
                {
                    include: {
                        name: true,
                        count: {
                            $fn: 'count(col("name"))'
                        }
                    },
                    group: 'age'
                },
                righto.after(users)
            );

        group(function(error, data) {
            t.notOk(error);
            t.equal(data[0].count, 1);
            t.equal(data[1].count, 2);
        });
    });
});

test('find deep include but no nested data', function(t){

    t.plan(1);

    require('./db')(function(error, models){

        var bob = models.user.create({
                name: 'bob',
                age: 50
            });

        var result = righto(models.user.findOne, {
            where: {
                age: 50
            },
            include: {
                pets: {
                    name: true,
                    vet: {
                        name: true
                    }
                }
            }
        }, righto.after(bob));

        result(function(error, data){
            t.notOk(error);
        });
    });
});

test('find does not pass sequelize $ operators through to where but operator still works', function(t){
    t.plan(2);

    require('./db')(function(error, models){
        var data = [
            {
                id: 1,
                name: 'bob',
                age: 50
            },
            {
                id: 2,
                name: 'jane',
                age: 20
            },
            {
                id: 3,
                name: 'tmart'
            }
        ];

        var expectedData = JSON.parse(JSON.stringify(data));
            expectedData.pop();

        var users = models.user.bulkCreate(data);

        var foundBob = righto(models.user.findAll, {
            where: {
                $or: [
                    {
                        name: 'bob'
                    },
                    {
                        name: 'jane'
                    }
                ]
            },
            include: {
                $fields: ['name', 'age']
            }
        }, righto.after(users));

        foundBob(function(error, data){
            t.notOk(error);
            t.deepEqual(data, expectedData);
        });
    });
});