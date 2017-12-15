
var test = require('tape');
var AppConfig = require('../../lib/app_config')

test('一个配置文件', function (t) {
    t.plan(3);

    var appConfig1 = new AppConfig();
    appConfig1.init(__dirname);
    var config = appConfig1.getConfig();
    t.ok( config && config.name == "sample" , "默认配置文件1" );

    var appConfig2 = new AppConfig("a1_config");
    appConfig2.init(__dirname);
    var config = appConfig2.getConfig();
    t.ok( config && config.name == "a1","a1_config"  );

    var appConfig3 = new AppConfig("a2_config");
    appConfig3.init(__dirname);
    var config = appConfig3.getConfig();
    t.ok( config == null,"a2_config"  );
});
test('二个配置文件1', function (t) {
    t.plan(2);

    var appConfig1 = new AppConfig( "b_config" , "b_config_sample" );
    appConfig1.init(__dirname);
    var config = appConfig1.getConfig();
    t.ok( config && config.name == "b2" , "二个配置文件1" );

    var appConfig2 = new AppConfig( "c_config" , "c_config_sample" );
    appConfig2.init(__dirname);
    var config = appConfig2.getConfig();
    t.ok( config && config.name == "c1" , "二个配置文件2" );
});
