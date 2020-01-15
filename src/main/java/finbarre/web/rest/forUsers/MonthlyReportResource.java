package finbarre.web.rest.forUsers;

import static java.time.temporal.TemporalAdjusters.firstDayOfMonth;
import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finbarre.domain.Cashup;
import finbarre.domain.PaymentToCashup;
import finbarre.domain.Restaurant;
import finbarre.domain.UserToRestaurant;
import finbarre.repository.CashupRepository;
import finbarre.repository.PaymentToCashupRepository;
import finbarre.repository.UserToRestaurantRepository;
import finbarre.security.SecurityUtils;

/**
 * REST controller for managing MonthlyReports.
 */
@RestController
@RequestMapping("/api")
public class MonthlyReportResource {

	private final Logger log = LoggerFactory.getLogger(MonthlyReportResource.class);

	@Autowired
	private CashupRepository cashupRepository;

	@Autowired
	private PaymentToCashupRepository paymentToCashupRepository;

	@Autowired
	private UserToRestaurantRepository userToRestaurantRepository;

	public class CashupWithPayments {

		private Cashup cashup;
		private List<PaymentToCashup> paymentsToCashup;

		public Cashup getCashup() {
			return cashup;
		}

		public void setCashup(Cashup cashup) {
			this.cashup = cashup;
		}

		public List<PaymentToCashup> getPaymentsToCashup() {
			return paymentsToCashup;
		}

		public void setPaymentsToCashup(List<PaymentToCashup> paymentsToCashup) {
			this.paymentsToCashup = paymentsToCashup;
		}

	}

	public class CashupsWithPayments {

		private List<CashupWithPayments> cashups;

		public List<CashupWithPayments> getCashups() {
			return cashups;
		}

		public void setCashups(List<CashupWithPayments> cashups) {
			this.cashups = cashups;
		}
	}

	/**
	 * GET /monthly-report/:id : get the "id" monthly-report.
	 *
	 */
	@GetMapping("/monthly-report/{id}")
	public synchronized List<CashupWithPayments> getMonthlyReport(@PathVariable Long id) {
		log.debug("REST request to get MonthlyReport : {}", id);
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Optional<Cashup> cashup = cashupRepository.findById(id);
		ZonedDateTime initial = cashup.get().getBarmanLoginTime();
		log.debug("ZonedDateTime initial : {}", initial);
		ZonedDateTime start = initial.with(firstDayOfMonth());
		ZonedDateTime end = initial.with(lastDayOfMonth());
		List<Cashup> cashups = cashupRepository.findByRestaurantAndBarmanLoginTimeBetween(restaurant, start, end);
//		List<CashupWithPayments> cashupsWithPayments = new ArrayList<>();
		List<CashupWithPayments> cuwp = new ArrayList<>();

		for (Cashup cu : cashups) {
			CashupWithPayments cashupWithPayments = new CashupWithPayments();
			List<PaymentToCashup> paymentsToCashup = paymentToCashupRepository.findByCashup(cu);
			cashupWithPayments.setCashup(cu);
			cashupWithPayments.setPaymentsToCashup(paymentsToCashup);
			cuwp.add(cashupWithPayments);
		}

//		cashupsWithPayments.setCashups(cuwp);

		return cuwp;
	}

	/**
	 * GET /monthly-report : get all the monthly-report.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOnStocks in body
	 */
	@GetMapping("/monthly-report")
	public synchronized List<CashupWithPayments> getLastCashupMonthReportly() {
		log.debug("REST request to MonthlyReport");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		final Cashup lastCashup = cashupRepository.findFirstByRestaurantOrderByIdDesc(restaurant);
		ZonedDateTime initial = lastCashup.getBarmanLoginTime();
//		ZonedDateTime initial = ZonedDateTime.now(ZoneId.systemDefault());
		ZonedDateTime start = initial.with(firstDayOfMonth());
		ZonedDateTime end = initial.with(lastDayOfMonth());
		List<Cashup> cashups = cashupRepository.findByRestaurantAndBarmanLoginTimeBetween(restaurant, start, end);
		List<CashupWithPayments> cuwp = new ArrayList<>();
//log.debug("cashups.size()="+cashups.size()+
//		" initial="+initial+
//		" start="+start+
//		" end="+end);
		for (Cashup cu : cashups) {
			CashupWithPayments cashupWithPayments = new CashupWithPayments();
			List<PaymentToCashup> paymentsToCashup = paymentToCashupRepository.findByCashup(cu);
			cashupWithPayments.setCashup(cu);
			cashupWithPayments.setPaymentsToCashup(paymentsToCashup);
			cuwp.add(cashupWithPayments);
		}
		return cuwp;
	}

	/**
	 * GET /monthly-report : get all the monthly-report.
	 *
	 * @return the ResponseEntity with status 200 (OK) and the list of
	 *         productOnStocks in body
	 */
	@GetMapping("/monthly-report/cashup/{id}")
	public synchronized CashupWithPayments getCashupForMonthReport(@PathVariable Long id) {
		log.debug("REST request to getCashupForMonthReport");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
		Optional<Cashup> cashup = cashupRepository.findById(id);
		if (cashup != null && cashup.get().getRestaurant().getId() != restaurant.getId()) {
			cashup = null;
		}

		CashupWithPayments cashupWithPayments = new CashupWithPayments();
		List<PaymentToCashup> paymentsToCashup = paymentToCashupRepository.findByCashup(cashup.get());
		cashupWithPayments.setCashup(cashup.get());
		cashupWithPayments.setPaymentsToCashup(paymentsToCashup);

		return cashupWithPayments;
	}

	/**
	 * GET /sale-analysis/:id : get the "id" SaleAnalysis.
	 *
	 */
	@GetMapping("/monthly-report-to-dropdown")
	public List<Cashup> getMonthlyReportsToDropdown() {
        log.debug("REST request to MonthlyReportsToDropdown");
		// fu
		final String userStr = SecurityUtils.getCurrentUserLogin().get();
		final UserToRestaurant userToRestaurant = userToRestaurantRepository.findOneByUserLogin(userStr);
		final Restaurant restaurant = userToRestaurant.getRestaurant();
        List<Cashup> cashups =cashupRepository.findAllByBarmanLoginTime(restaurant);
        return cashups;
    }
}
