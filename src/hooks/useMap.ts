import { useState, useEffect } from 'react';
import { CivicIssue } from '../types';

export function useMap(initialIssues: CivicIssue[]) {
  const [issues, setIssues] = useState<CivicIssue[]>(initialIssues);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterRiskLevel, setFilterRiskLevel] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);

  useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  const toggleHeatmap = () => setShowHeatmap(prev => !prev);

  const resetFilters = () => {
    setFilterCategory(null);
    setFilterRiskLevel(null);
    setSelectedIssue(null);
  };

  return {
    issues,
    filterCategory,
    setFilterCategory,
    filterRiskLevel,
    setFilterRiskLevel,
    showHeatmap,
    toggleHeatmap,
    selectedIssue,
    setSelectedIssue,
    resetFilters
  };
}
