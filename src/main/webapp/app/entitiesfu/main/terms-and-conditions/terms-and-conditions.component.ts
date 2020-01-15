import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'jhi-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html'
})
export class TermsAndConditionsComponent implements OnInit {
  message: string;
  //   private route: ActivatedRoute;
  private fragment: string;

  constructor(private route: ActivatedRoute, router: Router) {
    this.message = 'ManualComponent message';
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            element.scrollIntoView(true);
          }
        }
      }
    });
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }
}
