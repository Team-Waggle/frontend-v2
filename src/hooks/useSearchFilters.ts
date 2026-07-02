import { useEffect, useMemo, useRef, useState } from 'react';

import type { PostsSort } from '../types/api/posts';
import { trackEvent } from '../lib/ga';
import { POSITION_CONVERTER } from '../utils/position';
import { SKILL_MAP } from '../constants/skillMap';

export type Job = { id: string; label: string };
export type Skill = { id: string; label: string };
export type TagType = 'job' | 'skill';
export type SearchTagItem = { type: TagType; id: string; title: string };
export type AppliedSearchFilters = {
  q: string;
  positions: string[];
  skills: string[];
};

type UseSearchFiltersProps = {
  onApplyFilters: (filters: AppliedSearchFilters) => void;
  onChangeSort: (sort: PostsSort) => void;
};

export const useSearchFilters = ({
  onApplyFilters,
  onChangeSort,
}: UseSearchFiltersProps) => {
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const lastTrackedKeywordRef = useRef('');

  const trackSearch = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed || trimmed === lastTrackedKeywordRef.current) return;
    lastTrackedKeywordRef.current = trimmed;
    trackEvent({ action: 'search', label: trimmed });
  };

  const toApiPositions = (jobs: Job[]): string[] =>
    Array.from(
      new Set(
        jobs
          .map((job) => POSITION_CONVERTER[job.label] || job.id)
          .map((value) => value?.trim())
          .filter(Boolean),
      ),
    );

  const toApiSkills = (skills: Skill[]): string[] =>
    Array.from(
      new Set(
        skills
          .map((skill) => SKILL_MAP[skill.label as keyof typeof SKILL_MAP])
          .map((value) => value?.trim())
          .filter(Boolean),
      ),
    );

  const onToggleJob = (label: string) => {
    setSelectedJobs((prev) => {
      const exists = prev.some((j) => j.id === label);
      if (exists) return prev.filter((j) => j.id !== label);
      trackEvent({ action: 'filter_job', label });
      return [...prev, { id: label, label }];
    });
  };

  const onToggleSkill = (skill: Skill) => {
    setSelectedSkills((prev) => {
      const exists = prev.some((s) => s.id === skill.id);
      if (exists) return prev.filter((s) => s.id !== skill.id);
      trackEvent({ action: 'filter_skill', label: skill.label });
      return [...prev, skill];
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    trackSearch(debouncedKeyword);
  }, [debouncedKeyword]);

  useEffect(() => {
    onApplyFilters({
      q: debouncedKeyword.trim(),
      positions: toApiPositions(selectedJobs),
      skills: toApiSkills(selectedSkills),
    });
  }, [selectedJobs, selectedSkills, debouncedKeyword]);

  const applyFilters = () => {
    trackSearch(keyword);
    onApplyFilters({
      q: keyword.trim(),
      positions: toApiPositions(selectedJobs),
      skills: toApiSkills(selectedSkills),
    });
  };

  const onReset = () => {
    setSelectedJobs([]);
    setSelectedSkills([]);
    setKeyword('');
    onChangeSort('NEWEST');
    onApplyFilters({ q: '', positions: [], skills: [] });
  };

  const searchTags = useMemo<SearchTagItem[]>(
    () => [
      ...selectedJobs.map((j) => ({ type: 'job' as const, id: j.id, title: j.label })),
      ...selectedSkills.map((s) => ({ type: 'skill' as const, id: s.id, title: s.label })),
    ],
    [selectedJobs, selectedSkills],
  );

  const removeSearchTag = (tag: SearchTagItem) => {
    if (tag.type === 'job') {
      setSelectedJobs((prev) => prev.filter((j) => j.id !== tag.id));
    } else {
      setSelectedSkills((prev) => prev.filter((s) => s.id !== tag.id));
    }
  };

  return {
    keyword,
    setKeyword,
    selectedJobs,
    selectedSkills,
    searchTags,
    onToggleJob,
    onToggleSkill,
    removeSearchTag,
    applyFilters,
    onReset,
  };
};
