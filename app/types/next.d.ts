// Next.js/App Router convenience types
import React, { ReactNode } from 'react';

export interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export type NextPageWithLayout<P = {}> = React.FC<P> & {
  getLayout?: (page: React.ReactElement) => ReactNode;
};