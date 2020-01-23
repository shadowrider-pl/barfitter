# Barfitter

Barfitter is POS/management system for bars and restaurants. 
Read [manual](https://barfitter.net/manual) to see how it works.
If you want to use it in your restaurant and you don't know too much about programming, just register your account on [barfitter](https://barfitter.net).
Here is how to run this app.

Barfitter is a [SpringBoot](https://spring.io/projects/spring-boot) app based on [JHipster](https://www.jhipster.tech).
MySql database is needed to run it. Set up your DB credentials in /src/main/resources/config/application-dev.yml and /src/main/resources/config/application-prod.yml. App will generate database tables for you.

Run barfitter like any SpringBoot application. 
First compile it with: 
```sh
$ ./mvnw -Pprod -DskipTests clean package
```

and then run it in example 
```sh
$ java -jar barfitter-4.0.3.jar --spring.profiles.active=prod
```

