import HistoryChart from '@/components/HistoryChart';
import { getUserByClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getData = async () => {
  const user = await getUserByClerkID();
  const posts = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      analysis: true,
    },
  });

  const analyses = posts
    .filter((post) => !!post.analysis)
    .map((post) => post.analysis!)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  const scores = analyses.map((analysis) => analysis.sentimentScore);

  const sum = scores.reduce((all, current) => all + current, 0);
  const avg = Math.round(sum / scores.length);
  return { analyses, avg };
};

const HistoryPage = async () => {
  const { avg, analyses } = await getData();
  return (
    <div className="px-10 py-4">
      <div className="py-4 text-xl">
        <span className="mr-4 font-semibold">Average sentiment:</span>
        <span className="text-4xl text-white">{avg}</span>
      </div>
      <div className="mx-auto h-[500px] px-4">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default HistoryPage;
