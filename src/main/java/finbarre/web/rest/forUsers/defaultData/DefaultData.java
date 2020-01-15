package finbarre.web.rest.forUsers.defaultData;

import java.util.ArrayList;

import finbarre.domain.Category;
import finbarre.domain.Desk;
import finbarre.domain.Vat;

public class DefaultData {

	private ArrayList<Vat> vats;
	private ArrayList<Desk> desks;
	private ArrayList<Category> categories;

	public ArrayList<Vat> getVats() {
		return vats;
	}

	public void setVats(ArrayList<Vat> vats) {
		this.vats = vats;
	}

	public ArrayList<Desk> getDesks() {
		return desks;
	}

	public void setDesks(ArrayList<Desk> desks) {
		this.desks = desks;
	}

	public ArrayList<Category> getCategories() {
		return categories;
	}

	public void setCategories(ArrayList<Category> categories) {
		this.categories = categories;
	}

}
