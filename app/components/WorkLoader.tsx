'use client';

import WorksGrid from './WorksGrid';
import { Project } from '@/lib/contentful';

interface WorkLoaderProps {
  works: Project[];
}

export default function WorkLoader({ works }: WorkLoaderProps) {
  return <WorksGrid works={works} />;
}
