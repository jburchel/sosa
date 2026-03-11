interface ProgramCardProps {
  title: string;
  description: string;
}

export default function ProgramCard({ title, description }: ProgramCardProps) {
  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-xl p-6 flex flex-col gap-3 hover:border-sosa-orange transition-colors group">
      <div className="w-10 h-1 bg-sosa-orange rounded" />
      <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wide group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
