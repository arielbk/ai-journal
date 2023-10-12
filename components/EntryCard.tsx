const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div
      className={`white divide-y divide-gray-600 overflow-hidden rounded-t-lg border-b-2 bg-zinc-800 shadow`}
      style={{
        borderColor: entry.analysis.color,
      }}
    >
      <div className="px-4 py-5 text-white">{date}</div>
      <div className="px-4 py-5">{entry.analysis?.summary}</div>
      <div className="px-4 py-4 font-semibold capitalize">
        {entry.analysis?.mood}
      </div>
    </div>
  );
};

export default EntryCard;
