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
    .map((post) => post.analysis!);
  const scores = analyses.map((analysis) => analysis.sentimentScore);

  const sum = scores.reduce((all, current) => all + current, 0);
  const avg = Math.round(sum / scores.length);
  return { analyses, avg };
};

const HistoryPage = async () => {
  const { avg, analyses } = await getData();
  return (
    <div>
      <div>Average sentiment: {avg}</div>
      <div className="h-[500px]">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default HistoryPage;
