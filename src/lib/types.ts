import { Timestamp } from "firebase/firestore";

export type Paper = {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  abstract: string;
  citations: number;
  url: string;
  tags: string[];
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Timestamp;
  paperIds: string[];
};
