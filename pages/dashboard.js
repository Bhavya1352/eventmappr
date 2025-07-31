import Head from 'next/head';
import UserDashboard from '../components/UserDashboard';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard | EventMappr</title>
        <meta name="description" content="User dashboard for EventMappr" />
      </Head>
      
      <UserDashboard />
    </>
  );
}
