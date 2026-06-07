import React, { useState } from 'react';
import { X, Bot, Sparkles } from 'lucide-react';
import { CropAdvisorResponse } from '../types';

interface AIAdvisorProps {
  onClose: () => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ onClose }) => {
  const [cropType, setCropType] = useState('');
  const [season, setSeason] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CropAdvisorResponse | null>(null);

  const cropTypes = ['Wheat', 'Corn', 'Rice', 'Soybean', 'Cotton', 'Potato', 'Tomato', 'Other'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

  const getAIRecommendation = (): CropAdvisorResponse => {
    // Simulated AI recommendations based on inputs
    const recommendations: Record<string, { equipment: string[]; reasoning: string }> = {
      'Wheat-Spring': {
        equipment: ['Tractor', 'Seed Drill', 'Fertilizer Spreader'],
        reasoning: 'Spring wheat planting requires soil preparation with a tractor, precise seeding with a seed drill, and fertilizer application for optimal growth.',
      },
      'Corn-Summer': {
        equipment: ['Tractor', 'Planter', 'Sprayer'],
        reasoning: 'Summer corn cultivation needs a tractor for field preparation, a planter for seed placement, and a sprayer for pest and weed control.',
      },
      'Rice-Spring': {
        equipment: ['Tractor', 'Rotary Tiller', 'Transplanter'],
        reasoning: 'Rice farming in spring requires tillage for paddy preparation, and a transplanter for efficient seedling placement.',
      },
      'Soybean-Summer': {
        equipment: ['Tractor', 'Planter', 'Combine Harvester'],
        reasoning: 'Soybean production needs a planter for seeding and a combine harvester for efficient harvesting during summer.',
      },
    };

    const key = `${cropType}-${season}`;
    const recommendation = recommendations[key] || {
      equipment: ['Tractor', 'Cultivator', 'Harvester'],
      reasoning: `For ${cropType} cultivation in ${season}, a versatile tractor is essential for field operations, along with appropriate cultivation and harvesting equipment based on your specific needs.`,
    };

    return {
      recommendation: `Based on your ${farmSize} farm growing ${cropType} in ${season}, here are the recommended equipment:`,
      equipment: recommendation.equipment,
      reasoning: recommendation.reasoning,
      cropType,
      season,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse = getAIRecommendation();
    setResponse(aiResponse);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8" />
            <h2 className="text-2xl font-bold">AI Crop Equipment Advisor</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!response ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-primary-800">
                      Our AI advisor will analyze your crop type, season, and farm size to recommend the best equipment for your farming needs.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type *
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season *
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select season</option>
                  {seasons.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size *
                </label>
                <select
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select farm size</option>
                  <option value="Small (1-10 acres)">Small (1-10 acres)</option>
                  <option value="Medium (10-50 acres)">Medium (10-50 acres)</option>
                  <option value="Large (50-200 acres)">Large (50-200 acres)</option>
                  <option value="Very Large (200+ acres)">Very Large (200+ acres)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  'Get AI Recommendation'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bot className="w-6 h-6 text-primary-600" />
                  AI Recommendation
                </h3>
                <p className="text-gray-700 mb-4">{response.recommendation}</p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Equipment:</h4>
                  <div className="flex flex-wrap gap-2">
                    {response.equipment.map((eq, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Reasoning:</h4>
                  <p className="text-gray-600">{response.reasoning}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setResponse(null);
                    setCropType('');
                    setSeason('');
                    setFarmSize('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  New Query
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;

