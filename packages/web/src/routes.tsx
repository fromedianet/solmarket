import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Providers } from './providers';
import {
  ArtCreateView,
  AuctionCreateView,
  AuctionView,
  HomeView,
  StaticPageView,
} from './views';
// import { AdminView } from './views/admin';
import { AuctionsView } from './views/auctions';
import { ProfileView } from './views/profile';
import { LaunchPadView } from './views/launchpad';
import { LaunchpadDetailView } from './views/launchpadDetail';
import { FAQView } from './views/faq';
import { CollectionsView } from './views/collections';
import { MarketplaceView } from './views/marketplace';
import { ItemDetailView } from './views/itemDetail';
import { DashboardListingView } from './views/dashboard/listing';
import { DashboardView } from './views/dashboard/dashboard';
import { DashboardAdmin } from './views/dashboard/admin';
import { DashboardAdminDetails } from './views/dashboard/admin/details';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          {/* <Route path="/admin" element={<AdminView />} /> */}
          <Route path="/art-create/:step_param" element={<ArtCreateView />} />
          <Route path="/item-details/:mint" element={<ItemDetailView />} />
          <Route path="/auctions" element={<AuctionsView />} />
          <Route
            path="/auction-create/:step_param"
            element={<AuctionCreateView />}
          />
          <Route path="/auction/:id" element={<AuctionView />} />
          <Route path="/collections" element={<CollectionsView />} />
          <Route path="/marketplace/:symbol" element={<MarketplaceView />} />
          <Route path="/launchpad" element={<LaunchPadView />} />
          <Route path="/launchpad/:symbol" element={<LaunchpadDetailView />} />
          <Route path="/faq" element={<FAQView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/about" element={<StaticPageView />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route
            path="/dashboard/listing/:id"
            element={<DashboardListingView />}
          />
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          <Route
            path="/dashboard/admin/:id"
            element={<DashboardAdminDetails />}
          />
          <Route index element={<HomeView />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}
