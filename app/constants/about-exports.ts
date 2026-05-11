import Metadata from 'next';
import { metadata as aboutMetadata } from './about-metadata';

export const dynamic = 'force-static';
export const metadata: Metadata = aboutMetadata;