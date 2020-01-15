package finbarre.service.serviceForUsers;

import java.time.ZonedDateTime;

import finbarre.domain.Restaurant;


public class RestaurantSummary {

	private Restaurant restaurant;
	private int activeUsers;
	private ZonedDateTime lastCashup;

	public Restaurant getRestaurant() {
		return restaurant;
	}
	public int getActiveUsers() {
		return activeUsers;
	}
	public ZonedDateTime getLastCashup() {
		return lastCashup;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	public void setActiveUsers(int activeUsers) {
		this.activeUsers = activeUsers;
	}
	public void setLastCashup(ZonedDateTime lastCashup) {
		this.lastCashup = lastCashup;
	}
	
	
}
