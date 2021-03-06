var test = require('tape');
var righto = require('righto');
var nextError = require('./nextError');

test('update', function(t){
    t.plan(2);

    require('./db')(function(error, models){

        var bob = models.user.create({
            name: 'bob',
            age: 50
        });

        var updatedBob = righto(models.user.update, bob.get('id'), { age: 51 });

        var foundBob = righto(models.user.find, {
            where: {
                name: 'bob'
            },
            include: {
                name: true,
                age: true
            }
        }, righto.after(updatedBob));

        foundBob(function(error, data){
            t.notOk(error);

            t.equal(data.age, 51);
        });
    });
});

test('findOneAndUpdate', function(t){
    t.plan(2);

    require('./db')(function(error, models){

        var bob = models.user.create({
            name: 'bob',
            age: 50
        });

        var updatedBob = righto(models.user.findOneAndUpdate,
                { age: 51 },
                {
                    where: {
                        name: 'bob'
                    }
                },
                righto.after(bob)
            );

        var updatedBob2 = righto(models.user.find, {
                where: {
                    name: 'bob'
                },
                include: {
                    name: true,
                    age: true
                }
            }, righto.after(updatedBob));

        updatedBob2(function(error, data){
            t.notOk(error);

            t.equal(data.age, 51);
        });
    });
});

test('findOneAndUpdate throw', function(t){

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

        var foundBob = righto(models.user.findOneAndUpdate,
                {
                    age: 51
                },
                {
                    where: {
                        name: {
                            $like: '%bob%'
                        }
                    }
                },
                righto.after(bob, bob2)
            );

        nextError(function(){
            t.pass('threw on > 1 items');
        });

        foundBob();
    });
});

test('findOneAndUpdateOrCreate', function(t){
    t.plan(2);

    require('./db')(function(error, models){

        var updatedBob = righto(models.user.findOneAndUpdateOrCreate,
                {
                    name: 'bob',
                    age: 51
                },
                {
                    where: {
                        name: 'bob'
                    }
                }
            );

        var updatedBob2 = righto(models.user.find, {
                where: {
                    name: 'bob'
                },
                include: {
                    name: true,
                    age: true
                }
            }, righto.after(updatedBob));

        updatedBob2(function(error, data){
            t.notOk(error);

            t.equal(data.age, 51);
        });
    });
});

test('findOneAndUpdateOrCreate race', function(t){
    t.plan(2);

    require('./db')(function(error, models){

        var updatedBob = righto(models.user.findOneAndUpdateOrCreate,
                {
                    name: 'bob',
                    age: 51
                },
                {
                    where: {
                        name: 'bob'
                    }
                }
            );

        var updatedBob2 = righto(models.user.findOneAndUpdateOrCreate,
                {
                    name: 'bob',
                    age: 52
                },
                {
                    where: {
                        name: 'bob'
                    }
                }
            );

        var results = righto(models.user.findAll, {
                where: {
                    name: 'bob'
                },
                include: {
                    name: true,
                    age: true
                }
            }, righto.after(updatedBob, updatedBob2));

        results(function(error, results){
            t.notOk(error);

            t.equal(results.length, 1);
        });
    });
});