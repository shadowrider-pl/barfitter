package finbarre.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, finbarre.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, finbarre.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, finbarre.domain.User.class.getName());
            createCache(cm, finbarre.domain.Authority.class.getName());
            createCache(cm, finbarre.domain.User.class.getName() + ".authorities");
            createCache(cm, finbarre.domain.Restaurant.class.getName());
            createCache(cm, finbarre.domain.Vat.class.getName());
            createCache(cm, finbarre.domain.ProductType.class.getName());
            createCache(cm, finbarre.domain.Category.class.getName());
            createCache(cm, finbarre.domain.Product.class.getName());
            createCache(cm, finbarre.domain.Cashup.class.getName());
            createCache(cm, finbarre.domain.Xsell.class.getName());
            createCache(cm, finbarre.domain.Desk.class.getName());
            createCache(cm, finbarre.domain.Favorite.class.getName());
            createCache(cm, finbarre.domain.UserToRestaurant.class.getName());
            createCache(cm, finbarre.domain.ProductDelivered.class.getName());
            createCache(cm, finbarre.domain.ProductOnStock.class.getName());
            createCache(cm, finbarre.domain.Payment.class.getName());
            createCache(cm, finbarre.domain.OrderOpened.class.getName());
            createCache(cm, finbarre.domain.PaymentToCashup.class.getName());
            createCache(cm, finbarre.domain.OrderClosed.class.getName());
            createCache(cm, finbarre.domain.OrderedProductStatus.class.getName());
            createCache(cm, finbarre.domain.ProductOrdered.class.getName());
            createCache(cm, finbarre.domain.ProductSold.class.getName());
            createCache(cm, finbarre.domain.Bestseller.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cm.destroyCache(cacheName);
        }
        cm.createCache(cacheName, jcacheConfiguration);
    }

}
