package finbarre.web.rest.forUsers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

public class BarfitterHeaderUtil {

	private static final Logger log = LoggerFactory.getLogger(BarfitterHeaderUtil.class);

	private static final String APPLICATION_NAME = "barfitterApp";

	private BarfitterHeaderUtil() {
	}

	public static HttpHeaders createAlert(String message, String param) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("X-" + APPLICATION_NAME + "-alert", message);
		headers.add("X-" + APPLICATION_NAME + "-params", param);
		return headers;
	}

	public static HttpHeaders createFailureAlert(String entityName, String errorKey, String defaultMessage) {
		log.error("Entity processing failed, {}", defaultMessage);
		HttpHeaders headers = new HttpHeaders();
		headers.add("X-" + APPLICATION_NAME + "-error", "error." + errorKey);
		headers.add("X-" + APPLICATION_NAME + "-params", entityName);
		return headers;
	}
}
