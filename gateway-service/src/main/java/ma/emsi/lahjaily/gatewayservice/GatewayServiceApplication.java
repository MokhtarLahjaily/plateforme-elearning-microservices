package ma.emsi.lahjaily.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.discovery.ReactiveDiscoveryClient;
import org.springframework.cloud.gateway.discovery.DiscoveryClientRouteDefinitionLocator;
import org.springframework.cloud.gateway.discovery.DiscoveryLocatorProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GatewayServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceApplication.class, args);
    }

    /**
     * Configuration du routage dynamique (Discovery Locator)
     * La Gateway va automatiquement créer des routes pour tous les services
     * enregistrés dans Eureka, en utilisant leur ID de service.
     */
    @Bean
    public DiscoveryClientRouteDefinitionLocator locator(
            ReactiveDiscoveryClient rdc, DiscoveryLocatorProperties dlp){
        // Cette configuration est utilisée pour le routage dynamique par défaut
        return new DiscoveryClientRouteDefinitionLocator(rdc,dlp);
    }

}
