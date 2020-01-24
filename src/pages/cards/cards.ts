import { Component } from '@angular/core';

// Providers
import { ActionSheetProvider } from '../../providers/action-sheet/action-sheet';
import { AppProvider } from '../../providers/app/app';
import { BitPayCardProvider } from '../../providers/bitpay-card/bitpay-card';
import { GiftCardProvider } from '../../providers/gift-card/gift-card';
import { HomeIntegrationsProvider } from '../../providers/home-integrations/home-integrations';
import { PersistenceProvider } from '../../providers/persistence/persistence';

@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  public bitpayCardItems;
  public showGiftCards: boolean;
  public showBitPayCard: boolean;
  public activeCards: any;
  public itemTapped = 0;
  constructor(
    private appProvider: AppProvider,
    private homeIntegrationsProvider: HomeIntegrationsProvider,
    private bitPayCardProvider: BitPayCardProvider,
    private giftCardProvider: GiftCardProvider,
    private persistenceProvider: PersistenceProvider,
    private actionSheetProvider: ActionSheetProvider
  ) {}

  async ionViewDidEnter() {
    this.showGiftCards = this.homeIntegrationsProvider.shouldShowInHome(
      'giftcards'
    );
    this.showBitPayCard = !!this.appProvider.info._enabledExtensions.debitcard;
    this.bitpayCardItems = await this.bitPayCardProvider.get({
      noHistory: true
    });
    this.activeCards = await this.giftCardProvider.getActiveCards();
  }

  public enableCard() {
    this.itemTapped++;

    if (this.itemTapped >= 8) {
      this.itemTapped = 0;

      this.persistenceProvider.getCardExperimentFlag().then(res => {
        res === 'enabled'
          ? this.persistenceProvider.removeCardExperimentFlag()
          : this.persistenceProvider.setCardExperimentFlag('enabled');

        this.actionSheetProvider
          .createInfoSheet('in-app-notification', {
            title: `Card experiment ${
              res === 'enabled' ? 'enabled' : 'disabled'
            }. Restart required.`
          })
          .present();
      });
    }
  }
}
