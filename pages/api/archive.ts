// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Game } from '@/lib/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await fetch('https://io.stjarnholm.com/api/statistics/save_object?key=chicago_games',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body as Game),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      res.status(200).end()
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).end()
    });
}
