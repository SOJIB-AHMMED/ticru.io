/**
 * Campaign Manager UI Component
 * Manage marketing campaigns with an intuitive interface
 */

import React, { useState } from 'react';

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface CampaignManagerProps {
  onCampaignCreate?: (campaign: Campaign) => void;
  onCampaignUpdate?: (campaign: Campaign) => void;
  onCampaignDelete?: (campaignId: string) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  onCampaignCreate,
  onCampaignUpdate,
  onCampaignDelete
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateCampaign = (campaignData: Partial<Campaign>) => {
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: campaignData.name || 'New Campaign',
      status: 'draft',
      startDate: campaignData.startDate || new Date(),
      endDate: campaignData.endDate || new Date(),
      budget: campaignData.budget || 0,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0
    };

    setCampaigns([...campaigns, newCampaign]);
    if (onCampaignCreate) {
      onCampaignCreate(newCampaign);
    }
    setShowCreateModal(false);
  };

  const handleUpdateCampaign = (updatedCampaign: Campaign) => {
    setCampaigns(campaigns.map(c => 
      c.id === updatedCampaign.id ? updatedCampaign : c
    ));
    if (onCampaignUpdate) {
      onCampaignUpdate(updatedCampaign);
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
    if (onCampaignDelete) {
      onCampaignDelete(campaignId);
    }
    setSelectedCampaign(null);
  };

  const getCampaignROI = (campaign: Campaign): number => {
    if (campaign.spent === 0) return 0;
    return ((campaign.conversions * 100 - campaign.spent) / campaign.spent) * 100;
  };

  return (
    <div className="campaign-manager">
      <div className="campaign-header">
        <h2>Campaign Manager</h2>
        <button 
          className="create-button"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Campaign
        </button>
      </div>

      <div className="campaign-grid">
        {campaigns.map(campaign => (
          <div 
            key={campaign.id}
            className={`campaign-card ${campaign.status}`}
            onClick={() => setSelectedCampaign(campaign)}
          >
            <h3>{campaign.name}</h3>
            <div className="campaign-status">
              <span className={`status-badge ${campaign.status}`}>
                {campaign.status}
              </span>
            </div>
            <div className="campaign-metrics">
              <div className="metric">
                <span className="label">Budget:</span>
                <span className="value">${campaign.budget}</span>
              </div>
              <div className="metric">
                <span className="label">Spent:</span>
                <span className="value">${campaign.spent}</span>
              </div>
              <div className="metric">
                <span className="label">Impressions:</span>
                <span className="value">{campaign.impressions.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="label">Clicks:</span>
                <span className="value">{campaign.clicks.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="label">Conversions:</span>
                <span className="value">{campaign.conversions}</span>
              </div>
              <div className="metric">
                <span className="label">ROI:</span>
                <span className="value">{getCampaignROI(campaign).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="empty-state">
          <p>No campaigns yet. Create your first campaign to get started!</p>
        </div>
      )}
    </div>
  );
};

export default CampaignManager;
