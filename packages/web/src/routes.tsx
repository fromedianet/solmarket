import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Providers } from './providers';
import {
  AnalyticsView,
  ArtCreateView,
  ArtistsView,
  ArtistView,
  ArtView,
  ArtworksView,
  AuctionCreateView,
  AuctionView,
  HomeView,
  StaticPageView,
} from './views';
import { AdminView } from './views/admin';
import PackView from './views/pack';
import { PackCreateView } from './views/packCreate';
import { BillingView } from './views/auction/billing/billing';
import { AuctionsView } from './views/auctions';
import { ProfileView } from './views/profile';
import { LaunchPadView } from './views/launchpad';
import { CollectionsView } from './views/collections';
import { StatsView } from './views/stats';
import { FAQView } from './views/faq';
import { CollectionView } from './views/collection';
import { CollectionCreateView } from './views/collectionCreate';
import { InventoryView } from './views/inventory';
import { ExCollectionView } from './views/ExCollection';
import { ExNFTView } from './views/ExNFT';

export function Routes() {
  const shouldEnableNftPacks = process.env.NEXT_ENABLE_NFT_PACKS === 'true';
  return (
    <>
      <BrowserRouter basename={'/'}>
        <Providers>
          <Switch>
            {shouldEnableNftPacks && (
              <Route
                exact
                path="/admin/pack/create/:stepParam?"
                component={() => <PackCreateView />}
              />
            )}
            {shouldEnableNftPacks && (
              <Route
                exact
                path="/pack/:packKey"
                component={() => <PackView />}
              />
            )}
            <Route exact path="/admin" component={() => <AdminView />} />
            <Route
              exact
              path="/analytics"
              component={() => <AnalyticsView />}
            />
            <Route
              exact
              path="/art/create/:step_param?"
              component={() => <ArtCreateView />}
            />
            <Route
              exact
              path="/artworks/:id?"
              component={() => <ArtworksView />}
            />
            <Route exact path="/art/:id" component={() => <ArtView />} />
            <Route exact path="/artists/:id" component={() => <ArtistView />} />
            <Route exact path="/artists" component={() => <ArtistsView />} />
            <Route exact path="/auctions" component={() => <AuctionsView />} />
            <Route
              exact
              path="/auction/create/:step_param?"
              component={() => <AuctionCreateView />}
            />
            <Route
              exact
              path="/auction/:id"
              component={() => <AuctionView />}
            />
            <Route
              exact
              path="/auction/:id/billing"
              component={() => <BillingView />}
            />
            <Route
              exact
              path="/collection/create/:step_param?"
              component={() => <CollectionCreateView />}
            />
            <Route
              exact
              path="/collections"
              component={() => <CollectionsView />}
            />
            <Route
              exact
              path="/collection/:id"
              component={() => <CollectionView />}
            />
            <Route
              exact
              path="/inventory/:id"
              component={() => <InventoryView />}
            />
            <Route
              exact
              path="/excollection/:id"
              component={() => <ExCollectionView />}
            />
            <Route exact path="/exnft/:id" component={() => <ExNFTView />} />
            <Route
              exact
              path="/launchpad"
              component={() => <LaunchPadView />}
            />
            <Route exact path="/stats" component={() => <StatsView />} />
            <Route exact path="/faq" component={() => <FAQView />} />
            <Route exact path="/profile" component={() => <ProfileView />} />
            <Route path="/about" component={() => <StaticPageView />} />
            <Route path="/" component={() => <HomeView />} />
          </Switch>
        </Providers>
      </BrowserRouter>
    </>
  );
}
