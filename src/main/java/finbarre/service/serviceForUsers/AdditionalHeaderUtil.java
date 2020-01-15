package finbarre.service.serviceForUsers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

public class AdditionalHeaderUtil {

    private static final Logger log = LoggerFactory.getLogger(AdditionalHeaderUtil.class);
    
    private AdditionalHeaderUtil() {
    }

    public static HttpHeaders createAdditionalAlert(String message, String param) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-barfitterApp-alert", message);
        headers.add("X-barfitterApp-params", param);
        return headers;
    }

    public static HttpHeaders createTakeCashAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".cashTaken", param);
    }

    public static HttpHeaders substituteAuthorizedAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".substituteAuthorized", param);
    }

    public static HttpHeaders productsAuthorizedAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".authorized", param);
    }

    public static HttpHeaders chefNotFoundAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".chefNotFound", param);
    }

    public static HttpHeaders barmanNotFoundAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".barmanNotFound", param);
    }

    public static HttpHeaders joinedPaymentCreatedAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".joinedPaymentCreated", param);
    }

    public static HttpHeaders paymentChangedAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".paymentChanged", param);
    }

    public static HttpHeaders cashTakenAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".cashTaken", param);
    }

    public static HttpHeaders productDeletedAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".deleted", param);
    }

    public static HttpHeaders productsOrderedUpdatedAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".productsOrderedUpdated", param);
    }

	public static HttpHeaders splitOrderAlert(String entityName, String param) {
        return createAdditionalAlert("barfitterApp." + entityName + ".orderSplited", param);
	}

}
