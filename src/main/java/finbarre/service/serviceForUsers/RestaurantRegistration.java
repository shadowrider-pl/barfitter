package finbarre.service.serviceForUsers;

import java.time.LocalDate;

import finbarre.domain.Restaurant;
import finbarre.web.rest.vm.ManagedUserVM;

public class RestaurantRegistration {
	
	private Restaurant restaurant;
	private ManagedUserVM user;
	
	public ManagedUserVM getUser() {
		return user;
	}
	public void setUser(ManagedUserVM user) {
		this.user = user;
	}
	public Restaurant getRestaurant() {
		return restaurant;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	public void setCreateDate(LocalDate createdDate) {
		this.restaurant.createdDate(createdDate);
	}
}
