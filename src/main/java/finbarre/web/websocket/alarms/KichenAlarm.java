package finbarre.web.websocket.alarms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import finbarre.domain.UserToRestaurant;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

@Controller
public class KichenAlarm {

	private static final Logger log = LoggerFactory.getLogger(KichenAlarm.class);

    //fu
	@Autowired
    private UserToRestaurantRepository userToRestaurantRepository;
	
	@Autowired
    SimpMessageSendingOperations messagingTemplate;

    public synchronized void sendToKichen(Long countSentToKitchen) {
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Long restaurantId=userToRestaurant.getRestaurant().getId();
     	WSAlarm resultAlarm = new WSAlarm();
      	resultAlarm.setContent(countSentToKitchen);
      	log.debug("Sending alarm message from sendToKichen()");
      	String destination = "/topic/kitchenactivity/"+restaurantId;
        messagingTemplate.convertAndSend(destination, resultAlarm);
    }

	public synchronized void sendToBar(Long countSentToBar) {
        //fu
        final String user =SecurityUtils.getCurrentUserLogin().get();
        final UserToRestaurant userToRestaurant=userToRestaurantRepository.findOneByUserLogin(user);
        final Long restaurantId=userToRestaurant.getRestaurant().getId();
     	WSAlarm resultAlarm = new WSAlarm();
      	resultAlarm.setContent(countSentToBar);
      	log.debug("Sending alarm message from sendToBar()");
      	String destination = "/topic/baractivity/"+restaurantId;
        messagingTemplate.convertAndSend(destination, resultAlarm);
	}
    
    
}
