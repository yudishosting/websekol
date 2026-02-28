import { neon } from '@neondatabase/serverless';

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return 'postgresql://placeholder:placeholder@localhost/placeholder';
  }
  return url;
};

const sql = neon(getDatabaseUrl());

export default sql;
