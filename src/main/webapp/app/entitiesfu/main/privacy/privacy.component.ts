import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'jhi-privacy',
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent implements OnInit {
  message: string;
  private fragment: string;

  constructor(private route: ActivatedRoute, router: Router) {
    this.message = 'PrivacyComponent message';
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
