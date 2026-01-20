/**
 * Integration Marketplace Component
 * Browse and connect third-party integrations
 */

import React, { useState } from 'react';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'available' | 'installed' | 'coming-soon';
  rating: number;
  reviews: number;
  price: 'free' | 'premium';
}

interface IntegrationMarketplaceProps {
  onInstall?: (integrationId: string) => void;
  onUninstall?: (integrationId: string) => void;
}

export const IntegrationMarketplace: React.FC<IntegrationMarketplaceProps> = ({
  onInstall,
  onUninstall
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Connect with your Slack workspace for real-time notifications',
      category: 'Communication',
      icon: '💬',
      status: 'available',
      rating: 4.8,
      reviews: 1250,
      price: 'free'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track your website traffic and user behavior',
      category: 'Analytics',
      icon: '📊',
      status: 'available',
      rating: 4.9,
      reviews: 2100,
      price: 'free'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Accept payments and manage subscriptions',
      category: 'Payments',
      icon: '💳',
      status: 'available',
      rating: 4.7,
      reviews: 890,
      price: 'premium'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and automation platform',
      category: 'Marketing',
      icon: '📧',
      status: 'available',
      rating: 4.6,
      reviews: 1560,
      price: 'free'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows between your apps',
      category: 'Automation',
      icon: '⚡',
      status: 'coming-soon',
      rating: 4.8,
      reviews: 980,
      price: 'premium'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', ...Array.from(new Set(integrations.map(i => i.category)))];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstall = (integrationId: string) => {
    setIntegrations(integrations.map(i =>
      i.id === integrationId ? { ...i, status: 'installed' as const } : i
    ));
    if (onInstall) {
      onInstall(integrationId);
    }
  };

  const handleUninstall = (integrationId: string) => {
    setIntegrations(integrations.map(i =>
      i.id === integrationId ? { ...i, status: 'available' as const } : i
    ));
    if (onUninstall) {
      onUninstall(integrationId);
    }
  };

  return (
    <div className="integration-marketplace">
      <div className="marketplace-header">
        <h2>Integration Marketplace</h2>
        <p>Connect your favorite tools and services</p>
      </div>

      <div className="marketplace-filters">
        <input
          type="search"
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="integrations-grid">
        {filteredIntegrations.map(integration => (
          <div key={integration.id} className="integration-card">
            <div className="integration-icon">{integration.icon}</div>
            <h3>{integration.name}</h3>
            <p className="integration-description">{integration.description}</p>
            
            <div className="integration-meta">
              <span className="category-badge">{integration.category}</span>
              <span className="price-badge">{integration.price}</span>
            </div>

            <div className="integration-rating">
              <span className="rating">⭐ {integration.rating}</span>
              <span className="reviews">({integration.reviews} reviews)</span>
            </div>

            <div className="integration-actions">
              {integration.status === 'available' && (
                <button
                  className="install-button"
                  onClick={() => handleInstall(integration.id)}
                >
                  Install
                </button>
              )}
              {integration.status === 'installed' && (
                <>
                  <button className="configure-button">Configure</button>
                  <button
                    className="uninstall-button"
                    onClick={() => handleUninstall(integration.id)}
                  >
                    Uninstall
                  </button>
                </>
              )}
              {integration.status === 'coming-soon' && (
                <button className="coming-soon-button" disabled>
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="empty-state">
          <p>No integrations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default IntegrationMarketplace;
