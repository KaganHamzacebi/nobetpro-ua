import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Monitoring } from 'react-scan/monitoring/next';

export default function Metrics() {
  return (
    <>
      <Monitoring
        apiKey="5JVlpgtGgBda2lPgbm3x_UqsL7Y8NoCj"
        url="https://monitoring.react-scan.com/api/v1/ingest"
      />
      <SpeedInsights />
      <Analytics />
    </>
  );
}
